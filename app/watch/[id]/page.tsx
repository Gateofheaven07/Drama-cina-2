'use client';

import { Navbar } from '@/components/Navbar';
import { DownloadButton } from '@/components/DownloadButton';
import { BookmarkButton } from '@/components/BookmarkButton';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getEpisodesForDrama, getDramaById, mockEpisodes } from '@/lib/mockData';
import { ArrowLeft } from 'lucide-react';
import { use } from 'react';

export default function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const episode = mockEpisodes.find((ep) => ep.id === parseInt(id));
  const drama = episode ? getDramaById(episode.dramaId) : null;
  const episodes = drama ? getEpisodesForDrama(drama.id) : [];
  const currentEpisodeIndex = episodes.findIndex((ep) => ep.id === episode?.id);
  const nextEpisode = episodes[currentEpisodeIndex + 1];
  const prevEpisode = episodes[currentEpisodeIndex - 1];

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
            <div className="h-96 bg-muted rounded" />
            <div className="h-8 bg-muted rounded w-64" />
          </div>
        </main>
      </>
    );
  }

  if (!episode || !drama) {
    return (
      <>
        <Navbar />
        <main className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Episode Not Found
            </h1>
            <p className="text-foreground/70 mb-6">
              Sorry, we couldn't find the episode you're looking for.
            </p>
            <Link href="/browse">
              <Button className="bg-accent text-accent-foreground">
                Back to Browse
              </Button>
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-black/50">
        {/* Video Player Section */}
        <div className="w-full aspect-video bg-black relative flex items-center justify-center">
          <video
            src={episode.videoUrl}
            controls
            autoPlay
            className="w-full h-full"
          >
            Your browser does not support the video tag.
          </video>

          {/* Overlay Controls */}
          <div className="absolute top-4 left-4">
            <Link href={`/drama/${drama.id}`}>
              <Button
                size="sm"
                variant="outline"
                className="bg-black/70 border-white/20 hover:bg-black/80"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Drama
              </Button>
            </Link>
          </div>
        </div>

        {/* Episode Info */}
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          {/* Breadcrumb & Title */}
          <div className="mb-6">
            <Link
              href={`/drama/${drama.id}`}
              className="text-accent hover:underline text-sm font-medium mb-2 inline-block"
            >
              ← {drama.title}
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Episode {episode.episodeNumber}: {episode.title}
            </h1>
            <p className="text-foreground/70 mt-2">{episode.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-8 pb-8 border-b border-border">
            <BookmarkButton dramaId={drama.id} size="md" variant="outline" />
            <DownloadButton
              episodeId={episode.id}
              episodeTitle={episode.title}
              dramaTitle={drama.title}
              episodeNumber={episode.episodeNumber}
              thumbnail={episode.thumbnail}
              size="md"
              variant="outline"
            />
          </div>

          {/* Episode Navigation */}
          <div className="space-y-8">
            {/* Previous Episode */}
            {prevEpisode && (
              <div className="pb-8">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  PREVIOUS EPISODE
                </h3>
                <Link href={`/watch/${prevEpisode.id}`}>
                  <div className="group flex gap-4 p-4 border border-border rounded-lg hover:border-accent/50 transition-colors cursor-pointer bg-card/50">
                    <div className="w-32 h-20 rounded flex-shrink-0 bg-muted overflow-hidden">
                      <img
                        src={prevEpisode.thumbnail || drama.poster}
                        alt={prevEpisode.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        Ep {prevEpisode.episodeNumber}
                      </p>
                      <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                        {prevEpisode.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {prevEpisode.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Next Episode */}
            {nextEpisode && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  NEXT EPISODE
                </h3>
                <Link href={`/watch/${nextEpisode.id}`}>
                  <div className="group flex gap-4 p-4 border border-border rounded-lg hover:border-accent/50 transition-colors cursor-pointer bg-card/50">
                    <div className="w-32 h-20 rounded flex-shrink-0 bg-muted overflow-hidden">
                      <img
                        src={nextEpisode.thumbnail || drama.poster}
                        alt={nextEpisode.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">
                        Ep {nextEpisode.episodeNumber}
                      </p>
                      <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                        {nextEpisode.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {nextEpisode.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
