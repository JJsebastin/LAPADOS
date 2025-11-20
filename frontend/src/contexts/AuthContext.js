import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../api/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (auth.isAuthenticated()) {
        const userData = await auth.me();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const userData = await auth.login(email, password);
    setUser(userData);
    return userData;
  };

  const register = async (full_name, email, password) => {
    const userData = await auth.register(full_name, email, password);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);