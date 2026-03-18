/**
 * Maps Open Food Facts category/label tags to our internal survey taxonomy.
 * OFF uses hierarchical tags like "en:chocolate-biscuits" —
 * we map these to our flat survey option IDs.
 */

/** OFF tag substring → survey flavor IDs */
const flavorMap: Record<string, string[]> = {
  chocolate: ["chocolate", "sweet"],
  sugar: ["sweet"],
  candy: ["sweet"],
  caramel: ["sweet"],
  honey: ["sweet"],
  "salted": ["salty"],
  "salt": ["salty"],
  "sea-salt": ["salty"],
  sour: ["sour"],
  "citrus": ["sour", "fruity"],
  spicy: ["spicy"],
  hot: ["spicy"],
  chili: ["spicy"],
  jalapeno: ["spicy"],
  cheese: ["savory"],
  savory: ["savory"],
  herb: ["savory"],
  fruit: ["fruity"],
  berry: ["fruity"],
  strawberry: ["fruity"],
  apple: ["fruity"],
  mint: ["minty"],
  peppermint: ["minty"],
};

/** OFF tag substring → survey texture IDs */
const textureMap: Record<string, string[]> = {
  chip: ["crunchy", "crispy"],
  crisp: ["crispy", "crunchy"],
  cracker: ["crunchy"],
  pretzel: ["crunchy"],
  nut: ["crunchy"],
  granola: ["crunchy"],
  gummy: ["gummy", "chewy"],
  gummi: ["gummy"],
  jelly: ["gummy"],
  chewy: ["chewy"],
  caramel: ["chewy"],
  taffy: ["chewy"],
  cookie: ["crispy"],
  biscuit: ["crispy"],
  wafer: ["crispy", "flaky"],
  cream: ["creamy", "smooth"],
  yogurt: ["creamy"],
  pudding: ["smooth", "creamy"],
  puff: ["puffy"],
  popcorn: ["puffy", "crunchy"],
  pastry: ["flaky"],
  croissant: ["flaky"],
};

/** OFF tag substring → survey category IDs */
const categoryMap: Record<string, string[]> = {
  chip: ["chips"],
  crisp: ["chips"],
  tortilla: ["chips"],
  candy: ["candy"],
  gummy: ["candy"],
  sweet: ["candy"],
  cookie: ["cookies"],
  biscuit: ["cookies"],
  bar: ["bars"],
  "energy-bar": ["bars"],
  "protein-bar": ["bars"],
  popcorn: ["popcorn"],
  cracker: ["crackers"],
  "dried-fruit": ["dried_fruit"],
  raisin: ["dried_fruit"],
  nut: ["nuts_seeds"],
  seed: ["nuts_seeds"],
  almond: ["nuts_seeds"],
  cashew: ["nuts_seeds"],
  trail: ["nuts_seeds"],
};

/** OFF allergen tags → survey dietary IDs */
const allergenToDietary: Record<string, string> = {
  "en:gluten": "gluten_free",
  "en:milk": "dairy_free",
  "en:nuts": "nut_free",
  "en:peanuts": "nut_free",
  "en:tree-nuts": "nut_free",
};

export interface TagAnalysis {
  flavors: string[];
  textures: string[];
  categories: string[];
  allergenConflicts: string[]; // dietary IDs this product violates
}

/** Analyze a product's OFF tags and map them to our survey taxonomy */
export function analyzeProductTags(
  tags: string[],
  allergens: string[]
): TagAnalysis {
  const flavors = new Set<string>();
  const textures = new Set<string>();
  const categories = new Set<string>();

  for (const tag of tags) {
    const lower = tag.toLowerCase();
    for (const [keyword, ids] of Object.entries(flavorMap)) {
      if (lower.includes(keyword)) ids.forEach((id) => flavors.add(id));
    }
    for (const [keyword, ids] of Object.entries(textureMap)) {
      if (lower.includes(keyword)) ids.forEach((id) => textures.add(id));
    }
    for (const [keyword, ids] of Object.entries(categoryMap)) {
      if (lower.includes(keyword)) ids.forEach((id) => categories.add(id));
    }
  }

  const allergenConflicts: string[] = [];
  for (const allergen of allergens) {
    const dietaryId = allergenToDietary[allergen];
    if (dietaryId) allergenConflicts.push(dietaryId);
  }

  return {
    flavors: [...flavors],
    textures: [...textures],
    categories: [...categories],
    allergenConflicts,
  };
}

/** Get OFF category tags to query based on survey category answers.
 *  Uses specific US-market friendly tags for better results. */
export function surveyCategoriesToOFFTags(surveyCategories: string[]): string[] {
  const mapping: Record<string, string[]> = {
    chips: ["potato-chips", "tortilla-chips", "vegetable-chips"],
    candy: ["gummy-candies", "chocolate-candies", "hard-candies"],
    cookies: ["cookies", "chocolate-chip-cookies", "sandwich-cookies"],
    bars: ["granola-bars", "chocolate-bars", "snack-bars"],
    popcorn: ["popcorn", "microwave-popcorn"],
    crackers: ["crackers", "cheese-crackers", "graham-crackers"],
    dried_fruit: ["dried-fruits", "fruit-snacks"],
    nuts_seeds: ["mixed-nuts", "trail-mix", "roasted-nuts"],
  };

  return surveyCategories.flatMap((cat) => mapping[cat] ?? []);
}
