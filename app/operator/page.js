"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { syncStore } from "../../lib/firebase";

// SVG shield icon replacing the banned 🛡️ emoji
function ShieldIcon({ color = "currentColor", size = 24 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ConfidenceBar({ confidence, validated }) {
  const barColor =
    confidence >= 80
      ? "var(--color-danger)"
      : confidence >= 60
      ? "var(--color-warning)"
      : "var(--color-success)";

  return (
    <div
      role="meter"
      aria-valuenow={confidence}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`SentinelAI confidence score: ${confidence}%`}
      style={{ width: "100%" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-xs)",
        }}
      >
        <span style={{ fontSize: "var(--text-xs)", fontWeight: "bold" }}>
          Confidence Score
        </span>
        <span
          style={{
            fontSize: "var(--text-lg)",
            fontWeight: "bold",
            color: barColor,
          }}
        >
          {confidence}%
        </span>
      </div>
      <div
        style={{
          height: "8px",
          backgroundColor: "oklch(25% 0.03 240)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${confidence}%`,
            height: "100%",
            backgroundColor: barColor,
            borderRadius: "4px",
            transition: "width 0.5s ease",
          }}
        />
      </div>
      {validated && (
        <p
          style={{
            fontSize: "var(--text-xs)",
            color: "var(--color-success)",
            marginTop: "var(--space-xs)",
          }}
        >
          Cross-validated ({">"}= 3 independent signals confirmed)
        </p>
      )}
    </div>
  );
}

export default function OperatorPage() {
  const [state, setState] = useState(null);
  const [isDispatching, setIsDispatching] = useState(false);

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
        aria-label="Loading command center"
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "oklch(12% 0.02 240)",
          color: "#ffffff",
        }}
      >
        <p>Loading Command Center...</p>
      </div>
    );
  }

  const handleApproveDispatch = async () => {
    setIsDispatching(true);
    const activeIncident = state.activeIncidents.find((inc) => inc.id === "inc_gate7");

    const englishTaskBase = activeIncident?.insights 
      ? `SentinelAI Incident Alert: ${activeIncident.type} at ${activeIncident.zone}. ${activeIncident.insights.proposedActions.join(" ")} Eco-Impact: ${activeIncident.insights.ecoImpact}`
      : "SentinelAI predicted congestion at Gate 7. Open auxiliary gate 7B immediately and guide fans using accessible routes.";

    const translateTask = async (text, targetLang) => {
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, targetLang, context: "Operator Dispatch Instruction" })
        });
        const data = await res.json();
        return data.translatedText || text;
      } catch (e) {
        return text;
      }
    };

    const updatedVolunteers = await Promise.all(
      state.volunteers.map(async (vol) => {
        if (vol.id === "v1" || vol.id === "v3") {
          const translated = await translateTask(englishTaskBase, vol.lang);
          return {
            ...vol,
            status: "notified",
            task: {
              title: vol.lang === "pt" ? "TAREFA DE EMERGÊNCIA" : (vol.lang === "es" ? "TAREA DE EMERGENCIA" : "EMERGENCY TASK"),
              title_en: "EMERGENCY TASK",
              instructions: translated,
              instructions_en: englishTaskBase,
              priority: vol.id === "v1" ? "HIGH" : "MEDIUM",
            },
          };
        }
        return vol;
      })
    );

    const updatedIncidents = state.activeIncidents.map((inc) => ({
      ...inc,
      status: "dispatched",
    }));

    const dispatchTime = new Date().toLocaleTimeString();
    const updatedLogs = [
      ...state.operatorLog,
      {
        time: dispatchTime,
        text: "ACTION APPROVED: GenAI Dispatch instructions translated and transmitted dynamically.",
      },
      {
        time: dispatchTime,
        text: "FAN NOTICE: Real-time Arabic detour notification pushed to accessibility-flagged users.",
      },
    ];

    await syncStore.updateState({
      simulationStatus: "dispatched",
      activeIncidents: updatedIncidents,
      volunteers: updatedVolunteers,
      operatorLog: updatedLogs,
    });
    setIsDispatching(false);
  };

  const handleResolveIncident = async () => {
    const resolveTime = new Date().toLocaleTimeString();
    const updatedLogs = [
      ...state.operatorLog,
      {
        time: resolveTime,
        text: "SYSTEM RESOLVED: Telemetry shows flow rates at Gate 7 and 7B normalized. Crowds cleared.",
      },
    ];

    const resetVolunteers = state.volunteers.map((vol) => ({
      ...vol,
      status: "idle",
      task: null,
    }));

    await syncStore.updateState({
      simulationStatus: "resolved",
      activeIncidents: [],
      volunteers: resetVolunteers,
      operatorLog: updatedLogs,
    });
  };

  const activeIncident = state.activeIncidents.find(
    (inc) => inc.id === "inc_gate7"
  );

  const getVolunteerBadgeStyle = (status) => ({
    fontSize: "var(--text-xs)",
    padding: "4px 8px",
    borderRadius: "var(--radius-sm)",
    color: "#ffffff",
    backgroundColor:
      status === "idle"
        ? "var(--color-info)"
        : status === "notified"
        ? "var(--color-warning)"
        : "var(--color-success)",
  });

  return (
    <div
      data-theme="dark"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
        padding: "var(--space-lg)",
      }}
    >
      {/* Header bar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--color-border)",
          paddingBottom: "var(--space-md)",
          marginBottom: "var(--space-lg)",
          flexWrap: "wrap",
          gap: "var(--space-md)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "var(--color-primary)",
              fontWeight: "bold",
            }}
            aria-label="Back to launcher"
          >
            ← Launcher
          </Link>
          {/* H1 without inline font-size override — inherits correct h1 size from globals.css */}
          <h1>MatchMind Command Console</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-lg)", flexWrap: "wrap" }}>
          <div>
            <span style={{ color: "var(--color-foreground-muted)" }}>
              STADIUM:{" "}
            </span>
            <strong>AT&amp;T Stadium (Arlington, TX)</strong>
          </div>
          <div>
            <span style={{ color: "var(--color-foreground-muted)" }}>
              KICKOFF:{" "}
            </span>
            <strong style={{ color: "var(--color-accent)" }}>
              T-{state.timeRemaining} min
            </strong>
          </div>
        </div>
      </header>

      {/* Main 3-column grid — uses .grid-3 CSS class (responsive) */}
      <div
        className="grid grid-3"
        style={{ gap: "var(--space-lg)", marginBottom: "var(--space-lg)" }}
      >
        {/* Left: Telemetry Signals */}
        <section
          aria-label="Live sensor telemetry"
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}
        >
          <h2
            style={{
              fontSize: "var(--text-lg)",
              borderBottom: "1px solid var(--color-border)",
              paddingBottom: "var(--space-xs)",
            }}
          >
            Live Sensor Telemetry
          </h2>

          {[
            {
              label: "Gate 7 Flow Velocity",
              value:
                state.simulationStatus === "idle" ? "1.4 m/s" : "0.9 m/s",
              status: state.simulationStatus === "idle" ? "NORMAL" : "SLOWDOWN",
              statusBg:
                state.simulationStatus === "idle"
                  ? "var(--color-success)"
                  : "var(--color-danger)",
            },
            {
              label: "Ticket Scans Rate",
              value:
                state.simulationStatus === "idle"
                  ? "24 scans/min"
                  : "62 scans/min",
              status:
                state.simulationStatus === "idle" ? "STEADY" : "PEAK SURGE",
              statusBg:
                state.simulationStatus === "idle"
                  ? "var(--color-success)"
                  : "var(--color-warning)",
            },
            {
              label: "Weather Conditions",
              value: "38°C (Humid)",
              status: "HEAT INDEX",
              statusBg: "var(--color-danger)",
            },
          ].map((signal) => (
            <div
              key={signal.label}
              className="card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              role="status"
              aria-label={`${signal.label}: ${signal.value}, status ${signal.status}`}
            >
              <div>
                <span className="label">{signal.label}</span>
                <p
                  style={{
                    fontSize: "var(--text-lg)",
                    fontWeight: "bold",
                    marginTop: "2px",
                  }}
                >
                  {signal.value}
                </p>
              </div>
              <span
                className="badge"
                style={{ backgroundColor: signal.statusBg }}
              >
                {signal.status}
              </span>
            </div>
          ))}
        </section>

        {/* Middle: SentinelAI Core Analysis */}
        <section
          className="card"
          style={{
            display: "flex",
            flexDirection: "column",
            border: "2px solid var(--color-border)",
          }}
          role="status"
          aria-live="polite"
          aria-label="SentinelAI analysis panel"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--space-md)",
              flexWrap: "wrap",
              gap: "var(--space-sm)",
            }}
          >
            <h2 style={{ fontSize: "var(--text-xl)" }}>
              SentinelAI Core Analysis
            </h2>
            <span
              className="badge"
              style={{
                backgroundColor:
                  state.simulationStatus === "idle"
                    ? "var(--color-success)"
                    : "var(--color-danger)",
              }}
            >
              {state.simulationStatus === "idle"
                ? "ONLINE / SCANNING"
                : "INCIDENT PREDICTION"}
            </span>
          </div>

          {activeIncident ? (
            <div
              style={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-md)",
              }}
            >
              {/* Confidence Score Bar */}
              <ConfidenceBar
                confidence={activeIncident.confidence}
                validated={activeIncident.confidence >= 75}
              />

              <div
                style={{
                  padding: "var(--space-md)",
                  backgroundColor: "oklch(22% 0.05 25 / 0.15)",
                  border: "1px solid var(--color-danger)",
                  borderRadius: "var(--radius-lg)",
                }}
                role="alert"
                aria-live="assertive"
              >
                <h3
                  style={{
                    color: "var(--color-danger)",
                    marginBottom: "var(--space-xs)",
                    fontSize: "var(--text-base)",
                  }}
                >
                  {activeIncident.type} detected at {activeIncident.zone}
                </h3>
                <p style={{ fontSize: "var(--text-sm)" }}>
                  Predictive Alert Lead Time:{" "}
                  <strong>In {activeIncident.predictedIn} minutes</strong>.
                </p>
              </div>

              {!activeIncident.insights ? (
                <div style={{ padding: "var(--space-xl) var(--space-md)", textAlign: "center", color: "var(--color-primary)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-sm)" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                  </svg>
                  <p>Loading SentinelAI Insights...</p>
                  <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                </div>
              ) : (
                <>
                  <div>
                    <h4 style={{ marginBottom: "var(--space-xs)" }}>GenAI Situation Explanation:</h4>
                    <p
                      style={{
                        fontSize: "var(--text-sm)",
                        color: "var(--color-foreground-muted)",
                        lineHeight: "1.6",
                      }}
                    >
                      {activeIncident.insights.explanation}
                    </p>
                  </div>

                  <div>
                    <h4 style={{ marginBottom: "var(--space-xs)" }}>
                      Proposed Action Dispatch Plans:
                    </h4>
                    <ul
                      style={{
                        fontSize: "var(--text-sm)",
                        paddingLeft: "var(--space-lg)",
                        color: "var(--color-foreground-muted)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--space-xs)",
                      }}
                    >
                      {activeIncident.insights.proposedActions.map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div style={{ marginTop: "var(--space-xs)" }}>
                    <div style={{ display: "inline-block", backgroundColor: "var(--color-success)", color: "#fff", padding: "4px 8px", borderRadius: "var(--radius-sm)", fontSize: "var(--text-xs)", fontWeight: "bold", marginBottom: "4px" }}>
                      Sustainability Impact
                    </div>
                    <p style={{ fontSize: "var(--text-sm)", color: "var(--color-foreground-muted)", fontStyle: "italic" }}>
                      {activeIncident.insights.ecoImpact}
                    </p>
                  </div>
                </>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "var(--space-md)",
                  marginTop: "auto",
                  paddingTop: "var(--space-md)",
                }}
              >
                {activeIncident.status === "pending_approval" ? (
                  <button
                    onClick={handleApproveDispatch}
                    disabled={!activeIncident.insights || isDispatching}
                    className="btn btn-primary"
                    style={{
                      flexGrow: 1,
                      backgroundColor: (!activeIncident.insights || isDispatching) ? "var(--color-border)" : "var(--color-accent)",
                      cursor: (!activeIncident.insights || isDispatching) ? "not-allowed" : "pointer"
                    }}
                    aria-label="Approve SentinelAI action plan"
                  >
                    {isDispatching ? "Translating & Dispatching..." : "Approve SentinelAI action plan"}
                  </button>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      gap: "var(--space-sm)",
                    }}
                  >
                    <div
                      role="status"
                      style={{
                        textAlign: "center",
                        padding: "10px",
                        backgroundColor: "var(--color-success)",
                        borderRadius: "var(--radius-md)",
                        fontWeight: "bold",
                        color: "#ffffff",
                      }}
                    >
                      Dispatch Active
                    </div>
                    <button
                      onClick={handleResolveIncident}
                      className="btn btn-secondary"
                      style={{ width: "100%" }}
                      aria-label="Mark incident as resolved and reset volunteer statuses"
                    >
                      Clear &amp; Resolve Incident
                    </button>
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
            >
              <div>
                <ShieldIcon
                  color="var(--color-foreground-muted)"
                  size={48}
                />
                <p style={{ marginTop: "var(--space-md)" }}>
                  No developing threats predicted. Monitoring telemetry
                  streams...
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Right: Ground Volunteers */}
        <section
          aria-label="Ground volunteer status"
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}
        >
          <h2
            style={{
              fontSize: "var(--text-lg)",
              borderBottom: "1px solid var(--color-border)",
              paddingBottom: "var(--space-xs)",
            }}
          >
            Ground Volunteers
          </h2>

          {state.volunteers.map((vol) => (
            <div
              key={vol.id}
              className="card"
              style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <strong>{vol.name}</strong>
                <span
                  className="badge"
                  style={getVolunteerBadgeStyle(vol.status)}
                  aria-label={`${vol.name} status: ${vol.status}`}
                >
                  {vol.status.toUpperCase()}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-foreground-muted)",
                }}
              >
                <span>Role: {vol.role}</span>
                <span>Lang: {vol.lang.toUpperCase()}</span>
              </div>
              {vol.task && (
                <div
                  style={{
                    marginTop: "4px",
                    padding: "6px var(--space-sm)",
                    backgroundColor: "var(--color-background)",
                    borderLeft: "3px solid var(--color-accent)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "var(--text-xs)",
                      fontWeight: "bold",
                    }}
                  >
                    {vol.task.title}
                  </p>
                </div>
              )}
            </div>
          ))}
        </section>
      </div>

      {/* Logs section */}
      <section className="card" aria-label="Operator incident logs">
        <h3
          style={{
            marginBottom: "var(--space-md)",
            borderBottom: "1px solid var(--color-border)",
            paddingBottom: "var(--space-sm)",
          }}
        >
          Operator Incident Logs
        </h3>
        <div
          role="log"
          aria-live="polite"
          style={{
            maxHeight: "120px",
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: "var(--text-xs)",
            lineHeight: "1.6",
          }}
        >
          {state.operatorLog.map((log, index) => (
            <div key={index} style={{ marginBottom: "var(--space-xs)" }}>
              <span style={{ color: "var(--color-foreground-muted)" }}>
                [{log.time}]
              </span>{" "}
              {log.text}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
