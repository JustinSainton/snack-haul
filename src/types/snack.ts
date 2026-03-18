export interface Snack {
  id: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  tags: string[];
  categories: string[];
  nutriScore: string | null;
  ingredients: string | null;
  allergens: string[];
  cachedAt: number;
}
