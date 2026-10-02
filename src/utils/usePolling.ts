'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook untuk real-time polling data dengan interval aman (10-15 detik)
 * Otomatis menangani cleanup interval saat unmount.
 */
export function usePolling<T>(
  fetchFn: () => Promise<T>,
  intervalMs: number = 10000,
  enabled: boolean = true
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef<boolean>(true);

  const executeFetch = useCallback(
    async (isBackground = false) => {
      if (!isBackground) setIsLoading(true);
      else setIsRefreshing(true);

      try {
        const result = await fetchFn();
        if (isMounted.current) {
          setData(result);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted.current) {
          setError(err?.message || 'Gagal memuat data terbaru');
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [fetchFn]
  );

  useEffect(() => {
    isMounted.current = true;
    if (!enabled) return;

    // Fetch pertama kali
    executeFetch(false);

    // Polling interval
    const interval = setInterval(() => {
      executeFetch(true);
    }, intervalMs);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [executeFetch, intervalMs, enabled]);

  const manualRefresh = () => executeFetch(false);

  return { data, isLoading, isRefreshing, error, refetch: manualRefresh };
}
