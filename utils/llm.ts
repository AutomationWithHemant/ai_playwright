import 'dotenv/config';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY missing. Copy .env.example to .env and paste your OpenAI key.');
}

const client = new OpenAI(); // reads OPENAI_API_KEY from .env
const model = process.env.OPENAI_MODEL ?? 'gpt-4o';

export async function askLLM(prompt: string, system = 'You are a senior QA automation engineer.'): Promise<string> {
  const res = await client.chat.completions.create({
    model,
    temperature: 0.2, // low = more repeatable answers
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: prompt },
    ],
  });
  return res.choices[0].message.content ?? '';
}

// Ask for JSON and parse it safely
export async function askJSON<T>(prompt: string): Promise<T> {
  const raw = await askLLM(`${prompt}\n\nReturn ONLY valid JSON. No markdown fences, no explanation.`);
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean) as T;
}
