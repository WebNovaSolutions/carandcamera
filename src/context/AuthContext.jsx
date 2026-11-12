import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAdminAuth, loginAdmin, logoutAdmin } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const res = await checkAdminAuth();
      if (res && res.authenticated) {
        setIsAuthenticated(true);
        setAdminUser(res.user);
      } else {
        setIsAuthenticated(false);
        setAdminUser(null);
      }
    } catch (err) {
      setIsAuthenticated(false);
      setAdminUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (password) => {
    try {
      const res = await loginAdmin(password);
      setIsAuthenticated(true);
      setAdminUser(res.user);
      toast.success('Welcome back, Admin!');
      return res;
    } catch (err) {
      toast.error(err.message || 'Login failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutAdmin();
      setIsAuthenticated(false);
      setAdminUser(null);
      toast.success('Logged out successfully');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
