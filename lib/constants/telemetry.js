/**
 * @fileoverview Telemetry and Signal Threshold Constants.
 */

export const INCIDENT_IDS = {
  GATE7: "inc_gate7",
};

export const GATE_ZONES = {
  GATE7: "Gate 7",
  GATE7B: "Gate 7B",
};

export const VOLUNTEER_IDS = {
  MARIA: "v1",
  JOHN: "v2",
  LUIS: "v3",
};

export const DEFAULT_INCIDENT_TYPE = "Crowd Congestion Surge";

export const SIGNAL_THRESHOLDS = {
  FLOW_SLOWDOWN_MIN: 10,
  FLOW_SLOWDOWN_NORM: 20,
  SCAN_RATE_MIN: 15,
  SCAN_RATE_NORM: 30,
  HEAT_INDEX_MIN: 35,
  HEAT_INDEX_BASE: 30,
  HEAT_INDEX_RANGE: 10,
};

export const CROSS_VALIDATION = {
  LOW_SIGNAL_THRESHOLD: 3,
  HIGH_SIGNAL_THRESHOLD: 4,
  LOW_FACTOR: 0.5,
  HIGH_FACTOR: 1.1,
};

export const CONFIDENCE_THRESHOLDS = {
  ALERT: 75,
  HIGH: 80,
  MEDIUM: 60,
};
