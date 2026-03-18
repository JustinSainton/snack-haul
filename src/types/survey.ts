export type SurveyStep = "flavors" | "textures" | "dietary" | "brands";

export interface SurveyOption {
  id: string;
  label: string;
  emoji: string;
}

export interface SurveyAnswers {
  flavors: string[];
  textures: string[];
  dietary: string[];
  brands: string[];
}

export type AgeGroup = "under13" | "13to17" | "18plus";
