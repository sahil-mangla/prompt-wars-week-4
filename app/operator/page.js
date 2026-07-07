"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { syncStore } from "@/lib/sync-store";
import { LoadingScreen } from "@/app/_components/LoadingScreen";
import { OperatorLogViewer } from "@/app/_components/OperatorLogViewer";
import { TelemetrySignalCard } from "./_components/TelemetrySignalCard";
import { VolunteerCard } from "./_components/VolunteerCard";
import { IncidentPanel } from "./_components/IncidentPanel";

export default function OperatorPage() {
  const [state, setState] = useState(null);

  useEffect(() => {
    const unsubscribe = syncStore.subscribeState((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  if (!state) {
    return <LoadingScreen message="Initialising Command Console..." />;
  }

  const handleApproveDispatch = async (incident) => {
    const activeVolunteers = state.volunteers.map((v) => {
      if (v.id === "v1") {
        return {
          ...v,
          status: "notified",
          task: {
            title: "Direcionar Fluxo do Portão 7 para Portão 7B",
            instructions: "O SentinelAI previu congestionamento no Portão 7. Abra o portão auxiliar 7B e redirecione o fluxo principal de torcedores em português.",
            title_en: "Direct Flow from Gate 7 to Gate 7B",
            instructions_en: "SentinelAI predicted congestion at Gate 7. Open auxiliary Gate 7B and redirect the main flow of fans.",
            priority: "HIGH",
          },
        };
      }
      return v;
    });

    const updatedIncidents = state.activeIncidents.map((inc) =>
      inc.id === incident.id ? { ...inc, status: "dispatched" } : inc
    );

    const logEntry = {
      time: new Date().toLocaleTimeString(),
      text: `SentinelAI Action Plan Approved. Ground units dispatched to ${incident.zone}. Fan app detours active.`,
    };

    await syncStore.updateState({
      simulationStatus: "dispatched",
      activeIncidents: updatedIncidents,
      volunteers: activeVolunteers,
      operatorLog: [...state.operatorLog, logEntry],
    });

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: "SentinelAI Incident Alert: Crowd Bottleneck forming at Gate 7. Immediate action required. Open Gate 7B and begin rerouting fans. Use your megaphone to direct fans to the new gate.",
        targetLang: "pt",
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        const translatedTask = {
          title: "ALERTA: Redirecionamento de Multidão",
          instructions: data.translatedText || "O SentinelAI previu congestionamento no Portão 7. Abra o portão auxiliar 7B e redirecione o fluxo principal de torcedores em português.",
          title_en: "ALERT: Crowd Rerouting",
          instructions_en: "SentinelAI Incident Alert: Crowd Bottleneck forming at Gate 7. Immediate action required. Open Gate 7B and begin rerouting fans. Use your megaphone to direct fans to the new gate.",
          priority: "HIGH",
        };
        const finalVolunteers = state.volunteers.map((v) =>
          v.id === "v1" ? { ...v, status: "notified", task: translatedTask } : v
        );
        await syncStore.updateState({ volunteers: finalVolunteers });
      })
      .catch((err) => console.error("Translation failed:", err));
  };

  const activeIncident = state.activeIncidents[0]; // for demo, assume single incident

  return (
    <div
      data-theme="dark"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div className="container" style={{ padding: "var(--space-xl) var(--space-md)" }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-xl)",
            paddingBottom: "var(--space-md)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div>
            <h1 style={{ color: "var(--color-primary)", fontSize: "var(--text-2xl)", margin: 0 }}>
              MatchMind Command Console
            </h1>
            <div style={{ color: "var(--color-foreground-muted)", marginTop: "var(--space-xs)" }}>
              Zone: North Stadium • Operator: Alex Rivera
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "var(--text-3xl)", fontWeight: 700, fontFamily: "monospace", letterSpacing: "2px" }}>
              T-{state.timeRemaining} <span style={{ fontSize: "var(--text-md)" }}>min</span>
            </div>
            <div style={{ color: "var(--color-foreground-muted)", fontSize: "var(--text-xs)", textTransform: "uppercase" }}>
              To Kickoff
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-3" style={{ gap: "var(--space-xl)" }}>
          <div style={{ gridColumn: "1 / span 2", display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
            
            <TelemetrySignalCard state={state} />

            {state.simulationStatus === "idle" ? (
              <section
                className="card"
                style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "var(--space-2xl) var(--space-md)", textAlign: "center" }}
                aria-labelledby="sentinel-status"
              >
                <h2 id="sentinel-status" className="sr-only">SentinelAI Status</h2>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "var(--space-md)" }} aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <h3 style={{ color: "var(--color-success)", fontSize: "var(--text-xl)", marginBottom: "var(--space-sm)" }}>
                  SentinelAI Core: ONLINE / SCANNING
                </h3>
                <p style={{ color: "var(--color-foreground-muted)" }}>
                  No developing threats predicted. Monitoring telemetry streams...
                </p>
              </section>
            ) : (
              <IncidentPanel 
                activeIncident={activeIncident} 
                onApproveDispatch={handleApproveDispatch} 
              />
            )}

            <OperatorLogViewer logs={state.operatorLog} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
            <section className="card" aria-labelledby="volunteers-heading">
              <h2 id="volunteers-heading" style={{ color: "var(--color-primary)", marginBottom: "var(--space-md)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Ground Volunteers
                <span className="badge" style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text)" }}>{state.volunteers.length} ACTIVE</span>
              </h2>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {state.volunteers.map((v) => (
                  <VolunteerCard key={v.id} v={v} />
                ))}
              </div>
            </section>

            <Link href="/" className="btn btn-secondary" style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}>
              Return to Launcher
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
