// MatchMind Firebase & Real-time Sync Provider

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Check if valid config exists
const hasFirebaseConfig = 
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.apiKey !== "undefined" &&
  firebaseConfig.projectId !== "mock_project_id" &&
  firebaseConfig.apiKey !== "mock_firebase_api_key_for_local_testing";

let app;
let db = null;

if (hasFirebaseConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    console.log("MatchMind: Firebase Firestore successfully initialized.");
  } catch (error) {
    console.error("MatchMind: Firebase failed to initialize, falling back to LocalSync:", error);
  }
} else {
  console.log("MatchMind: No Firebase credentials found. Running in LocalSync Mode (Cross-tab BroadcastChannel).");
}

// Fallback real-time synchronization using HTML5 BroadcastChannel and LocalStorage
class LocalSyncManager {
  constructor() {
    this.channelName = "matchmind_sync_channel";
    this.channel = typeof window !== "undefined" ? new BroadcastChannel(this.channelName) : null;
    this.listeners = new Set();
    
    // Attempt to load from localStorage first to handle cross-tab navigation/reload
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("matchmind_state");
      if (saved) {
        try {
          this.state = JSON.parse(saved);
        } catch (e) {
          this.state = this.getInitialState();
        }
      } else {
        this.state = this.getInitialState();
      }
    } else {
      this.state = this.getInitialState();
    }

    if (this.channel) {
      this.channel.onmessage = (event) => {
        const { type, data } = event.data;
        if (type === "STATE_UPDATE") {
          this.state = { ...this.state, ...data };
          if (typeof window !== "undefined") {
            localStorage.setItem("matchmind_state", JSON.stringify(this.state));
          }
          this.notifyListeners();
        }
      };
    }
  }

  getInitialState() {
    // Default initial mock scenario data matching Gate 7 surge event
    return {
      simulationStatus: "idle", // "idle", "predicting", "dispatched", "resolved"
      timeRemaining: 38, // minutes to kickoff
      activeIncidents: [],
      volunteers: [
        { id: "v1", name: "Maria Silva", role: "Gate Marshal", location: "Gate 7", status: "idle", lang: "pt", task: null },
        { id: "v2", name: "John Doe", role: "Concourse Patrol", location: "Zone 3", status: "idle", lang: "en", task: null },
        { id: "v3", name: "Luis Hernandez", role: "Ramp Safety", location: "Zone 5", status: "idle", lang: "es", task: null }
      ],
      fans: {
        totalSimulated: 650,
        detoured: 0,
        routeBlocked: false
      },
      operatorLog: [
        { time: "16:20:00", text: "MatchMind Operational Dashboard online. Systems normal." }
      ]
    };
  }

  getState() {
    return this.state;
  }

  updateState(updatedFields) {
    this.state = { ...this.state, ...updatedFields };
    if (typeof window !== "undefined") {
      localStorage.setItem("matchmind_state", JSON.stringify(this.state));
    }
    this.notifyListeners();
    if (this.channel) {
      this.channel.postMessage({ type: "STATE_UPDATE", data: updatedFields });
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.state);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.state));
  }
}

const localSync = new LocalSyncManager();

// Unified Sync API
export const syncStore = {
  isFirebaseEnabled: () => !!db,
  
  subscribeState: (callback) => {
    if (db) {
      const docRef = doc(db, "matchmind", "active_state");
      return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          callback(docSnap.data());
        } else {
          // If Firestore is empty, initialize it with the local sync default state
          const initialState = localSync.getInitialState();
          setDoc(docRef, initialState);
          callback(initialState);
        }
      }, (error) => {
        console.warn("Firestore snapshot error, falling back to LocalSync:", error);
        return localSync.subscribe(callback);
      });
    }
    return localSync.subscribe(callback);
  },

  updateState: async (updatedFields) => {
    const currentState = localSync.getState();
    const evaluatedFields = typeof updatedFields === "function" 
      ? updatedFields(currentState) 
      : updatedFields;
      
    localSync.updateState(evaluatedFields);
    if (db) {
      try {
        const docRef = doc(db, "matchmind", "active_state");
        await updateDoc(docRef, evaluatedFields);
      } catch (error) {
        console.error("Failed to update Firestore:", error);
      }
    }
  },

  resetState: async () => {
    const initialState = localSync.getInitialState();
    localSync.updateState(initialState);
    if (db) {
      try {
        const docRef = doc(db, "matchmind", "active_state");
        await setDoc(docRef, initialState);
      } catch (error) {
        console.error("Failed to reset Firestore:", error);
      }
    }
  }
};
