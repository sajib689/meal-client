import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Decode JWT payload without verifying signature (safe for role-based routing).
// Actual signature verification still happens on the backend for every API call.
function decodeJwtPayload(token: string): { id?: string; role?: string; messId?: string } | null {
    try {
        const base64Payload = token.split('.')[1];
        if (!base64Payload) return null;
        // Convert base64url to base64 then decode
        const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = atob(base64);
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const pathname = request.nextUrl.pathname;

    const isDashboard = pathname.startsWith('/dashboard');

    // ─── 1. No token → protect dashboard ────────────────────────────────────
    if (isDashboard && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ─── 3. Role-based route protection ─────────────────────────────────────
    if (isDashboard && token) {
        const payload = decodeJwtPayload(token);
        const role = payload?.role;

        // Super Admin only
        if (pathname.startsWith('/dashboard/superadmin') && role !== 'superadmin') {
            return NextResponse.redirect(new URL('/dashboard?error=access_denied', request.url));
        }

        // Mess Admin only (rooms, subscription)
        const isAdminOnlyPath =
            pathname.startsWith('/dashboard/rooms') ||
            pathname.startsWith('/dashboard/subscription');
        if (isAdminOnlyPath && role !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard?error=access_denied', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    // Run on all paths except Next.js internals and static assets
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|css|js)$).*)'],
};
