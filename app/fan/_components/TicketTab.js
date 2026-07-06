import { RoutingMap } from "./RoutingMap";

export function TicketTab({ isDispatched, t }) {
  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-md)",
        }}
      >
        <h2 style={{ fontSize: "var(--text-xl)", margin: 0 }}>Match Ticket</h2>
        <span
          className="badge"
          style={{
            backgroundColor: isDispatched ? "var(--color-danger)" : "var(--color-success)",
            color: "var(--color-background)",
          }}
        >
          {isDispatched ? t.actionRequired : t.valid}
        </span>
      </div>

      <div style={{ marginBottom: "var(--space-md)", color: "var(--color-text-muted)" }}>
        <strong>Match:</strong> Group Stage A<br />
        <strong>Seat:</strong> Block 114, Row H, Seat 22
      </div>

      <RoutingMap isDispatched={isDispatched} t={t} />

      <div style={{ padding: "var(--space-md)", background: "var(--color-bg)", borderRadius: "var(--radius-sm)", textAlign: "center" }}>
        <div style={{ width: "80%", height: "80px", margin: "0 auto", backgroundImage: "repeating-linear-gradient(90deg, var(--color-text), var(--color-text) 2px, transparent 2px, transparent 4px, var(--color-text) 4px, var(--color-text) 8px, transparent 8px, transparent 10px)", opacity: 0.5 }}></div>
        <p style={{ marginTop: "var(--space-sm)", color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>Tap at turnstile</p>
      </div>
    </section>
  );
}
