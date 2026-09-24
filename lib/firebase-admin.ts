// lib/firebase-admin.ts
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || "iot1013";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk-fbsvc@iot1013.iam.gserviceaccount.com";
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  const privateKey = rawKey ? rawKey.replace(/\\n/g, '\n') : undefined;

  if (!privateKey) {
    console.warn("FIREBASE_PRIVATE_KEY is not set. Ensure environment variables are added in Vercel.");
    // Fallback dummy key to prevent crashes if cert() is evaluated during build
    return initializeApp({
      projectId,
    });
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

// Proxy export for db to initialize lazily at runtime
export const db = new Proxy({} as Firestore, {
  get(_, prop: keyof Firestore) {
    const firestore = getFirestore(getAdminApp());
    const val = firestore[prop];
    return typeof val === 'function' ? val.bind(firestore) : val;
  },
});


