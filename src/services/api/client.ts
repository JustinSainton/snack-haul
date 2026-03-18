import { config } from "@/src/constants/config";

export async function fetchOFF<T>(path: string): Promise<T> {
  const url = `${config.openFoodFacts.baseUrl}${path}`;
  console.log("[OFF] Fetching:", url.slice(0, 120));

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`OFF API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  console.log("[OFF] Got response, products:", (data as any)?.products?.length ?? "n/a");
  return data;
}
