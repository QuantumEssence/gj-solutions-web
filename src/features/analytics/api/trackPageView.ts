import type { PageTrackPayload } from "../types";
import { getFirebaseInstance, isFirebaseProduction } from "../../../services/firebase";

/**
 * Dispatches non-blocking analytics page view events.
 * Writes directly to Cloud Firestore collection 'page_views' in production mode,
 * and falls back seamlessly to /api/analytics/track for demo/local environments.
 */
export async function trackPageView(payload: PageTrackPayload): Promise<void> {
  // 1. Direct Firestore write in production mode
  if (isFirebaseProduction) {
    try {
      const [firebaseInstance, { collection, addDoc, serverTimestamp }] = await Promise.all([
        getFirebaseInstance(),
        import("firebase/firestore"),
      ]);

      if (firebaseInstance?.firestoreDb) {
        await addDoc(collection(firebaseInstance.firestoreDb, "page_views"), {
          path: payload.path || "/",
          timestamp: serverTimestamp(),
          referrer: payload.referrer || (typeof document !== "undefined" ? document.referrer : "") || "direct",
        });
        return;
      }
    } catch {
      // Fallback silently to REST tracking if direct Firestore write fails
    }
  }

  // 2. REST API tracking fallback
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: payload.path,
        timestamp: payload.timestamp || Date.now(),
        referrer: payload.referrer || (typeof document !== "undefined" ? document.referrer : undefined),
      }),
    });
  } catch {
    // Non-blocking silent catch for analytics tracking resilience
  }
}
