'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { DramaCard } from '@/components/DramaCard';
import { fetchTrendingDramas, fetchLatestDramas, Drama } from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const backgroundImages = [
  '/dracin_poster.jpg',
  '/dracin_poster2.jpg',
  '/dracin_poster3.jpg',
  '/dracin_poster4.jpg',
  '/dracin_poster5.jpg',
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [trending, setTrending] = useState<Drama[]>([]);
  const [latest, setLatest] = useState<Drama[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const loadData = async (isRetry = false) => {
    try {
      if (!isRetry) setLoading(true);
      const [trendingData, latestData] = await Promise.all([
        fetchTrendingDramas(),
        fetchLatestDramas(),
      ]);
      setTrending(trendingData);
      setLatest(latestData);
      setError(null); // Berhasil, hapus error
    } catch (err: any) {
      console.log('Catched fetch api:', err);
      // err can be a string now (since we throw string in api.ts) or an Error object
      const errorMessage = typeof err === 'string' ? err : err?.message;
      setError(errorMessage || 'Gagal memuat data. Server mungkin sedang mengalami gangguan atau offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Polling otomatis untuk memuat ulang data saat server kembali online
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (error) {
      interval = setInterval(() => {
        loadData(true); // Retry fetch secara background (tanpa memunculkan loading state utuh)
      }, 10000); // Coba otomatis setiap 10 detik
    }
    return () => {
      if (interval) clearInterval(interval);
    }
  }, [error]);

  const featured = trending.slice(0, 3);
  const newReleases = latest.slice(0, 6);
  const topRated = trending.slice(0, 6); // Just using trending as top rated for now since we mapped rank sorting to rating

  return (
    <>
      <Navbar />
      <main className="relative">
        {error && (
          <div className="absolute top-4 left-4 right-4 z-50 flex justify-center">
            <Alert className="w-full max-w-2xl bg-red-950/95 backdrop-blur-md border border-red-800 text-red-100 shadow-2xl">
              <AlertCircle className="h-5 w-5 !text-red-500" />
              <AlertTitle className="text-lg font-semibold text-red-50">Koneksi Error</AlertTitle>
              <AlertDescription className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm leading-relaxed opacity-90 break-words">{error}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => loadData()} 
                  className="w-full sm:w-auto bg-red-900/40 hover:bg-red-800 focus:ring-red-500 hover:text-white border-red-800 text-red-100 flex-shrink-0 transition-all font-medium"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Coba Lagi
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}
        {/* Hero Section */}
        <section className="relative w-full h-96 sm:h-[28rem] md:h-[32rem] overflow-hidden bg-background">
          {/* Background Images for smooth transition */}
          {backgroundImages.map((img, index) => (
            <div
              key={img}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0 z-0'
              }`}
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 15%',
              }}
            />
          ))}

          {/* Gradient Overlay for Text Readability - carefully fading so right side is clear */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent sm:w-3/4" />

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-7xl mx-auto">
            {loading ? (
               <div className="flex justify-center items-center h-full">
                 <Loader2 className="h-8 w-8 animate-spin text-accent" />
               </div>
            ) : (
                <div className="space-y-4">
                  <div className="inline-block">
                    <span className="text-accent font-semibold text-sm">Unggulan</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance">
                    {featured[0]?.title || 'Memuat...'}
                  </h1>

                  <p className="text-foreground/70 max-w-2xl text-sm sm:text-base leading-relaxed line-clamp-3">
                    {featured[0]?.description}
                  </p>

                  <div className="flex items-center gap-3 pt-4">
                    {featured[0] && (
                      <Link href={`/drama/${featured[0].id}`}>
                        <Button size="lg" className="bg-accent text-accent-foreground">
                          Mulai Menonton
                        </Button>
                      </Link>
                    )}

                    <Link href="/browse">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-border hover:bg-muted"
                      >
                        Jelajahi Semua
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
            )}
          </div>
        </section>

        {/* New Releases */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Rilis Terbaru
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Konten baru ditambahkan secara berkala
              </p>
            </div>
            <Link href="/browse">
              <Button
                variant="ghost"
                size="sm"
                className="text-accent hover:text-accent hover:bg-accent/10"
              >
                Lihat Semua
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
               {newReleases.map((drama) => (
                 <DramaCard key={drama.id} drama={drama} />
               ))}
             </div>
          )}
        </section>

        {/* Trending (Previously Top Rated) */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Sedang Tren
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Paling banyak ditonton komunitas
              </p>
            </div>
          </div>

          {loading ? (
             <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {topRated.map((drama) => (
                <DramaCard key={drama.id} drama={drama} />
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-7xl mx-auto">
          <div className="rounded-lg bg-accent/10 border border-accent/30 p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Temukan Lebih Banyak Cerita
            </h2>
            <p className="text-foreground/70 mb-6 max-w-xl mx-auto">
              Jelajahi koleksi komprehensif drama Tiongkok, romansa,
              thriller, epik sejarah, dan banyak lagi.
            </p>
            <Link href="/browse">
              <Button size="lg" className="bg-accent text-accent-foreground">
                Jelajahi Drama
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
