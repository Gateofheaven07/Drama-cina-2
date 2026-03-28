'use client';

import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { Download, Play, Trash2, ArrowRight } from 'lucide-react';

export default function DownloadsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    downloads,
    totalStorageFormatted,
    deleteDownload,
  } = useOfflineStorage(user?.id || null);

  // Protect the page - redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    setIsLoading(false);
  }, [user, router]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-32" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded" />
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Download className="w-8 h-8 text-accent" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Downloaded Episodes
            </h1>
          </div>
          <p className="text-foreground/70">
            {downloads.length}{' '}
            {downloads.length === 1 ? 'episode' : 'episodes'} downloaded
            {downloads.length > 0 && (
              <span className="ml-4 text-sm">
                Storage used: <span className="font-semibold">{totalStorageFormatted}</span>
              </span>
            )}
          </p>
        </div>

        {/* Content */}
        {downloads.length > 0 ? (
          <div className="space-y-3">
            {downloads.map((download) => (
              <div
                key={download.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-accent/50 transition-colors bg-card/50"
              >
                {/* Left Side - Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">
                    {download.dramaTitle}
                  </p>
                  <h3 className="font-semibold text-foreground truncate">
                    Ep {download.episodeNumber}: {download.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>
                      Downloaded:{' '}
                      {new Date(download.downloadedAt).toLocaleDateString()}
                    </span>
                    <span>
                      Expires:{' '}
                      {new Date(download.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Right Side - Actions */}
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1"
                  >
                    <Play className="w-4 h-4" />
                    <span className="hidden sm:inline">Play</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteDownload(download.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Download className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              No Downloads Yet
            </h2>
            <p className="text-foreground/70 mb-6 max-w-sm mx-auto">
              Download episodes to watch offline. Your downloads will expire after 30 days.
            </p>
            <Link href="/browse">
              <Button className="bg-accent text-accent-foreground">
                Find Episodes to Download
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
