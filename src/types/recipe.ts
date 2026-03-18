export interface Recipe {
  id: number;
  title: string;
  imageUrl: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  tags: string[];
}

export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: string;
}

export interface RecipeStep {
  number: number;
  instruction: string;
}
