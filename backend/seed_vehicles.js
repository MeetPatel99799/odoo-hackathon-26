require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function seedVehicles() {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO vehicles (reg_no, name_model, type, max_capacity_kg, odometer, acquisition_cost, status, region)
      VALUES 
        ('GJ-01-AB-1234', 'Volvo FH16', 'Truck', 25000, 125000, 135000, 'On Trip', 'North'),
        ('GJ-05-CD-5678', 'Ford Transit', 'Van', 3500, 85000, 45000, 'Available', 'West'),
        ('GJ-03-EF-9012', 'Mercedes Sprinter', 'Van', 4000, 95000, 52000, 'In Shop', 'East'),
        ('GJ-07-GH-3456', 'Suzuki Carry', 'Mini', 1000, 180000, 15000, 'Retired', 'South'),
        ('GJ-02-IJ-7890', 'Scania R500', 'Truck', 26000, 42000, 160000, 'Available', 'North'),
        ('GJ-06-KL-2345', 'Toyota TownAce', 'Mini', 850, 110000, 22000, 'On Trip', 'West')
      ON CONFLICT (reg_no) DO NOTHING;
    `);
    console.log('Seeded 6 vehicles successfully');
  } catch (err) {
    console.error('Error seeding vehicles:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seedVehicles();
