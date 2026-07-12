const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Find user by email (join roles)
    const userResult = await query(
      `SELECT u.*, r.name as role_name 
       FROM users u 
       JOIN roles r ON u.role_id = r.id 
       WHERE u.email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = userResult.rows[0];

    // Check if locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return res.status(423).json({ error: 'Account locked after 5 failed attempts.' });
    }

    // Compare password AND role name
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    const roleMatch = user.role_name === role;

    if (!passwordMatch || !roleMatch) {
      const newFailedAttempts = user.failed_login_attempts + 1;
      
      if (newFailedAttempts >= 5) {
        // Lock for 15 mins
        const lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        await query(
          'UPDATE users SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3',
          [newFailedAttempts, lockUntil, user.id]
        );
      } else {
        await query(
          'UPDATE users SET failed_login_attempts = $1 WHERE id = $2',
          [newFailedAttempts, user.id]
        );
      }
      
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Reset failed attempts on success
    await query(
      'UPDATE users SET failed_login_attempts = 0, locked_until = NULL WHERE id = $1',
      [user.id]
    );

    // Fetch permissions
    const permsResult = await query(
      'SELECT module, access_level FROM role_permissions WHERE role_id = $1',
      [user.role_id]
    );

    // Sign JWT
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.role_id,
        roleName: user.role_name
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role_name
      },
      permissions: permsResult.rows
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const logout = (req, res) => {
  res.json({ success: true });
};

const me = async (req, res) => {
  try {
    const roleId = req.user.roleId;

    // Fetch permissions
    const permsResult = await query(
      'SELECT module, access_level FROM role_permissions WHERE role_id = $1',
      [roleId]
    );

    res.json({
      user: req.user,
      permissions: permsResult.rows
    });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
  login,
  logout,
  me
};
