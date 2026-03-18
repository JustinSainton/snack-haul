import { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSnackStore } from "@/src/stores/useSnackStore";
import { useProfilesStore } from "@/src/stores/useProfilesStore";
import { getProduct } from "@/src/services/api/openFoodFacts";
import { BuyButton } from "@/src/components/snack/BuyButton";
import { colors } from "@/src/constants/colors";
import type { Snack } from "@/src/types/snack";

const nutriScoreColors: Record<string, string> = {
  a: "#2D8B2D",
  b: "#85BB2F",
  c: "#FECB02",
  d: "#EE8100",
  e: "#E63E11",
};

export default function SnackDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const cached = useSnackStore((s) => (id ? s.cache[id] : undefined));
  const cacheSnack = useSnackStore((s) => s.cacheSnack);
  const isFavorite = useProfilesStore((s) => s.isSnackFavorite(id || ""));
  const toggleFavorite = useProfilesStore((s) => s.toggleFavoriteSnack);

  const [snack, setSnack] = useState<Snack | null>(cached ?? null);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) {
      setSnack(cached);
      return;
    }
    if (!id) return;

    getProduct(id)
      .then((product) => {
        if (product) {
          cacheSnack(product);
          setSnack(product);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!snack) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-8">
        <Text className="text-4xl">😕</Text>
        <Text className="mt-3 text-center text-base text-muted">
          Couldn't find this snack.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-12">
      {/* Hero image */}
      {snack.imageUrl ? (
        <Image
          source={{ uri: snack.imageUrl.replace("/200.", "/400.") }}
          style={{ width: "100%", height: 280 }}
          contentFit="contain"
          className="bg-white"
        />
      ) : (
        <View className="h-[280px] w-full items-center justify-center bg-white">
          <Text className="text-6xl">🍬</Text>
        </View>
      )}

      <View className="px-6 pt-5">
        {/* Title + favorite */}
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-2xl font-bold text-foreground">
              {snack.name}
            </Text>
            <Text className="mt-1 text-base text-muted">{snack.brand}</Text>
          </View>
          <Pressable
            onPress={() => toggleFavorite(snack.id)}
            className="mt-1 rounded-full bg-white p-2"
            hitSlop={12}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={26}
              color={isFavorite ? colors.primary : colors.muted}
            />
          </Pressable>
        </View>

        {/* Nutri-Score badge */}
        {snack.nutriScore && (
          <View className="mt-4 flex-row items-center gap-2">
            <Text className="text-sm font-medium text-muted">Nutri-Score</Text>
            <View
              className="rounded-lg px-3 py-1"
              style={{
                backgroundColor: nutriScoreColors[snack.nutriScore] ?? colors.muted,
              }}
            >
              <Text className="text-sm font-bold uppercase text-white">
                {snack.nutriScore}
              </Text>
            </View>
          </View>
        )}

        {/* Allergens */}
        {snack.allergens.length > 0 && (
          <View className="mt-4">
            <Text className="mb-2 text-sm font-semibold text-muted">
              Allergens
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {snack.allergens.map((allergen) => (
                <View
                  key={allergen}
                  className="rounded-full bg-error/10 px-3 py-1"
                >
                  <Text className="text-xs font-medium text-error">
                    {allergen.replace("en:", "")}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Ingredients */}
        {snack.ingredients && (
          <View className="mt-5">
            <Text className="mb-2 text-sm font-semibold text-muted">
              Ingredients
            </Text>
            <Text className="text-sm leading-5 text-foreground">
              {snack.ingredients}
            </Text>
          </View>
        )}

        {/* Buy button */}
        <View className="mt-6">
          <BuyButton
            productName={snack.name}
            brand={snack.brand}
            snackId={snack.id}
            imageUrl={snack.imageUrl}
          />
        </View>
      </View>
    </ScrollView>
  );
}
