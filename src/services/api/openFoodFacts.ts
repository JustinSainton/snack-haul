import { fetchOFF } from "./client";
import type { OFFSearchResponse, OFFProductResponse, OFFProduct } from "./types";
import type { Snack } from "@/src/types/snack";

const PRODUCT_FIELDS = [
  "code",
  "product_name",
  "brands",
  "image_front_small_url",
  "categories_tags",
  "labels_tags",
  "allergens_tags",
  "ingredients_text",
  "nutrition_grades",
  "popularity_key",
].join(",");

/** Only ASCII letters, numbers, spaces, and common punctuation = likely English */
const ENGLISH_NAME_RE = /^[a-zA-Z0-9\s&',.\-!()/%#]+$/;

function isEnglishProduct(p: OFFProduct): boolean {
  if (!p.product_name) return false;
  return ENGLISH_NAME_RE.test(p.product_name);
}

function toSnack(p: OFFProduct): Snack {
  return {
    id: p.code,
    name: p.product_name || "Unknown",
    brand: p.brands || "Unknown brand",
    imageUrl: p.image_front_small_url || null,
    tags: [...(p.categories_tags || []), ...(p.labels_tags || [])],
    categories: p.categories_tags || [],
    nutriScore: p.nutrition_grades || null,
    ingredients: p.ingredients_text || null,
    allergens: p.allergens_tags || [],
    cachedAt: Date.now(),
  };
}

/** Common query params to get English, US-market products */
const LOCALE_PARAMS = "countries_tags_en=united-states&lc=en";

/** Search snacks by query string */
export async function searchSnacks(
  query: string,
  page = 1,
  pageSize = 20
): Promise<{ snacks: Snack[]; totalCount: number }> {
  const params = new URLSearchParams({
    search_terms: query,
    search_simple: "1",
    action: "process",
    json: "1",
    fields: PRODUCT_FIELDS,
    page: String(page),
    page_size: String(pageSize),
    countries_tags_en: "united-states",
    lc: "en",
    tagtype_0: "categories",
    tag_contains_0: "contains",
    tag_0: "snacks",
  });

  const data = await fetchOFF<OFFSearchResponse>(
    `/cgi/search.pl?${params.toString()}`
  );

  return {
    snacks: data.products.filter(isEnglishProduct).map(toSnack),
    totalCount: data.count,
  };
}

/** Browse snacks by category tag */
export async function browseByCategory(
  categoryTag: string,
  page = 1,
  pageSize = 20
): Promise<{ snacks: Snack[]; totalCount: number }> {
  const data = await fetchOFF<OFFSearchResponse>(
    `/api/v2/search?categories_tags_en=${encodeURIComponent(categoryTag)}&${LOCALE_PARAMS}&fields=${PRODUCT_FIELDS}&page=${page}&page_size=${pageSize}&sort_by=popularity_key`
  );

  return {
    snacks: data.products.filter(isEnglishProduct).map(toSnack),
    totalCount: data.count,
  };
}

/** Get a single product by barcode */
export async function getProduct(barcode: string): Promise<Snack | null> {
  try {
    const data = await fetchOFF<OFFProductResponse>(
      `/api/v2/product/${barcode}?fields=${PRODUCT_FIELDS}`
    );
    if (data.status !== 1 || !data.product?.product_name) return null;
    return toSnack(data.product);
  } catch {
    return null;
  }
}

/** Fetch snacks for the recommendation feed based on category tags.
 *  Batches requests 3 at a time to avoid overwhelming the network. */
export async function fetchSnacksForFeed(
  categoryTags: string[],
  pageSize = 50
): Promise<Snack[]> {
  const perCategory = Math.ceil(pageSize / categoryTags.length);
  const allSnacks: Snack[] = [];

  // Process in batches of 3 to avoid network failures
  for (let i = 0; i < categoryTags.length; i += 3) {
    const batch = categoryTags.slice(i, i + 3);
    const results = await Promise.allSettled(
      batch.map((tag) => browseByCategory(tag, 1, perCategory))
    );

    for (const result of results) {
      if (result.status === "fulfilled") {
        allSnacks.push(...result.value.snacks);
      }
    }
  }

  // Deduplicate by product ID
  const seen = new Set<string>();
  return allSnacks.filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
}
