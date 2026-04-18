const API_BASE = 'https://api.sansekai.my.id/api/dramabox';

// API Response Interfaces
export interface ApiDrama {
  bookId: string;
  bookName: string;
  coverWap: string;
  chapterCount: number;
  introduction: string;
  tags: string[];
  tagV3s?: any[];
  protagonist?: string;
  rankVo?: {
    hotCode: string;
    sort: number;
  };
  shelfTime?: string;
  // detail related
  authorName?: string;
  episodes?: ApiEpisode[];
}

export interface ApiEpisode {
  chapterId?: string;
  id?: string;
  chapterName?: string;
  title?: string;
  videoUrl?: string;
  url?: string;
  description?: string;
  duration?: number;
  thumbnail?: string;
  coverWap?: string;
  chapterImg?: string;
  cdnList?: any[];
}

export interface Episode {
  id: string;
  dramaId: string;
  episodeNumber: number;
  title: string;
  description: string;
  videoUrl: string;
  subtitleUrl?: string;
  duration: number; // in seconds
  airDate: string;
  thumbnail?: string;
}

export const mapApiEpisodeToEpisode = (apiEp: ApiEpisode, dramaId: string, index: number): Episode => {
  let videoUrl = apiEp.videoUrl || apiEp.url || '';
  if (!videoUrl && apiEp.cdnList && apiEp.cdnList.length > 0) {
     const cdn = apiEp.cdnList.find((c: any) => c.isDefault) || apiEp.cdnList[0];
     if (cdn && cdn.videoPathList && cdn.videoPathList.length > 0) {
        const pathObj = cdn.videoPathList.find((p: any) => p.isDefault) || cdn.videoPathList[0];
        videoUrl = pathObj.videoPath || videoUrl;
     }
  }

  return {
    id: apiEp.chapterId || apiEp.id || `${dramaId}_${index}`,
    dramaId: dramaId,
    episodeNumber: index + 1,
    title: apiEp.chapterName || apiEp.title || `Episode ${index + 1}`,
    description: apiEp.description || `Episode ${index + 1} of the drama.`,
    videoUrl: videoUrl,
    duration: apiEp.duration || 3600,
    airDate: new Date().toISOString(),
    thumbnail: apiEp.chapterImg || apiEp.thumbnail || apiEp.coverWap || '',
  };
};
export interface Drama {
  id: string; // using string because bookId is string
  title: string;
  chineseTitle?: string;
  description: string;
  poster: string;
  backdrop: string;
  genre: string[];
  year: number;
  status: 'Ongoing' | 'Completed';
  rating: number; // mocked as API might not provide a straightforward 1-10
  viewCount: string | number; // e.g. "2.1M" or parsed
  episodeCount: number;
}

export const mapApiDramaToDrama = (apiDrama: ApiDrama): Drama => {
  return {
    id: apiDrama.bookId,
    title: apiDrama.bookName || 'Unknown Title',
    description: apiDrama.introduction || 'No description available',
    poster: apiDrama.coverWap || (apiDrama as any).cover || '',
    backdrop: apiDrama.coverWap || (apiDrama as any).cover || '', // fallback since API doesn't seem to provide separate backdrop
    genre: apiDrama.tags || [],
    year: apiDrama.shelfTime ? new Date(apiDrama.shelfTime).getFullYear() : new Date().getFullYear(),
    status: 'Completed', // fallback
    rating: apiDrama.rankVo?.sort ? (10 - apiDrama.rankVo.sort * 0.1) : 8.5, // somewhat hacky mapping
    viewCount: apiDrama.rankVo?.hotCode || 0,
    episodeCount: apiDrama.chapterCount || 0,
  };
};

export async function fetchTrendingDramas(): Promise<Drama[]> {
  try {
    const res = await fetch(`${API_BASE}/trending`);
    const data = await res.json();
    if (!res.ok || data.error) {
      throw (data.message || data.error || 'Server error');
    }
    if (Array.isArray(data)) {
      return data.map(mapApiDramaToDrama);
    }
    return [];
  } catch (error) {
    throw error;
  }
}

export async function fetchLatestDramas(): Promise<Drama[]> {
  try {
    const res = await fetch(`${API_BASE}/latest`);
    const data = await res.json();
    if (!res.ok || data.error) {
      throw (data.message || data.error || 'Server error');
    }
    if (Array.isArray(data)) {
      return data.map(mapApiDramaToDrama);
    }
    return [];
  } catch (error) {
    throw error;
  }
}

export async function fetchForYouDramas(): Promise<Drama[]> {
  try {
    const res = await fetch(`${API_BASE}/foryou`);
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map(mapApiDramaToDrama);
    }
    return [];
  } catch (error) {
    console.error('Error fetching foryou dramas', error);
    return [];
  }
}

export async function fetchSearchDramas(query: string): Promise<Drama[]> {
  try {
    const res = await fetch(`${API_BASE}/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map(mapApiDramaToDrama);
    } else if (data && data.data && Array.isArray(data.data)) {
      return data.data.map(mapApiDramaToDrama);
    }
    return [];
  } catch (error) {
    console.error('Error searching dramas', error);
    return [];
  }
}

export async function fetchPopularSearches(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE}/populersearch`);
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map((item: any) => item.keyword || item.bookName || item);
    }
    return [];
  } catch (error) {
    console.error('Error fetching popular searches', error);
    return [];
  }
}

export async function fetchDramaDetail(id: string): Promise<Drama | null> {
  try {
    const res = await fetch(`${API_BASE}/detail?bookId=${id}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) return mapApiDramaToDrama(data[0]);
    if (data && data.bookId) return mapApiDramaToDrama(data);
    return null;
  } catch (error) {
    console.error(`Error fetching detail for ID: ${id}`, error);
    return null;
  }
}

export async function fetchAllEpisodes(id: string): Promise<Episode[]> {
  try {
    const res = await fetch(`${API_BASE}/allepisode?bookId=${id}`);
    const data = await res.json();
    let episodes: ApiEpisode[] = [];
    if (Array.isArray(data)) episodes = data;
    else if (data && data.data && Array.isArray(data.data)) episodes = data.data;
    
    return episodes.map((ep, idx) => mapApiEpisodeToEpisode(ep, id, idx));
  } catch (error) {
    console.error(`Error fetching episodes for ID: ${id}`, error);
    return [];
  }
}

export async function fetchDecryptVideo(url: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/decrypt?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    let decUrl = data.streamUrl || data.data || data.url || data.videoUrl || data.decryptedUrl || null;
    
    // We do NOT want to decode the url if it's already a full proxy url that needs the query to stay encoded.
    // However if it's double encoded, or it's just a raw url, it should be fine. The API seems to work as is.
    
    return decUrl;
  } catch (error) {
    console.error('Error decrypting video url', error);
    return null;
  }
}
