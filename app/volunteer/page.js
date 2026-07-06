"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { syncStore } from "@/lib/sync-store";
import { VOLUNTEER_TRANSLATIONS } from "@/lib/constants";
import { TaskCard } from "./_components/TaskCard";
import { EmptyState } from "./_components/EmptyState";

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

  const t = VOLUNTEER_TRANSLATIONS[language];
  const maria = state.volunteers.find((v) => v.id === "v1");
  const dispatchTimestamp =
    state.activeIncidents.length > 0
      ? state.activeIncidents[0].timestamp
      : null;

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
            <h1 style={{ fontSize: "var(--text-base)" }}>{t.title}</h1>
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
            <TaskCard
              maria={maria}
              dispatchTimestamp={dispatchTimestamp}
              language={language}
              t={t}
              onUpdateStatus={handleUpdateStatus}
            />
          ) : (
            <EmptyState t={t} />
          )}
        </div>
      </div>
    </div>
  );
}
