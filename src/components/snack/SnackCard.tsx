import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import type { Snack } from "@/src/types/snack";
import { useProfilesStore } from "@/src/stores/useProfilesStore";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/src/constants/colors";

interface SnackCardProps {
  snack: Snack;
  score?: number;
}

export function SnackCard({ snack, score }: SnackCardProps) {
  const router = useRouter();
  const isFavorite = useProfilesStore((s) => s.isSnackFavorite(snack.id));
  const toggleFavorite = useProfilesStore((s) => s.toggleFavoriteSnack);

  return (
    <Pressable
      onPress={() => router.push(`/snack/${snack.id}`)}
      className="mb-3 flex-row rounded-2xl bg-white p-3 active:opacity-90"
    >
      {snack.imageUrl ? (
        <Image
          source={{ uri: snack.imageUrl }}
          style={{ width: 72, height: 72, borderRadius: 12 }}
          contentFit="cover"
        />
      ) : (
        <View className="h-[72px] w-[72px] items-center justify-center rounded-xl bg-border">
          <Text className="text-2xl">🍬</Text>
        </View>
      )}

      <View className="ml-3 flex-1 justify-center">
        <Text className="text-base font-semibold text-foreground" numberOfLines={1}>
          {snack.name}
        </Text>
        <Text className="text-sm text-muted" numberOfLines={1}>
          {snack.brand}
        </Text>
        {snack.nutriScore && (
          <View className="mt-1 flex-row items-center gap-1">
            <Text className="text-xs text-muted">Nutri-Score:</Text>
            <Text className="text-xs font-bold uppercase text-secondary">
              {snack.nutriScore}
            </Text>
          </View>
        )}
      </View>

      <Pressable
        onPress={() => toggleFavorite(snack.id)}
        className="justify-center px-2"
        hitSlop={12}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={22}
          color={isFavorite ? colors.primary : colors.muted}
        />
      </Pressable>
    </Pressable>
  );
}
