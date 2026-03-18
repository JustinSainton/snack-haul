import { useEffect, useState, useCallback, useRef } from "react";
import { useProfilesStore } from "@/src/stores/useProfilesStore";
import { getRecommendations } from "@/src/services/recommendations/engine";
import type { ScoredSnack } from "@/src/services/recommendations/scoring";

export function useRecommendations(limit = 20) {
  const activeProfileId = useProfilesStore((s) => s.activeProfileId);
  const [results, setResults] = useState<ScoredSnack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchedForProfile = useRef<string | null>(null);

  useEffect(() => {
    if (!activeProfileId) return;
    if (fetchedForProfile.current === activeProfileId) return;

    const profile = useProfilesStore.getState().active();
    if (!profile) return;

    fetchedForProfile.current = activeProfileId;
    setIsLoading(true);
    setError(null);

    console.log("[Recs] Fetching for profile:", activeProfileId);

    getRecommendations(profile.surveyAnswers, limit)
      .then((ranked) => {
        console.log("[Recs] Got", ranked.length, "results");
        setResults(ranked);
      })
      .catch((e) => {
        console.error("[Recs] Error:", e);
        setError(e instanceof Error ? e.message : "Failed to load recommendations");
      })
      .finally(() => setIsLoading(false));
  }, [activeProfileId, limit]);

  const refresh = useCallback(() => {
    fetchedForProfile.current = null;
    const profile = useProfilesStore.getState().active();
    if (!profile) return;

    setIsLoading(true);
    setError(null);

    getRecommendations(profile.surveyAnswers, limit)
      .then((ranked) => setResults(ranked))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setIsLoading(false));
  }, [limit]);

  return { results, isLoading, error, refresh };
}
