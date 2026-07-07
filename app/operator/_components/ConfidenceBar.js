import { CONFIDENCE_THRESHOLDS } from "@/constants";

export function ConfidenceBar({ confidence }) {
  let color = "var(--color-primary)"; // default blue/primary
  if (confidence >= CONFIDENCE_THRESHOLDS.HIGH) color = "var(--color-danger)";
  else if (confidence >= CONFIDENCE_THRESHOLDS.MEDIUM) color = "var(--color-warning)";

  return (
    <div style={{ marginTop: "var(--space-md)" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "var(--space-xs)",
          fontSize: "var(--text-xs)",
          color: "var(--color-foreground-muted)",
        }}
      >
        <span>SentinelAI Confidence</span>
        <span style={{ color, fontWeight: 700 }}>{confidence}%</span>
      </div>
      <div
        style={{
          height: "8px",
          background: "var(--color-border)",
          borderRadius: "var(--radius-full)",
          overflow: "hidden",
        }}
        role="progressbar"
        aria-valuenow={confidence}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          style={{
            height: "100%",
            width: `${confidence}%`,
            background: color,
            transition: "width 0.5s ease-out, background-color 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}
