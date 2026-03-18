import { ScrollView, Text } from "react-native";
import { useRouter } from "expo-router";
import { useProfilesStore } from "@/src/stores/useProfilesStore";
import { surveyOptions, surveyStepTitles } from "@/src/constants/survey";
import { surveyStepColors } from "@/src/constants/colors";
import { SurveyGrid } from "@/src/components/survey/SurveyGrid";
import { SurveyNavButtons } from "@/src/components/survey/SurveyNavButtons";

export default function Flavors() {
  const router = useRouter();
  const answers = useProfilesStore((s) => s.active()?.surveyAnswers.flavors ?? []);
  const toggleAnswer = useProfilesStore((s) => s.toggleSurveyAnswer);
  const accent = surveyStepColors.flavors;

  return (
    <ScrollView className="flex-1" contentContainerClassName="pb-4">
      <Text className="mb-6 px-6 text-2xl font-bold text-foreground">
        {surveyStepTitles.flavors}
      </Text>
      <SurveyGrid
        options={surveyOptions.flavors}
        selected={answers}
        accentColor={accent}
        onToggle={(id) => toggleAnswer("flavors", id)}
      />
      <SurveyNavButtons
        onNext={() => router.push("/(onboarding)/survey/textures")}
        nextDisabled={answers.length === 0}
        accentColor={accent}
      />
    </ScrollView>
  );
}
