import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE } from './lib/auth';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminArea = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');
  const isStoriesMutation =
    pathname.startsWith('/api/stories') && req.method !== 'GET';

  if (isAdminArea || isStoriesMutation) {
    const token = req.cookies.get(AUTH_COOKIE)?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/stories/:path*'],
};
