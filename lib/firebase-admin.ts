// lib/firebase-admin.ts
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

function formatPrivateKey(key?: string): string | undefined {
  if (!key) return undefined;
  let formatted = key.trim();
  // Strip outer quotes if pasted into Vercel dashboard with wrapping quotes
  if (
    (formatted.startsWith('"') && formatted.endsWith('"')) ||
    (formatted.startsWith("'") && formatted.endsWith("'"))
  ) {
    formatted = formatted.slice(1, -1).trim();
  }
  // Replace literal escaped \n with real newline characters
  formatted = formatted.replace(/\\n/g, '\n');
  return formatted;
}

export function getAdminApp(): App {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    'iot1013';

  const clientEmail =
    process.env.FIREBASE_CLIENT_EMAIL ||
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
    'firebase-adminsdk-fbsvc@iot1013.iam.gserviceaccount.com';

  const rawKey =
    process.env.FIREBASE_PRIVATE_KEY ||
    process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  const privateKey = formatPrivateKey(rawKey);

  if (!privateKey) {
    throw new Error(
      'FIREBASE_PRIVATE_KEY is missing or empty. Please configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your Vercel Environment Variables and redeploy.'
    );
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



