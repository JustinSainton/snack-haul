import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Profile } from "@/src/types/profile";
import type { AgeGroup, SurveyStep } from "@/src/types/survey";
import type { SnackRequest } from "@/src/types/snackRequest";
import { createEmptyProfile } from "@/src/types/profile";
import { generateSnackProfile } from "@/src/constants/survey";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

interface ProfilesState {
  profiles: Record<string, Profile>;
  activeProfileId: string | null;
  snackRequests: SnackRequest[];

  // Profile lifecycle
  createProfile: () => string;
  deleteProfile: (id: string) => void;
  setActiveProfile: (id: string) => void;

  // Active profile helpers
  active: () => Profile | null;
  updateActive: (updates: Partial<Profile>) => void;

  // Onboarding shortcuts for the active profile
  setAgeGroup: (group: AgeGroup) => void;
  setName: (name: string) => void;
  setAvatarId: (id: string) => void;

  // Family linking
  linkToParent: (parentProfileId: string) => void;
  getLinkedKids: (parentProfileId: string) => Profile[];
  getParentProfiles: () => Profile[];

  // Snack requests
  createSnackRequest: (snack: {
    id: string;
    name: string;
    brand: string;
    imageUrl: string | null;
  }) => void;
  getRequestsForParent: (parentProfileId: string) => SnackRequest[];
  approveRequest: (requestId: string) => void;
  dismissRequest: (requestId: string) => void;

  // Survey
  toggleSurveyAnswer: (step: SurveyStep, optionId: string) => void;
  computeSnackProfile: () => void;
  resetSurvey: () => void;

  // Favorites
  toggleFavoriteSnack: (id: string) => void;
  toggleFavoriteRecipe: (id: number) => void;
  isSnackFavorite: (id: string) => boolean;
  isRecipeFavorite: (id: number) => boolean;
}

export const useProfilesStore = create<ProfilesState>()(
  persist(
    (set, get) => ({
      profiles: {},
      activeProfileId: null,
      snackRequests: [],

      createProfile: () => {
        const id = generateId();
        const profile = createEmptyProfile(id);
        set((s) => ({
          profiles: { ...s.profiles, [id]: profile },
          activeProfileId: id,
        }));
        return id;
      },

      deleteProfile: (id) =>
        set((s) => {
          const { [id]: _, ...rest } = s.profiles;
          const ids = Object.keys(rest);
          return {
            profiles: rest,
            activeProfileId:
              s.activeProfileId === id ? (ids[0] ?? null) : s.activeProfileId,
            // Clean up requests from/to this profile
            snackRequests: s.snackRequests.filter(
              (r) => r.requestedByProfileId !== id && r.parentProfileId !== id
            ),
          };
        }),

      setActiveProfile: (id) => set({ activeProfileId: id }),

      active: () => {
        const { profiles, activeProfileId } = get();
        return activeProfileId ? profiles[activeProfileId] ?? null : null;
      },

      updateActive: (updates) =>
        set((s) => {
          if (!s.activeProfileId) return s;
          const profile = s.profiles[s.activeProfileId];
          if (!profile) return s;
          return {
            profiles: {
              ...s.profiles,
              [s.activeProfileId]: { ...profile, ...updates },
            },
          };
        }),

      // Onboarding
      setAgeGroup: (group) =>
        get().updateActive({
          ageGroup: group,
          coppaRestricted: group === "under13",
        }),

      setName: (name) => get().updateActive({ name }),
      setAvatarId: (id) => get().updateActive({ avatarId: id }),

      // Family linking
      linkToParent: (parentProfileId) =>
        get().updateActive({ linkedParentId: parentProfileId }),

      getLinkedKids: (parentProfileId) =>
        Object.values(get().profiles).filter(
          (p) => p.linkedParentId === parentProfileId
        ),

      getParentProfiles: () =>
        Object.values(get().profiles).filter((p) => !p.coppaRestricted),

      // Snack requests
      createSnackRequest: (snack) => {
        const profile = get().active();
        if (!profile || !profile.linkedParentId) return;

        const request: SnackRequest = {
          id: generateId(),
          snackId: snack.id,
          snackName: snack.name,
          snackBrand: snack.brand,
          snackImageUrl: snack.imageUrl,
          requestedByProfileId: profile.id,
          requestedByName: profile.name,
          parentProfileId: profile.linkedParentId,
          status: "pending",
          createdAt: Date.now(),
        };

        set((s) => ({ snackRequests: [...s.snackRequests, request] }));
      },

      getRequestsForParent: (parentProfileId) =>
        get().snackRequests.filter(
          (r) => r.parentProfileId === parentProfileId && r.status === "pending"
        ),

      approveRequest: (requestId) =>
        set((s) => ({
          snackRequests: s.snackRequests.map((r) =>
            r.id === requestId ? { ...r, status: "approved" as const } : r
          ),
        })),

      dismissRequest: (requestId) =>
        set((s) => ({
          snackRequests: s.snackRequests.map((r) =>
            r.id === requestId ? { ...r, status: "dismissed" as const } : r
          ),
        })),

      // Survey
      toggleSurveyAnswer: (step, optionId) =>
        set((s) => {
          if (!s.activeProfileId) return s;
          const profile = s.profiles[s.activeProfileId];
          if (!profile) return s;
          const current = profile.surveyAnswers[step];
          const updated = current.includes(optionId)
            ? current.filter((id) => id !== optionId)
            : [...current, optionId];
          return {
            profiles: {
              ...s.profiles,
              [s.activeProfileId]: {
                ...profile,
                surveyAnswers: { ...profile.surveyAnswers, [step]: updated },
              },
            },
          };
        }),

      computeSnackProfile: () => {
        const profile = get().active();
        if (!profile) return;
        const label = generateSnackProfile(profile.surveyAnswers);
        get().updateActive({ snackProfileLabel: label });
      },

      resetSurvey: () =>
        get().updateActive({
          surveyAnswers: { flavors: [], textures: [], dietary: [], brands: [] },
          snackProfileLabel: "",
        }),

      // Favorites
      toggleFavoriteSnack: (id) => {
        const profile = get().active();
        if (!profile) return;
        const ids = profile.favoriteSnackIds.includes(id)
          ? profile.favoriteSnackIds.filter((s) => s !== id)
          : [...profile.favoriteSnackIds, id];
        get().updateActive({ favoriteSnackIds: ids });
      },

      toggleFavoriteRecipe: (id) => {
        const profile = get().active();
        if (!profile) return;
        const ids = profile.favoriteRecipeIds.includes(id)
          ? profile.favoriteRecipeIds.filter((r) => r !== id)
          : [...profile.favoriteRecipeIds, id];
        get().updateActive({ favoriteRecipeIds: ids });
      },

      isSnackFavorite: (id) =>
        get().active()?.favoriteSnackIds.includes(id) ?? false,

      isRecipeFavorite: (id) =>
        get().active()?.favoriteRecipeIds.includes(id) ?? false,
    }),
    {
      name: "snack-haul-profiles",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
