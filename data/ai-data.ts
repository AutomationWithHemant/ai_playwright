import { z } from 'zod';
import { askJSON } from '../utils/llm';

export const UserSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  city: z.string(),
  pincode: z.string().regex(/^\d{6}$/),
});
export type User = z.infer<typeof UserSchema>;

export async function generateUsers(count: number): Promise<User[]> {
  const data = await askJSON<unknown[]>(
    `Generate ${count} realistic Indian e-commerce customers as a JSON array.
     Fields: firstName, lastName, email, phone (10 digits, starts with 6-9), city, pincode (6 digits).
     Emails must be unique and use the domain example.com.`);
  return z.array(UserSchema).parse(data); // throws if the LLM invents bad data
}

export const EdgeCaseSchema = z.object({
  input: z.string(),
  expected: z.enum(['accept', 'reject']),
  reason: z.string(),
});

export const ProductSchema = z.object({
  name: z.string(),
  category: z.string(),
  price: z.number().min(99).max(50000),
  stock: z.number().int().min(0).max(500),
});
