/**
 * Nano Banana Pro 2 — Event Promotional Image Generator
 * Uses Gemini image generation models (Nano Banana lineup) for CTIH event visuals.
 * Models: gemini-3.1-flash-image-preview (Nano Banana 2), gemini-3-pro-image-preview (Nano Banana Pro)
 */

const NANO_BANANA_MODELS = {
  fast: 'gemini-3.1-flash-image-preview',   // Nano Banana 2 — fastest
  quality: 'gemini-3-pro-image-preview',      // Nano Banana Pro — highest quality
  balanced: 'gemini-2.5-flash-image'          // Nano Banana — original balanced
} as const;

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

interface PromoImageResult {
  base64: string;
  mimeType: string;
  model: string;
  prompt: string;
}

const EVENT_STYLE_PRESETS: Record<string, string> = {
  hero: 'Futuristic coastal cityscape with digital elements, ocean waves merging with circuit patterns, vibrant blues and golds, hackathon energy, wide banner format',
  social: 'Modern event promotional graphic, bold typography placeholder space, electric blue and gold color scheme, tech-meets-ocean aesthetic, square format',
  sponsor: 'Professional corporate partnership visual, premium feel, gold and navy palette, subtle tech elements, clean modern design',
  badge: 'Event badge design, circular format, "CTIH 2026" text, coastal innovation theme, holographic effect, dark background',
  track_ai: 'Abstract AI neural network visualization, blue electric nodes, coastal wave patterns, futuristic and dynamic',
  track_web3: 'Blockchain and decentralized network visualization, interconnected nodes, ocean-inspired color palette',
  track_social: 'Community and social impact visual, diverse hands connecting, coastal landscape, warm and inclusive',
  track_creative: 'Creative technology explosion, paint splashes mixed with digital particles, vibrant colors on dark background'
};

export async function generatePromoImage(
  prompt: string,
  style?: keyof typeof EVENT_STYLE_PRESETS,
  aspectRatio?: '16:9' | '4:3' | '1:1',
  quality?: 'fast' | 'quality' | 'balanced'
): Promise<PromoImageResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const model = NANO_BANANA_MODELS[quality || 'quality'];
  const styleContext = style ? EVENT_STYLE_PRESETS[style] : '';
  const fullPrompt = styleContext
    ? `${styleContext}. Additional details: ${prompt}. For the Coastal Talent and Innovation Hack-A-Thon event.`
    : `${prompt}. For the Coastal Talent and Innovation Hack-A-Thon event. Style: modern, tech-forward, coastal innovation theme, electric blue and gold palette.`;

  const response = await fetch(`${BASE_URL}/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: {
        responseModalities: ['IMAGE'],
        ...(aspectRatio && { aspectRatio })
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Nano Banana API error: ${response.status} — ${errText}`);
  }

  const result = await response.json();
  const imagePart = result.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);

  if (!imagePart?.inlineData) {
    throw new Error('No image data returned from Nano Banana');
  }

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType || 'image/png',
    model,
    prompt: fullPrompt
  };
}
