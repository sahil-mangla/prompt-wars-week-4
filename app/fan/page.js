"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { syncStore } from "@/lib/sync-store";
import { TRANSLATIONS } from "@/constants";
import { LoadingScreen } from "@/app/_components/LoadingScreen";
import { DetourAlert } from "./_components/DetourAlert";
import { EcoPillStrip } from "./_components/EcoPillStrip";
import { TicketTab } from "./_components/TicketTab";
import { TransportTab } from "./_components/TransportTab";

export default function FanAppPage() {
  const [state, setState] = useState(null);
  const [lang, setLang] = useState("en"); // "en" | "ar" | "es" | "pt"
  const [activeTab, setActiveTab] = useState("ticket");
  const [accessibilityMode, setAccessibilityMode] = useState(true);

  useEffect(() => {
    const unsubscribe = syncStore.subscribeState((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  if (!state) {
    return <LoadingScreen message="Loading MatchMind..." />;
  }

  const t = TRANSLATIONS[lang];
  const isDispatched = state.simulationStatus === "dispatched";
  const activeIncident = isDispatched ? state.activeIncidents[0] : null;

  return (
    <div className="fan-app-wrapper">
      <div className="mobile-app" dir={t.dir}>
        {/* App Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-md)",
          }}
        >
          <div>
            <h1 style={{ color: "var(--color-primary)", fontSize: "var(--text-xl)", margin: 0 }}>
              {t.greeting}
            </h1>
            <div style={{ color: "var(--color-foreground-muted)", fontSize: "var(--text-sm)" }}>
              MatchMind Fan Pass
            </div>
          </div>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="btn btn-secondary"
            style={{ padding: "var(--space-xs) var(--space-sm)", fontSize: "var(--text-xs)" }}
            aria-label="Language selection"
          >
            <option value="en">EN</option>
            <option value="ar">AR</option>
            <option value="es">ES</option>
            <option value="pt">PT</option>
          </select>
        </header>

        {/* Accessibility Toggle */}
        <div
          style={{
            padding: "var(--space-sm) var(--space-md)",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "var(--color-surface)",
            borderRadius: "var(--radius-md)",
            marginBottom: "var(--space-md)",
          }}
        >
          <label
            htmlFor="a11y-toggle"
            style={{ fontSize: "var(--text-xs)", fontWeight: "bold" }}
          >
            {t.accessibilityLabel}
          </label>
          <button
            id="a11y-toggle"
            onClick={() => setAccessibilityMode(!accessibilityMode)}
            role="switch"
            aria-checked={accessibilityMode}
            aria-label={t.accessibilityLabel}
            style={{
              padding: "6px 14px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "var(--text-xs)",
              backgroundColor: accessibilityMode
                ? "var(--color-primary)"
                : "var(--color-border)",
              color: accessibilityMode ? "#ffffff" : "var(--color-foreground)",
              minHeight: "40px",
              minWidth: "60px",
            }}
          >
            {accessibilityMode
              ? (lang === "ar" ? "مفعّل" : "ON")
              : (lang === "ar" ? "مغلق" : "OFF")}
          </button>
        </div>

        {/* Eco Summary Pills */}
        <EcoPillStrip t={t} />

        {/* Active Incident Detour Alert */}
        <DetourAlert activeIncident={activeIncident} t={t} />

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--color-border)", marginBottom: "var(--space-md)" }} role="tablist">
          <button
            className="tab"
            style={{
              flex: 1,
              padding: "var(--space-sm)",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "ticket" ? "2px solid var(--color-primary)" : "2px solid transparent",
              color: activeTab === "ticket" ? "var(--color-primary)" : "var(--color-text-muted)",
              fontWeight: activeTab === "ticket" ? 600 : 400,
              cursor: "pointer",
            }}
            onClick={() => setActiveTab("ticket")}
            role="tab"
            aria-selected={activeTab === "ticket"}
          >
            {t.ticket}
          </button>
          <button
            className="tab"
            style={{
              flex: 1,
              padding: "var(--space-sm)",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === "transport" ? "2px solid var(--color-primary)" : "2px solid transparent",
              color: activeTab === "transport" ? "var(--color-primary)" : "var(--color-text-muted)",
              fontWeight: activeTab === "transport" ? 600 : 400,
              cursor: "pointer",
            }}
            onClick={() => setActiveTab("transport")}
            role="tab"
            aria-selected={activeTab === "transport"}
          >
            {t.transport}
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: "auto" }} role="tabpanel">
          {activeTab === "ticket" && (
            <TicketTab isDispatched={isDispatched} t={t} accessibilityMode={accessibilityMode} />
          )}

          {activeTab === "transport" && (
            <TransportTab t={t} accessibilityMode={accessibilityMode} />
          )}
        </div>

        {/* Footer Return Link */}
        <div style={{ marginTop: "var(--space-xl)", textAlign: "center" }}>
          <Link href="/" className="btn btn-secondary" style={{ textDecoration: "none", display: "inline-block" }}>
            Back to Launcher
          </Link>
        </div>
      </div>
    </div>
  );
}
