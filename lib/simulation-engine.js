// MatchMind SentinelAI Telemetry Simulation & Signal-Weighting Engine

import { syncStore } from "./firebase";

// Define the signal weights for incident prediction
const SIGNAL_WEIGHTS = {
  flow_anomaly: 0.45,      // Weight of crowd flow speed slowdown
  scan_anomaly: 0.35,      // Weight of ticket scan rate surge
  weather_index: 0.10,     // Weight of high temperature/heat index
  historical_match: 0.10   // Weight of matching historical pattern
};

// Calculate confidence score using signal-weighting and cross-validation heuristic
export function calculateConfidence(signals) {
  let score = 0;
  let activeSignalCount = 0;

  // 1. Sum up weighted signals
  if (signals.flowSlowdown > 10) {
    score += SIGNAL_WEIGHTS.flow_anomaly * Math.min(signals.flowSlowdown / 20, 1.0);
    activeSignalCount++;
  }
  if (signals.scanRateSurge > 15) {
    score += SIGNAL_WEIGHTS.scan_anomaly * Math.min(signals.scanRateSurge / 30, 1.0);
    activeSignalCount++;
  }
  if (signals.heatIndex > 35) {
    score += SIGNAL_WEIGHTS.weather_index * ((signals.heatIndex - 30) / 10);
    activeSignalCount++;
  }
  if (signals.historicalIncidentMatch) {
    score += SIGNAL_WEIGHTS.historical_match;
    activeSignalCount++;
  }

  // 2. Cross-validation: Check for multi-signal verification (reductive variance)
  // If fewer than 3 signals are active, we reduce the confidence score to prevent false alerts.
  let crossValFactor = 1.0;
  if (activeSignalCount < 3) {
    crossValFactor = 0.5; // High variance penalty
  } else if (activeSignalCount >= 4) {
    crossValFactor = 1.1; // Multi-signal confirmation bonus
  }

  const finalConfidence = Math.min(Math.round(score * 100 * crossValFactor), 100);
  return {
    confidence: finalConfidence,
    isValidated: activeSignalCount >= 3,
    activeSignals: activeSignalCount
  };
}

// Simulated data stream generator
export class SimulationController {
  constructor(onStateUpdate) {
    this.onStateUpdate = onStateUpdate;
    this.intervalId = null;
  }

  startTimeline(currentState) {
    if (this.intervalId) clearInterval(this.intervalId);

    // Initial state setup for the scenario
    let time = 45; // Minutes to kickoff
    let signals = {
      flowSlowdown: 2, // % slowdown
      scanRateSurge: 0, // % surge
      heatIndex: 32, // °C
      historicalIncidentMatch: true // Gate 7 has a history
    };

    this.intervalId = setInterval(async () => {
      // Tick down time
      time = Math.max(time - 1, 0);

      // Simulate developing incident as time gets closer to kickoff
      if (time <= 40 && time > 35) {
        // Signals begin to degrade (anomalies build up)
        signals.flowSlowdown = Math.min(signals.flowSlowdown + 3, 14); // reaches 14% slowdown
        signals.scanRateSurge = Math.min(signals.scanRateSurge + 5, 28); // reaches 28% surge
        signals.heatIndex = 38; // rises
      }

      // Calculate new confidence score
      const { confidence, isValidated } = calculateConfidence(signals);

      // Construct current simulation status
      let simulationStatus = currentState.simulationStatus;
      let activeIncidents = [...currentState.activeIncidents];

      if (time <= 38 && simulationStatus === "idle" && confidence >= 75) {
        simulationStatus = "predicting";
        
        const incidentId = "inc_gate7";
        const incidentZone = "Gate 7";
        const incidentType = "Crowd Congestion Surge";

        const incident = {
          id: incidentId,
          zone: incidentZone,
          type: incidentType,
          predictedIn: 3, // minutes
          confidence: confidence,
          signals: { ...signals },
          status: "pending_approval",
          timestamp: new Date().toLocaleTimeString(),
          insights: null // Triggers loading spinner on UI
        };
        activeIncidents = [incident];
        
        // Add log entry
        const updatedLogs = [
          ...currentState.operatorLog,
          {
            time: new Date().toLocaleTimeString(),
            text: `⚠️ ALERT: SentinelAI predicted congestion at Gate 7 in 3 minutes. Confidence: ${confidence}%`
          }
        ];
        
        await syncStore.updateState({
          timeRemaining: time,
          simulationStatus,
          activeIncidents,
          operatorLog: updatedLogs
        });

        // Asynchronously fetch GenAI insights
        fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            telemetry: signals,
            zone: incidentZone,
            type: incidentType
          })
        })
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            syncStore.updateState(prevState => {
              const updated = prevState.activeIncidents.map(inc => 
                inc.id === incidentId ? { ...inc, insights: data } : inc
              );
              return { activeIncidents: updated };
            });
          }
        })
        .catch(err => console.error("Failed to fetch SentinelAI insights:", err));

      } else {
        await syncStore.updateState({
          timeRemaining: time
        });
      }

      if (time === 0) {
        this.stop();
      }
    }, 5000); // Fast simulation tick (every 5 seconds represents 1 minute)
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Trigger manual override injection of Gate 7 surge scenario
  async triggerGate7Surge(currentState) {
    this.stop();
    
    const signals = {
      flowSlowdown: 14,
      scanRateSurge: 28,
      heatIndex: 38,
      historicalIncidentMatch: true
    };

    const { confidence } = calculateConfidence(signals);
    const incidentTime = new Date().toLocaleTimeString();

    const incidentZone = "Gate 7";
    const incidentType = "Crowd Congestion Surge";

    const incident = {
      id: "inc_gate7",
      zone: incidentZone,
      type: incidentType,
      predictedIn: 3,
      confidence: confidence,
      signals: { ...signals },
      status: "pending_approval",
      timestamp: incidentTime,
      insights: null
    };

    const logs = [
      ...currentState.operatorLog,
      {
        time: incidentTime,
        text: `⚠️ ALERT: SentinelAI predicted congestion at Gate 7 in 3 minutes. Confidence: ${confidence}% (Cross-validated)`
      }
    ];

    await syncStore.updateState({
      simulationStatus: "predicting",
      timeRemaining: 38,
      activeIncidents: [incident],
      operatorLog: logs
    });

    // Asynchronously fetch GenAI insights
    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telemetry: signals,
        zone: incidentZone,
        type: incidentType
      })
    })
    .then(res => res.json())
    .then(data => {
      if (!data.error) {
        syncStore.updateState(prevState => {
          const updated = prevState.activeIncidents.map(inc => 
            inc.id === incident.id ? { ...inc, insights: data } : inc
          );
          return { activeIncidents: updated };
        });
      } else {
        console.warn("SentinelAI API error, using client-side fallback:", data.error);
        const fallback = {
          explanation: `(Fallback Mode) A combination of ${signals.flowSlowdown}% crowd slowdown near ${incidentZone} and a ${signals.scanRateSurge}% surge in scan rates indicates a severe bottleneck will form. The heat index (${signals.heatIndex}°C) increases safety risk.`,
          proposedActions: [
            `Open auxiliary entrance near ${incidentZone} and transition queue.`,
            "Dispatch Gate Marshal with multilingual script briefing.",
            `Push detour alert to wheelchair/disabled fans en route to ${incidentZone}.`
          ],
          ecoImpact: `Rerouting crowds from ${incidentZone} prevents idling queues, reducing localized heat output and saving ~12% on HVAC cooling overhead.`
        };
        syncStore.updateState(prevState => {
          const updated = prevState.activeIncidents.map(inc => 
            inc.id === incident.id ? { ...inc, insights: fallback } : inc
          );
          return { activeIncidents: updated };
        });
      }
    })
    .catch(err => {
      console.error("Failed to fetch SentinelAI insights, using client-side fallback:", err);
      const fallback = {
        explanation: `(Fallback Mode) A combination of ${signals.flowSlowdown}% crowd slowdown near ${incidentZone} and a ${signals.scanRateSurge}% surge in scan rates indicates a severe bottleneck will form. The heat index (${signals.heatIndex}°C) increases safety risk.`,
        proposedActions: [
          `Open auxiliary entrance near ${incidentZone} and transition queue.`,
          "Dispatch Gate Marshal with multilingual script briefing.",
          `Push detour alert to wheelchair/disabled fans en route to ${incidentZone}.`
        ],
        ecoImpact: `Rerouting crowds from ${incidentZone} prevents idling queues, reducing localized heat output and saving ~12% on HVAC cooling overhead.`
      };
      syncStore.updateState(prevState => {
        const updated = prevState.activeIncidents.map(inc => 
          inc.id === incident.id ? { ...inc, insights: fallback } : inc
        );
        return { activeIncidents: updated };
      });
    });
  }
}
