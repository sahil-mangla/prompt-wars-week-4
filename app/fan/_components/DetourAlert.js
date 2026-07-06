export function DetourAlert({ activeIncident, t }) {
  if (!activeIncident) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="card alert-pulse"
      style={{
        backgroundColor: "var(--color-danger)",
        color: "var(--color-background)",
        marginBottom: "var(--space-md)",
      }}
    >
      <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center", marginBottom: "var(--space-xs)" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
        <h2 style={{ fontSize: "var(--text-lg)", margin: 0 }}>{t.detourAlert}</h2>
      </div>
      <p style={{ margin: 0, fontWeight: 500 }}>{t.detourReason}</p>
    </div>
  );
}
