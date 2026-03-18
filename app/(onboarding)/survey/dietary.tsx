import { ScrollView, Text } from "react-native";
import { useRouter } from "expo-router";
import { useProfilesStore } from "@/src/stores/useProfilesStore";
import { surveyOptions, surveyStepTitles } from "@/src/constants/survey";
import { surveyStepColors } from "@/src/constants/colors";
import { SurveyGrid } from "@/src/components/survey/SurveyGrid";
import { SurveyNavButtons } from "@/src/components/survey/SurveyNavButtons";

export default function Dietary() {
  const router = useRouter();
  const answers = useProfilesStore((s) => s.active()?.surveyAnswers.dietary ?? []);
  const toggleAnswer = useProfilesStore((s) => s.toggleSurveyAnswer);
  const accent = surveyStepColors.dietary;

  return (
    <ScrollView className="flex-1" contentContainerClassName="pb-4">
      <Text className="mb-6 px-6 text-2xl font-bold text-foreground">
        {surveyStepTitles.dietary}
      </Text>
      <SurveyGrid
        options={surveyOptions.dietary}
        selected={answers}
        accentColor={accent}
        onToggle={(id) => toggleAnswer("dietary", id)}
      />
      <SurveyNavButtons
        onBack={() => router.back()}
        onNext={() => router.push("/(onboarding)/survey/brands")}
        nextDisabled={answers.length === 0}
        accentColor={accent}
      />
    </ScrollView>
  );
}
