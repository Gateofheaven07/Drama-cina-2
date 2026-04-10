'use client';

import { Navbar } from '@/components/Navbar';
import { DramaCard } from '@/components/DramaCard';
import { fetchSearchDramas, fetchLatestDramas, Drama } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useState, useEffect, Suspense } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, Loader2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync debounced query when URL param changes externally
  useEffect(() => {
    const q = searchParams.get('q') || '';
    if (q !== debouncedQuery) {
      setSearchQuery(q);
      setDebouncedQuery(q);
    }
  }, [searchParams]);

  // Simple debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        if (debouncedQuery.trim() === '') {
          // If no search query, show latest dramas as default browse page
          const data = await fetchLatestDramas();
          setDramas(data);
          // Only update URL if we need to remove q
          if (searchParams.get('q')) {
            router.replace('/browse');
          }
        } else {
          // Fetch from search API
          const data = await fetchSearchDramas(debouncedQuery);
          setDramas(data);
          // Sync URL
          if (searchParams.get('q') !== debouncedQuery) {
            router.replace(`/browse?q=${encodeURIComponent(debouncedQuery.trim())}`);
          }
        }
      } catch (error) {
        console.error('Failed to load dramas', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [debouncedQuery, router, searchParams]);

  return (
    <>
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Pencarian Drama
          </h1>
          <p className="text-foreground/70">
            Temukan dan jelajahi koleksi lengkap kami
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari berdasarkan judul, aktor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Results count */}
          <div className="mt-4">
            <div className="text-sm text-muted-foreground">
              {isLoading ? 'Sedang mencari...' : `${dramas.length} drama ditemukan`}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : dramas.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {dramas.map((drama) => (
              <DramaCard key={drama.id} drama={drama} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/70 text-lg mb-4">
              Tidak ada drama yang cocok dengan pencarian Anda.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
              }}
            >
              Hapus Pencarian
            </Button>
          </div>
        )}
      </main>
    </>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-accent" />
        </div>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
