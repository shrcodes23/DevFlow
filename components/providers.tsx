'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="devflow-theme">
      {children}
    </NextThemesProvider>
  );
}

interface AuthState {
  user: import('@/lib/types').User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<import('@/lib/types').User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('devflow-auth') : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user);
        setToken(parsed.token);
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const persist = (u: import('@/lib/types').User | null, t: string | null) => {
    if (u && t) localStorage.setItem('devflow-auth', JSON.stringify({ user: u, token: t }));
    else localStorage.removeItem('devflow-auth');
  };

  const login = async (email: string, password: string) => {
    const { api } = await import('@/lib/api');
    const res = await api.auth.login(email, password);
    setUser(res.user); setToken(res.token); persist(res.user, res.token);
  };

  const register = async (name: string, email: string, _password: string) => {
    const { api } = await import('@/lib/api');
    const res = await api.auth.register(name, email);
    setUser(res.user); setToken(res.token); persist(res.user, res.token);
  };

  const logout = () => { setUser(null); setToken(null); persist(null, null); };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
