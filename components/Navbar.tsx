'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, Search, User } from 'lucide-react';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function Navbar() {
  const { user, logout } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <img 
              src="/logo_dracin2.png" 
              alt="DramaFlix Logo" 
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105" 
            />
            <span className="text-xl font-bold text-foreground hidden sm:inline">
              DramaFlix
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-foreground/70 hover:text-foreground transition-colors text-sm font-medium"
            >
              Beranda
            </Link>
            <Link
              href="/categories"
              className="text-foreground/70 hover:text-foreground transition-colors text-sm font-medium"
            >
              Kategori
            </Link>
            <Link
              href="/rankings"
              className="text-foreground/70 hover:text-foreground transition-colors text-sm font-medium"
            >
              Peringkat
            </Link>
            <Link
              href="/bookmarks"
              className="text-foreground/70 hover:text-foreground transition-colors text-sm font-medium"
            >
              Bookmark
            </Link>
          </nav>

          {/* Right Side - Search, Auth */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Button - Mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Auth Section */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm">
                      {user.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/bookmarks">Bookmarks</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setShowLogoutDialog(true)}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button size="sm" className="bg-accent text-accent-foreground">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="pb-4 md:hidden">
            <input
              type="search"
              placeholder="Search dramas..."
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        )}
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin keluar dari akun ini? Anda harus login kembali untuk mengakses bookmark dan fitur lainnya.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                logout();
                setShowLogoutDialog(false);
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Keluar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
