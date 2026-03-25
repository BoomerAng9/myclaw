/**
 * Gemini-Powered Event Content Generator
 * Uses Gemini 3.1 Pro for marketing copy, social posts, email sequences, and SEO content.
 * Default design engine per project requirements.
 */

const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro:generateContent';

type ContentType = 'social_post' | 'email_sequence' | 'seo_description' | 'sponsor_pitch' | 'event_recap' | 'speaker_bio' | 'press_release';

const CONTENT_PROMPTS: Record<ContentType, string> = {
  social_post: `You are a marketing copywriter for the Coastal Talent and Innovation Hack-A-Thon (CTIH). Write an engaging social media post. Keep it under 280 characters for Twitter compatibility. Include relevant hashtags: #CTIH2026 #HackAThon #CoastalTalent #foaicloud. Be energetic and inclusive.`,
  email_sequence: `You are crafting an email for the CTIH Hack-A-Thon email nurture sequence. Write a compelling email with subject line, preview text, and body. Tone: energetic, professional, forward-thinking. Brand voice: inclusive, innovation-focused.`,
  seo_description: `Write an SEO-optimized meta description (under 160 characters) for a page about the Coastal Talent and Innovation Hack-A-Thon. Include key terms: hackathon, AI, innovation, coastal talent, hybrid event.`,
  sponsor_pitch: `Write a professional sponsorship pitch for the CTIH Hack-A-Thon. Highlight ROI: 500+ attendees, media coverage, talent pipeline access, brand alignment with AI innovation. Tiers: Platinum ($10K), Gold ($5K), Silver ($2.5K).`,
  event_recap: `Write an engaging event recap/summary for the CTIH Hack-A-Thon. Highlight key moments, winning projects, attendance numbers, and community impact.`,
  speaker_bio: `Write a professional speaker bio for the CTIH Hack-A-Thon program. Keep it concise (2-3 sentences) and highlight expertise relevant to the event tracks: AI/ML, Web3, Social Impact Tech, Creative Technology.`,
  press_release: `Write a press release announcing the Coastal Talent and Innovation Hack-A-Thon. Include event details, mission, expected impact, and quote placeholders for organizers. Professional AP style.`
};

export async function generateEventContent(contentType: ContentType, context?: string): Promise<{ type: string; generated: string; model: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');

  const systemPrompt = CONTENT_PROMPTS[contentType];
  if (!systemPrompt) throw new Error(`Unknown content type: ${contentType}`);

  const userPrompt = context
    ? `${systemPrompt}\n\nAdditional context: ${context}`
    : systemPrompt;

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: contentType === 'seo_description' ? 0.3 : 0.7,
        maxOutputTokens: contentType === 'press_release' ? 2048 : 1024,
        topP: 0.9
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error: ${response.status} — ${errText}`);
  }

  const result = await response.json();
  const generated = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

  return { type: contentType, generated, model: 'gemini-3.1-pro' };
}
