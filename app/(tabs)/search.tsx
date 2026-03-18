import { useState } from "react";
import { View, Text, TextInput, FlatList, ActivityIndicator } from "react-native";
import { useSnackSearch } from "@/src/hooks/useSnackSearch";
import { SnackCard } from "@/src/components/snack/SnackCard";
import { colors } from "@/src/constants/colors";

export default function Search() {
  const [query, setQuery] = useState("");
  const { results, isLoading, error, totalCount, search } = useSnackSearch();

  function handleSubmit() {
    search(query);
  }

  return (
    <View className="flex-1 bg-background pt-16">
      <View className="px-6 pb-4">
        <Text className="mb-3 text-2xl font-bold text-foreground">
          Search Snacks
        </Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          placeholder="Try 'chocolate chips' or 'gummy bears'..."
          placeholderTextColor="#9A8F8A"
          returnKeyType="search"
          className="rounded-xl border border-border bg-white px-4 py-3 text-base text-foreground"
        />
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center text-base text-muted">{error}</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SnackCard snack={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          ListHeaderComponent={
            results.length > 0 ? (
              <Text className="mb-2 text-sm text-muted">
                {totalCount.toLocaleString()} results
              </Text>
            ) : null
          }
          ListEmptyComponent={
            query ? null : (
              <View className="items-center pt-20">
                <Text className="text-4xl">🔍</Text>
                <Text className="mt-4 text-center text-base text-muted">
                  Search for any snack by name, brand, or type
                </Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}
