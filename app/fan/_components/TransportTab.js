export function TransportTab({ t }) {
  return (
    <section>
      <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-md)" }}>
        {t.transportTitle}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
        <div style={{ padding: "var(--space-md)", background: "var(--color-bg)", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 600 }}>{t.metro}</div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-success)" }}>{t.onTime}</div>
          </div>
          <span className="badge" style={{ backgroundColor: "var(--color-primary)", color: "var(--color-background)" }}>5 min</span>
        </div>
        <div style={{ padding: "var(--space-md)", background: "var(--color-bg)", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontWeight: 600 }}>{t.bus}</div>
            <div style={{ fontSize: "var(--text-sm)", color: "var(--color-warning)" }}>{t.delayed}</div>
          </div>
          <span className="badge" style={{ backgroundColor: "var(--color-warning)", color: "var(--color-background)" }}>12 min</span>
        </div>
      </div>
    </section>
  );
}
