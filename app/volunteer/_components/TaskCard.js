export function TaskCard({ maria, dispatchTimestamp, language, t, onUpdateStatus }) {
  const taskTitle = language === "en"
    ? maria.task.title_en || maria.task.title
    : maria.task.title;

  const taskInstructions = language === "en"
    ? maria.task.instructions_en || maria.task.instructions
    : maria.task.instructions;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)", height: "100%" }}>
      <div
        role="alert"
        aria-live="assertive"
        style={{
          padding: "var(--space-md)",
          backgroundColor: "oklch(60% 0.25 25 / 0.1)",
          borderLeft: "4px solid var(--color-danger)",
          borderRadius: "var(--radius-md)",
        }}
      >
        <h2 style={{ color: "var(--color-danger)", fontSize: "var(--text-sm)", marginBottom: "4px" }}>
          {t.taskAlert}
        </h2>
        <p style={{ fontSize: "var(--text-xs)" }}>
          {t.requestedBy} {dispatchTimestamp || "—"}
        </p>
      </div>

      <div>
        <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-xs)" }}>
          {taskTitle}
        </h2>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-foreground-muted)", lineHeight: "1.6" }}>
          {taskInstructions}
        </p>
      </div>

      <div
        style={{
          padding: "var(--space-md)",
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px dashed var(--color-border)",
        }}
      >
        <h3 style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-xs)" }}>
          {t.genAiScript}
        </h3>
        <p style={{ fontSize: "var(--text-xs)", fontStyle: "italic", color: "var(--color-foreground-muted)", lineHeight: "1.6" }}>
          {language === "pt" 
            ? '"Atenção torcedores, o Portão 7 está temporariamente congestionado. Por favor, utilizem o Portão 7B à direita para acesso prioritário sem filas. Há elevadores acessíveis logo adiante."'
            : '"Attention fans, Gate 7 is temporarily congested. Please use Gate 7B to the right for priority access without lines. There are accessible elevators straight ahead."'}
        </p>
      </div>

      <div
        style={{
          padding: "var(--space-sm) var(--space-md)",
          backgroundColor: "oklch(65% 0.20 145 / 0.1)",
          borderLeft: "3px solid var(--color-success)",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--text-xs)",
          color: "var(--color-foreground-muted)",
        }}
      >
        <strong>{t.ecoBadge}</strong> {t.ecoText}
      </div>

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
        {maria.status === "notified" && (
          <button
            onClick={() => onUpdateStatus("in_position")}
            className="btn btn-primary"
            style={{ width: "100%" }}
            aria-label="Confirm arrival"
          >
            {t.btnConfirmArrival}
          </button>
        )}
        {maria.status === "in_position" && (
          <button
            onClick={() => onUpdateStatus("completed")}
            className="btn btn-primary"
            style={{ width: "100%", backgroundColor: "var(--color-success)" }}
            aria-label="Mark completed"
          >
            {t.btnMarkCompleted}
          </button>
        )}
        {maria.status === "completed" && (
          <div
            role="status"
            style={{
              textAlign: "center",
              padding: "var(--space-md)",
              backgroundColor: "var(--color-success)",
              color: "#ffffff",
              borderRadius: "var(--radius-md)",
              fontWeight: "bold",
            }}
          >
            {t.actionFinished}
          </div>
        )}
      </div>
    </div>
  );
}
