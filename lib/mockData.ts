// Mock data for drama streaming app
// This will be replaced with real API calls when database is integrated

export interface Drama {
  id: number;
  title: string;
  chineseTitle?: string;
  description: string;
  poster: string;
  backdrop?: string;
  genre: string[];
  year: number;
  status: 'Ongoing' | 'Completed';
  rating: number;
  viewCount: number;
  episodeCount: number;
}

export interface Episode {
  id: number;
  dramaId: number;
  episodeNumber: number;
  title: string;
  description: string;
  videoUrl: string;
  subtitleUrl?: string;
  duration: number; // in seconds
  airDate: string;
  thumbnail?: string;
}

// Sample drama data
export const mockDramas: Drama[] = [
  {
    id: 1,
    title: 'A Journey of Flowers',
    chineseTitle: '花の旅',
    description:
      'A romantic tale of two souls finding love amidst ancient gardens and modern challenges. Watch as their bond grows stronger through seasons of change.',
    poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop',
    backdrop:
      'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1920&h=1080&fit=crop',
    genre: ['Romance', 'Drama', 'Comedy'],
    year: 2023,
    status: 'Completed',
    rating: 8.5,
    viewCount: 150000,
    episodeCount: 24,
  },
  {
    id: 2,
    title: 'Midnight Whispers',
    chineseTitle: '真夜中のささやき',
    description:
      'A thrilling mystery where past secrets resurface in a quiet provincial town. Uncover the truth before it is too late.',
    poster: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=400&h=600&fit=crop',
    backdrop:
      'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=1920&h=1080&fit=crop',
    genre: ['Mystery', 'Thriller', 'Crime'],
    year: 2024,
    status: 'Ongoing',
    rating: 8.2,
    viewCount: 98000,
    episodeCount: 16,
  },
  {
    id: 3,
    title: 'Legacy of the Crane',
    chineseTitle: '鶴の遺産',
    description:
      'An epic historical drama spanning decades. Follow a family dynasty through prosperity and adversity.',
    poster: 'https://images.unsplash.com/photo-1533613220915-05466a872585?w=400&h=600&fit=crop',
    backdrop:
      'https://images.unsplash.com/photo-1533613220915-05466a872585?w=1920&h=1080&fit=crop',
    genre: ['Historical', 'Family', 'Drama'],
    year: 2022,
    status: 'Completed',
    rating: 8.8,
    viewCount: 250000,
    episodeCount: 45,
  },
  {
    id: 4,
    title: 'City Lights',
    chineseTitle: '都市の光',
    description:
      'Modern romance blooms in the heart of the city. Three interconnected stories of love, ambition, and dreams.',
    poster: 'https://images.unsplash.com/photo-1478720568477-152d9e3fb27f?w=400&h=600&fit=crop',
    backdrop:
      'https://images.unsplash.com/photo-1478720568477-152d9e3fb27f?w=1920&h=1080&fit=crop',
    genre: ['Romance', 'Drama', 'Contemporary'],
    year: 2023,
    status: 'Completed',
    rating: 7.9,
    viewCount: 120000,
    episodeCount: 32,
  },
  {
    id: 5,
    title: 'Sword of Destiny',
    chineseTitle: '運命の剣',
    description:
      'Fantasy and martial arts collide in this epic adventure. A chosen hero must master ancient powers to save their world.',
    poster: 'https://images.unsplash.com/photo-1524712245610-41fdc87d45d1?w=400&h=600&fit=crop',
    backdrop:
      'https://images.unsplash.com/photo-1524712245610-41fdc87d45d1?w=1920&h=1080&fit=crop',
    genre: ['Fantasy', 'Action', 'Adventure'],
    year: 2024,
    status: 'Ongoing',
    rating: 8.4,
    viewCount: 180000,
    episodeCount: 20,
  },
  {
    id: 6,
    title: 'Hidden Love',
    chineseTitle: '偷偷藏不住',
    description:
      'Sang Zhi jatuh cinta pada teman kakak laki-lakinya, Duan Jiaxu. Sebuah kisah manis tentang cinta masa muda yang disembunyikan hingga mereka dewasa.',
    poster: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=600&fit=crop',
    backdrop:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&h=1080&fit=crop',
    genre: ['Romance', 'Youth', 'Comedy'],
    year: 2023,
    status: 'Completed',
    rating: 9.1,
    viewCount: 95000,
    episodeCount: 25,
  },
];

// Sample episodes for drama 1
export const mockEpisodes: Episode[] = [
  {
    id: 1,
    dramaId: 1,
    episodeNumber: 1,
    title: 'New Beginning',
    description:
      'Lily arrives at the flower estate to start her new life. She meets Jun, the mysterious garden keeper with a troubled past.',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
    subtitleUrl: 'https://example.com/subs/ep1.vtt',
    duration: 3600,
    airDate: '2023-01-15',
    thumbnail:
      'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=320&h=180&fit=crop',
  },
  {
    id: 2,
    dramaId: 1,
    episodeNumber: 2,
    title: 'Secrets in the Petals',
    description:
      'Lily discovers old letters hidden in the garden. Jun is hesitant about revealing the estates true history.',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4',
    subtitleUrl: 'https://example.com/subs/ep2.vtt',
    duration: 3540,
    airDate: '2023-01-22',
    thumbnail:
      'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=320&h=180&fit=crop',
  },
  {
    id: 3,
    dramaId: 1,
    episodeNumber: 3,
    title: 'Moonlit Confession',
    description:
      'Under the full moon, Jun finally opens up about his past. Their connection deepens as trust is built.',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4',
    subtitleUrl: 'https://example.com/subs/ep3.vtt',
    duration: 3720,
    airDate: '2023-01-29',
    thumbnail:
      'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=320&h=180&fit=crop',
  },
  {
    id: 4,
    dramaId: 1,
    episodeNumber: 4,
    title: 'Summer Heat',
    description:
      'As summer arrives, their relationship faces its first real test. Misunderstandings threaten to tear them apart.',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerJoyrides.mp4',
    subtitleUrl: 'https://example.com/subs/ep4.vtt',
    duration: 3600,
    airDate: '2023-02-05',
    thumbnail:
      'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=320&h=180&fit=crop',
  },
  {
    id: 5,
    dramaId: 1,
    episodeNumber: 5,
    title: 'Fragile Hearts',
    description:
      'Lily must decide whether to stay or return to her old life. Jun prepares for the possibility of losing her.',
    videoUrl:
      'https://commondatastorage.googleapis.com/gtv-videos-library/sample/VolleyballShortFilm.mp4',
    subtitleUrl: 'https://example.com/subs/ep5.vtt',
    duration: 3480,
    airDate: '2023-02-12',
    thumbnail:
      'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=320&h=180&fit=crop',
  },
];

// Episodes for other dramas
export const getEpisodesForDrama = (dramaId: number): Episode[] => {
  if (dramaId === 1) {
    return mockEpisodes;
  }

  // Generate mock episodes for other dramas
  const drama = mockDramas.find((d) => d.id === dramaId);
  if (!drama) return [];

  return Array.from({ length: Math.min(drama.episodeCount, 8) }).map(
    (_, idx) => ({
      id: dramaId * 100 + idx + 1,
      dramaId,
      episodeNumber: idx + 1,
      title: `Episode ${idx + 1}`,
      description: `Watch as the story of ${drama.title} continues. Episode ${idx + 1} brings new developments and exciting twists.`,
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
      subtitleUrl: `https://example.com/subs/${dramaId}_ep${idx + 1}.vtt`,
      duration: 3600,
      airDate: new Date(2023, 0, 15 + idx * 7).toISOString().split('T')[0],
      thumbnail: drama.poster,
    })
  );
};

// Get a single drama
export const getDramaById = (id: number): Drama | undefined => {
  return mockDramas.find((drama) => drama.id === id);
};

// Search dramas by title or genre
export const searchDramas = (query: string): Drama[] => {
  const q = query.toLowerCase();
  return mockDramas.filter(
    (drama) =>
      drama.title.toLowerCase().includes(q) ||
      drama.chineseTitle?.toLowerCase().includes(q) ||
      drama.description.toLowerCase().includes(q) ||
      drama.genre.some((g) => g.toLowerCase().includes(q))
  );
};

// Get dramas by genre
export const getDramasByGenre = (genre: string): Drama[] => {
  return mockDramas.filter((drama) => drama.genre.includes(genre));
};

// Get all genres
export const getAllGenres = (): string[] => {
  const genres = new Set<string>();
  mockDramas.forEach((drama) => {
    drama.genre.forEach((g) => genres.add(g));
  });
  return Array.from(genres).sort();
};
