import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('devcollab_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData, token = 'mock-jwt-token-xyz') => {
    localStorage.setItem('devcollab_user', JSON.stringify(userData));
    localStorage.setItem('devcollab_token', token);
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);