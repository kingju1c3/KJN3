import React, { createContext, useContext, useState } from 'react';
import { ClearanceLevel } from '../security/ClearanceLevel';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const withClearance = (WrappedComponent, requiredClearance) => {
  return function WithClearanceComponent(props) {
    const { user } = useAuth();
    
    if (!user || user.clearanceLevel < requiredClearance) {
      return <AccessDenied />;
    }
    
    return <WrappedComponent {...props} />;
  };
};