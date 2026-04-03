'use client';

import Link from 'next/link';
import { Episode } from '@/lib/api';
import { Clock, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface EpisodeListProps {
  episodes: Episode[];
  dramaId: string;
  isUserLoggedIn: boolean;
}

export function EpisodeList({
  episodes,
  dramaId,
  isUserLoggedIn,
}: EpisodeListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="space-y-2">
      {episodes.map((episode) => (
        <div
          key={episode.id}
          onMouseEnter={() => setHoveredId(episode.id)}
          onMouseLeave={() => setHoveredId(null)}
          className="group border border-border rounded-lg overflow-hidden hover:border-accent/50 transition-all duration-200 bg-card/50 hover:bg-card"
        >
          <div className="flex gap-4 p-4">
            {/* Thumbnail */}
            <Link href={`/watch/${episode.id}?dramaId=${dramaId}`} className="flex-shrink-0">
              <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-muted">
                <img
                  src={episode.thumbnail || 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=320&h=180&fit=crop'}
                  alt={episode.title}
                  className="w-full h-full object-cover"
                />
                {hoveredId === episode.id && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                      <div className="w-0 h-0 border-l-4 border-l-transparent border-r-0 border-y-2.5 border-y-transparent border-y-black ml-1" />
                    </div>
                  </div>
                )}
              </div>
            </Link>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <Link href={`/watch/${episode.id}?dramaId=${dramaId}`}>
                <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                  Ep {episode.episodeNumber}: {episode.title}
                </h4>
              </Link>

              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {episode.description}
              </p>

              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(episode.duration)}
                </div>
                <span>•</span>
                <span>{new Date(episode.airDate).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href={`/watch/${episode.id}?dramaId=${dramaId}`}>
                <Button
                  size="sm"
                  variant={hoveredId === episode.id ? 'default' : 'outline'}
                  className="whitespace-nowrap"
                >
                  Watch
                </Button>
              </Link>

              {isUserLoggedIn && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="p-2 h-auto hover:text-accent"
                  title="Download for offline viewing"
                >
                  <Download className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
