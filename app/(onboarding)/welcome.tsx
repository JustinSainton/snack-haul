import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useProfilesStore } from "@/src/stores/useProfilesStore";

export default function Welcome() {
  const router = useRouter();
  const createProfile = useProfilesStore((s) => s.createProfile);

  function handleStart() {
    createProfile(); // creates a new profile and sets it as active
    router.push("/(onboarding)/age-gate");
  }

  return (
    <View className="flex-1 items-center justify-center bg-background px-8">
      <Text className="mb-2 text-6xl">🍿</Text>
      <Text className="mb-2 text-4xl font-bold text-foreground">
        Snack Haul
      </Text>
      <Text className="mb-12 text-center text-lg text-muted">
        Discover snacks you'll love, tailored just for you!
      </Text>

      <Pressable
        onPress={handleStart}
        className="w-full rounded-2xl bg-primary px-8 py-4 active:opacity-80"
      >
        <Text className="text-center text-lg font-bold text-white">
          Let's Go!
        </Text>
      </Pressable>
    </View>
  );
}
