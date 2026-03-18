import type { SurveyAnswers } from "@/src/types/survey";
import type { ScoredSnack } from "./scoring";
import { rankSnacks } from "./scoring";
import { surveyCategoriesToOFFTags } from "./tags";
import { fetchSnacksForFeed } from "../api/openFoodFacts";
import { useSnackStore } from "@/src/stores/useSnackStore";
import { config } from "@/src/constants/config";

/**
 * The recommendation engine:
 * 1. Maps survey answers → Open Food Facts category tags
 * 2. Fetches products from those categories
 * 3. Caches them in the snack store
 * 4. Scores & ranks them against user preferences
 * 5. Returns the top results
 */
export async function getRecommendations(
  answers: SurveyAnswers,
  limit = 20
): Promise<ScoredSnack[]> {
  const store = useSnackStore.getState();

  // Check if we have fresh cached data
  const cachedSnacks = store.feedIds
    .map((id) => store.cache[id])
    .filter(Boolean);

  const isFresh =
    cachedSnacks.length > 0 &&
    cachedSnacks.every(
      (s) => Date.now() - s.cachedAt < config.cache.productTtlMs
    );

  let snacks = cachedSnacks;

  if (!isFresh) {
    // Map survey category answers to OFF tags
    const offTags = surveyCategoriesToOFFTags(answers.brands);

    // Fallback: if user didn't pick categories, use popular ones
    const allTags =
      offTags.length > 0
        ? offTags
        : ["potato-chips", "cookies", "chocolate-candies", "granola-bars"];

    // Cap at 6 tags to keep API calls reasonable
    const tagsToFetch = allTags.slice(0, 6);

    // Fetch from API
    const fetched = await fetchSnacksForFeed(tagsToFetch, 60);

    // Cache in store
    store.cacheSnacks(fetched);
    store.setFeedIds(fetched.map((s) => s.id));

    snacks = fetched;
  }

  // Score and rank
  const ranked = rankSnacks(snacks, answers);

  return ranked.slice(0, limit);
}
