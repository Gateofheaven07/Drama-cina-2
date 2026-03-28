// IndexedDB utilities for offline video storage
// This manages downloaded episodes for offline playback

export interface OfflineEpisode {
  id: string; // episodeId_userId
  episodeId: number;
  userId: string;
  title: string;
  dramaTitle: string;
  episodeNumber: number;
  videoBlob?: Blob;
  subtitleBlob?: Blob;
  thumbnail?: string;
  downloadedAt: string;
  expiresAt: string; // 30 days from download date
  fileSize: number; // in bytes
}

const DB_NAME = 'DramaStreaming';
const DB_VERSION = 1;
const STORE_NAME = 'downloads';

// Helper to open the database
export const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object store for downloads
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('userId', 'userId', { unique: false });
        store.createIndex('expiresAt', 'expiresAt', { unique: false });
      }
    };
  });
};

// Save a downloaded episode
export const saveOfflineEpisode = async (
  episode: OfflineEpisode
): Promise<void> => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(episode);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

// Get downloaded episode by id
export const getOfflineEpisode = async (
  id: string
): Promise<OfflineEpisode | null> => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
};

// Get all downloaded episodes for a user
export const getOfflineEpisodesByUser = async (
  userId: string
): Promise<OfflineEpisode[]> => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('userId');
    const request = index.getAll(userId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const episodes = request.result || [];
      // Filter out expired downloads
      const now = new Date();
      const active = episodes.filter(
        (ep) => new Date(ep.expiresAt) > now
      );
      resolve(active);
    };
  });
};

// Delete an offline episode
export const deleteOfflineEpisode = async (id: string): Promise<void> => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

// Clean up expired downloads
export const cleanupExpiredDownloads = async (
  userId: string
): Promise<number> => {
  const episodes = await getOfflineEpisodesByUser(userId);
  const now = new Date();
  let deleted = 0;

  for (const ep of episodes) {
    if (new Date(ep.expiresAt) <= now) {
      await deleteOfflineEpisode(ep.id);
      deleted++;
    }
  }

  return deleted;
};

// Get total storage used for a user
export const getTotalStorageUsed = async (userId: string): Promise<number> => {
  const episodes = await getOfflineEpisodesByUser(userId);
  return episodes.reduce((total, ep) => total + ep.fileSize, 0);
};

// Format bytes to readable format
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
