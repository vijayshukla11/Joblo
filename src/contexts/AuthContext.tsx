import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  signUp: (name: string, email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there is an existing session
    const loadSession = async () => {
      try {
        const currentUser = await authService.getCurrentSessionUser();
        if (currentUser) {
          setUser(currentUser);
          localStorage.setItem('jl_auth_user', JSON.stringify(currentUser));
        } else {
          const savedUser = localStorage.getItem('jl_auth_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
      } catch (err) {
        // Ignored in production logs
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await authService.signIn(email, password);
    if (result.user) {
      setUser(result.user);
      localStorage.setItem('jl_auth_user', JSON.stringify(result.user));
    }
    setLoading(false);
    return result;
  };

  const signUp = async (name: string, email: string, password: string, role: string = 'Applicant') => {
    setLoading(true);
    const result = await authService.signUp(name, email, password, role);
    if (result.user) {
      setUser(result.user);
      localStorage.setItem('jl_auth_user', JSON.stringify(result.user));
    }
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    await authService.signOut();
    setUser(null);
    localStorage.removeItem('jl_auth_user');
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
