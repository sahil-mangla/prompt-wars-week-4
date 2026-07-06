export function EcoPillStrip({ t }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "var(--space-sm)",
        overflowX: "auto",
        paddingBottom: "var(--space-sm)",
        scrollbarWidth: "none",
        whiteSpace: "nowrap",
      }}
    >
      <div className="eco-pill" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
        {t.ecoEnergy}
      </div>
      <div className="eco-pill" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
        {t.ecoWaste}
      </div>
      <div className="eco-pill" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /><path d="M2 12h20" /></svg>
        {t.ecoTransit}
      </div>
    </div>
  );
}
