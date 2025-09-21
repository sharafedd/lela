import { createHmac, timingSafeEqual } from 'crypto';

export const AUTH_COOKIE = 'lela_admin';

// required: ADMIN_SECRET in your .env(.local)
const SECRET = process.env.ADMIN_SECRET || '';

function sign(value: string) {
  const sig = createHmac('sha256', SECRET).update(value).digest('base64url');
  return `${Buffer.from(value).toString('base64url')}.${sig}`;
}
function verify(token: string) {
  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return false;
  const value = Buffer.from(payloadB64, 'base64url').toString();
  const expected = createHmac('sha256', SECRET).update(value).digest('base64url');
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export function createSession() {
  const payload = JSON.stringify({ iat: Date.now() });
  return sign(payload);
}
export function isValidSession(token?: string | null) {
  if (!SECRET) return false;
  return !!token && verify(token);
}
