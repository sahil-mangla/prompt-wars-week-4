/**
 * @fileoverview MatchMind — Centralized application constants.
 *
 * All magic strings, IDs, and numeric thresholds live here.
 * Import from this file — never hardcode these values inline.
 */

// ---------------------------------------------------------------------------
// Simulation identifiers
// ---------------------------------------------------------------------------

/** @type {Object.<string, string>} Well-known incident IDs */
export const INCIDENT_IDS = {
  GATE7: "inc_gate7",
};

/** @type {Object.<string, string>} Named gate zones used across the system */
export const GATE_ZONES = {
  GATE7: "Gate 7",
  GATE7B: "Gate 7B",
};

/** @type {Object.<string, string>} Volunteer IDs from the initial state */
export const VOLUNTEER_IDS = {
  MARIA: "v1",
  JOHN: "v2",
  LUIS: "v3",
};

/** @type {string} Default incident type label */
export const DEFAULT_INCIDENT_TYPE = "Crowd Congestion Surge";

// ---------------------------------------------------------------------------
// Simulation timing defaults
// ---------------------------------------------------------------------------

/** @type {Object.<string, number>} Default simulation timing values (minutes) */
export const SIMULATION_DEFAULTS = {
  /** Starting countdown to kickoff (minutes) in the auto-timeline */
  TIMELINE_START: 45,
  /** Countdown value injected by the manual Gate 7 surge trigger */
  SURGE_TRIGGER_TIME: 38,
  /** Predicted lead time shown to the operator (minutes) */
  PREDICTED_LEAD_TIME: 3,
  /** Interval between simulation ticks (ms); 5 s = 1 simulated minute */
  TICK_INTERVAL_MS: 5000,
};

// ---------------------------------------------------------------------------
// SentinelAI signal thresholds
// ---------------------------------------------------------------------------

/**
 * Minimum raw signal values that activate a weighted factor.
 * @type {Object.<string, number>}
 */
export const SIGNAL_THRESHOLDS = {
  /** Crowd flow slowdown (%) required to activate flow_anomaly weight */
  FLOW_SLOWDOWN_MIN: 10,
  /** Max value used for flow slowdown normalisation */
  FLOW_SLOWDOWN_NORM: 20,
  /** Ticket scan rate surge (%) required to activate scan_anomaly weight */
  SCAN_RATE_MIN: 15,
  /** Max value used for scan rate normalisation */
  SCAN_RATE_NORM: 30,
  /** Heat index (°C) required to activate weather_index weight */
  HEAT_INDEX_MIN: 35,
  /** Baseline value subtracted before heat index scaling */
  HEAT_INDEX_BASE: 30,
  /** Divisor for heat index normalisation */
  HEAT_INDEX_RANGE: 10,
};

/**
 * Signal count thresholds for cross-validation.
 * @type {Object.<string, number>}
 */
export const CROSS_VALIDATION = {
  /** Signals below this count trigger the high-variance penalty */
  LOW_SIGNAL_THRESHOLD: 3,
  /** Signals at or above this count receive the multi-signal bonus */
  HIGH_SIGNAL_THRESHOLD: 4,
  /** Variance penalty multiplier when signal count is below threshold */
  LOW_FACTOR: 0.5,
  /** Confirmation bonus multiplier when signal count is at/above threshold */
  HIGH_FACTOR: 1.1,
};

// ---------------------------------------------------------------------------
// Confidence display thresholds
// ---------------------------------------------------------------------------

/**
 * Confidence score brackets used for UI colouring and validation logic.
 * @type {Object.<string, number>}
 */
export const CONFIDENCE_THRESHOLDS = {
  /** Minimum confidence to trigger "predicting" status in the auto-timeline */
  ALERT: 75,
  /** Confidence level at which the bar renders in danger/red */
  HIGH: 80,
  /** Confidence level below which the bar renders in warning/amber */
  MEDIUM: 60,
};

// ---------------------------------------------------------------------------
// Fan App Translations
// ---------------------------------------------------------------------------

export const TRANSLATIONS = {
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
    greeting: "أهلاً بك، يوسف",
    ticket: "التذكرة",
    transport: "النقل",
    detourAlert: "تنبيه تبديل المسار",
    detourReason: "انتبه: مسار المصعد في البوابة 7 مغلق مؤقتًا بسبب الازدحام. يرجى اتباع المسار البديل إلى مصعد البوابة 7B لتفادي التدافع.",
    ecoEnergy: "طاقة متجددة: 78%",
    ecoWaste: "إعادة تدوير: 62%",
    ecoTransit: "نقل عام: 44%",
    routingMap: "مخطط التوجيه المباشر",
    newGate: "البوابة 7B",
    gate7: "البوابة 7",
    actionRequired: "تحديث المسار مطلوب",
    valid: "صالح",
    transportTitle: "النقل القريب",
    metro: "Metro Line B",
    bus: "Shuttle Bus 7",
    onTime: "On time",
    delayed: "Delayed"
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
    greeting: "Welcome, Yusuf",
    ticket: "Ticket",
    transport: "Transport",
    detourAlert: "DETOUR ALERT",
    detourReason: "Attention: The elevator path at Gate 7 is temporarily congested. Please follow the alternative route to Gate 7B elevator.",
    ecoEnergy: "Renewable: 78%",
    ecoWaste: "Recycled: 62%",
    ecoTransit: "Transit: 44%",
    routingMap: "Live Routing Map",
    newGate: "Gate 7B",
    gate7: "Gate 7",
    actionRequired: "Route Change Required",
    valid: "Valid",
    transportTitle: "Nearby Transport",
    metro: "Metro Line B",
    bus: "Shuttle Bus 7",
    onTime: "On time",
    delayed: "Delayed"
  },
  es: {
    dir: "ltr",
    title: "Boleto de Aficionado y Guía Digital",
    welcome: "Bienvenido, Yusuf",
    match: "Arabia Saudita vs USA",
    kickoff: "Inicio: 8:00 PM",
    seat: "Sec: 120 | Fila: 5 | Asiento: 12",
    gate: "Puerta Recomendada: Puerta 7",
    normalStatus: "Estado de Entrada: Normal",
    accessibilityLabel: "Ruta de Accesibilidad (Silla de Ruedas)",
    alertHeader: "ALERTA DE DESVÍO",
    alertBody:
      "Atención: El camino del ascensor en la Puerta 7 está congestionado temporalmente. Siga la ruta alternativa hacia el ascensor de la Puerta 7B para evitar aglomeraciones.",
    detourActive: "Desvío Seguro Activado",
    transportLabel: "Transporte Cercano",
    ecoLabel: "Ecológico",
    waitLabel: "Espera",
    sustainLabel: "Sostenibilidad",
    sustainBody: "Los aficionados que usan el Metro reducen las emisiones de CO₂ en 2.4 kg en comparación con conducir.",
    exit: "← Salir",
    greeting: "Bienvenido, Yusuf",
    ticket: "Boleto",
    transport: "Transporte",
    detourAlert: "ALERTA DE DESVÍO",
    detourReason: "Atención: El camino del ascensor en la Puerta 7 está congestionado temporalmente. Siga la ruta alternativa hacia el ascensor de la Puerta 7B.",
    ecoEnergy: "Renovable: 78%",
    ecoWaste: "Reciclado: 62%",
    ecoTransit: "Tránsito: 44%",
    routingMap: "Mapa de Rutas en Vivo",
    newGate: "Puerta 7B",
    gate7: "Puerta 7",
    actionRequired: "Cambio de Ruta Requerido",
    valid: "Válido",
    transportTitle: "Transporte Cercano",
    metro: "Línea B del Metro",
    bus: "Autobús 7",
    onTime: "A tiempo",
    delayed: "Retrasado"
  },
  pt: {
    dir: "ltr",
    title: "Ingresso Digital e Guia do Torcedor",
    welcome: "Bem-vindo, Yusuf",
    match: "Arábia Saudita vs EUA",
    kickoff: "Início: 20:00",
    seat: "Setor: 120 | Fila: 5 | Assento: 12",
    gate: "Portão Recomendado: Portão 7",
    normalStatus: "Status de Entrada: Normal",
    accessibilityLabel: "Rota de Acessibilidade (Cadeira de Rodas)",
    alertHeader: "ALERTA DE DESVIO",
    alertBody:
      "Atenção: O caminho do elevador no Portão 7 está temporariamente congestionado. Siga a rota alternativa para o elevador do Portão 7B para evitar aglomerações.",
    detourActive: "Desvio Seguro Ativado",
    transportLabel: "Transporte Próximo",
    ecoLabel: "Ecológico",
    waitLabel: "Espera",
    sustainLabel: "Sustentabilidade",
    sustainBody: "Torcedores que usam o Metrô reduzem as emissões de CO₂ em 2,4 kg em comparação com dirigir.",
    exit: "← Sair",
    greeting: "Bem-vindo, Yusuf",
    ticket: "Ingresso",
    transport: "Transporte",
    detourAlert: "ALERTA DE DESVIO",
    detourReason: "Atenção: O caminho do elevador no Portão 7 está temporariamente congestionado. Siga a rota alternativa para o elevador do Portão 7B.",
    ecoEnergy: "Renovável: 78%",
    ecoWaste: "Reciclado: 62%",
    ecoTransit: "Trânsito: 44%",
    routingMap: "Mapa de Rotas ao Vivo",
    newGate: "Portão 7B",
    gate7: "Portão 7",
    actionRequired: "Mudança de Rota Necessária",
    valid: "Válido",
    transportTitle: "Transporte Próximo",
    metro: "Linha B do Metrô",
    bus: "Ônibus 7",
    onTime: "No horário",
    delayed: "Atrasado"
  }
};

// ---------------------------------------------------------------------------
// Volunteer App Translations
// ---------------------------------------------------------------------------

export const VOLUNTEER_TRANSLATIONS = {
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
