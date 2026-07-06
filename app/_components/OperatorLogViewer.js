export function OperatorLogViewer({ logs }) {
  return (
    <section className="card log-section" aria-labelledby="log-heading">
      <h2 id="log-heading" style={{ color: "var(--color-primary)", marginBottom: "var(--space-md)" }}>
        Operator Incident Logs
      </h2>
      <div
        className="log-container"
        style={{
          background: "var(--color-bg)",
          padding: "var(--space-md)",
          borderRadius: "var(--radius-sm)",
          height: "200px",
          overflowY: "auto",
          fontFamily: "monospace",
          fontSize: "0.9rem",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-xs)",
          border: "1px solid var(--color-border)",
        }}
      >
        {logs.length === 0 ? (
          <div style={{ color: "var(--color-text-muted)" }}>No logs recorded yet.</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{ paddingBottom: "var(--space-xs)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: "var(--color-primary)", marginRight: "var(--space-sm)" }}>
                [{log.time}]
              </span>
              <span style={{ color: log.text.includes("ALERT") ? "var(--color-danger)" : "var(--color-text)" }}>
                {log.text}
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
