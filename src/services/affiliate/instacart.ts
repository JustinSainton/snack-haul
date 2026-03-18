import { config } from "@/src/constants/config";

/**
 * Generates an Instacart search link for a product.
 * Opens a search for the product name + brand so the user
 * can find it and add it to their cart.
 */
export function getInstacartLink(productName: string, brand?: string): string {
  const query = brand ? `${productName} ${brand}` : productName;
  const encoded = encodeURIComponent(query);
  const base = config.instacart.affiliateBaseUrl;
  const tag = config.instacart.affiliateTag;

  // Instacart search URL format
  const url = `${base}/store/search/${encoded}`;

  // Append affiliate tag if configured
  return tag ? `${url}?utm_source=${tag}` : url;
}
