'use client';

import { Navbar } from '@/components/Navbar';
import { DownloadButton } from '@/components/DownloadButton';
import { BookmarkButton } from '@/components/BookmarkButton';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { fetchDramaDetail, fetchAllEpisodes, Drama, Episode, fetchDecryptVideo } from '@/lib/api';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ dramaId?: string }>;
}) {
  const { id } = use(params);
  const unwrappedSearchParams = use(searchParams);
  const dramaId = unwrappedSearchParams.dramaId;
  
  const { user } = useAuth();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [drama, setDrama] = useState<Drama | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [decryptedVideoUrl, setDecryptedVideoUrl] = useState<string>('');

  const currentEpisodeIndex = episodes.findIndex((ep) => ep.id === id);
  const episode = currentEpisodeIndex >= 0 ? episodes[currentEpisodeIndex] : null;
  const nextEpisode = episodes[currentEpisodeIndex + 1];
  const prevEpisode = episodes[currentEpisodeIndex - 1];

  // Remove login requirement for watching

  useEffect(() => {
    async function loadData() {
      if (!dramaId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const [dramaData, epsData] = await Promise.all([
          fetchDramaDetail(dramaId),
          fetchAllEpisodes(dramaId)
        ]);
        setDrama(dramaData);
        setEpisodes(epsData);
        
        // Auto decrypt video upon finding episode
        const currentEp = epsData.find((ep) => ep.id === id);
        if (currentEp && currentEp.videoUrl) {
           const decrypted = await fetchDecryptVideo(currentEp.videoUrl);
           setDecryptedVideoUrl(decrypted || currentEp.videoUrl);
        }
      } catch (error) {
        console.error('Failed to load watch data', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [dramaId, id]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
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
              Sorry, we couldn't find the episode or drama you're looking for.
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
          {decryptedVideoUrl ? (
            <video
              key={decryptedVideoUrl}
              src={decryptedVideoUrl}
              controls
              autoPlay
              playsInline
              crossOrigin="anonymous"
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-white flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span>Memuat Video...</span>
            </div>
          )}

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
            <BookmarkButton dramaId={drama.id} size="default" variant="outline" />
            <DownloadButton
              episodeId={episode.id}
              episodeTitle={episode.title}
              dramaTitle={drama.title}
              episodeNumber={episode.episodeNumber}
              thumbnail={episode.thumbnail}
              size="default"
              variant="outline"
            />
          </div>

          {/* Episode Selector */}
          <div className="mb-10 bg-card/30 p-4 sm:p-6 rounded-xl border border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Pilih Episode ({episodes.length})
            </h3>
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {episodes.map((ep) => (
                <Link key={ep.id} href={`/watch/${ep.id}?dramaId=${drama.id}`}>
                  <Button
                    variant={ep.id === episode.id ? 'default' : 'outline'}
                    size="sm"
                    className={`w-full ${ep.id === episode.id ? 'bg-accent text-accent-foreground' : 'bg-background/50 hover:bg-accent/20 hover:text-accent hover:border-accent'}`}
                  >
                    {ep.episodeNumber}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Episode Navigation */}
          <div className="space-y-8">
            {/* Previous Episode */}
            {prevEpisode && (
              <div className="pb-8">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  PREVIOUS EPISODE
                </h3>
                <Link href={`/watch/${prevEpisode.id}?dramaId=${drama.id}`}>
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
                <Link href={`/watch/${nextEpisode.id}?dramaId=${drama.id}`}>
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
