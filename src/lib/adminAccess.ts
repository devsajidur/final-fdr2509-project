// Client-side admin allowlist. It only decides which UI to show; the real check is
// isAdmin() in firestore.rules, which must list the same emails.
export const ADMIN_EMAILS = ['sajidhasan164@gmail.com', 'admin@macktrucks.com'] as const;

// The shared demo account can't be verified through an inbox, so it is trusted without verification.
const UNVERIFIED_ADMIN_EMAILS = ['admin@macktrucks.com'] as const;

/** One-click demo admin for /login and /admin. Turn off with NEXT_PUBLIC_DEMO_ADMIN=false. */
export const DEMO_ADMIN = {
  email: 'admin@macktrucks.com',
  password: 'MackAdmin2026!',
  displayName: 'Mack Demo Administrator',
} as const;

export const isDemoAdminEnabled = process.env.NEXT_PUBLIC_DEMO_ADMIN !== 'false';

export function isAllowlistedAdmin(email: string | null | undefined, emailVerified: boolean): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (!(ADMIN_EMAILS as readonly string[]).includes(normalized)) return false;
  if ((UNVERIFIED_ADMIN_EMAILS as readonly string[]).includes(normalized)) return isDemoAdminEnabled;
  return emailVerified;
}
