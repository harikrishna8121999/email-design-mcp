import { listBrands, loadBrand } from '../lib/storage.js';

export async function listBrandResources(): Promise<Array<{ uri: string; name: string; description: string }>> {
  const brands = await listBrands();
  return brands.map((b) => ({
    uri: `brand://${b.id}`,
    name: b.name,
    description: `Brand profile for ${b.name} — ${b.industry}, ${b.tone} tone`,
  }));
}

export async function readBrandResource(brandId: string): Promise<string | null> {
  const brand = await loadBrand(brandId);
  if (!brand) return null;
  return JSON.stringify(brand, null, 2);
}
