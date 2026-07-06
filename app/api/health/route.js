/**
 * MatchMind — Health Check API Route
 * GET /api/health
 *
 * Returns system health status including:
 * - API availability
 * - Firebase connectivity status
 * - Gemini API key presence (boolean only — never expose the key itself)
 * - Build version
 */

export async function GET() {
  const health = {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    services: {
      gemini_api_configured: !!process.env.GEMINI_API_KEY,
      firebase_configured: !!(
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock_project_id" &&
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "mock_firebase_api_key_for_local_testing"
      ),
      sync_mode: (process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
                  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "mock_project_id" &&
                  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "mock_firebase_api_key_for_local_testing")
        ? "firestore"
        : "local_broadcast_channel",
    },
    // Security: never expose actual key values, only presence booleans
  };

  return Response.json(health, {
    status: 200,
    headers: { "Cache-Control": "no-store" },
  });
}
