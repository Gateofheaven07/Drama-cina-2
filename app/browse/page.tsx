'use client';

import { Navbar } from '@/components/Navbar';
import { DramaCard } from '@/components/DramaCard';
import { mockDramas, getAllGenres } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const genres = getAllGenres();
  const statuses = ['Ongoing', 'Completed'];

  // Filter dramas based on search and filters
  const filteredDramas = useMemo(() => {
    return mockDramas.filter((drama) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          drama.title.toLowerCase().includes(query) ||
          drama.chineseTitle?.toLowerCase().includes(query) ||
          drama.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Genre filter
      if (selectedGenre && !drama.genre.includes(selectedGenre)) {
        return false;
      }

      // Status filter
      if (selectedStatus && drama.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedGenre, selectedStatus]);

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Search */}
          <div className="relative md:col-span-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, genre..."
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

          {/* Genre Filter */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-3">
              Genre
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedGenre === null ? 'default' : 'outline'}
                onClick={() => setSelectedGenre(null)}
                className="text-xs"
              >
                All
              </Button>
              {genres.map((genre) => (
                <Button
                  key={genre}
                  size="sm"
                  variant={selectedGenre === genre ? 'default' : 'outline'}
                  onClick={() =>
                    setSelectedGenre(selectedGenre === genre ? null : genre)
                  }
                  className="text-xs"
                >
                  {genre}
                </Button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-3">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedStatus === null ? 'default' : 'outline'}
                onClick={() => setSelectedStatus(null)}
                className="text-xs"
              >
                All
              </Button>
              {statuses.map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={selectedStatus === status ? 'default' : 'outline'}
                  onClick={() =>
                    setSelectedStatus(selectedStatus === status ? null : status)
                  }
                  className="text-xs"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-3">
              Results
            </label>
            <div className="text-sm text-muted-foreground">
              {filteredDramas.length}{' '}
              {filteredDramas.length === 1 ? 'drama' : 'dramas'} found
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {filteredDramas.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredDramas.map((drama) => (
              <DramaCard key={drama.id} drama={drama} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-foreground/70 text-lg mb-4">
              No dramas found matching your filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre(null);
                setSelectedStatus(null);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
