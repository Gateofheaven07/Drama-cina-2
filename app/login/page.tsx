'use client';

import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { login, signup, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isSignup) {
        await signup(email, password, name);
        setShowSuccess(true);
      } else {
        await login(email, password);
        // Redirect to home or bookmarks on success
        router.push('/');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      router.push('/');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 flex flex-col items-center">
            <img 
              src="/logo_dracin2.png" 
              alt="DramaFlix Logo" 
              className="w-32 h-auto mb-6 object-contain drop-shadow-lg" 
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-foreground/70 text-sm">
              {isSignup
                ? 'Join us to save favorites and download episodes'
                : 'Sign in to access bookmarks and offline downloads'}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignup}
                  className="mt-1 bg-card border-border"
                  disabled={isLoading}
                />
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 bg-card border-border"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 bg-card border-border"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground mt-6"
              disabled={isLoading}
            >
              {isLoading
                ? 'Loading...'
                : isSignup
                  ? 'Create Account'
                  : 'Sign In'}
            </Button>
          </form>

          {/* Google Auth */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Atau lanjutkan dengan
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-6 bg-card border-border hover:bg-muted font-medium py-5"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </div>

          {/* Toggle Auth Mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-foreground/70">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setError('');
                }}
                className="ml-2 text-accent hover:underline font-medium"
              >
                {isSignup ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Dialog open={showSuccess} onOpenChange={(open) => {
        if (!open) {
          setShowSuccess(false);
          router.push('/');
        }
      }}>
        <DialogContent className="sm:max-w-md text-center p-8 bg-card border-accent/20">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">Akun Berhasil Dibuat!</DialogTitle>
              <DialogDescription className="text-center text-foreground/70 text-base mt-2">
                Selamat datang di DramaFlix, {name}! Akun kamu telah aktif dan siap digunakan untuk menonton dan mendownload drama favorit.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center w-full mt-6">
              <Button
                type="button"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 py-6 text-lg rounded-xl font-semibold shadow-lg shadow-accent/20 transition-all hover:scale-[1.02]"
                onClick={() => {
                  setShowSuccess(false);
                  router.push('/');
                }}
              >
                Mulai Menonton Sekarang
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
