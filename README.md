# DramaFlix - Chinese Drama Streaming Platform

A modern web application for streaming Chinese dramas with support for bookmarks, offline viewing, and user authentication.

## Architecture Overview

### UI-First Approach with Mock Data

This project is built with a **UI-first methodology**, meaning all pages and features are built with mock data stored locally. This allows for rapid development and testing without requiring a backend database setup.

**Key Benefits:**
- Develop and test the entire UI independently
- Learn Next.js patterns without database complexity
- Easy migration to real database when ready
- Clear separation of concerns between UI and data layer

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: Tailwind CSS v4 + shadcn/ui components
- **State Management**: React Context (Auth) + localStorage (Data)
- **Video Player**: HTML5 `<video>` element
- **Offline Storage**: IndexedDB + localStorage
- **Styling**: Dark theme with warm accent colors (golden/orange)

## Project Structure

```
/app                          # Next.js app directory
  /page.tsx                   # Homepage
  /browse/page.tsx            # Drama catalog with filtering
  /drama/[id]/page.tsx        # Drama detail page
  /watch/[id]/page.tsx        # Video player (protected)
  /bookmarks/page.tsx         # Saved bookmarks (protected)
  /downloads/page.tsx         # Offline episodes (protected)
  /login/page.tsx             # Authentication
  /layout.tsx                 # Root layout with AuthProvider

/components
  /Navbar.tsx                 # Navigation with auth status
  /DramaCard.tsx              # Drama grid card
  /EpisodeList.tsx            # Episodes list with actions
  /EpisodePlayer.tsx          # Video player wrapper
  /AuthGuard.tsx              # Conditional rendering based on auth
  /BookmarkButton.tsx         # Bookmark toggle
  /DownloadButton.tsx         # Download for offline

/contexts
  /AuthContext.tsx            # Mock auth state management

/hooks
  /useAuth.ts                 # Auth context hook
  /useOfflineStorage.ts       # IndexedDB operations

/lib
  /mockData.ts                # Sample dramas & episodes
  /offlineStorage.ts          # IndexedDB utilities
```

## Features

### Public Features (No Login Required)
- Browse all available dramas
- View drama details and episode list
- Filter by genre, status, and search
- See ratings, episode counts, and synopses

### Protected Features (Login Required)
- **Bookmarks**: Save favorite dramas to your profile
- **Watch History**: Track which episodes you've watched
- **Offline Downloads**: Download episodes to watch without internet
- **30-Day Expiration**: Downloads automatically expire after 30 days

## Mock Data System

### Dramas
Located in `lib/mockData.ts`, contains 6 sample dramas with:
- Title and Chinese title
- Poster and backdrop images
- Description, genres, year, rating
- Episode count and status (Ongoing/Completed)

### Episodes
First drama has 5 full episodes with:
- Title, description, air date
- Video URL (Google samples)
- Duration and thumbnail
- Other dramas generate stub episodes on-demand

### How to Add More Data
```typescript
// lib/mockData.ts
export const mockDramas: Drama[] = [
  {
    id: 7,
    title: 'Your Drama Title',
    chineseTitle: '你的中文标题',
    description: '...',
    poster: 'https://image-url',
    genre: ['Romance', 'Drama'],
    year: 2024,
    status: 'Completed',
    rating: 8.5,
    viewCount: 100000,
    episodeCount: 24,
  },
  // ... more dramas
];
```

## Authentication System (Mock)

### How It Works
1. User enters email and password on `/login`
2. System accepts any email/password combination
3. User data stored in React Context + localStorage
4. Session persists across page refreshes
5. Protected routes redirect to login if user not found

### localStorage Keys
- `mockUser` - Current user profile
- `bookmarks_{userId}` - Array of drama IDs
- `watchHistory_{userId}` - Episode progress tracking

### To Switch to Real Auth Later
Replace `contexts/AuthContext.tsx` with NextAuth.js:
```typescript
// Just swap the context import
import { useSession } from 'next-auth/react';
```

## Offline Storage System

### IndexedDB Structure
```
Database: DramaStreaming
Store: downloads
  - id: episodeId_userId
  - episodeId, userId, title, dramaTitle
  - videoBlob, subtitleBlob (for future use)
  - downloadedAt, expiresAt
  - fileSize (in bytes)
```

### Currently Mock Implementation
The system simulates downloads by:
1. Creating metadata in IndexedDB
2. Tracking file sizes (mock data)
3. Setting 30-day expiration
4. Managing storage cleanup

### To Store Actual Videos Later
```typescript
// lib/offlineStorage.ts - Update saveOfflineEpisode
const blob = await fetch(videoUrl).then(r => r.blob());
const offlineEpisode: OfflineEpisode = {
  // ... existing fields
  videoBlob: blob,  // Add this
  fileSize: blob.size,
};
```

## Component Patterns

### AuthGuard - Conditional Rendering
Wraps buttons/features to hide them when user isn't logged in:
```tsx
<AuthGuard>
  <BookmarkButton dramaId={drama.id} />
</AuthGuard>
```

### Bookmarks - localStorage Backed
Stores/retrieves array of drama IDs:
```typescript
const bookmarks = JSON.parse(
  localStorage.getItem(`bookmarks_${userId}`) || '[]'
);
```

### Downloads - IndexedDB Backed
Stores full episode metadata with 30-day expiry:
```typescript
await saveOfflineEpisode({
  id: `${episodeId}_${userId}`,
  downloadedAt: now.toISOString(),
  expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  // ... more fields
});
```

## Design System

### Colors
- **Primary**: Dark (oklch(0.08 0 0)) - Background
- **Accent**: Golden/Orange (oklch(0.72 0.18 45)) - Call-to-action, highlights
- **Foreground**: Light text (oklch(0.95 0 0))
- **Muted**: Secondary text and dividers

### Typography
- **Headings**: Geist (Bold, sans-serif)
- **Body**: Geist (Regular, sans-serif)
- **Code**: Geist Mono

### Breakpoints (Tailwind)
- Mobile: Default (0px)
- Small: sm (640px)
- Medium: md (768px)
- Large: lg (1024px)

## Migration Path to Real Database

### Step 1: Setup Database
```bash
npm install @prisma/client prisma
npx prisma init
# Configure .env with database URL
```

### Step 2: Create Schema
```prisma
// prisma/schema.prisma
model Drama {
  id Int @id @default(autoincrement())
  title String
  description String
  // ... more fields
}
```

### Step 3: Replace Mock Data
```typescript
// OLD: from lib/mockData.ts
const drama = mockDramas.find(d => d.id === id);

// NEW: from database
const drama = await prisma.drama.findUnique({
  where: { id: parseInt(id) },
  include: { episodes: true }
});
```

### Step 4: Add Real Authentication
Replace AuthContext with NextAuth.js for secure server-side sessions.

## Development

### Running Locally
```bash
npm run dev
# Open http://localhost:3000
```

### Building for Production
```bash
npm run build
npm start
```

## Browser Support
- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS 13+, Android 12+)

## Notes for Future Developers

### About Mock Data
- All drama posters/backdrops are from Unsplash
- Episode videos use Google's sample video streams
- Ratings, view counts, and descriptions are fictional

### About localStorage Limits
- Most browsers: 5-10MB
- Fine for bookmarks/watch history
- Won't work for actual video storage (use IndexedDB/Blob)

### About Performance
- Current setup has no pagination
- With 100+ dramas, add infinite scroll or pagination
- Consider caching drama list in state management

## Common Tasks

### Add a New Drama
1. Add to `mockDramas` array in `lib/mockData.ts`
2. Optionally add episodes to `mockEpisodes`
3. Page will auto-generate episodes if missing

### Change Color Scheme
1. Edit `app/globals.css` - Update oklch color tokens
2. Colors auto-apply to all components via Tailwind design tokens

### Add Social Features
1. Add bookmark count to DramaCard
2. Add viewing stats to drama detail
3. Create leaderboard for top dramas

## License

MIT - Feel free to use this as a learning project or starting template.
