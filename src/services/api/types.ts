/** Open Food Facts product from the API */
export interface OFFProduct {
  code: string;
  product_name?: string;
  brands?: string;
  image_front_url?: string;
  image_front_small_url?: string;
  categories_tags?: string[];
  labels_tags?: string[];
  allergens_tags?: string[];
  ingredients_text?: string;
  nutrition_grades?: string;
  nova_group?: number;
  nutriments?: Record<string, number>;
  popularity_key?: number;
}

/** Open Food Facts search response */
export interface OFFSearchResponse {
  count: number;
  page: number;
  page_count: number;
  page_size: number;
  products: OFFProduct[];
}

/** Open Food Facts single product response */
export interface OFFProductResponse {
  status: number;
  product: OFFProduct;
}
