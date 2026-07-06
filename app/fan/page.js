"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { syncStore } from "../../lib/firebase";

// Transport shuttle status (simulated — would connect to real API in production)
const SHUTTLE_STATUS = [
  { id: "s1", route: "Metro Line B — Stadium Direct", waitMins: 4, capacity: "High", eco: true },
  { id: "s2", route: "Shuttle Bus 7 — Parking C", waitMins: 11, capacity: "Medium", eco: false },
  { id: "s3", route: "Accessible Shuttle — Gate 7B", waitMins: 2, capacity: "Available", eco: true },
];

const LANGS = {
  ar: {
    dir: "rtl",
    title: "بطاقة المشجع الرقمية",
    welcome: "أهلاً بك، يوسف",
    match: "السعودية ضد الولايات المتحدة",
    kickoff: "ركلة البداية: 8:00 مساءً",
    seat: "القسم: 120 | الصف: 5 | المقعد: 12",
    gate: "البوابة الموصى بها: البوابة 7",
    normalStatus: "حالة الدخول: طبيعي",
    accessibilityLabel: "مسار ذوي الهمم (كرسي متحرك)",
    alertHeader: "تنبيه تبديل المسار",
    alertBody:
      "انتبه: مسار المصعد في البوابة 7 مغلق مؤقتًا بسبب الازدحام. يرجى اتباع المسار البديل إلى مصعد البوابة 7B لتفادي التدافع.",
    detourActive: "تم تفعيل المسار البديل الآمن",
    transportLabel: "وسائل النقل القريبة",
    ecoLabel: "خيار صديق للبيئة",
    waitLabel: "وقت الانتظار",
    sustainLabel: "بصمة بيئية",
    sustainBody: "المشجعون الذين يستخدمون المترو يخفضون انبعاثات ثاني أكسيد الكربون بمقدار 2.4 كجم مقارنة بالسيارة.",
    exit: "← خروج",
  },
  en: {
    dir: "ltr",
    title: "Digital Fan Ticket & Guide",
    welcome: "Welcome, Yusuf",
    match: "Saudi Arabia vs USA",
    kickoff: "Kickoff: 8:00 PM",
    seat: "Sec: 120 | Row: 5 | Seat: 12",
    gate: "Recommended Gate: Gate 7",
    normalStatus: "Entry Status: Normal",
    accessibilityLabel: "Wheelchair Accessibility Route",
    alertHeader: "DETOUR ALERT",
    alertBody:
      "Attention: The elevator path at Gate 7 is temporarily congested. Please follow the alternative route to Gate 7B elevator to avoid overcrowding.",
    detourActive: "Safe Detour Activated",
    transportLabel: "Nearby Transport",
    ecoLabel: "Eco-friendly",
    waitLabel: "Wait",
    sustainLabel: "Sustainability",
    sustainBody: "Fans using Metro reduce CO₂ emissions by 2.4 kg vs. driving. You're helping keep the World Cup green.",
    exit: "← Exit",
  },
};

export default function FanPage() {
  const [state, setState] = useState(null);
  const [accessibilityMode, setAccessibilityMode] = useState(true);
  const [language, setLanguage] = useState("ar");
  const [activeTab, setActiveTab] = useState("ticket"); // "ticket" | "transport" | "eco"

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
        aria-label="Loading fan portal"
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "oklch(98% 0.01 240)",
        }}
      >
        <p>Loading Matchday Portal...</p>
      </div>
    );
  }

  const isIncidentActive = state.simulationStatus === "dispatched";
  const t = LANGS[language];

  const tabStyle = (tab) => ({
    flex: 1,
    padding: "var(--space-sm)",
    fontSize: "var(--text-xs)",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    borderBottom: activeTab === tab ? "3px solid var(--color-primary)" : "3px solid transparent",
    backgroundColor: "transparent",
    color: activeTab === tab ? "var(--color-primary)" : "var(--color-foreground-muted)",
    transition: "color 0.15s, border-color 0.15s",
    minHeight: "48px",
  });

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
          direction: t.dir,
        }}
      >
        {/* Fan App Header */}
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
            aria-label={language === "ar" ? "خروج من تطبيق المشجع" : "Exit fan app"}
          >
            {t.exit}
          </Link>
          <h1 style={{ fontSize: "var(--text-base)" }}>{t.title}</h1>
          <button
            onClick={() => setLanguage((l) => (l === "ar" ? "en" : "ar"))}
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
            aria-label={
              language === "ar"
                ? "Switch to English"
                : "التبديل إلى العربية"
            }
          >
            {language === "ar" ? "EN" : "عر"}
          </button>
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
              ? language === "ar"
                ? "مفعّل"
                : "ON"
              : language === "ar"
              ? "مغلق"
              : "OFF"}
          </button>
        </div>

        {/* Eco Stadium Metrics (Header Pills) */}
        <div
          style={{
            display: "flex",
            gap: "var(--space-xs)",
            padding: "var(--space-xs) var(--space-md)",
            overflowX: "auto",
            backgroundColor: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border)",
            scrollbarWidth: "none",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "var(--color-success)", display: "flex", alignItems: "center", marginRight: "4px" }}>
            {language === "ar" ? "حالة بيئية:" : "Stadium Eco:"}
          </span>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "10px",
            padding: "4px 8px",
            borderRadius: "12px",
            backgroundColor: "oklch(65% 0.20 145 / 0.15)",
            color: "var(--color-success)",
            border: "1px solid var(--color-success)",
            whiteSpace: "nowrap"
          }}>
            ⚡ {language === "ar" ? "طاقة متجددة: 78%" : "Renewable: 78%"}
          </span>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "10px",
            padding: "4px 8px",
            borderRadius: "12px",
            backgroundColor: "oklch(65% 0.20 145 / 0.15)",
            color: "var(--color-success)",
            border: "1px solid var(--color-success)",
            whiteSpace: "nowrap"
          }}>
            ♻️ {language === "ar" ? "إعادة تدوير: 62%" : "Recycled: 62%"}
          </span>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "10px",
            padding: "4px 8px",
            borderRadius: "12px",
            backgroundColor: "oklch(65% 0.20 145 / 0.15)",
            color: "var(--color-success)",
            border: "1px solid var(--color-success)",
            whiteSpace: "nowrap"
          }}>
            🚌 {language === "ar" ? "نقل عام: 44%" : "Transit: 44%"}
          </span>
        </div>

        {/* Active Detour Alert — role="alert" for immediate screenreader announcement */}
        {isIncidentActive && (
          <div
            role="alert"
            aria-live="assertive"
            className="alert-pulse"
            style={{
              padding: "var(--space-md)",
              backgroundColor: "oklch(60% 0.25 25 / 0.1)",
              border: "2px solid var(--color-danger)",
              margin: "var(--space-sm)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <h2
              style={{
                color: "var(--color-danger)",
                fontSize: "var(--text-sm)",
                marginBottom: "var(--space-xs)",
              }}
            >
              {t.alertHeader}
            </h2>
            <p style={{ fontSize: "var(--text-xs)", lineHeight: "1.6" }}>
              {t.alertBody}
            </p>
          </div>
        )}

        {/* Tab navigation */}
        <nav
          aria-label="Fan portal sections"
          style={{
            display: "flex",
            borderBottom: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <button
            style={tabStyle("ticket")}
            onClick={() => setActiveTab("ticket")}
            aria-selected={activeTab === "ticket"}
            aria-label="Ticket and route information"
          >
            {language === "ar" ? "التذكرة" : "Ticket"}
          </button>
          <button
            style={tabStyle("transport")}
            onClick={() => setActiveTab("transport")}
            aria-selected={activeTab === "transport"}
            aria-label="Transport and shuttle information"
          >
            {language === "ar" ? "النقل" : "Transport"}
          </button>
        </nav>

        {/* Tab content */}
        <div
          style={{
            flexGrow: 1,
            padding: "var(--space-md)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-md)",
          }}
        >
          {/* TICKET TAB */}
          {activeTab === "ticket" && (
            <>
              {/* Ticket card */}
              <div
                className="card"
                style={{
                  border: "2px solid var(--color-primary)",
                  backgroundColor: "var(--color-surface)",
                }}
              >
                <h2
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-primary)",
                    marginBottom: "4px",
                  }}
                >
                  {t.welcome}
                </h2>
                <h3 style={{ fontSize: "var(--text-base)" }}>{t.match}</h3>
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    color: "var(--color-foreground-muted)",
                  }}
                >
                  {t.kickoff}
                </p>
                <hr
                  style={{
                    margin: "var(--space-sm) 0",
                    borderColor: "var(--color-border)",
                  }}
                />
                <p style={{ fontSize: "var(--text-sm)", fontWeight: "bold" }}>
                  {t.seat}
                </p>
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    marginTop: "4px",
                    color: isIncidentActive
                      ? "var(--color-danger)"
                      : "var(--color-success)",
                  }}
                >
                  {isIncidentActive
                    ? language === "ar"
                      ? "تحديث المسار مطلوب"
                      : "Route Change Required"
                    : t.gate}
                </p>
              </div>

              {/* Live Routing Map */}
              <div
                className="card"
                style={{ padding: "var(--space-md)", textAlign: "center" }}
              >
                <span
                  className="label"
                  style={{ display: "block", marginBottom: "var(--space-sm)" }}
                >
                  {language === "ar" ? "مخطط التوجيه المباشر" : "Live Routing Map"}
                </span>
                <svg
                  viewBox="0 0 200 120"
                  style={{
                    width: "100%",
                    height: "auto",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "#ffffff",
                  }}
                  role="img"
                  aria-label={
                    isIncidentActive
                      ? "Routing map showing detour from Gate 7 to Gate 7B"
                      : "Routing map showing direct path to Gate 7"
                  }
                >
                  {/* Stadium outline */}
                  <rect x="20" y="20" width="160" height="80" rx="40" fill="none" stroke="#cbd5e1" strokeWidth="3" />
                  <rect x="50" y="40" width="100" height="40" fill="#f1f5f9" rx="10" />
                  {/* Gates */}
                  <circle cx="30" cy="60" r="6" fill={isIncidentActive ? "#ef4444" : "#22c55e"} />
                  <text x="22" y="50" fontSize="6" fontWeight="bold" fill={isIncidentActive ? "#ef4444" : "#374151"}>Gate 7</text>
                  <circle cx="170" cy="60" r="6" fill="#22c55e" />
                  <text x="152" y="50" fontSize="6" fontWeight="bold" fill="#374151">Gate 7B</text>
                  {/* Metro */}
                  <rect x="80" y="102" width="40" height="12" rx="2" fill="#3b82f6" />
                  <text x="83" y="110" fontSize="5" fill="#ffffff" fontWeight="bold">Metro</text>
                  <circle cx="100" cy="108" r="3" fill="#f97316" />
                  {/* Routes */}
                  {isIncidentActive ? (
                    <>
                      <path d="M 100 102 C 60 90, 40 70, 30 63" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3" />
                      <path d="M 100 102 C 120 90, 150 70, 170 63" fill="none" stroke="#22c55e" strokeWidth="2.5" />
                      <text x="108" y="80" fontSize="5" fill="#22c55e" fontWeight="bold">
                        {language === "ar" ? "المسار الآمن" : "Safe Detour"}
                      </text>
                    </>
                  ) : (
                    <>
                      <path d="M 100 102 C 60 90, 40 70, 30 63" fill="none" stroke="#3b82f6" strokeWidth="2" />
                      <text x="44" y="80" fontSize="5" fill="#3b82f6" fontWeight="bold">
                        {language === "ar" ? "المسار المباشر" : "Direct Route"}
                      </text>
                    </>
                  )}
                  {/* Accessibility elevator marker */}
                  {accessibilityMode && (
                    <g aria-label="Wheelchair accessible elevator at Gate 7B">
                      <circle cx="170" cy="72" r="5" fill="#3b82f6" />
                      <text x="167" y="75" fill="#ffffff" fontSize="6" aria-hidden="true">♿</text>
                    </g>
                  )}
                </svg>
              </div>
            </>
          )}

          {/* TRANSPORT TAB */}
          {activeTab === "transport" && (
            <>
              <h2 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-xs)" }}>
                {t.transportLabel}
              </h2>
              {SHUTTLE_STATUS.map((shuttle) => (
                <div
                  key={shuttle.id}
                  className="card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-xs)",
                  }}
                  aria-label={`${shuttle.route}, wait ${shuttle.waitMins} minutes, capacity ${shuttle.capacity}`}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontWeight: "bold", fontSize: "var(--text-sm)" }}>
                      {shuttle.route}
                    </p>
                    {shuttle.eco && (
                      <span
                        className="badge"
                        style={{ backgroundColor: "var(--color-success)", fontSize: "10px" }}
                      >
                        {t.ecoLabel}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "var(--space-md)", fontSize: "var(--text-xs)", color: "var(--color-foreground-muted)" }}>
                    <span>
                      {t.waitLabel}:{" "}
                      <strong style={{ color: shuttle.waitMins <= 5 ? "var(--color-success)" : "var(--color-warning)" }}>
                        {shuttle.waitMins} min
                      </strong>
                    </span>
                    <span>Capacity: {shuttle.capacity}</span>
                  </div>
                  {/* Accessibility indicator */}
                  {accessibilityMode && shuttle.id === "s3" && (
                    <p style={{ fontSize: "10px", color: "var(--color-primary)", fontWeight: "bold" }}>
                      {language === "ar" ? "متاح لذوي الهمم" : "Wheelchair Accessible"}
                    </p>
                  )}
                  {/* Google Maps Directions Integration */}
                  <button
                    onClick={() => {
                      const destination = shuttle.id === "s3" ? "AT%26T+Stadium+Gate+7B" : "AT%26T+Stadium";
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=transit`, "_blank");
                    }}
                    className="btn btn-primary"
                    style={{
                      marginTop: "var(--space-xs)",
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
                      minHeight: "44px"
                    }}
                  >
                    📍 {language === "ar" ? "احصل على الاتجاهات (خرائط Google)" : "Get Directions (Google Maps)"}
                  </button>
                </div>
              ))}
            </>
          )}


        </div>
      </div>
    </div>
  );
}
