import { Redirect } from "expo-router";
import { useProfilesStore } from "@/src/stores/useProfilesStore";
import { useAppStore } from "@/src/stores/useAppStore";

export default function Index() {
  const activeProfileId = useProfilesStore((s) => s.activeProfileId);
  const hasOnboarded = useAppStore((s) => s.hasOnboarded);

  if (activeProfileId && hasOnboarded(activeProfileId)) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(onboarding)/welcome" />;
}
