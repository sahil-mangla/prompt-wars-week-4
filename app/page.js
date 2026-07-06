"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { syncStore } from "../lib/firebase";
import { SimulationController } from "../lib/simulation-engine";

export default function LauncherPage() {
  const [state, setState] = useState(null);
  const simulationRef = useRef(null);

  useEffect(() => {
    const unsubscribe = syncStore.subscribeState((newState) => {
      setState(newState);
    });

    const controller = new SimulationController();
    simulationRef.current = controller;

    return () => {
      unsubscribe();
      if (controller) controller.stop();
    };
  }, []);

  if (!state) {
    return (
      <div
        role="status"
        aria-label="Loading MatchMind application"
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "oklch(98% 0.01 240)",
        }}
      >
        <div className="card" style={{ width: "300px", textAlign: "center" }}>
          <p>Loading MatchMind...</p>
        </div>
      </div>
    );
  }

  const handleTriggerSurge = () => {
    if (simulationRef.current) simulationRef.current.triggerGate7Surge(state);
  };

  const handleReset = async () => {
    if (simulationRef.current) simulationRef.current.stop();
    await syncStore.resetState();
  };

  const statusColor =
    state.simulationStatus === "predicting"
      ? "var(--color-danger)"
      : state.simulationStatus === "dispatched"
      ? "var(--color-warning)"
      : state.simulationStatus === "resolved"
      ? "var(--color-success)"
      : "var(--color-foreground-muted)";

  return (
    <div
      className="container"
      style={{ padding: "var(--space-2xl) var(--space-lg)" }}
    >
      {/* Hero Header */}
      <header style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
        <h1
          style={{
            color: "var(--color-primary)",
            fontSize: "var(--text-3xl)",
            marginBottom: "var(--space-sm)",
          }}
        >
          MatchMind
        </h1>
        <p
          style={{
            margin: "0 auto var(--space-md)",
            color: "var(--color-foreground-muted)",
          }}
        >
          GenAI-Powered Stadium Operations &amp; Crowd Intelligence for FIFA
          World Cup 2026.
        </p>
        {/* Status chip — no numbered marker */}
        <span
          className="badge"
          style={{
            backgroundColor: statusColor,
            fontSize: "var(--text-xs)",
          }}
          aria-label={`System status: ${state.simulationStatus}`}
        >
          {state.simulationStatus.toUpperCase()}
        </span>
      </header>

      {/* Simulation Controls */}
      <div
        style={{
          display: "flex",
          gap: "var(--space-md)",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "var(--space-2xl)",
        }}
      >
        <button
          onClick={handleTriggerSurge}
          className="btn btn-primary"
          style={{ backgroundColor: "var(--color-danger)" }}
          aria-label="Inject Gate 7 crowd surge simulation"
        >
          Inject Gate 7 Surge Telemetry
        </button>
        <button
          onClick={handleReset}
          className="btn btn-secondary"
          aria-label="Reset simulation to idle state"
        >
          Reset Simulation State
        </button>
      </div>

      {/* Portal cards — no numbered H2 section markers */}
      <div
        className="grid grid-2"
        style={{ gap: "var(--space-xl)", marginBottom: "var(--space-2xl)" }}
      >
        <div
          className="card"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <h2
            style={{
              fontSize: "var(--text-xl)",
              color: "var(--color-primary)",
              marginBottom: "var(--space-md)",
            }}
          >
            Operations Command Center
          </h2>
          <p
            style={{
              flexGrow: 1,
              marginBottom: "var(--space-lg)",
              fontSize: "var(--text-sm)",
            }}
          >
            Operator dashboard (Alex&apos;s view): dark-mode control room with real-time telemetry, SentinelAI warnings, and multilingual dispatch controls.
          </p>
          <Link
            href="/operator"
            className="btn btn-primary"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            Open Command Dashboard
          </Link>
        </div>

        <div
          className="card"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <h2
            style={{
              fontSize: "var(--text-xl)",
              color: "var(--color-primary)",
              marginBottom: "var(--space-md)",
            }}
          >
            Volunteer Portal
          </h2>
          <p
            style={{
              flexGrow: 1,
              marginBottom: "var(--space-lg)",
              fontSize: "var(--text-sm)",
            }}
          >
            Mobile PWA for Gate Marshals (Maria&apos;s view): real-time Portuguese task scripts, role briefings, and confirmation workflow.
          </p>
          <Link
            href="/volunteer"
            className="btn btn-primary"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            Open Volunteer App
          </Link>
        </div>

        <div
          className="card"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <h2
            style={{
              fontSize: "var(--text-xl)",
              color: "var(--color-primary)",
              marginBottom: "var(--space-md)",
            }}
          >
            Fan Companion App
          </h2>
          <p
            style={{
              flexGrow: 1,
              marginBottom: "var(--space-lg)",
              fontSize: "var(--text-sm)",
            }}
          >
            Accessible fan guide (Yusuf&apos;s view): Arabic-localized detour alerts, dynamic ticket summary, and wheelchair-accessible SVG routing map.
          </p>
          <Link
            href="/fan"
            className="btn btn-primary"
            style={{ textDecoration: "none", textAlign: "center" }}
          >
            Open Fan App
          </Link>
        </div>

        <div
          className="card"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <h2
            style={{
              fontSize: "var(--text-xl)",
              color: "var(--color-primary)",
              marginBottom: "var(--space-md)",
            }}
          >
            Live System Telemetry
          </h2>
          <div
            style={{
              backgroundColor: "var(--color-background)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-md)",
              flexGrow: 1,
            }}
            role="status"
            aria-live="polite"
            aria-label="Live telemetry status"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "var(--space-sm)",
              }}
            >
              <span className="label">Kickoff Countdown:</span>
              <strong>T-{state.timeRemaining} min</strong>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "var(--space-sm)",
              }}
            >
              <span className="label">SentinelAI Status:</span>
              <strong style={{ color: statusColor }}>
                {state.simulationStatus.toUpperCase()}
              </strong>
            </div>
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span className="label">Active Signals:</span>
              <strong>
                {state.activeIncidents.length > 0
                  ? "Anomaly Detected"
                  : "Systems Normal"}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Signal Logs */}
      <section className="card" aria-label="Simulation signal logs">
        <h3
          style={{
            marginBottom: "var(--space-md)",
            borderBottom: "1px solid var(--color-border)",
            paddingBottom: "var(--space-sm)",
          }}
        >
          Simulated Signal Logs
        </h3>
        <div
          style={{
            maxHeight: "150px",
            overflowY: "auto",
            fontFamily: "monospace",
            fontSize: "var(--text-xs)",
            lineHeight: "1.6",
          }}
          aria-live="polite"
          role="log"
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
