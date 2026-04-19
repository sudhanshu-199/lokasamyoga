import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { registerUser, loginUser, getMe } from './api';
import type { AuthUser } from './api';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, requestedRole: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string, regId?: string) => Promise<{ isApproved: boolean }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('lokasamyoga_token'));
  const [isLoading, setIsLoading] = useState(true);

  // On mount (or token change), verify the token by calling GET /api/auth/me
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('lokasamyoga_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await getMe();
        setUser(userData);
        setToken(storedToken);
      } catch {
        // Token is invalid or expired — clear it
        localStorage.removeItem('lokasamyoga_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = useCallback(async (email: string, password: string, requestedRole: string) => {
    const data = await loginUser({ email, password, requestedRole });
    localStorage.setItem('lokasamyoga_token', data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string, role: string, regId?: string) => {
    const data = await registerUser({ name, email, password, role, regId });
    localStorage.setItem('lokasamyoga_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return { isApproved: data.user.isApproved };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('lokasamyoga_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
