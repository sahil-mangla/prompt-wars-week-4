/**
 * MatchMind — SentinelAI Gemini Insights & Action Plan Route
 *
 * Security model:
 * - GEMINI_API_KEY is a server-side environment variable ONLY.
 * - It is NEVER exposed to the client bundle.
 * - Input (telemetry) is validated before forwarding.
 *
 * POST /api/analyze
 * Body: { telemetry: { flowSlowdown, scanRateSurge, heatIndex, historicalIncidentMatch }, zone: string, type: string }
 * Returns: { explanation: string, proposedActions: string[], ecoImpact: string }
 */

export async function POST(request) {
  try {
    const body = await request.json();
    const { telemetry, zone, type } = body;

    // Validate inputs
    if (!telemetry || typeof telemetry !== "object") {
      return Response.json(
        { error: "Missing or invalid 'telemetry' object" },
        { status: 400 }
      );
    }
    
    if (!zone || typeof zone !== "string" || !type || typeof type !== "string") {
      return Response.json(
        { error: "Missing or invalid 'zone' or 'type'" },
        { status: 400 }
      );
    }

    // Sanitize and ensure numbers
    const safeTelemetry = {
      flowSlowdown: Number(telemetry.flowSlowdown) || 0,
      scanRateSurge: Number(telemetry.scanRateSurge) || 0,
      heatIndex: Number(telemetry.heatIndex) || 0,
      historicalIncidentMatch: Boolean(telemetry.historicalIncidentMatch)
    };
    const sanitizedZone = zone.slice(0, 50);
    const sanitizedType = type.slice(0, 50);

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback template if no key is configured
    if (!apiKey) {
      console.warn("[MatchMind API] GEMINI_API_KEY not configured — returning fallback insights with local telemetry");
      return Response.json({
        explanation: `(Fallback Mode) A combination of ${safeTelemetry.flowSlowdown}% crowd slowdown near ${sanitizedZone} and a ${safeTelemetry.scanRateSurge}% surge in scan rates indicates a severe bottleneck will form. The heat index (${safeTelemetry.heatIndex}°C) increases safety risk. ${safeTelemetry.historicalIncidentMatch ? 'Historical data matches.' : ''}`,
        proposedActions: [
          `Open auxiliary entrance near ${sanitizedZone} and transition queue.`,
          "Dispatch Gate Marshal with multilingual script briefing.",
          `Push detour alert to wheelchair/disabled fans en route to ${sanitizedZone}.`
        ],
        ecoImpact: `Rerouting crowds from ${sanitizedZone} prevents idling queues, reducing localized heat output and saving ~12% on HVAC cooling overhead.`,
        mock: true
      });
    }

    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    // Structured Prompt
    const prompt = `You are SentinelAI, an operational intelligence engine for FIFA World Cup 2026.
An incident of type "${sanitizedType}" is predicted at "${sanitizedZone}".

Current live telemetry data:
- Crowd Flow Slowdown: ${safeTelemetry.flowSlowdown}%
- Ticket Scan Rate Surge: ${safeTelemetry.scanRateSurge}%
- Heat Index: ${safeTelemetry.heatIndex}°C
- Historical Match: ${safeTelemetry.historicalIncidentMatch ? "Yes" : "No"}

You must return a raw JSON object (without any markdown formatting or code blocks) exactly matching this schema:
{
  "explanation": "A concise 2-sentence explanation of the situation that explicitly mentions the provided telemetry numbers.",
  "proposedActions": [
    "Action 1 (e.g. Open auxiliary gate)",
    "Action 2 (e.g. Dispatch marshals with translated scripts)",
    "Action 3 (e.g. Push accessible detour route to fan apps)"
  ],
  "ecoImpact": "A concise 1-sentence statement on how these actions provide a sustainability or environmental benefit (e.g. saving HVAC energy, reducing idling emissions)."
}

IMPORTANT: Ensure the JSON is valid and DO NOT wrap it in \`\`\`json blocks.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2, // Low variance
            maxOutputTokens: 1024,
            responseMimeType: "application/json"
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
      console.error("[MatchMind API] Gemini API error (analyze):", errText);
      return Response.json(
        { error: "AI service temporarily unavailable" },
        { status: 502 }
      );
    }

    const data = await response.json();
    let textResult = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!textResult) {
      return Response.json(
        { error: "Empty response from AI service" },
        { status: 502 }
      );
    }

    // Clean markdown if Gemini accidentally added it despite responseMimeType
    if (textResult.startsWith("\`\`\`json")) {
      textResult = textResult.replace(/^\`\`\`json\n/, "").replace(/\n\`\`\`$/, "");
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(textResult);
    } catch (e) {
      console.error("[MatchMind API] Failed to parse Gemini JSON output:", textResult);
      return Response.json(
        { error: "Invalid JSON format returned from AI" },
        { status: 500 }
      );
    }

    return Response.json({
      explanation: parsedResult.explanation,
      proposedActions: parsedResult.proposedActions,
      ecoImpact: parsedResult.ecoImpact,
      model
    });
  } catch (error) {
    console.error("[MatchMind API] Unhandled error in analyze:", error);
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
