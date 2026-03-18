import { create } from "zustand";
import type { Snack } from "@/src/types/snack";

interface SnackState {
  cache: Record<string, Snack>;
  feedIds: string[];
  searchResults: string[];
  isLoading: boolean;

  cacheSnack: (snack: Snack) => void;
  cacheSnacks: (snacks: Snack[]) => void;
  setFeedIds: (ids: string[]) => void;
  setSearchResults: (ids: string[]) => void;
  setLoading: (loading: boolean) => void;
  getSnack: (id: string) => Snack | undefined;
}

export const useSnackStore = create<SnackState>()((set, get) => ({
  cache: {},
  feedIds: [],
  searchResults: [],
  isLoading: false,

  cacheSnack: (snack) =>
    set((state) => ({
      cache: { ...state.cache, [snack.id]: snack },
    })),

  cacheSnacks: (snacks) =>
    set((state) => {
      const updated = { ...state.cache };
      for (const snack of snacks) {
        updated[snack.id] = snack;
      }
      return { cache: updated };
    }),

  setFeedIds: (ids) => set({ feedIds: ids }),
  setSearchResults: (ids) => set({ searchResults: ids }),
  setLoading: (loading) => set({ isLoading: loading }),
  getSnack: (id) => get().cache[id],
}));
