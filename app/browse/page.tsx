'use client';

import { Navbar } from '@/components/Navbar';
import { DramaCard } from '@/components/DramaCard';
import { fetchSearchDramas, fetchLatestDramas, Drama } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X, Loader2 } from 'lucide-react';

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        } else {
          // Fetch from search API
          const data = await fetchSearchDramas(debouncedQuery);
          setDramas(data);
        }
      } catch (error) {
        console.error('Failed to load dramas', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [debouncedQuery]);

  return (
    <>
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Browse Dramas
          </h1>
          <p className="text-foreground/70">
            Discover and explore our complete collection
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title..."
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
              {isLoading ? 'Searching...' : `${dramas.length} ${dramas.length === 1 ? 'drama' : 'dramas'} found`}
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
              No dramas found matching your search.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
              }}
            >
              Clear Search
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
