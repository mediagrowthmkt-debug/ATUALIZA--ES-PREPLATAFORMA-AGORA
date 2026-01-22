import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';

// =====================================================================
// AI PROXY - Protege a API Key do OpenRouter no Backend
// =====================================================================

const openrouterApiKey = defineSecret('OPENROUTER_API_KEY');
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const allowedModels = [
  'google/gemini-2.5-flash',
  'google/gemini-2.5-pro', 
  'anthropic/claude-sonnet-4',
  'openai/gpt-4o-mini',
  'openai/gpt-4o',
  'gpt-4o-mini'
];

// Rate limiting simples
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(userId);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + 60000 });
    return true;
  }
  if (record.count >= 30) return false;
  record.count++;
  return true;
}

export const aiProxy = onRequest(
  { 
    secrets: [openrouterApiKey],
    timeoutSeconds: 120,
    memory: '256MiB',
    cors: true
  },
  async (req, res) => {
    // CORS headers
    Object.entries(CORS_HEADERS).forEach(([k, v]) => res.set(k, v));

    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const apiKey = openrouterApiKey.value();
      if (!apiKey) {
        res.status(500).json({ error: 'API key not configured' });
        return;
      }

      const { model, messages, userId, max_tokens, temperature } = req.body;

      if (!model || !messages) {
        res.status(400).json({ error: 'Missing model or messages' });
        return;
      }

      if (!allowedModels.includes(model)) {
        res.status(400).json({ error: 'Model not allowed' });
        return;
      }

      if (userId && !checkRateLimit(userId)) {
        res.status(429).json({ error: 'Rate limit exceeded' });
        return;
      }

      const body: any = { model, messages };
      if (max_tokens) body.max_tokens = max_tokens;
      if (temperature !== undefined) body.temperature = temperature;

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://mediagrowth-a5349.web.app',
          'X-Title': 'MediaGrowth Platform'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        res.status(response.status).json({ error: data?.error?.message || 'API error' });
        return;
      }

      if (data.usage) {
        console.log(`AI: ${model} - In:${data.usage.prompt_tokens} Out:${data.usage.completion_tokens} User:${userId || 'anon'}`);
      }

      res.status(200).json(data);
    } catch (error: any) {
      console.error('aiProxy error:', error);
      res.status(500).json({ error: error.message || 'Internal error' });
    }
  }
);
