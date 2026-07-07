import { GATE_ZONES, SIGNAL_THRESHOLDS } from "@/constants";

export function TelemetrySignalCard({ state }) {
  const activeIncident = state.activeIncidents[0];
  const flowSlowdown = activeIncident ? activeIncident.signals.flowSlowdown : 2;
  const scanRateSurge = activeIncident ? activeIncident.signals.scanRateSurge : 0;
  const heatIndex = activeIncident ? activeIncident.signals.heatIndex : 32;

  return (
    <section className="card" aria-label="System telemetry">
      <h2 style={{ color: "var(--color-primary)", marginBottom: "var(--space-md)" }}>
        Telemetry Streams
      </h2>
      <div className="grid grid-3" style={{ gap: "var(--space-md)" }}>
        <div
          style={{
            background: "var(--color-bg)",
            padding: "var(--space-md)",
            borderRadius: "var(--radius-sm)",
            border: flowSlowdown > SIGNAL_THRESHOLDS.FLOW_SLOWDOWN_MIN ? "1px solid var(--color-warning)" : "1px solid var(--color-border)",
          }}
        >
          <div className="label">{GATE_ZONES.GATE7} Flow</div>
          <div style={{ fontSize: "var(--text-xl)", fontWeight: 700 }}>
            {flowSlowdown > SIGNAL_THRESHOLDS.FLOW_SLOWDOWN_MIN ? "0.4 m/s" : "1.4 m/s"}
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-foreground-muted)" }}>
            {flowSlowdown > SIGNAL_THRESHOLDS.FLOW_SLOWDOWN_MIN ? `↓ ${flowSlowdown}% (Anomaly)` : "Normal"}
          </div>
        </div>

        <div
          style={{
            background: "var(--color-bg)",
            padding: "var(--space-md)",
            borderRadius: "var(--radius-sm)",
            border: scanRateSurge > SIGNAL_THRESHOLDS.SCAN_RATE_MIN ? "1px solid var(--color-danger)" : "1px solid var(--color-border)",
          }}
        >
          <div className="label">Scan Rate</div>
          <div style={{ fontSize: "var(--text-xl)", fontWeight: 700 }}>
            {scanRateSurge > SIGNAL_THRESHOLDS.SCAN_RATE_MIN ? "185 scans/min" : "24 scans/min"}
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-foreground-muted)" }}>
            {scanRateSurge > SIGNAL_THRESHOLDS.SCAN_RATE_MIN ? `↑ ${scanRateSurge}% (Surge)` : "Normal"}
          </div>
        </div>

        <div
          style={{
            background: "var(--color-bg)",
            padding: "var(--space-md)",
            borderRadius: "var(--radius-sm)",
            border: heatIndex > SIGNAL_THRESHOLDS.HEAT_INDEX_MIN ? "1px solid var(--color-warning)" : "1px solid var(--color-border)",
          }}
        >
          <div className="label">Zone Weather</div>
          <div style={{ fontSize: "var(--text-xl)", fontWeight: 700 }}>
            {heatIndex}°C
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-foreground-muted)" }}>
            {heatIndex > SIGNAL_THRESHOLDS.HEAT_INDEX_MIN ? "High Risk" : "Humid"}
          </div>
        </div>
      </div>
    </section>
  );
}
