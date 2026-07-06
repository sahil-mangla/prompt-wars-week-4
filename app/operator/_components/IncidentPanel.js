import { ShieldIcon } from "./ShieldIcon";
import { ConfidenceBar } from "./ConfidenceBar";

export function IncidentPanel({ activeIncident, onApproveDispatch }) {
  return (
    <section
      className="card"
      style={{
        border: "1px solid var(--color-danger)",
        boxShadow: "0 0 20px rgba(220, 38, 38, 0.15)",
        position: "relative",
      }}
      aria-labelledby="incident-heading"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "var(--space-md)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
          <ShieldIcon color="var(--color-danger)" size={28} />
          <div>
            <span
              className="badge"
              style={{ backgroundColor: "var(--color-danger)", marginBottom: "var(--space-xs)" }}
            >
              INCIDENT PREDICTION
            </span>
            <h2 id="incident-heading" style={{ fontSize: "var(--text-xl)" }}>
              {activeIncident.type} detected at {activeIncident.zone}
            </h2>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-foreground-muted)" }}>
            Predicted Time to Impact
          </div>
          <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--color-danger)" }}>
            In {activeIncident.predictedIn} minutes
          </div>
        </div>
      </div>

      <ConfidenceBar confidence={activeIncident.confidence} />

      <div style={{ marginTop: "var(--space-lg)", padding: "var(--space-md)", background: "rgba(0,0,0,0.2)", borderRadius: "var(--radius-sm)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <h3 style={{ fontSize: "var(--text-md)", color: "var(--color-primary)" }}>
            SentinelAI Analysis
          </h3>
        </div>

        {!activeIncident.insights ? (
          <div style={{ padding: "var(--space-xl) var(--space-md)", textAlign: "center", color: "var(--color-primary)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-sm)" }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="spinner"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <p>Loading SentinelAI Insights...</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: "var(--text-sm)", lineHeight: 1.6, marginBottom: "var(--space-md)", color: "var(--color-text)" }}>
              {activeIncident.insights.explanation}
            </p>

            <div style={{ marginBottom: "var(--space-md)" }}>
              <h4 style={{ fontSize: "var(--text-xs)", textTransform: "uppercase", color: "var(--color-foreground-muted)", marginBottom: "var(--space-sm)" }}>
                Proposed Action Dispatch Plans:
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                {activeIncident.insights.proposedActions.map((action, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "start", gap: "var(--space-sm)", fontSize: "var(--text-sm)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }} aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ padding: "var(--space-sm)", background: "rgba(16, 185, 129, 0.1)", borderLeft: "4px solid var(--color-success)", borderRadius: "var(--radius-sm)", fontSize: "var(--text-xs)", marginBottom: "var(--space-md)" }}>
              <strong>Sustainability Impact:</strong> {activeIncident.insights.ecoImpact}
            </div>
            
            {activeIncident.status === "pending_approval" ? (
              <button
                className="btn btn-primary alert-pulse"
                style={{ width: "100%", justifyContent: "center", backgroundColor: "var(--color-danger)" }}
                onClick={() => onApproveDispatch(activeIncident)}
              >
                Approve SentinelAI action plan &amp; dispatch ground units
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-sm)", padding: "var(--space-md)", background: "rgba(16, 185, 129, 0.1)", color: "var(--color-success)", borderRadius: "var(--radius-sm)", fontWeight: 600 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
                Action Plan Dispatched to Ground Units
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
