'use client';

import { Navbar } from '@/components/Navbar';
import { DramaCard } from '@/components/DramaCard';
import { useAuth } from '@/contexts/AuthContext';
import { fetchDramaDetail, Drama } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark, Heart, Download } from 'lucide-react';

export default function BookmarksPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookmarkedDramas, setBookmarkedDramas] = useState<Drama[]>([]);
  const [activeTab, setActiveTab] = useState<'disimpan' | 'disukai' | 'diunduh'>('disimpan');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for new tabs since features are not fully implemented yet
  const likedDramas: Drama[] = []; 
  const downloadedDramas: Drama[] = [];

  // Protect the page - redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    async function loadBookmarks() {
      setIsLoading(true);
      if(!user) return;
      try {
        const bookmarks = JSON.parse(
          localStorage.getItem(`bookmarks_${user.id}`) || '[]'
        );
        if (bookmarks.length > 0) {
           const fetches = bookmarks.map((id: string) => fetchDramaDetail(id));
           const results = await Promise.all(fetches);
           setBookmarkedDramas(results.filter((d): d is Drama => d !== null));
        } else {
           setBookmarkedDramas([]);
        }
      } catch (err) {
        console.error('Failed to load bookmarks', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadBookmarks();
  }, [user, router]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-32" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-muted rounded" />
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
            <Bookmark className="w-8 h-8 text-accent fill-accent" />
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Koleksi Saya
            </h1>
          </div>
          <p className="text-foreground/70">
            Kelola drama yang Anda simpan, sukai, dan unduh
          </p>
        </div>

        {/* Tab Bar */}
        <div className="flex overflow-x-auto pb-2 mb-8 gap-2 no-scrollbar">
          <button
            onClick={() => setActiveTab('disimpan')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all print:hidden ${
              activeTab === 'disimpan'
                ? 'bg-accent text-accent-foreground shadow-md'
                : 'bg-muted/50 text-foreground/70 hover:bg-muted hover:text-foreground'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Disimpan
          </button>
          <button
            onClick={() => setActiveTab('disukai')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
              activeTab === 'disukai'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-muted/50 text-foreground/70 hover:bg-muted hover:text-foreground'
            }`}
          >
            <Heart className="w-4 h-4" />
            Disukai
          </button>
          <button
            onClick={() => setActiveTab('diunduh')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
              activeTab === 'diunduh'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-muted/50 text-foreground/70 hover:bg-muted hover:text-foreground'
            }`}
          >
            <Download className="w-4 h-4" />
            Diunduh
          </button>
        </div>

        {/* Content */}
        {activeTab === 'disimpan' && (
          bookmarkedDramas.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-in fade-in duration-300">
              {bookmarkedDramas.map((drama) => (
                <DramaCard key={drama.id} drama={drama} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 animate-in fade-in duration-300">
              <Bookmark className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Belum Ada Video Disimpan
              </h2>
              <p className="text-foreground/70 mb-6 max-w-sm mx-auto">
                Mulai tambahkan drama favorit Anda ke koleksi simpanan agar mudah diakses kembali.
              </p>
              <Link href="/browse">
                <Button className="bg-accent text-accent-foreground">
                  Eksplorasi Drama
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )
        )}

        {activeTab === 'disukai' && (
          likedDramas.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-in fade-in duration-300">
              {likedDramas.map((drama) => (
                <DramaCard key={drama.id} drama={drama} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 animate-in fade-in duration-300">
              <Heart className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Belum Ada Video Disukai
              </h2>
              <p className="text-foreground/70 mb-6 max-w-sm mx-auto">
                Berikan tanda suka pada video yang Anda nikmati untuk melihatnya di sini.
              </p>
              <Link href="/browse">
                <Button className="bg-accent text-accent-foreground">
                  Eksplorasi Drama
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )
        )}

        {activeTab === 'diunduh' && (
          downloadedDramas.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-in fade-in duration-300">
              {downloadedDramas.map((drama) => (
                <DramaCard key={drama.id} drama={drama} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 animate-in fade-in duration-300">
              <Download className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Belum Ada Video Diunduh
              </h2>
              <p className="text-foreground/70 mb-6 max-w-sm mx-auto">
                Unduh drama favorit Anda untuk menontonnya secara offline kapan saja dan di mana saja.
              </p>
              <Link href="/browse">
                <Button className="bg-accent text-accent-foreground">
                  Eksplorasi Drama
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )
        )}
      </main>
    </>
  );
}
