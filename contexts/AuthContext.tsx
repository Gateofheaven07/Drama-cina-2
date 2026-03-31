'use client';

import React, { createContext, useContext, useState } from 'react';
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
  const [isMutationLoading, setIsMutationLoading] = useState(false);

  const isSessionLoading = status === 'loading';
  const isLoading = isSessionLoading || isMutationLoading;

  let activeUser: User | null = null;
  if (session?.user) {
     activeUser = {
       id: (session.user as any).id || '',
       email: session.user.email || '',
       name: session.user.name || 'User',
     };
  }

  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error('Email dan password wajib diisi');
    setIsMutationLoading(true);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        throw new Error(result.error);
      }
    } finally {
      setIsMutationLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) throw new Error('Semua kolom wajib diisi');
    setIsMutationLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal mendaftarkan akun');
      }

      // Automatically login after successful signup
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(`Pendaftaran berhasil, tetapi gagal masuk otomatis: ${result.error}`);
      }
    } finally {
      setIsMutationLoading(false);
    }
  };

  const logout = async () => {
    setIsMutationLoading(true);
    try {
      await signOut({ redirect: false });
      window.location.href = '/';
    } finally {
      setIsMutationLoading(false);
    }
  };

  const updateProfile = async (name: string) => {
    if (!activeUser) throw new Error('Tidak terautentikasi');
    setIsMutationLoading(true);
    try {
      // In a real scenario, call an API here to update the user in DB
      alert("Pembaruan nama belum dikonfigurasi secara penuh pada mutasi server-side.");
    } finally {
      setIsMutationLoading(false);
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


