'use client';

import { useCallback, useState, useEffect } from 'react';
import {
  OfflineEpisode,
  saveOfflineEpisode,
  getOfflineEpisodesByUser,
  deleteOfflineEpisode,
  getTotalStorageUsed,
  formatBytes,
} from '@/lib/offlineStorage';

export const useOfflineStorage = (userId: string | null) => {
  const [downloads, setDownloads] = useState<OfflineEpisode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalStorage, setTotalStorage] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load downloads on mount and when userId changes
  useEffect(() => {
    if (!userId) {
      setDownloads([]);
      setTotalStorage(0);
      return;
    }

    const loadDownloads = async () => {
      try {
        setIsLoading(true);
        const episodes = await getOfflineEpisodesByUser(userId);
        setDownloads(episodes);

        const storage = await getTotalStorageUsed(userId);
        setTotalStorage(storage);
      } catch (err) {
        console.error('Failed to load downloads:', err);
        setError('Failed to load offline downloads');
      } finally {
        setIsLoading(false);
      }
    };

    loadDownloads();
  }, [userId]);

  // Download an episode (mock implementation)
  const downloadEpisode = useCallback(
    async (
      episodeId: string,
      title: string,
      dramaTitle: string,
      episodeNumber: number,
      thumbnail?: string
    ) => {
      if (!userId) {
        setError('Must be logged in to download');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Mock download - in real app, this would fetch the actual video
        // For now, we'll just create metadata
        const id = `${episodeId}_${userId}`;
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

        const offlineEpisode: OfflineEpisode = {
          id,
          episodeId,
          userId,
          title,
          dramaTitle,
          episodeNumber,
          thumbnail,
          downloadedAt: now.toISOString(),
          expiresAt: expiresAt.toISOString(),
          fileSize: Math.floor(Math.random() * 500 * 1024 * 1024) + 100 * 1024 * 1024, // 100-600 MB mock size
        };

        await saveOfflineEpisode(offlineEpisode);

        // Update local state
        setDownloads([...downloads, offlineEpisode]);
        setTotalStorage(totalStorage + offlineEpisode.fileSize);
      } catch (err) {
        console.error('Download failed:', err);
        setError('Failed to download episode');
      } finally {
        setIsLoading(false);
      }
    },
    [userId, downloads, totalStorage]
  );

  // Delete a download
  const deleteDownload = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const episode = downloads.find((d) => d.id === id);
        if (!episode) throw new Error('Download not found');

        await deleteOfflineEpisode(id);

        // Update local state
        setDownloads(downloads.filter((d) => d.id !== id));
        setTotalStorage(totalStorage - episode.fileSize);
      } catch (err) {
        console.error('Delete failed:', err);
        setError('Failed to delete download');
      } finally {
        setIsLoading(false);
      }
    },
    [downloads, totalStorage]
  );

  // Check if episode is downloaded
  const isEpisodeDownloaded = useCallback(
    (episodeId: string): boolean => {
      return downloads.some((d) => d.episodeId === episodeId);
    },
    [downloads]
  );

  return {
    downloads,
    isLoading,
    totalStorage,
    totalStorageFormatted: formatBytes(totalStorage),
    error,
    downloadEpisode,
    deleteDownload,
    isEpisodeDownloaded,
  };
};
