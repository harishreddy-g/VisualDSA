import OpenAI from 'openai';

let openai = null;

export const getOpenAI = () => {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
};

export const generateHint = async ({ title, description, code, difficulty }) => {
  const client = getOpenAI();
  if (!client) {
    return {
      hint: `Think about the constraints for "${title}" (${difficulty}). Break the problem into smaller steps: parse input, apply the core algorithm, and return the expected format.`,
      source: 'fallback',
    };
  }

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a DSA tutor. Give a concise hint without revealing the full solution. Max 120 words.',
      },
      {
        role: 'user',
        content: `Problem: ${title}\nDifficulty: ${difficulty}\nDescription: ${description}\nUser code:\n${code || '(empty)'}`,
      },
    ],
    max_tokens: 200,
    temperature: 0.4,
  });

  return {
    hint: response.choices[0]?.message?.content?.trim() || 'Try identifying the pattern first.',
    source: 'openai',
  };
};
