export function RoutingMap({ isDispatched, t, accessibilityMode }) {
  return (
    <div
      style={{
        background: "var(--color-bg)",
        padding: "var(--space-md)",
        borderRadius: "var(--radius-sm)",
        marginBottom: "var(--space-md)",
        border: "1px solid var(--color-border)",
      }}
      aria-label={t.routingMap}
      role="img"
    >
      {/* SVG rendering with dynamic accessibility overlay */}
      <svg
        viewBox="0 0 400 250"
        style={{ width: "100%", height: "auto" }}
        aria-hidden="true"
      >
        <rect width="400" height="250" fill="var(--color-bg)" />
        <rect x="50" y="50" width="100" height="150" fill="var(--color-background)" stroke="var(--color-border)" strokeWidth="2" rx="8" />
        <text x="100" y="130" fill="var(--color-text-muted)" fontSize="14" textAnchor="middle" fontWeight="bold">STADIUM</text>

        {isDispatched ? (
          <>
            <path d="M 200 200 Q 250 200 250 150 T 150 100" fill="none" stroke="var(--color-success)" strokeWidth="6" strokeDasharray="8 8" strokeLinecap="round" className="alert-pulse" />
            <circle cx="200" cy="200" r="8" fill="var(--color-primary)" />
            <circle cx="150" cy="100" r="8" fill="var(--color-success)" />
            <text x="140" y="90" fill="var(--color-success)" fontSize="12" fontWeight="bold" textAnchor="end">{t.newGate}</text>
            <path d="M 200 200 L 150 200" fill="none" stroke="var(--color-danger)" strokeWidth="4" strokeLinecap="round" />
            <line x1="140" y1="190" x2="160" y2="210" stroke="var(--color-danger)" strokeWidth="3" />
            <line x1="160" y1="190" x2="140" y2="210" stroke="var(--color-danger)" strokeWidth="3" />
          </>
        ) : (
          <>
            <path d="M 200 200 L 150 200" fill="none" stroke="var(--color-primary)" strokeWidth="6" strokeDasharray="8 8" strokeLinecap="round" />
            <circle cx="200" cy="200" r="8" fill="var(--color-primary)" />
            <circle cx="150" cy="200" r="8" fill="var(--color-primary)" />
            <text x="140" y="195" fill="var(--color-primary)" fontSize="12" fontWeight="bold" textAnchor="end">{t.gate7}</text>
          </>
        )}

        {/* Accessibility elevator marker */}
        {accessibilityMode && (
          <g aria-label="Wheelchair accessible elevator marker">
            <circle cx="150" cy={isDispatched ? 74 : 220} r="10" fill="var(--color-primary)" />
            <text x="150" y={isDispatched ? 78 : 224} fill="#ffffff" fontSize="12" textAnchor="middle" fontWeight="bold" aria-hidden="true">♿</text>
          </g>
        )}
      </svg>
      <div style={{ textAlign: "center", marginTop: "var(--space-sm)", fontSize: "var(--text-sm)", color: "var(--color-text)" }}>
        <strong>{isDispatched ? t.newGate : t.gate7}</strong>
      </div>
    </div>
  );
}
