import { useState, useCallback } from "react";
import { searchSnacks } from "@/src/services/api/openFoodFacts";
import { useSnackStore } from "@/src/stores/useSnackStore";
import type { Snack } from "@/src/types/snack";

export function useSnackSearch() {
  const cacheSnacks = useSnackStore((s) => s.cacheSnacks);
  const [results, setResults] = useState<Snack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const search = useCallback(async (query: string, page = 1) => {
    if (!query.trim()) {
      setResults([]);
      setTotalCount(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { snacks, totalCount } = await searchSnacks(query, page);
      cacheSnacks(snacks);
      setResults(page === 1 ? snacks : (prev) => [...prev, ...snacks]);
      setTotalCount(totalCount);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setIsLoading(false);
    }
  }, [cacheSnacks]);

  const clear = useCallback(() => {
    setResults([]);
    setTotalCount(0);
    setError(null);
  }, []);

  return { results, isLoading, error, totalCount, search, clear };
}
