import OpenAI from 'openai';

let openai = null;

export const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const looksLikePlaceholder = !apiKey || apiKey.includes('your_openai') || apiKey.includes('your_ope') || apiKey.includes('example');

  if (looksLikePlaceholder) return null;
  if (!openai) {
    openai = new OpenAI({ apiKey });
  }
  return openai;
};

export const generateHint = async ({ title, description, code, difficulty }) => {
  const client = getOpenAI();
  if (!client) {
    return {
      hint: `Think about the constraints for "${title}" (${difficulty}). Break the problem into smaller steps: parse input, apply the core algorithm, and return the expected format.`,
      source: 'fallback',
      note: 'OpenAI API key is not configured on the server. Add OPENAI_API_KEY to enable AI-generated hints.',
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

export const chatWithTutor = async ({ messages = '', context = '' }) => {
  const client = getOpenAI();
  const fallback = 'I can help you learn DSA. Ask me about a pattern, share your approach, or describe the bug you are stuck on. I will guide you with hints before giving away a full solution.';

  if (!client) {
    return {
      reply: fallback,
      source: 'fallback',
      note: 'OpenAI API key is not configured on the server. Add OPENAI_API_KEY to enable live tutoring.',
    };
  }

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are VisualDSA, a patient DSA tutor. Help users understand algorithms through concise explanations, questions, examples, and debugging guidance. Prefer hints and mental models over immediately giving complete solutions. Use Markdown when helpful. Keep responses under 180 words.',
      },
      ...(context ? [{ role: 'system', content: `Current app context: ${context}` }] : []),
      ...messages,
    ],
    max_tokens: 300,
    temperature: 0.5,
  });

  return {
    reply: response.choices[0]?.message?.content?.trim() || fallback,
    source: 'openai',
  };
};

const COMPLEXITY_FALLBACKS = {
  twoSum: {
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    approaches: [
      { name: 'Brute Force', complexity: 'O(n^2) time, O(1) space', description: 'Try every pair of elements and check if they sum to target.' },
      { name: 'Hash Map (Optimal)', complexity: 'O(n) time, O(n) space', description: 'Store each number in a hash map and look up the complement in O(1).' },
    ],
    explanation: 'The optimal approach uses a hash map to find the complement of each element in a single pass.',
    source: 'fallback',
  },
  default: {
    timeComplexity: 'O(?)',
    spaceComplexity: 'O(?)',
    approaches: [
      { name: 'Brute Force', complexity: 'O(n^2) time, O(1) space', description: 'Nested loops checking all pairs or combinations.' },
      { name: 'Optimized', complexity: 'O(n log n) time, O(1) space', description: 'Sorting or divide-and-conquer to reduce comparisons.' },
      { name: 'Hash/DP', complexity: 'O(n) time, O(n) space', description: 'Trade space for time using a hash table or memoization.' },
    ],
    explanation: 'Add your OpenAI API key to get AI-powered complexity analysis tailored to your specific code.',
    source: 'fallback',
  },
};

export const analyzeComplexity = async ({ title, description, code, language, difficulty, functionName }) => {
  const client = getOpenAI();

  if (!client) {
    const base = COMPLEXITY_FALLBACKS[functionName] || COMPLEXITY_FALLBACKS.default;
    const missingKeyMessage = 'OpenAI API key is not configured on the server. Add OPENAI_API_KEY to enable AI-powered analysis.';

    let timeComplexity = base.timeComplexity;
    let spaceComplexity = base.spaceComplexity;

    if (code) {
      const nestedLoops = (code.match(/for\s*\(|while\s*\(/g) || []).length;
      const usesMap = /Map\(|{}\s*;|new Map|HashMap|dict\s*=/.test(code);
      const usesRecursion = new RegExp(`${functionName || 'function'}[^(]*\\(`).test(code.slice(code.indexOf('{') + 1));
      const usesSort = /\.sort\(|Arrays\.sort|sort\(/.test(code);

      if (nestedLoops >= 2) timeComplexity = 'O(n^2)';
      else if (nestedLoops === 1) timeComplexity = 'O(n)';
      else if (usesSort) timeComplexity = 'O(n log n)';
      else if (usesRecursion) timeComplexity = 'O(2^n) or O(n) with memo';

      if (usesMap) spaceComplexity = 'O(n)';
      else if (usesRecursion) spaceComplexity = 'O(n) call stack';
    }

    return { ...base, timeComplexity, spaceComplexity, note: missingKeyMessage };
  }

  const systemPrompt = `You are an expert DSA coach. Analyze the user's code and respond ONLY with valid JSON matching this exact schema:
{
  "timeComplexity": "O(...)",
  "spaceComplexity": "O(...)",
  "explanation": "2-3 sentence explanation of WHY these complexities apply to the code.",
  "approaches": [
    {
      "name": "Approach name",
      "complexity": "O(...) time, O(...) space",
      "description": "One sentence description."
    }
  ],
  "codeReview": "1-2 sentences of specific feedback on the user's code style, correctness, or edge cases.",
  "source": "openai"
}
Include 2-3 approaches ordered from brute force to optimal. Do not include any text outside the JSON.`;

  const userPrompt = `Problem: ${title} (${difficulty})
Language: ${language}
Function: ${functionName}
Description: ${description}

User's code:
\`\`\`${language.toLowerCase()}
${code || '// (no code written yet)'}
\`\`\`

Analyze the time and space complexity of the code above. If the code is empty or incomplete, analyze the optimal approach instead.`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 600,
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const raw = response.choices[0]?.message?.content?.trim() || '{}';
    const parsed = JSON.parse(raw);
    return { ...parsed, source: 'openai' };
  } catch (err) {
    const base = COMPLEXITY_FALLBACKS.default;
    return { ...base, explanation: `Analysis unavailable: ${err.message}`, source: 'error', note: 'OpenAI request failed. Check the server logs and API key configuration.' };
  }
};
