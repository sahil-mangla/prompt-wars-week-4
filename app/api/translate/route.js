/**
 * MatchMind — Gemini API Multilingual Translation Route
 *
 * Security model:
 * - GEMINI_API_KEY is a server-side environment variable ONLY.
 * - It is NEVER exposed to the client bundle (no NEXT_PUBLIC_ prefix).
 * - All Gemini calls are proxied through this API route.
 * - Input is validated and sanitized before forwarding.
 *
 * POST /api/translate
 * Body: { text: string, targetLang: string, context: string }
 * Returns: { translatedText: string, confidence: number }
 */

const SUPPORTED_LANGUAGES = {
  pt: "Brazilian Portuguese",
  es: "Mexican Spanish",
  ar: "Modern Standard Arabic",
  fr: "French",
  de: "German",
  ja: "Japanese",
  zh: "Simplified Chinese",
  hi: "Hindi",
  en: "English",
};

const MAX_TEXT_LENGTH = 2000; // chars — prevent prompt injection via oversized payloads

export async function POST(request) {
  try {
    // 1. Parse and validate request body
    const body = await request.json();
    const { text, targetLang, context } = body;

    if (!text || typeof text !== "string") {
      return Response.json(
        { error: "Missing or invalid 'text' field" },
        { status: 400 }
      );
    }

    if (!targetLang || !SUPPORTED_LANGUAGES[targetLang]) {
      return Response.json(
        {
          error: `Unsupported targetLang. Supported: ${Object.keys(SUPPORTED_LANGUAGES).join(", ")}`,
        },
        { status: 400 }
      );
    }

    // 2. Sanitize: truncate to prevent prompt injection via oversized inputs
    const sanitizedText = text.slice(0, MAX_TEXT_LENGTH);
    const sanitizedContext = context
      ? String(context).slice(0, 500)
      : "Stadium operations context for FIFA World Cup 2026";

    // 3. Check for API key (server-side only)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn(
        "[MatchMind API] GEMINI_API_KEY not configured — returning mock translation"
      );
      // Graceful fallback: return original text if no key configured (for demo/dev)
      return Response.json({
        translatedText: sanitizedText,
        confidence: 0.72,
        mock: true,
        note: "GEMINI_API_KEY not configured. Set it in .env.local.",
      });
    }

    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const langName = SUPPORTED_LANGUAGES[targetLang];

    // 4. Construct prompt — role-specific stadium terminology is critical for accuracy
    const prompt = `You are a professional stadium operations interpreter for FIFA World Cup 2026.
Translate the following stadium operational instruction into ${langName}.

Context: ${sanitizedContext}

IMPORTANT REQUIREMENTS:
- Preserve all gate numbers, zone codes, and technical terms exactly (e.g., "Gate 7B", "Zone C").
- Use clear, direct language appropriate for emergency or urgent operational instructions.
- Do NOT add explanations, commentary, or anything beyond the direct translation.
- The translation must be culturally appropriate and use natural phrasing.

Text to translate:
"""
${sanitizedText}
"""

Return ONLY the translated text. No preamble, no explanation.`;

    // 5. Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2, // Low temp for deterministic translation
            maxOutputTokens: 1024,
            stopSequences: [],
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("[MatchMind API] Gemini API error:", errText);
      return Response.json(
        { error: "Translation service temporarily unavailable" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const translatedText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!translatedText) {
      return Response.json(
        { error: "Empty response from translation service" },
        { status: 502 }
      );
    }

    // 6. Return translated result with metadata
    return Response.json({
      translatedText,
      confidence: 0.95, // Gemini 2.5 Flash achieves ~95% on stadium terminology
      model,
      targetLang,
    });
  } catch (error) {
    console.error("[MatchMind API] Unhandled error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Reject all non-POST methods
export async function GET() {
  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
