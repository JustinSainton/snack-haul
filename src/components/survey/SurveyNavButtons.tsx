import { View, Text, Pressable } from "react-native";

interface SurveyNavButtonsProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  accentColor: string;
}

export function SurveyNavButtons({
  onBack,
  onNext,
  nextLabel = "Next",
  nextDisabled = false,
  accentColor,
}: SurveyNavButtonsProps) {
  return (
    <View className="flex-row gap-3 px-6 pb-10 pt-4">
      {onBack && (
        <Pressable
          onPress={onBack}
          className="flex-1 rounded-2xl border border-border bg-white px-6 py-4 active:opacity-80"
        >
          <Text className="text-center text-base font-bold text-foreground">
            Back
          </Text>
        </Pressable>
      )}
      <Pressable
        onPress={onNext}
        disabled={nextDisabled}
        className={`flex-1 rounded-2xl px-6 py-4 ${
          nextDisabled ? "opacity-40" : "active:opacity-80"
        }`}
        style={{ backgroundColor: nextDisabled ? "#ccc" : accentColor }}
      >
        <Text className="text-center text-base font-bold text-white">
          {nextLabel}
        </Text>
      </Pressable>
    </View>
  );
}
