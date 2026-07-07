/**
 * @fileoverview MatchMind — SentinelAI Telemetry Simulation & Signal-Weighting Engine.
 *
 * Responsibilities:
 *   - calculateConfidence: pure scoring function (signal-weighted + cross-validation)
 *   - SimulationController: manages the auto-tick timeline and the manual surge trigger
 *
 * This module does NOT call fetch() directly; AI insight fetching is
 * delegated to the analysis service (lib/services/analysis-service.js).
 */

import { syncStore } from "@/lib/sync-store";
import { fetchSentinelInsights } from "@/lib/services/analysis-service";
import {
  INCIDENT_IDS,
  GATE_ZONES,
  DEFAULT_INCIDENT_TYPE,
  SIMULATION_DEFAULTS,
  SIGNAL_THRESHOLDS,
  CROSS_VALIDATION,
  CONFIDENCE_THRESHOLDS,
} from "@/constants";

// ---------------------------------------------------------------------------
// Signal weights — kept local; only used by calculateConfidence
// ---------------------------------------------------------------------------

/** @type {Object.<string, number>} Relative weight of each telemetry signal */
const SIGNAL_WEIGHTS = {
  flow_anomaly: 0.45,     // Weight of crowd flow speed slowdown
  scan_anomaly: 0.35,     // Weight of ticket scan rate surge
  weather_index: 0.10,    // Weight of high temperature/heat index
  historical_match: 0.10, // Weight of matching historical pattern
};

// ---------------------------------------------------------------------------
// Confidence scoring — pure function (no side effects)
// ---------------------------------------------------------------------------

/**
 * Calculate confidence score using signal-weighting and cross-validation.
 *
 * @param {{
 *   flowSlowdown: number,
 *   scanRateSurge: number,
 *   heatIndex: number,
 *   historicalIncidentMatch: boolean
 * }} signals - Raw telemetry signals
 * @returns {{ confidence: number, isValidated: boolean, activeSignals: number }}
 */
export function calculateConfidence(signals) {
  let score = 0;
  let activeSignalCount = 0;

  if (signals.flowSlowdown > SIGNAL_THRESHOLDS.FLOW_SLOWDOWN_MIN) {
    score += SIGNAL_WEIGHTS.flow_anomaly * Math.min(signals.flowSlowdown / SIGNAL_THRESHOLDS.FLOW_SLOWDOWN_NORM, 1.0);
    activeSignalCount++;
  }
  if (signals.scanRateSurge > SIGNAL_THRESHOLDS.SCAN_RATE_MIN) {
    score += SIGNAL_WEIGHTS.scan_anomaly * Math.min(signals.scanRateSurge / SIGNAL_THRESHOLDS.SCAN_RATE_NORM, 1.0);
    activeSignalCount++;
  }
  if (signals.heatIndex > SIGNAL_THRESHOLDS.HEAT_INDEX_MIN) {
    score += SIGNAL_WEIGHTS.weather_index * ((signals.heatIndex - SIGNAL_THRESHOLDS.HEAT_INDEX_BASE) / SIGNAL_THRESHOLDS.HEAT_INDEX_RANGE);
    activeSignalCount++;
  }
  if (signals.historicalIncidentMatch) {
    score += SIGNAL_WEIGHTS.historical_match;
    activeSignalCount++;
  }

  // Cross-validation: reduce confidence when fewer than 3 independent signals are active
  let crossValFactor = 1.0;
  if (activeSignalCount < CROSS_VALIDATION.LOW_SIGNAL_THRESHOLD) {
    crossValFactor = CROSS_VALIDATION.LOW_FACTOR;
  } else if (activeSignalCount >= CROSS_VALIDATION.HIGH_SIGNAL_THRESHOLD) {
    crossValFactor = CROSS_VALIDATION.HIGH_FACTOR;
  }

  const finalConfidence = Math.min(Math.round(score * 100 * crossValFactor), 100);
  return {
    confidence: finalConfidence,
    isValidated: activeSignalCount >= CROSS_VALIDATION.LOW_SIGNAL_THRESHOLD,
    activeSignals: activeSignalCount,
  };
}

// ---------------------------------------------------------------------------
// Simulation controller
// ---------------------------------------------------------------------------

/** Simulated data stream generator for the auto-timeline and manual triggers */
export class SimulationController {
  constructor() {
    this.intervalId = null;
  }

  /**
   * Start the automatic countdown timeline from kickoff - 45 minutes.
   * Ticks every TICK_INTERVAL_MS (5 s ≡ 1 simulated minute).
   *
   * @param {object} currentState - Current application state snapshot
   */
  startTimeline(currentState) {
    if (this.intervalId) clearInterval(this.intervalId);

    let time = SIMULATION_DEFAULTS.TIMELINE_START;
    let signals = {
      flowSlowdown: 2,
      scanRateSurge: 0,
      heatIndex: 32,
      historicalIncidentMatch: true,
    };

    this.intervalId = setInterval(async () => {
      time = Math.max(time - 1, 0);

      // Signals degrade as kickoff approaches (40 → 35 minute window)
      if (time <= 40 && time > 35) {
        signals.flowSlowdown = Math.min(signals.flowSlowdown + 3, 14);
        signals.scanRateSurge = Math.min(signals.scanRateSurge + 5, 28);
        signals.heatIndex = 38;
      }

      const { confidence } = calculateConfidence(signals);

      let simulationStatus = currentState.simulationStatus;
      let activeIncidents = [...currentState.activeIncidents];

      if (
        time <= SIMULATION_DEFAULTS.SURGE_TRIGGER_TIME &&
        simulationStatus === "idle" &&
        confidence >= CONFIDENCE_THRESHOLDS.ALERT
      ) {
        simulationStatus = "predicting";

        const incident = buildIncident(INCIDENT_IDS.GATE7, GATE_ZONES.GATE7, DEFAULT_INCIDENT_TYPE, confidence, signals);
        activeIncidents = [incident];

        const updatedLogs = [
          ...currentState.operatorLog,
          buildAlertLog(GATE_ZONES.GATE7, confidence),
        ];

        await syncStore.updateState({ timeRemaining: time, simulationStatus, activeIncidents, operatorLog: updatedLogs });

        fetchSentinelInsights(signals, GATE_ZONES.GATE7, DEFAULT_INCIDENT_TYPE, INCIDENT_IDS.GATE7);
      } else {
        await syncStore.updateState({ timeRemaining: time });
      }

      if (time === 0) this.stop();
    }, SIMULATION_DEFAULTS.TICK_INTERVAL_MS);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Inject a full Gate 7 surge scenario immediately (manual operator trigger).
   *
   * @param {object} currentState - Current application state snapshot
   */
  async triggerGate7Surge(currentState) {
    this.stop();

    const signals = {
      flowSlowdown: 14,
      scanRateSurge: 28,
      heatIndex: 38,
      historicalIncidentMatch: true,
    };

    const { confidence } = calculateConfidence(signals);
    const incident = buildIncident(INCIDENT_IDS.GATE7, GATE_ZONES.GATE7, DEFAULT_INCIDENT_TYPE, confidence, signals);

    const logs = [
      ...currentState.operatorLog,
      {
        time: incident.timestamp,
        text: `⚠️ ALERT: SentinelAI predicted congestion at ${GATE_ZONES.GATE7} in ${SIMULATION_DEFAULTS.PREDICTED_LEAD_TIME} minutes. Confidence: ${confidence}% (Cross-validated)`,
      },
    ];

    await syncStore.updateState({
      simulationStatus: "predicting",
      timeRemaining: SIMULATION_DEFAULTS.SURGE_TRIGGER_TIME,
      activeIncidents: [incident],
      operatorLog: logs,
    });

    fetchSentinelInsights(signals, GATE_ZONES.GATE7, DEFAULT_INCIDENT_TYPE, INCIDENT_IDS.GATE7);
  }
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

/**
 * Build a normalized incident object.
 *
 * @param {string} id
 * @param {string} zone
 * @param {string} type
 * @param {number} confidence
 * @param {object} signals
 * @returns {object}
 */
function buildIncident(id, zone, type, confidence, signals) {
  return {
    id,
    zone,
    type,
    predictedIn: SIMULATION_DEFAULTS.PREDICTED_LEAD_TIME,
    confidence,
    signals: { ...signals },
    status: "pending_approval",
    timestamp: new Date().toLocaleTimeString(),
    insights: null, // Triggers loading spinner until AI responds
  };
}

/**
 * Build a standard alert log entry.
 *
 * @param {string} zone
 * @param {number} confidence
 * @returns {{ time: string, text: string }}
 */
function buildAlertLog(zone, confidence) {
  return {
    time: new Date().toLocaleTimeString(),
    text: `⚠️ ALERT: SentinelAI predicted congestion at ${zone} in ${SIMULATION_DEFAULTS.PREDICTED_LEAD_TIME} minutes. Confidence: ${confidence}%`,
  };
}
