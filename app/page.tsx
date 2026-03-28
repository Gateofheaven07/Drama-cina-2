'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { DramaCard } from '@/components/DramaCard';
import { mockDramas } from '@/lib/mockData';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const backgroundImages = [
  '/dracin_poster.jpg',
  '/dracin_poster2.jpg',
  '/dracin_poster3.jpg',
  '/dracin_poster4.jpg',
  '/dracin_poster5.jpg',
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Get featured dramas (highest rated)
  const featured = [...mockDramas]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  // Get new releases
  const newReleases = [...mockDramas]
    .sort((a, b) => b.year - a.year)
    .slice(0, 6);

  return (
    <>
      <Navbar />
      <main>
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
            <div className="space-y-4">
              <div className="inline-block">
                <span className="text-accent font-semibold text-sm">Featured</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground text-balance">
                {featured[0]?.title}
              </h1>

              <p className="text-foreground/70 max-w-2xl text-sm sm:text-base leading-relaxed">
                {featured[0]?.description}
              </p>

              <div className="flex items-center gap-3 pt-4">
                <Link href={`/drama/${featured[0]?.id}`}>
                  <Button size="lg" className="bg-accent text-accent-foreground">
                    Start Watching
                  </Button>
                </Link>

                <Link href="/browse">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-border hover:bg-muted"
                  >
                    Explore All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Drama Info */}
              <div className="flex items-center gap-6 pt-6 text-sm text-muted-foreground border-t border-border">
                <div>
                  <p className="text-foreground font-semibold">
                    {featured[0]?.episodeCount}
                  </p>
                  <p>Episodes</p>
                </div>
                <div>
                  <p className="text-foreground font-semibold">
                    {featured[0]?.rating.toFixed(1)}
                  </p>
                  <p>Rating</p>
                </div>
                <div>
                  <p className="text-foreground font-semibold">
                    {featured[0]?.year}
                  </p>
                  <p>Year</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New Releases */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                New Releases
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Fresh content added regularly
              </p>
            </div>
            <Link href="/browse">
              <Button
                variant="ghost"
                size="sm"
                className="text-accent hover:text-accent hover:bg-accent/10"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {newReleases.map((drama) => (
              <DramaCard key={drama.id} drama={drama} />
            ))}
          </div>
        </section>

        {/* Top Rated */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Top Rated
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Most loved by our community
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...mockDramas]
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 6)
              .map((drama) => (
                <DramaCard key={drama.id} drama={drama} />
              ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-7xl mx-auto">
          <div className="rounded-lg bg-accent/10 border border-accent/30 p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Discover More Stories
            </h2>
            <p className="text-foreground/70 mb-6 max-w-xl mx-auto">
              Explore our comprehensive collection of Chinese dramas, romance,
              thrillers, historical epics, and more.
            </p>
            <Link href="/browse">
              <Button size="lg" className="bg-accent text-accent-foreground">
                Browse Drama
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
