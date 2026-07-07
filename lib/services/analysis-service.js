/**
 * @fileoverview MatchMind — SentinelAI analysis service.
 *
 * Centralises the /api/analyze fetch call and all fallback logic.
 * Called by the simulation engine; not imported by any UI component.
 *
 * Decoupling from simulation-engine.js achieves two things:
 *   1. The engine becomes testable without mocking global.fetch.
 *   2. The fallback response is defined exactly once.
 */

import { syncStore } from "@/lib/sync-store";
import { GATE_ZONES } from "@/constants";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch AI insights from the /api/analyze endpoint and write the result
 * into the matching incident via syncStore.
 *
 * Falls back to a deterministic response if the API is unavailable.
 *
 * @param {{
 *   flowSlowdown: number,
 *   scanRateSurge: number,
 *   heatIndex: number,
 *   historicalIncidentMatch: boolean
 * }} signals
 * @param {string} zone  - Incident zone label (e.g. "Gate 7")
 * @param {string} type  - Incident type label (e.g. "Crowd Congestion Surge")
 * @param {string} incidentId - ID of the incident to update with insights
 * @returns {void} - Updates state asynchronously; callers need not await
 */
export function fetchSentinelInsights(signals, zone, type, incidentId) {
  fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telemetry: signals, zone, type }),
  })
    .then((res) => res.json())
    .then((data) => {
      const insights = data.error ? buildFallbackInsights(signals, zone) : data;
      if (data.error) {
        console.warn("SentinelAI API error, using client-side fallback:", data.error);
      }
      applyInsights(incidentId, insights);
    })
    .catch((err) => {
      console.error("Failed to fetch SentinelAI insights, using client-side fallback:", err);
      applyInsights(incidentId, buildFallbackInsights(signals, zone));
    });
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/**
 * Apply resolved insights to the matching incident in shared state.
 *
 * @param {string} incidentId
 * @param {object} insights
 */
function applyInsights(incidentId, insights) {
  syncStore.updateState((prevState) => {
    const updated = prevState.activeIncidents.map((inc) =>
      inc.id === incidentId ? { ...inc, insights } : inc
    );
    return { activeIncidents: updated };
  });
}

/**
 * Deterministic fallback insights when the AI API is unavailable.
 * Interpolates live telemetry values so the content remains meaningful.
 *
 * @param {{
 *   flowSlowdown: number,
 *   scanRateSurge: number,
 *   heatIndex: number,
 *   historicalIncidentMatch: boolean
 * }} signals
 * @param {string} zone
 * @returns {{ explanation: string, proposedActions: string[], ecoImpact: string }}
 */
function buildFallbackInsights(signals, zone) {
  const altZone = zone === GATE_ZONES.GATE7 ? GATE_ZONES.GATE7B : zone;
  return {
    explanation: `(Fallback Mode) A combination of ${signals.flowSlowdown}% crowd slowdown near ${zone} and a ${signals.scanRateSurge}% surge in scan rates indicates a severe bottleneck will form. The heat index (${signals.heatIndex}°C) increases safety risk.`,
    proposedActions: [
      `Open auxiliary entrance near ${zone} and transition queue to ${altZone}.`,
      "Dispatch Gate Marshal with multilingual script briefing.",
      `Push detour alert to wheelchair/disabled fans en route to ${zone}.`,
    ],
    ecoImpact: `Rerouting crowds from ${zone} prevents idling queues, reducing localized heat output and saving ~12% on HVAC cooling overhead.`,
  };
}
