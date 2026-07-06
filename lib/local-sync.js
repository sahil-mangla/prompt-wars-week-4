/**
 * @fileoverview MatchMind — LocalSyncManager.
 *
 * Fallback real-time synchronisation using the HTML5 BroadcastChannel API
 * and localStorage. Active when Firebase credentials are absent or mocked.
 *
 * This class is intentionally decoupled from Firebase so it can be
 * instantiated and tested without any Firebase dependency.
 */

// ---------------------------------------------------------------------------
// Initial application state
// ---------------------------------------------------------------------------

/**
 * Return a fresh copy of the default simulation state.
 * Called on first load or when the simulation is reset.
 *
 * @returns {object}
 */
export function getInitialState() {
  return {
    simulationStatus: "idle", // "idle" | "predicting" | "dispatched" | "resolved"
    timeRemaining: 38,        // minutes to kickoff
    activeIncidents: [],
    volunteers: [
      { id: "v1", name: "Maria Silva",    role: "Gate Marshal",     location: "Gate 7", status: "idle", lang: "pt", task: null },
      { id: "v2", name: "John Doe",       role: "Concourse Patrol", location: "Zone 3", status: "idle", lang: "en", task: null },
      { id: "v3", name: "Luis Hernandez", role: "Ramp Safety",      location: "Zone 5", status: "idle", lang: "es", task: null },
    ],
    fans: {
      totalSimulated: 650,
      detoured: 0,
      routeBlocked: false,
    },
    operatorLog: [
      { time: "16:20:00", text: "MatchMind Operational Dashboard online. Systems normal." },
    ],
  };
}

// ---------------------------------------------------------------------------
// LocalSyncManager class
// ---------------------------------------------------------------------------

const BROADCAST_CHANNEL_NAME = "matchmind_sync_channel";
const LOCAL_STORAGE_KEY = "matchmind_state";

/**
 * Manages local application state with cross-tab synchronisation.
 *
 * State flow:
 *   write → updateState() → localStorage → BroadcastChannel → listeners
 *   read  → subscribeState() / getState()
 */
export class LocalSyncManager {
  constructor() {
    this._channel = typeof window !== "undefined"
      ? new BroadcastChannel(BROADCAST_CHANNEL_NAME)
      : null;
    this._listeners = new Set();
    this._state = this._loadInitialState();

    if (this._channel) {
      this._channel.onmessage = (event) => {
        const { type, data } = event.data;
        if (type === "STATE_UPDATE") {
          this._state = { ...this._state, ...data };
          this._persistState();
          this._notifyListeners();
        }
      };
    }
  }

  /** @returns {object} Current state snapshot */
  getState() {
    return this._state;
  }

  /**
   * Merge updatedFields into state, persist, and broadcast.
   *
   * @param {object} updatedFields - Partial state to merge
   */
  updateState(updatedFields) {
    this._state = { ...this._state, ...updatedFields };
    this._persistState();
    this._notifyListeners();
    if (this._channel) {
      this._channel.postMessage({ type: "STATE_UPDATE", data: updatedFields });
    }
  }

  /**
   * Subscribe to state changes.
   *
   * @param {function(object): void} callback
   * @returns {function(): void} Unsubscribe function
   */
  subscribe(callback) {
    this._listeners.add(callback);
    callback(this._state); // immediate delivery of current state
    return () => this._listeners.delete(callback);
  }

  // Private ----------------------------------------------------------------

  _loadInitialState() {
    if (typeof window === "undefined") return getInitialState();
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!saved) return getInitialState();
    try {
      return JSON.parse(saved);
    } catch {
      return getInitialState();
    }
  }

  _persistState() {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this._state));
    }
  }

  _notifyListeners() {
    this._listeners.forEach((listener) => listener(this._state));
  }
}
