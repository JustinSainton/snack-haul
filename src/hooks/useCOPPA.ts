import { useProfilesStore } from "@/src/stores/useProfilesStore";

/** Returns COPPA restriction status for the active profile */
export function useCOPPA() {
  const coppaRestricted = useProfilesStore((s) => {
    const id = s.activeProfileId;
    return id ? s.profiles[id]?.coppaRestricted ?? false : false;
  });

  return {
    isRestricted: coppaRestricted,
    /** Label for purchase buttons */
    buyLabel: coppaRestricted ? "Ask a Parent!" : "Buy on Instacart",
  };
}
