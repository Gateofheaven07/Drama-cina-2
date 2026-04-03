'use client';

import { Navbar } from '@/components/Navbar';
import { EpisodeList } from '@/components/EpisodeList';
import { AuthGuard } from '@/components/AuthGuard';
import { fetchDramaDetail, fetchAllEpisodes, Drama, Episode } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Share2, Star, Loader2 } from 'lucide-react';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';

export default function DramaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [drama, setDrama] = useState<Drama | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [dramaData, epsData] = await Promise.all([
          fetchDramaDetail(id),
          fetchAllEpisodes(id)
        ]);
        setDrama(dramaData);
        setEpisodes(epsData);
      } catch (error) {
        console.error('Failed to load drama details', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

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

  if (!drama) {
    return (
      <>
        <Navbar />
        <main className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Drama Not Found
            </h1>
            <p className="text-foreground/70 mb-6">
              Sorry, we couldn't find the drama you're looking for.
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
      <main>
        {/* Hero Section with Backdrop */}
        <section
          className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden"
          style={{
            backgroundImage: `url(${drama.backdrop})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          {/* Top Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <AuthGuard
              fallback={
                <Link href="/login">
                  <Button size="sm" variant="outline">
                    <Heart className="w-4 h-4 mr-1" />
                    Bookmark
                  </Button>
                </Link>
              }
            >
              <Button
                size="sm"
                variant={isBookmarked ? 'default' : 'outline'}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Heart
                  className="w-4 h-4 mr-1"
                  fill={isBookmarked ? 'currentColor' : 'none'}
                />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
            </AuthGuard>

            <Button size="sm" variant="outline">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Content Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Poster - Left Side */}
            <div className="md:col-span-1">
              <div className="hidden md:block relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                <img
                  src={drama.poster}
                  alt={drama.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-4 space-y-2">
                <Link href={`/watch/${episodes[0]?.id || ''}?dramaId=${drama.id}`} className="block">
                  <Button className="w-full bg-accent text-accent-foreground" disabled={episodes.length === 0}>
                    Start Watching
                  </Button>
                </Link>

                <AuthGuard>
                  <Button className="w-full" variant="outline" disabled>
                    Add to Download
                  </Button>
                </AuthGuard>
              </div>
            </div>

            {/* Info - Right Side */}
            <div className="md:col-span-3">
              {/* Title */}
              <div className="mb-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  {drama.title}
                </h1>
                {drama.chineseTitle && (
                  <p className="text-lg text-muted-foreground">
                    {drama.chineseTitle}
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pb-6 border-b border-border">
                <div>
                  <p className="text-2xl font-bold text-accent flex items-center gap-1">
                    <Star className="w-5 h-5 fill-accent" />
                    {drama.rating.toFixed(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">Rating</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {drama.year}
                  </p>
                  <p className="text-sm text-muted-foreground">Year</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {drama.episodeCount}
                  </p>
                  <p className="text-sm text-muted-foreground">Episodes</p>
                </div>
                <div>
                  <p className="text-xl font-semibold text-accent">
                    {drama.status}
                  </p>
                  <p className="text-sm text-muted-foreground">Status</p>
                </div>
              </div>

              {/* Genres */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-muted-foreground mb-2">
                  GENRES
                </p>
                <div className="flex gap-2 flex-wrap">
                  {drama.genre.map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-3">
                  DESCRIPTION
                </p>
                <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
                  {drama.description}
                </p>
              </div>
            </div>
          </div>

          {/* Episodes Section */}
          <div className="border-t border-border pt-12">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Episodes
              </h2>
              <p className="text-foreground/70">
                {episodes.length} episode{episodes.length !== 1 ? 's' : ''}
              </p>
            </div>

            <EpisodeList
              episodes={episodes}
              dramaId={drama.id}
              isUserLoggedIn={!!user}
            />
          </div>
        </section>
      </main>
    </>
  );
}
