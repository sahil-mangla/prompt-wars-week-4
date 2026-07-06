/**
 * @fileoverview MatchMind — Firebase SDK initialisation.
 *
 * Sole responsibility: initialise the Firebase app and export the Firestore
 * database instance (`db`). Returns null when credentials are absent or mocked,
 * enabling the application to run in LocalSync mode without errors.
 *
 * Do not add business logic here. Import syncStore from "@/lib/sync-store".
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** @returns {boolean} True when all required Firebase credentials are present and not mock values */
function hasValidConfig() {
  const { apiKey, projectId } = firebaseConfig;
  return !!(
    apiKey &&
    projectId &&
    apiKey !== "undefined" &&
    projectId !== "mock_project_id" &&
    apiKey !== "mock_firebase_api_key_for_local_testing"
  );
}

/**
 * Firestore database instance.
 * `null` when Firebase credentials are absent — triggers LocalSync fallback.
 *
 * @type {import("firebase/firestore").Firestore | null}
 */
export let db = null;

if (hasValidConfig()) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
  } catch (error) {
    console.error("MatchMind: Firebase failed to initialise, falling back to LocalSync:", error);
  }
}
