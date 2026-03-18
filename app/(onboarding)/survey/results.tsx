import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useProfilesStore } from "@/src/stores/useProfilesStore";

export default function Results() {
  const router = useRouter();
  const label = useProfilesStore((s) => s.active()?.snackProfileLabel ?? "");

  return (
    <View className="flex-1 items-center justify-center px-8">
      <Text className="mb-4 text-6xl">🎉</Text>
      <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">
        You are a...
      </Text>
      <Text className="mb-8 text-center text-3xl font-bold text-accent">
        {label || "Snack Explorer!"}
      </Text>
      <Text className="mb-12 text-center text-base text-muted">
        We'll use your preferences to find snacks and recipes you'll love.
      </Text>
      <Pressable
        onPress={() => router.push("/(onboarding)/profile-create")}
        className="w-full rounded-2xl bg-accent px-8 py-4 active:opacity-80"
      >
        <Text className="text-center text-lg font-bold text-white">
          Create My Profile
        </Text>
      </Pressable>
    </View>
  );
}
