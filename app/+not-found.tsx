import { View, Text, Pressable } from "react-native";
import { Link, Stack } from "expo-router";

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 items-center justify-center bg-background px-8">
        <Text className="text-5xl">😅</Text>
        <Text className="mt-4 text-xl font-bold text-foreground">
          This page doesn't exist
        </Text>
        <Link href="/" asChild>
          <Pressable className="mt-6 rounded-xl bg-primary px-6 py-3 active:opacity-80">
            <Text className="font-bold text-white">Go Home</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}
