import { View, Text, Pressable } from "react-native";
import type { SurveyOption } from "@/src/types/survey";

interface SurveyGridProps {
  options: SurveyOption[];
  selected: string[];
  accentColor: string;
  onToggle: (id: string) => void;
}

export function SurveyGrid({
  options,
  selected,
  accentColor,
  onToggle,
}: SurveyGridProps) {
  return (
    <View className="flex-row flex-wrap gap-3 px-6">
      {options.map((option) => {
        const isSelected = selected.includes(option.id);
        return (
          <Pressable
            key={option.id}
            onPress={() => onToggle(option.id)}
            className={`w-[47%] rounded-2xl border-2 px-4 py-5 ${
              isSelected ? "bg-white" : "border-transparent bg-white"
            }`}
            style={isSelected ? { borderColor: accentColor } : undefined}
          >
            <Text className="mb-1 text-2xl">{option.emoji}</Text>
            <Text
              className={`text-base font-semibold ${
                isSelected ? "text-foreground" : "text-foreground"
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
