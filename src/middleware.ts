import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('admin_session');
  const isAuthenticated = sessionCookie?.value === 'authenticated';

  // Handling route /admin/login
  if (pathname === '/admin/login') {
    if (isAuthenticated) {
      // Admin yang sudah login mencoba akses /admin/login -> redirect ke /admin
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Handling seluruh rute /admin (dashboard, aspirasi, profil, dll)
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      // Pengguna belum login mencoba akses /admin -> redirect ke /admin/login
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Handling endpoint API khusus admin (/api/admin/*)
  if (pathname.startsWith('/api/admin')) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, message: 'Akses tidak diizinkan. Silakan login sebagai admin.' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
