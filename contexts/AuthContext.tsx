'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';

export interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProviderInner = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [localUser, setLocalUser] = useState<User | null>(null);
  const [isLocalLoading, setIsLocalLoading] = useState(true);

  // Load local user on mount (for email/pwd mock fallbacks)
  useEffect(() => {
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      try {
        setLocalUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }
    setIsLocalLoading(false);
  }, []);

  // Compute the current active user (NextAuth session takes priority)
  const isSessionLoading = status === 'loading';
  const isLoading = isLocalLoading || isSessionLoading;

  let activeUser: User | null = localUser;
  if (session?.user) {
     activeUser = {
       id: (session.user as any).id || session.user.email || 'google_user',
       email: session.user.email || '',
       name: session.user.name || 'Google User',
     };
  }

  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error('Email and password are required');
    setIsLocalLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        name: email.split('@')[0],
      };
      setLocalUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
    } finally {
      setIsLocalLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) throw new Error('All fields are required');
    setIsLocalLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
      };
      setLocalUser(mockUser);
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
    } finally {
      setIsLocalLoading(false);
    }
  };

  const logout = async () => {
    setLocalUser(null);
    localStorage.removeItem('mockUser');
    if (session) {
      await signOut({ redirect: true, callbackUrl: '/' });
    }
  };

  const updateProfile = async (name: string) => {
    if (!activeUser) throw new Error('Not authenticated');
    setIsLocalLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Only mock update local user, NextAuth update requires server API
      // For now this will update local user state if not using Google
      if (!session) {
        const updatedUser = { ...activeUser, name };
        setLocalUser(updatedUser);
        localStorage.setItem('mockUser', JSON.stringify(updatedUser));
      } else {
        // Here you would optimally call a backend to update DB if it was real
        alert("Pembaruan nama pada akun Google tidak dikonfigurasi secara mutasi server-side.");
      }
    } finally {
      setIsLocalLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    await signIn('google', { callbackUrl: '/' });
  };

  return (
    <AuthContext.Provider value={{ 
      user: activeUser, 
      isLoading, 
      login, 
      logout, 
      signup, 
      loginWithGoogle, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

