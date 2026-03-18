import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { mockRecipes } from "@/src/constants/mockRecipes";
import { BuyButton } from "@/src/components/snack/BuyButton";
import { colors } from "@/src/constants/colors";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = mockRecipes.find((r) => String(r.id) === id);

  if (!recipe) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-4xl">😕</Text>
        <Text className="mt-3 text-base text-muted">Recipe not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background" contentContainerClassName="pb-12">
      <Image
        source={{ uri: recipe.imageUrl }}
        style={{ width: "100%", height: 240 }}
        contentFit="cover"
      />

      <View className="px-6 pt-5">
        <Text className="text-2xl font-bold text-foreground">
          {recipe.title}
        </Text>

        <View className="mt-3 flex-row items-center gap-4">
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={16} color={colors.muted} />
            <Text className="text-sm text-muted">{recipe.readyInMinutes} min</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="people-outline" size={16} color={colors.muted} />
            <Text className="text-sm text-muted">{recipe.servings} servings</Text>
          </View>
        </View>

        <Text className="mt-4 text-base leading-6 text-foreground">
          {recipe.summary}
        </Text>

        {/* Ingredients */}
        <Text className="mb-3 mt-6 text-lg font-bold text-foreground">
          Ingredients
        </Text>
        {recipe.ingredients.map((ing, i) => (
          <View key={i} className="mb-2 flex-row items-center gap-2">
            <View className="h-2 w-2 rounded-full bg-primary" />
            <Text className="text-base text-foreground">
              {ing.amount} {ing.unit} {ing.name}
            </Text>
          </View>
        ))}

        {/* Steps */}
        <Text className="mb-3 mt-6 text-lg font-bold text-foreground">
          Steps
        </Text>
        {recipe.steps.map((step) => (
          <View key={step.number} className="mb-4 flex-row gap-3">
            <View className="h-7 w-7 items-center justify-center rounded-full bg-primary">
              <Text className="text-sm font-bold text-white">{step.number}</Text>
            </View>
            <Text className="flex-1 text-base leading-6 text-foreground">
              {step.instruction}
            </Text>
          </View>
        ))}

        {/* Buy ingredients */}
        <View className="mt-4">
          <Text className="mb-3 text-sm text-muted">
            Need ingredients? Get them delivered!
          </Text>
          <BuyButton
            productName={recipe.ingredients.map((i) => i.name).join(", ")}
          />
        </View>
      </View>
    </ScrollView>
  );
}
