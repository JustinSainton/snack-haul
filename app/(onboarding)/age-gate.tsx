import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useProfilesStore } from "@/src/stores/useProfilesStore";
import type { AgeGroup } from "@/src/types/survey";

const currentYear = new Date().getFullYear();
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const years = Array.from({ length: 18 }, (_, i) => currentYear - i);

export default function AgeGate() {
  const router = useRouter();
  const setAgeGroup = useProfilesStore((s) => s.setAgeGroup);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const canContinue = selectedMonth !== null && selectedYear !== null;

  function handleContinue() {
    if (selectedMonth === null || selectedYear === null) return;

    const now = new Date();
    const birthDate = new Date(selectedYear, selectedMonth);
    const age =
      now.getFullYear() -
      birthDate.getFullYear() -
      (now < new Date(now.getFullYear(), selectedMonth) ? 1 : 0);

    let group: AgeGroup;
    if (age < 13) group = "under13";
    else if (age < 18) group = "13to17";
    else group = "18plus";

    setAgeGroup(group);
    router.push("/(onboarding)/survey/flavors");
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="px-8 pt-16 pb-12"
    >
      <Text className="mb-2 text-3xl font-bold text-foreground">
        When were you born?
      </Text>
      <Text className="mb-8 text-base text-muted">
        We just need the month and year to personalize your experience.
      </Text>

      <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
        Month
      </Text>
      <View className="mb-6 flex-row flex-wrap gap-2">
        {months.map((month, i) => (
          <Pressable
            key={month}
            onPress={() => setSelectedMonth(i)}
            className={`rounded-xl px-4 py-2 ${
              selectedMonth === i
                ? "bg-primary"
                : "bg-white border border-border"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedMonth === i ? "text-white" : "text-foreground"
              }`}
            >
              {month}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
        Year
      </Text>
      <View className="mb-10 flex-row flex-wrap gap-2">
        {years.map((year) => (
          <Pressable
            key={year}
            onPress={() => setSelectedYear(year)}
            className={`rounded-xl px-4 py-2 ${
              selectedYear === year
                ? "bg-primary"
                : "bg-white border border-border"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                selectedYear === year ? "text-white" : "text-foreground"
              }`}
            >
              {year}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={handleContinue}
        disabled={!canContinue}
        className={`w-full rounded-2xl px-8 py-4 ${
          canContinue ? "bg-primary active:opacity-80" : "bg-border"
        }`}
      >
        <Text
          className={`text-center text-lg font-bold ${
            canContinue ? "text-white" : "text-muted"
          }`}
        >
          Continue
        </Text>
      </Pressable>
    </ScrollView>
  );
}
