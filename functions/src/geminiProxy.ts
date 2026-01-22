/**
 * Gemini AI Proxy - Secure backend proxy for Google Gemini API
 * Protects API key from frontend exposure
 */

import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';

// Define the secret for Gemini API key
const geminiApiKey = defineSecret('GEMINI_API_KEY');

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // requests per minute
const RATE_WINDOW = 60000; // 1 minute in ms

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

export const geminiProxy = onRequest(
  {
    secrets: [geminiApiKey],
    timeoutSeconds: 120,
    memory: '256MiB',
    cors: true,
  },
  async (req, res) => {
    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    // Only allow POST
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    try {
      const { prompt, userId, temperature, maxTokens } = req.body;

      // Validate required fields
      if (!prompt || !userId) {
        res.status(400).json({ error: 'Missing required fields: prompt, userId' });
        return;
      }

      // Rate limiting
      if (!checkRateLimit(userId)) {
        res.status(429).json({ error: 'Rate limit exceeded. Please wait.' });
        return;
      }

      // Get the API key from secrets
      const apiKey = geminiApiKey.value();
      
      if (!apiKey) {
        console.error('GEMINI_API_KEY secret not configured');
        res.status(500).json({ error: 'API key not configured' });
        return;
      }

      // Call Gemini API
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      
      const geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: temperature || 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: maxTokens || 8192
          }
        }),
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API error:', geminiResponse.status, errorText);
        res.status(geminiResponse.status).json({ 
          error: 'Gemini API error',
          details: errorText
        });
        return;
      }

      const data = await geminiResponse.json();
      
      // Extract text from response
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        const text = data.candidates[0].content.parts[0].text;
        res.status(200).json({ text });
      } else {
        console.warn('Unexpected Gemini response:', data);
        res.status(200).json({ text: null, raw: data });
      }

    } catch (error) {
      console.error('Gemini proxy error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);
