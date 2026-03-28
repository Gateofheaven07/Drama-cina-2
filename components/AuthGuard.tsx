'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Lock } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  showIcon?: boolean;
  tooltip?: string;
}

/**
 * AuthGuard wrapper component
 *
 * This component conditionally renders its children based on authentication status.
 * When user is not logged in, it shows a locked state or fallback content.
 *
 * Usage:
 * <AuthGuard>
 *   <BookmarkButton />
 * </AuthGuard>
 */
export function AuthGuard({
  children,
  fallback,
  showIcon = true,
  tooltip = 'Sign in to use this feature',
}: AuthGuardProps) {
  const { user } = useAuth();

  // If user is authenticated, show children
  if (user) {
    return <>{children}</>;
  }

  // If not authenticated, show fallback or locked state
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default: show disabled button with lock icon
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 opacity-50 cursor-not-allowed pointer-events-none">
            {showIcon && <Lock className="w-4 h-4 text-muted-foreground" />}
            {children}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            {tooltip}
            <br />
            <Link href="/login" className="underline font-medium hover:opacity-80">
              Sign in
            </Link>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
