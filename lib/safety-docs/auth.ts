import crypto from 'crypto';
import type { NextRequest } from 'next/server';

export const SAFETY_PORTAL_PASSWORD = 'tejaazul26';
export const SAFETY_COOKIE_NAME = 'ru_safety_session';

// Stable server-side secret for hashing the session cookie
const SAFETY_SECRET = process.env.SAFETY_SECRET || 'riseup_safety_portal_salt_2026_oceanside';

/**
 * Generate the authorized session token for the password.
 */
export function generateSafetyToken(): string {
  return crypto
    .createHmac('sha256', SAFETY_SECRET)
    .update(SAFETY_PORTAL_PASSWORD)
    .digest('hex');
}

/**
 * Verify if the request carries a valid safety authentication cookie or token.
 */
export function isSafetyAuthenticated(req: NextRequest): boolean {
  const expectedToken = generateSafetyToken();

  // 1. Check HTTP cookie
  const cookieVal = req.cookies.get(SAFETY_COOKIE_NAME)?.value;
  if (cookieVal && cookieVal === expectedToken) {
    return true;
  }

  // 2. Check Authorization header (Bearer <token>)
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.slice(7).trim();
    if (bearerToken === expectedToken || bearerToken === SAFETY_PORTAL_PASSWORD) {
      return true;
    }
  }

  // 3. Check query param for direct document streaming if needed
  const queryToken = req.nextUrl.searchParams.get('token');
  if (queryToken && (queryToken === expectedToken || queryToken === SAFETY_PORTAL_PASSWORD)) {
    return true;
  }

  return false;
}
