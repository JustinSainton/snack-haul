import type { SurveyOption, SurveyStep } from "@/src/types/survey";

export const surveySteps: SurveyStep[] = [
  "flavors",
  "textures",
  "dietary",
  "brands",
];

export const surveyStepTitles: Record<SurveyStep, string> = {
  flavors: "What flavors do you love?",
  textures: "What textures are your jam?",
  dietary: "Any allergies or diet stuff?",
  brands: "What kinds of snacks do you like?",
};

export const surveyOptions: Record<SurveyStep, SurveyOption[]> = {
  flavors: [
    { id: "sweet", label: "Sweet", emoji: "🍬" },
    { id: "salty", label: "Salty", emoji: "🧂" },
    { id: "sour", label: "Sour", emoji: "🍋" },
    { id: "spicy", label: "Spicy", emoji: "🌶️" },
    { id: "savory", label: "Savory", emoji: "🧀" },
    { id: "chocolate", label: "Chocolate", emoji: "🍫" },
    { id: "fruity", label: "Fruity", emoji: "🍓" },
    { id: "minty", label: "Minty", emoji: "🌿" },
  ],
  textures: [
    { id: "crunchy", label: "Crunchy", emoji: "🥨" },
    { id: "chewy", label: "Chewy", emoji: "🍭" },
    { id: "crispy", label: "Crispy", emoji: "🍟" },
    { id: "smooth", label: "Smooth", emoji: "🍮" },
    { id: "gummy", label: "Gummy", emoji: "🐻" },
    { id: "creamy", label: "Creamy", emoji: "🍦" },
    { id: "flaky", label: "Flaky", emoji: "🥐" },
    { id: "puffy", label: "Puffy", emoji: "☁️" },
  ],
  dietary: [
    { id: "none", label: "No restrictions", emoji: "✅" },
    { id: "gluten_free", label: "Gluten-Free", emoji: "🌾" },
    { id: "dairy_free", label: "Dairy-Free", emoji: "🥛" },
    { id: "nut_free", label: "Nut-Free", emoji: "🥜" },
    { id: "vegan", label: "Vegan", emoji: "🌱" },
    { id: "vegetarian", label: "Vegetarian", emoji: "🥗" },
    { id: "halal", label: "Halal", emoji: "☪️" },
    { id: "kosher", label: "Kosher", emoji: "✡️" },
  ],
  brands: [
    { id: "chips", label: "Chips & Crisps", emoji: "🍟" },
    { id: "candy", label: "Candy & Gummies", emoji: "🍬" },
    { id: "cookies", label: "Cookies", emoji: "🍪" },
    { id: "bars", label: "Bars & Bites", emoji: "🍫" },
    { id: "popcorn", label: "Popcorn", emoji: "🍿" },
    { id: "crackers", label: "Crackers", emoji: "🧇" },
    { id: "dried_fruit", label: "Dried Fruit", emoji: "🍎" },
    { id: "nuts_seeds", label: "Nuts & Seeds", emoji: "🌰" },
  ],
};

/** Maps survey answers to fun profile labels */
export function generateSnackProfile(answers: {
  flavors: string[];
  textures: string[];
}): string {
  const textureLabel =
    answers.textures[0] === "crunchy"
      ? "Crunchy"
      : answers.textures[0] === "chewy"
        ? "Chewy"
        : answers.textures[0] === "crispy"
          ? "Crispy"
          : "Adventurous";

  const flavorLabel =
    answers.flavors[0] === "sweet"
      ? "Sweet"
      : answers.flavors[0] === "salty"
        ? "Salty"
        : answers.flavors[0] === "spicy"
          ? "Spicy"
          : answers.flavors[0] === "sour"
            ? "Sour"
            : "Bold";

  return `${textureLabel}-${flavorLabel} Explorer!`;
}
