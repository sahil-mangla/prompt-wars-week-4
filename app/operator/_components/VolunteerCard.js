import { getBadgeStyle } from "../page"; // For now, we will extract getBadgeStyle into a utils or keep it in VolunteerCard

export function VolunteerCard({ v }) {
  // Inlined getBadgeStyle to avoid circular import for now
  const getBadgeStyle = (status) => {
    switch (status) {
      case "idle":
        return { bg: "var(--color-bg)", fg: "var(--color-text-muted)" };
      case "notified":
        return { bg: "var(--color-warning)", fg: "var(--color-background)" };
      case "in_position":
        return { bg: "var(--color-primary)", fg: "var(--color-background)" };
      case "resolved":
        return { bg: "var(--color-success)", fg: "var(--color-background)" };
      default:
        return { bg: "var(--color-bg)", fg: "var(--color-text)" };
    }
  };

  const badge = getBadgeStyle(v.status);
  
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "var(--space-sm) 0",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div>
        <div style={{ fontWeight: 600 }}>{v.name}</div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-foreground-muted)" }}>
          {v.role} • {v.location} • {v.lang.toUpperCase()}
        </div>
      </div>
      <span
        className="badge"
        style={{ backgroundColor: badge.bg, color: badge.fg }}
      >
        {v.status.replace("_", " ").toUpperCase()}
      </span>
    </div>
  );
}
