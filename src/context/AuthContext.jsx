import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedEmailVerified = localStorage.getItem('isEmailVerified');
    const storedRole = localStorage.getItem('role');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsEmailVerified(storedEmailVerified === 'true');
      setRole(storedRole || null);
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setRole(userData?.role || null);
    setIsEmailVerified(userData?.isEmailVerified === true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    localStorage.setItem('role', userData?.role || 'USER');
    localStorage.setItem('isEmailVerified', String(userData?.isEmailVerified === true));
    setError(null);
  };

  const logout = () => {
    setUser(null);
    setIsEmailVerified(false);
    setRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isEmailVerified');
    localStorage.removeItem('role');
  };

  const verifyEmail = () => {
    const updatedUser = { ...user, isEmailVerified: true };
    setUser(updatedUser);
    setIsEmailVerified(true);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('isEmailVerified', 'true');
    setError(null);
  };

  const register = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isEmailVerified,
        loading,
        error,
        setError,
        login,
        logout,
        verifyEmail,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
