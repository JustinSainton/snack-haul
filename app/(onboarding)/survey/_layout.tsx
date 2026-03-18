import { View, Text } from "react-native";
import { Slot, usePathname } from "expo-router";
import { surveyStepColors } from "@/src/constants/colors";
import { surveySteps } from "@/src/constants/survey";
import type { SurveyStep } from "@/src/types/survey";

export default function SurveyLayout() {
  const pathname = usePathname();
  const currentStep = pathname.split("/").pop() as SurveyStep;
  const stepIndex = surveySteps.indexOf(currentStep);
  const safeIndex = stepIndex >= 0 ? stepIndex : 0;
  const progress = (safeIndex + 1) / surveySteps.length;
  const accentColor = surveyStepColors[surveySteps[safeIndex]];

  return (
    <View className="flex-1 bg-background">
      {/* Progress bar */}
      <View className="px-6 pt-16 pb-4">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-sm font-medium text-muted">
            Step {safeIndex + 1} of {surveySteps.length}
          </Text>
        </View>
        <View className="h-2 rounded-full bg-border">
          <View
            className="h-2 rounded-full"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: accentColor,
            }}
          />
        </View>
      </View>

      <Slot />
    </View>
  );
}
