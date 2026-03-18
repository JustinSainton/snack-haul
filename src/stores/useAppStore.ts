import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppState {
  /** Set of profile IDs that have completed onboarding */
  onboardedProfileIds: string[];
  hasOnboarded: (profileId: string | null) => boolean;
  markOnboarded: (profileId: string) => void;
  removeOnboarded: (profileId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      onboardedProfileIds: [],

      hasOnboarded: (profileId) =>
        profileId ? get().onboardedProfileIds.includes(profileId) : false,

      markOnboarded: (profileId) =>
        set((s) => ({
          onboardedProfileIds: [...new Set([...s.onboardedProfileIds, profileId])],
        })),

      removeOnboarded: (profileId) =>
        set((s) => ({
          onboardedProfileIds: s.onboardedProfileIds.filter((id) => id !== profileId),
        })),
    }),
    {
      name: "snack-haul-app",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
