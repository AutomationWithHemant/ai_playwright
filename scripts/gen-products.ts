import fs from 'fs';
import { z } from 'zod';
import { askJSON } from '../utils/llm';
import { ProductSchema } from '../data/ai-data';

async function main() {
  const raw = await askJSON<unknown[]>(
    `Generate 12 products across 4 categories for an Indian online store as a JSON array.
     Fields: name, category, price (number, INR, 99 to 50000), stock (integer 0-500).
     Realistic names. Include exactly 3 out-of-stock items (stock 0).`);
  const products = z.array(ProductSchema).parse(raw);
  fs.writeFileSync('test-data/products.json', JSON.stringify(products, null, 2));
  console.log(`Saved ${products.length} products to test-data/products.json`);
}
main();
