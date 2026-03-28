'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Drama } from '@/lib/mockData';
import { Star, Play } from 'lucide-react';

interface DramaCardProps {
  drama: Drama;
}

export function DramaCard({ drama }: DramaCardProps) {
  return (
    <Link href={`/drama/${drama.id}`}>
      <div className="group cursor-pointer">
        {/* Poster Image */}
        <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg bg-muted mb-3">
          <img
            src={drama.poster}
            alt={drama.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Play className="w-12 h-12 text-white fill-white" />
          </div>

          {/* Status Badge */}
          <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2.5 py-1 rounded-full text-xs font-semibold">
            {drama.status}
          </div>

          {/* Rating Badge */}
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {drama.rating.toFixed(1)}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground line-clamp-1 text-sm sm:text-base group-hover:text-accent transition-colors">
            {drama.title}
          </h3>

          {drama.chineseTitle && (
            <p className="text-muted-foreground text-xs sm:text-sm line-clamp-1">
              {drama.chineseTitle}
            </p>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{drama.year}</span>
            <span>•</span>
            <span>{drama.episodeCount} eps</span>
          </div>

          {/* Genres */}
          <div className="flex gap-1 flex-wrap pt-1">
            {drama.genre.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded"
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
