import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';

export interface FirebaseInstance {
  firebaseApp: FirebaseApp;
  firestoreDb: Firestore;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDemoPlaceholderForLocalDevOnly',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'gjsolutions.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'gjsolutions',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'gjsolutions.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

export const isFirebaseProduction = import.meta.env.VITE_APP_MODE === 'production';

let cachedInstance: FirebaseInstance | null = null;
let initPromise: Promise<FirebaseInstance | null> | null = null;

/**
 * Lazy loads and initializes Firebase SDKs on demand.
 * This guarantees that Demo builds and non-production execution paths
 * do not eagerly bundle or initialize Firebase dependencies.
 */
export async function getFirebaseInstance(): Promise<FirebaseInstance | null> {
  if (cachedInstance) {
    return cachedInstance;
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      const [{ initializeApp, getApps }, { getFirestore }] = await Promise.all([
        import('firebase/app'),
        import('firebase/firestore')
      ]);

      const existingApps = getApps();
      const app: FirebaseApp = existingApps.length === 0 ? initializeApp(firebaseConfig) : existingApps[0];
      const db: Firestore = getFirestore(app);

      cachedInstance = { firebaseApp: app, firestoreDb: db };
      return cachedInstance;
    } catch (err) {
      console.warn('[Firebase] Lazy initialization warning:', err);
      return null;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}
