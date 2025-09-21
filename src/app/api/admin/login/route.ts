import { NextResponse } from 'next/server';
import { AUTH_COOKIE, createSession } from '@/lib/auth';

function readSecret(json: unknown): string | undefined {
  if (typeof json === 'object' && json !== null) {
    const obj = json as Record<string, unknown>;
    if (typeof obj.secret === 'string') return obj.secret;
  }
  return undefined;
}

export async function POST(req: Request) {
  const raw = await req.json().catch(() => null);
  const secret = readSecret(raw);

  if (!process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Missing ADMIN_SECRET' }, { status: 500 });
  }
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8h
  });
  return res;
}
