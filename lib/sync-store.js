/**
 * @fileoverview MatchMind — Unified sync store (public API).
 *
 * Provides a single interface for reading/writing application state
 * regardless of whether Firebase or LocalSync is the active backend.
 *
 * Import { syncStore } from "@/lib/sync-store" throughout the application.
 * Do not import firebase.js or local-sync.js directly from UI components.
 */

import { db } from "@/lib/firebase";
import { LocalSyncManager, getInitialState } from "@/lib/local-sync";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

// Single shared instance of the local sync manager
const localSync = new LocalSyncManager();

// ---------------------------------------------------------------------------
// Public sync store API
// ---------------------------------------------------------------------------

/**
 * @typedef {Object} SyncStore
 * @property {() => boolean} isFirebaseEnabled
 * @property {(cb: function) => function} subscribeState
 * @property {(fields: object | function) => Promise<void>} updateState
 * @property {() => Promise<void>} resetState
 */

/** @type {SyncStore} */
export const syncStore = {
  /** @returns {boolean} Whether Firestore is the active backend */
  isFirebaseEnabled: () => !!db,

  /**
   * Subscribe to real-time state updates.
   * Routes to Firestore (if enabled) or LocalSync.
   *
   * @param {function(object): void} callback
   * @returns {function(): void} Unsubscribe function
   */
  subscribeState: (callback) => {
    if (db) {
      const docRef = doc(db, "matchmind", "active_state");
      return onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            callback(docSnap.data());
          } else {
            // Initialise Firestore document on first use
            const initialState = getInitialState();
            setDoc(docRef, initialState);
            callback(initialState);
          }
        },
        (error) => {
          console.warn("Firestore snapshot error, falling back to LocalSync:", error);
          return localSync.subscribe(callback);
        }
      );
    }
    return localSync.subscribe(callback);
  },

  /**
   * Merge updated fields into shared state.
   * Accepts an object or an updater function (receives current state, returns partial update).
   *
   * @param {object | function(object): object} updatedFields
   * @returns {Promise<void>}
   */
  updateState: async (updatedFields) => {
    const currentState = localSync.getState();
    const evaluated =
      typeof updatedFields === "function" ? updatedFields(currentState) : updatedFields;

    localSync.updateState(evaluated);

    if (db) {
      try {
        const docRef = doc(db, "matchmind", "active_state");
        await updateDoc(docRef, evaluated);
      } catch (error) {
        console.error("Failed to update Firestore:", error);
      }
    }
  },

  /**
   * Reset shared state to the default initial values.
   *
   * @returns {Promise<void>}
   */
  resetState: async () => {
    const initialState = getInitialState();
    localSync.updateState(initialState);

    if (db) {
      try {
        const docRef = doc(db, "matchmind", "active_state");
        await setDoc(docRef, initialState);
      } catch (error) {
        console.error("Failed to reset Firestore:", error);
      }
    }
  },
};
