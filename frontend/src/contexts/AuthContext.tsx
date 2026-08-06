import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { authApi } from '../services/api';

interface User {
  id: string; username: string; email: string; display_name: string;
  role: 'admin' | 'farmer' | 'supplier'; is_active: boolean;
}

interface AuthContextType {
  user: User | null; token: string | null; loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void; isAdmin: boolean; isFarmer: boolean; isSupplier: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch {
        localStorage.removeItem('token'); localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await authApi.login(username, password);
    const { access_token, user: userData } = res.data;
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(access_token); setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    setToken(null); setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin: user?.role === 'admin', isFarmer: user?.role === 'farmer', isSupplier: user?.role === 'supplier' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
