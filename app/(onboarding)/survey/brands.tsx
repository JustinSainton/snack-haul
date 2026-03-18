import { ScrollView, Text } from "react-native";
import { useRouter } from "expo-router";
import { useProfilesStore } from "@/src/stores/useProfilesStore";
import { surveyOptions, surveyStepTitles } from "@/src/constants/survey";
import { surveyStepColors } from "@/src/constants/colors";
import { SurveyGrid } from "@/src/components/survey/SurveyGrid";
import { SurveyNavButtons } from "@/src/components/survey/SurveyNavButtons";

export default function Brands() {
  const router = useRouter();
  const answers = useProfilesStore((s) => s.active()?.surveyAnswers.brands ?? []);
  const toggleAnswer = useProfilesStore((s) => s.toggleSurveyAnswer);
  const computeProfile = useProfilesStore((s) => s.computeSnackProfile);
  const accent = surveyStepColors.brands;

  return (
    <ScrollView className="flex-1" contentContainerClassName="pb-4">
      <Text className="mb-6 px-6 text-2xl font-bold text-foreground">
        {surveyStepTitles.brands}
      </Text>
      <SurveyGrid
        options={surveyOptions.brands}
        selected={answers}
        accentColor={accent}
        onToggle={(id) => toggleAnswer("brands", id)}
      />
      <SurveyNavButtons
        onBack={() => router.back()}
        onNext={() => {
          computeProfile();
          router.push("/(onboarding)/survey/results");
        }}
        nextLabel="See My Profile!"
        nextDisabled={answers.length === 0}
        accentColor={accent}
      />
    </ScrollView>
  );
}
