'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface BookmarkButtonProps {
  dramaId: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export function BookmarkButton({
  dramaId,
  size = 'default',
  variant = 'outline',
}: BookmarkButtonProps) {
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load bookmark status from localStorage
  useEffect(() => {
    if (!user) return;

    const bookmarks = JSON.parse(
      localStorage.getItem(`bookmarks_${user.id}`) || '[]'
    );
    setIsBookmarked(bookmarks.includes(dramaId));
  }, [user, dramaId]);

  const handleToggleBookmark = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const key = `bookmarks_${user.id}`;
      const bookmarks = JSON.parse(localStorage.getItem(key) || '[]');

      if (isBookmarked) {
        // Remove bookmark
        const updated = bookmarks.filter(
          (id: string) => id !== dramaId
        );
        localStorage.setItem(key, JSON.stringify(updated));
      } else {
        // Add bookmark
        bookmarks.push(dramaId);
        localStorage.setItem(key, JSON.stringify(bookmarks));
      }

      setIsBookmarked(!isBookmarked);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Button
      size={size}
      variant={isBookmarked ? 'default' : variant}
      onClick={handleToggleBookmark}
      disabled={isLoading}
      className={size === 'sm' ? 'h-8 w-8 p-0' : ''}
    >
      <Heart
        className={`${size === 'sm' ? 'w-4 h-4' : 'w-4 h-4'}`}
        fill={isBookmarked ? 'currentColor' : 'none'}
      />
      {size !== 'sm' && (
        <span className="ml-2">
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </span>
      )}
    </Button>
  );
}
