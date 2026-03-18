import type { SurveyAnswers } from "@/src/types/survey";
import type { Snack } from "@/src/types/snack";
import { analyzeProductTags, type TagAnalysis } from "./tags";

/**
 * Scoring weights — these control how much each dimension
 * influences the final recommendation score.
 *
 * flavor:     How well the snack's flavor tags match the user's preferences
 * texture:    How well texture tags match
 * category:   Whether it's a snack type they said they like
 * novelty:    Bonus for snacks with tags the user DIDN'T pick (discovery)
 * popularity: Slight boost for well-known products (nutri-score as proxy)
 */
const WEIGHTS = {
  flavor: 0.4,
  texture: 0.25,
  category: 0.2,
  novelty: 0.1,
  popularity: 0.05,
} as const;

/** Calculate overlap ratio: how many of `selected` appear in `productTags` */
function overlapScore(selected: string[], productTags: string[]): number {
  if (selected.length === 0) return 0;
  const matches = selected.filter((s) => productTags.includes(s)).length;
  return matches / selected.length;
}

/** Novelty: reward products with tags NOT in the user's selections */
function noveltyScore(
  selected: string[],
  productTags: string[]
): number {
  if (productTags.length === 0) return 0;
  const novel = productTags.filter((t) => !selected.includes(t)).length;
  return novel / productTags.length;
}

/** Popularity proxy: nutri-score a=1.0, b=0.8, c=0.6, d=0.4, e=0.2, unknown=0.5 */
function popularityScore(nutriScore: string | null): number {
  const scores: Record<string, number> = {
    a: 1.0, b: 0.8, c: 0.6, d: 0.4, e: 0.2,
  };
  return nutriScore ? scores[nutriScore] ?? 0.5 : 0.5;
}

export interface ScoredSnack {
  snack: Snack;
  score: number;
  analysis: TagAnalysis;
}

/**
 * Score a single snack against the user's survey answers.
 * Returns -Infinity if the snack violates a dietary restriction (hard filter).
 */
export function scoreSnack(
  snack: Snack,
  answers: SurveyAnswers
): ScoredSnack {
  const analysis = analyzeProductTags(snack.tags, snack.allergens);

  // Hard filter: if user has dietary restrictions and the snack conflicts
  if (answers.dietary.length > 0 && !answers.dietary.includes("none")) {
    const hasConflict = analysis.allergenConflicts.some((conflict) =>
      answers.dietary.includes(conflict)
    );
    if (hasConflict) {
      return { snack, score: -Infinity, analysis };
    }
  }

  const flavor = overlapScore(answers.flavors, analysis.flavors);
  const texture = overlapScore(answers.textures, analysis.textures);
  const category = overlapScore(answers.brands, analysis.categories);
  const novelty = noveltyScore(
    [...answers.flavors, ...answers.textures],
    [...analysis.flavors, ...analysis.textures]
  );
  const popularity = popularityScore(snack.nutriScore);

  const score =
    WEIGHTS.flavor * flavor +
    WEIGHTS.texture * texture +
    WEIGHTS.category * category +
    WEIGHTS.novelty * novelty +
    WEIGHTS.popularity * popularity;

  return { snack, score, analysis };
}

/** Score and rank a batch of snacks, filtering out dietary conflicts */
export function rankSnacks(
  snacks: Snack[],
  answers: SurveyAnswers
): ScoredSnack[] {
  return snacks
    .map((snack) => scoreSnack(snack, answers))
    .filter((s) => s.score > -Infinity)
    .sort((a, b) => b.score - a.score);
}
