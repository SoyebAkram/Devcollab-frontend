import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('devcollab_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    localStorage.setItem('devcollab_user', JSON.stringify(userData));
    localStorage.setItem('devcollab_token', 'mock-jwt-token-xyz');
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('devcollab_user');
    localStorage.removeItem('devcollab_token');
    setUser(null);
  };

  const isProjectManager = user?.role === 'PROJECT_MANAGER';

  return (
    <AuthContext.Provider value={{ user, login, logout, isProjectManager }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);