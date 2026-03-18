import { View, Text, FlatList, ActivityIndicator, Pressable } from "react-native";
import { useProfilesStore } from "@/src/stores/useProfilesStore";
import { useRecommendations } from "@/src/hooks/useRecommendations";
import { SnackCard } from "@/src/components/snack/SnackCard";
import { colors } from "@/src/constants/colors";

export default function Home() {
  const profileLabel = useProfilesStore((s) => {
    const id = s.activeProfileId;
    return id ? s.profiles[id]?.snackProfileLabel : null;
  });
  const { results, isLoading, error, refresh } = useRecommendations();

  return (
    <View className="flex-1 bg-background pt-16">
      <View className="px-6 pb-4">
        <Text className="text-sm text-muted">Welcome back,</Text>
        <Text className="text-2xl font-bold text-foreground">
          {profileLabel || "Snack Explorer!"}
        </Text>
      </View>

      {isLoading && results.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-3 text-sm text-muted">
            Finding snacks for you...
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-4xl">😕</Text>
          <Text className="mt-3 text-center text-base text-muted">
            {error}
          </Text>
          <Pressable
            onPress={refresh}
            className="mt-4 rounded-xl bg-primary px-6 py-3 active:opacity-80"
          >
            <Text className="font-bold text-white">Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.snack.id}-${index}`}
          renderItem={({ item }) => (
            <SnackCard snack={item.snack} score={item.score} />
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center pt-20">
              <Text className="text-4xl">🍿</Text>
              <Text className="mt-4 text-center text-base text-muted">
                No snacks found yet. Try retaking the survey!
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
