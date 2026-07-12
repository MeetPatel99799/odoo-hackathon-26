import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [permissions, setPermissions] = useState([]);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedPermissions = localStorage.getItem('permissions');
    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch (_) {}
    }
    if (storedPermissions) {
      try { setPermissions(JSON.parse(storedPermissions)); } catch (_) {}
    }
  }, []);

  /**
   * TODO (Integration — Page 0):
   * Wire login() to POST /api/auth/login.
   * On success, store the JWT token + user + permissions returned by the API.
   */
  const login = async (email, password) => {
    // STUB — replace with real API call during integration
    console.warn('login() stub called — wire to real API in Integration phase');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPermissions([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
  };

  const value = { user, token, permissions, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
