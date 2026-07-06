"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { syncStore } from "../../lib/firebase";

const LANGS = {
  pt: {
    loading: "Carregando Portal...",
    exit: "← Sair",
    title: "FIFA World Cup Voluntários",
    stadium: "Estádio AT&T (Arlington)",
    role: "Fiscal de Portão — Gate Marshal",
    status: {
      idle: "DISPONÍVEL",
      notified: "ALERTA",
      in_position: "EM POSIÇÃO",
      completed: "CONCLUÍDO",
    },
    taskAlert: "TAREFA DE EMERGÊNCIA",
    requestedBy: "Solicitado por Central de Operações às",
    genAiScript: "Roteiro Recomendado pela IA:",
    ecoBadge: "Eco:",
    ecoText: "Direcionar para 7B reduz congestionamento e consome 18% menos energia de HVAC neste setor.",
    btnConfirmArrival: "Confirmar Chegada no Posto",
    btnMarkCompleted: "Marcar como Concluída",
    actionFinished: "Ação Finalizada. Obrigado!",
    noPending: "Nenhuma instrução pendente",
    waiting: "Aguardando sinais da central...",
  },
  en: {
    loading: "Loading Portal...",
    exit: "← Exit",
    title: "FIFA World Cup Volunteers",
    stadium: "AT&T Stadium (Arlington)",
    role: "Gate Marshal",
    status: {
      idle: "AVAILABLE",
      notified: "ALERT",
      in_position: "IN POSITION",
      completed: "COMPLETED",
    },
    taskAlert: "EMERGENCY TASK",
    requestedBy: "Requested by Operations Center at",
    genAiScript: "AI Recommended Script:",
    ecoBadge: "Eco:",
    ecoText: "Redirecting to 7B reduces congestion and consumes 18% less HVAC energy in this sector.",
    btnConfirmArrival: "Confirm Arrival at Post",
    btnMarkCompleted: "Mark as Completed",
    actionFinished: "Action Finished. Thank you!",
    noPending: "No pending instructions",
    waiting: "Waiting for signals from central...",
  }
};

export default function VolunteerPage() {
  const [state, setState] = useState(null);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const unsubscribe = syncStore.subscribeState((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  if (!state) {
    return (
      <div
        role="status"
        aria-label="Loading volunteer portal"
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "oklch(98% 0.01 240)",
        }}
      >
        <p>Loading Portal...</p>
      </div>
    );
  }

  const t = LANGS[language];
  const maria = state.volunteers.find((v) => v.id === "v1");
  const dispatchTimestamp =
    state.activeIncidents.length > 0
      ? state.activeIncidents[0].timestamp
      : null;

  const taskTitle = maria?.task
    ? language === "en"
      ? maria.task.title_en || maria.task.title
      : maria.task.title
    : "";

  const taskInstructions = maria?.task
    ? language === "en"
      ? maria.task.instructions_en || maria.task.instructions
      : maria.task.instructions
    : "";

  const handleUpdateStatus = async (newStatus) => {
    const updatedVolunteers = state.volunteers.map((vol) => {
      if (vol.id === "v1") return { ...vol, status: newStatus };
      return vol;
    });

    const logText =
      newStatus === "in_position"
        ? "Maria Silva: Confirmed in position at Gate 7B."
        : "Maria Silva: Task completed at Gate 7B.";

    await syncStore.updateState({
      volunteers: updatedVolunteers,
      operatorLog: [
        ...state.operatorLog,
        { time: new Date().toLocaleTimeString(), text: logText },
      ],
    });
  };

  const getBadgeStyle = (status) => ({
    fontSize: "var(--text-xs)",
    padding: "4px 10px",
    borderRadius: "var(--radius-sm)",
    fontWeight: "bold",
    color: "#ffffff",
    backgroundColor:
      status === "idle"
        ? "var(--color-info)"
        : status === "notified"
        ? "var(--color-warning)"
        : "var(--color-success)",
  });

  const statusLabel = t.status[maria.status] || t.status.idle;

  return (
    <div
      data-theme="dark"
      style={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "var(--color-background)",
        minHeight: "100vh",
        padding: "var(--space-md) 0",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "var(--color-background)",
          color: "var(--color-foreground)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-xl)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid var(--color-border)",
        }}
      >
        <header
          style={{
            padding: "var(--space-md)",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "var(--color-primary)",
              fontWeight: "bold",
              fontSize: "var(--text-sm)",
            }}
            aria-label="Exit volunteer portal"
          >
            {t.exit}
          </Link>
          <div style={{ textAlign: "center", flex: 1 }}>
            <h1 style={{ fontSize: "var(--text-base)" }}>
              {t.title}
            </h1>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-foreground-muted)" }}>
              {t.stadium}
            </p>
          </div>
          <button
            onClick={() => setLanguage((l) => (l === "en" ? "pt" : "en"))}
            style={{
              padding: "6px 10px",
              fontSize: "var(--text-xs)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              background: "transparent",
              cursor: "pointer",
              minHeight: "48px",
              minWidth: "48px",
              color: "var(--color-foreground)",
            }}
            aria-label="Toggle language"
          >
            {language === "en" ? "PT" : "EN"}
          </button>
        </header>

        <div
          style={{
            padding: "var(--space-md)",
            backgroundColor: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ fontWeight: "bold", fontSize: "var(--text-sm)" }}>
              Maria Silva
            </p>
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--color-foreground-muted)",
              }}
            >
              {t.role}
            </span>
          </div>
          <span
            className="badge"
            style={getBadgeStyle(maria.status)}
            aria-label={`Status: ${statusLabel}`}
          >
            {statusLabel}
          </span>
        </div>

        <div
          style={{
            flexGrow: 1,
            padding: "var(--space-lg)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {maria.task ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-md)",
                height: "100%",
              }}
            >
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
                <h2
                  style={{
                    color: "var(--color-danger)",
                    fontSize: "var(--text-sm)",
                    marginBottom: "4px",
                  }}
                >
                  {t.taskAlert}
                </h2>
                <p style={{ fontSize: "var(--text-xs)" }}>
                  {t.requestedBy} {dispatchTimestamp || "—"}
                </p>
              </div>

              <div>
                <h2
                  style={{
                    fontSize: "var(--text-lg)",
                    marginBottom: "var(--space-xs)",
                  }}
                >
                  {taskTitle}
                </h2>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-foreground-muted)",
                    lineHeight: "1.6",
                  }}
                >
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
                <h3
                  style={{ fontSize: "var(--text-sm)", marginBottom: "var(--space-xs)" }}
                >
                  {t.genAiScript}
                </h3>
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    fontStyle: "italic",
                    color: "var(--color-foreground-muted)",
                    lineHeight: "1.6",
                  }}
                >
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

              <div
                style={{
                  marginTop: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-sm)",
                }}
              >
                {maria.status === "notified" && (
                  <button
                    onClick={() => handleUpdateStatus("in_position")}
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                    aria-label="Confirm arrival"
                  >
                    {t.btnConfirmArrival}
                  </button>
                )}
                {maria.status === "in_position" && (
                  <button
                    onClick={() => handleUpdateStatus("completed")}
                    className="btn btn-primary"
                    style={{
                      width: "100%",
                      backgroundColor: "var(--color-success)",
                    }}
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
          ) : (
            <div
              style={{
                flexGrow: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                color: "var(--color-foreground-muted)",
              }}
              role="status"
              aria-label="No pending instructions"
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginBottom: "var(--space-md)", opacity: 0.5 }}
                  aria-hidden="true"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.55a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <p style={{ fontWeight: "bold" }}>{t.noPending}</p>
                <p style={{ fontSize: "var(--text-xs)", marginTop: "4px" }}>
                  {t.waiting}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
