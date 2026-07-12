import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const ACCESS_RANK = {
  view: 1,
  read: 1,
  Read: 1,
  write: 2,
  Write: 2,
};

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

  const persistAuth = useCallback(({ token: newToken, user: newUser, permissions: newPermissions }) => {
    setToken(newToken);
    setUser(newUser);
    setPermissions(newPermissions);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('permissions', JSON.stringify(newPermissions));
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    setPermissions([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
  }, []);

  const login = async (email, password, role) => {
    const { data } = await api.post('/auth/login', { email, password, role });
    persistAuth({
      token: data.token,
      user: data.user,
      permissions: data.permissions,
    });
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (_) {
      // Clear local session even if the logout request fails
    }
    clearAuth();
  };

  const hasAccess = useCallback((module, minLevel = 'view') => {
    const perm = permissions.find((p) => p.module === module);
    if (!perm) return false;

    const userRank = ACCESS_RANK[perm.access_level] ?? 0;
    const minRank = ACCESS_RANK[minLevel] ?? ACCESS_RANK.view;
    return userRank >= minRank;
  }, [permissions]);

  const value = { user, token, permissions, login, logout, hasAccess };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
