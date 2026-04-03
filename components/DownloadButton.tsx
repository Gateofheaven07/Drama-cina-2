'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Check, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

interface DownloadButtonProps {
  episodeId: string;
  episodeTitle: string;
  dramaTitle: string;
  episodeNumber: number;
  thumbnail?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export function DownloadButton({
  episodeId,
  episodeTitle,
  dramaTitle,
  episodeNumber,
  thumbnail,
  size = 'default',
  variant = 'outline',
}: DownloadButtonProps) {
  const { user } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const { downloadEpisode, isEpisodeDownloaded } = useOfflineStorage(
    user?.id || null
  );

  const isDownloaded = isEpisodeDownloaded(episodeId);

  const handleDownload = async () => {
    if (!user) return;

    setIsDownloading(true);
    try {
      await downloadEpisode(
        episodeId,
        episodeTitle,
        dramaTitle,
        episodeNumber,
        thumbnail
      );
    } finally {
      setIsDownloading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Button
      size={size}
      variant={isDownloaded ? 'default' : variant}
      onClick={handleDownload}
      disabled={isDownloading || isDownloaded}
      className={size === 'sm' ? 'h-8 w-8 p-0' : ''}
      title={
        isDownloaded
          ? 'Downloaded for offline viewing'
          : 'Download for offline viewing'
      }
    >
      {isDownloading ? (
        <>
          <Loader2 className={`${size === 'sm' ? 'w-4 h-4' : 'w-4 h-4'} animate-spin`} />
          {size !== 'sm' && <span className="ml-2">Downloading...</span>}
        </>
      ) : isDownloaded ? (
        <>
          <Check className={`${size === 'sm' ? 'w-4 h-4' : 'w-4 h-4'}`} />
          {size !== 'sm' && <span className="ml-2">Downloaded</span>}
        </>
      ) : (
        <>
          <Download className={`${size === 'sm' ? 'w-4 h-4' : 'w-4 h-4'}`} />
          {size !== 'sm' && <span className="ml-2">Download</span>}
        </>
      )}
    </Button>
  );
}
