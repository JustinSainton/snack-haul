export const config = {
  openFoodFacts: {
    baseUrl: "https://world.openfoodfacts.org",
    userAgent: "SnackHaul/1.0 (contact@snackhaul.app)",
    rateLimit: {
      maxRequests: 10,
      windowMs: 60_000,
    },
  },
  spoonacular: {
    baseUrl: "https://api.spoonacular.com",
    apiKey: "", // Set via env
  },
  instacart: {
    affiliateBaseUrl: "https://www.instacart.com",
    affiliateTag: "", // Set via env
  },
  cache: {
    productTtlMs: 24 * 60 * 60 * 1000, // 24 hours
  },
} as const;
