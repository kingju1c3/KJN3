import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import { MasterAuth } from '@/security/auth/MasterAuth';
import { AuditLog } from '@/security/audit/AuditLog';
import type { ClearanceLevel } from '@/types/security';

interface User {
  username: string;
  clearanceLevel: ClearanceLevel;
  token: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { 
    username: string; 
    password: string; 
    mfaToken?: string 
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
const masterAuth = MasterAuth.getInstance();
const auditLog = AuditLog.getInstance();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = useCallback(async (credentials: { 
    username: string; 
    password: string; 
    mfaToken?: string 
  }) => {
    try {
      const auth = await masterAuth.authenticateMaster(credentials);
      
      if (!auth) {
        throw new Error('Authentication failed');
      }

      const newUser = {
        username: credentials.username,
        clearanceLevel: { level: 5, name: 'MASTER', permissions: ['ALL'] },
        token: auth.token,
        refreshToken: auth.refreshToken
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      auditLog.log({
        type: 'auth',
        severity: 'info',
        description: `User ${credentials.username} logged in successfully`,
        userId: credentials.username
      });

    } catch (error) {
      auditLog.log({
        type: 'auth',
        severity: 'warning',
        description: `Failed login attempt for user ${credentials.username}`,
        userId: credentials.username
      });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    if (user) {
      auditLog.log({
        type: 'auth',
        severity: 'info',
        description: `User ${user.username} logged out`,
        userId: user.username
      });
    }
    
    setUser(null);
    localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    // Token refresh logic
    if (user) {
      const refreshInterval = setInterval(() => {
        // Implement token refresh logic here
      }, 45 * 60 * 1000); // Refresh every 45 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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