export function TransportTab({ t, accessibilityMode }) {
  const shuttles = [
    { id: "s1", route: t.metro, desc: t.metroDesc, status: t.onTime, statusColor: "var(--color-success)", waitMins: 4, capacity: t.highCapacity, eco: true },
    { id: "s2", route: t.bus, desc: t.busDesc, status: t.delayed, statusColor: "var(--color-warning)", waitMins: 11, capacity: t.medCapacity, eco: false },
    { id: "s3", route: t.accessibleShuttle, desc: "", status: t.onTime, statusColor: "var(--color-success)", waitMins: 2, capacity: t.availCapacity, eco: true },
  ];

  return (
    <section>
      <h2 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-md)" }}>
        {t.transportTitle}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        {shuttles.map((shuttle) => (
          <div
            key={shuttle.id}
            className="card"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-xs)",
              padding: "var(--space-md)",
              backgroundColor: "var(--color-background)",
              borderColor: "var(--color-border)",
            }}
            aria-label={`${shuttle.route}${shuttle.desc}, wait ${shuttle.waitMins} minutes, capacity ${shuttle.capacity}`}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: "bold", fontSize: "var(--text-base)" }}>
                <span>{shuttle.route}</span>
                {shuttle.desc && (
                  <span style={{ fontWeight: "normal", color: "var(--color-foreground-muted)" }}>
                    {shuttle.desc}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "var(--space-xs)", alignItems: "center" }}>
                {shuttle.eco && (
                  <span
                    className="badge"
                    style={{ backgroundColor: "var(--color-success)", fontSize: "10px", padding: "2px 6px" }}
                  >
                    {t.ecoLabel}
                  </span>
                )}
                <span className="badge" style={{ backgroundColor: shuttle.id === "s2" ? "var(--color-warning)" : "var(--color-primary)", color: "#ffffff", padding: "2px 8px" }}>
                  {shuttle.waitMins} min
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "var(--space-md)", fontSize: "var(--text-xs)", color: "var(--color-foreground-muted)" }}>
              <span>
                Status: <strong style={{ color: shuttle.statusColor }}>{shuttle.status}</strong>
              </span>
              <span>
                {t.capacityLabel}: <strong>{shuttle.capacity}</strong>
              </span>
            </div>

            {/* Accessibility indicator */}
            {accessibilityMode && shuttle.id === "s3" && (
              <div style={{ display: "flex", gap: "4px", alignItems: "center", fontSize: "var(--text-xs)", color: "var(--color-primary)", fontWeight: "bold", marginTop: "2px" }}>
                <span>♿</span> {t.wheelchairAccessible}
              </div>
            )}

            {/* Google Maps Directions Redirect */}
            <button
              onClick={() => {
                const destination = shuttle.id === "s3" ? "AT%26T+Stadium+Gate+7B" : "AT%26T+Stadium";
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=transit`, "_blank");
              }}
              className="btn btn-primary"
              style={{
                marginTop: "var(--space-sm)",
                fontSize: "var(--text-xs)",
                padding: "8px 12px",
                width: "100%",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-primary)",
                border: "1px solid var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--space-xs)",
                minHeight: "44px",
                cursor: "pointer",
              }}
            >
              📍 {t.getDirections}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
