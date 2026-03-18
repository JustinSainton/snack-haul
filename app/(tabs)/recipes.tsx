import { View, Text, FlatList } from "react-native";
import { mockRecipes } from "@/src/constants/mockRecipes";
import { RecipeCard } from "@/src/components/recipe/RecipeCard";

export default function Recipes() {
  return (
    <View className="flex-1 bg-background pt-16">
      <View className="px-6 pb-4">
        <Text className="text-2xl font-bold text-foreground">
          Snack Recipes
        </Text>
        <Text className="mt-1 text-sm text-muted">
          Easy recipes you can make at home
        </Text>
      </View>

      <FlatList
        data={mockRecipes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <RecipeCard recipe={item} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
      />
    </View>
  );
}
