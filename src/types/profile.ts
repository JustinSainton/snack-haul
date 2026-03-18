import type { AgeGroup, SurveyAnswers } from "./survey";

export interface Profile {
  id: string;
  name: string;
  avatarId: string;
  ageGroup: AgeGroup | null;
  coppaRestricted: boolean;
  surveyAnswers: SurveyAnswers;
  snackProfileLabel: string;
  favoriteSnackIds: string[];
  favoriteRecipeIds: number[];
  /** ID of the parent profile this kid is linked to */
  linkedParentId: string | null;
  createdAt: number;
}

export function createEmptyProfile(id: string): Profile {
  return {
    id,
    name: "",
    avatarId: "avatar_1",
    ageGroup: null,
    coppaRestricted: false,
    surveyAnswers: { flavors: [], textures: [], dietary: [], brands: [] },
    snackProfileLabel: "",
    favoriteSnackIds: [],
    favoriteRecipeIds: [],
    linkedParentId: null,
    createdAt: Date.now(),
  };
}
