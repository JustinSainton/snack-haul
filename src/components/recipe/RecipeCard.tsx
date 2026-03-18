import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProfilesStore } from "@/src/stores/useProfilesStore";
import { colors } from "@/src/constants/colors";
import type { Recipe } from "@/src/types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const router = useRouter();
  const isFavorite = useProfilesStore((s) => s.isRecipeFavorite(recipe.id));
  const toggleFavorite = useProfilesStore((s) => s.toggleFavoriteRecipe);

  return (
    <Pressable
      onPress={() => router.push(`/recipe/${recipe.id}`)}
      className="mb-4 overflow-hidden rounded-2xl bg-white active:opacity-90"
    >
      <Image
        source={{ uri: recipe.imageUrl }}
        style={{ width: "100%", height: 160 }}
        contentFit="cover"
      />
      <View className="p-4">
        <View className="flex-row items-start justify-between">
          <Text className="flex-1 text-lg font-bold text-foreground" numberOfLines={2}>
            {recipe.title}
          </Text>
          <Pressable onPress={() => toggleFavorite(recipe.id)} hitSlop={12}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? colors.primary : colors.muted}
            />
          </Pressable>
        </View>
        <View className="mt-2 flex-row items-center gap-4">
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={14} color={colors.muted} />
            <Text className="text-sm text-muted">{recipe.readyInMinutes} min</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="people-outline" size={14} color={colors.muted} />
            <Text className="text-sm text-muted">{recipe.servings} servings</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
