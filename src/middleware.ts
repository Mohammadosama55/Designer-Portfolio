// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('admin_token')?.value
  
  console.log('Middleware Check:', {
    pathname,
    hasAdminToken: !!token,
    isPublicAuthRoute: pathname === '/admin/login',
    isAdminRoute: pathname.startsWith('/admin'),
    isAdminApiRoute: pathname.startsWith('/api/admin'),
  });

  // Allow login page without authentication
  if (pathname === '/admin/login') {
    // If user is already logged in and tries to access login, redirect to admin
    if (token) {
      console.log('User already authenticated, redirecting to admin dashboard');
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // For all other admin routes, require authentication
  if ((pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) && 
      !pathname.startsWith('/api/admin/auth/login') && 
      !pathname.startsWith('/api/admin/auth/check')) {
    if (!token) {
      console.log('No token found in cookie, redirecting to login from:', pathname);
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token is valid
    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'dev-secret-key-change-in-production-32chars-min')
      const verified = await jwtVerify(token, secret)
      console.log('Token verified successfully:', { 
        email: (verified.payload as any).email,
        role: (verified.payload as any).role 
      })
      return NextResponse.next();
    } catch (error) {
      console.error('Token verification failed:', error)
      // Clear invalid token and redirect to login
      console.log('Clearing invalid token and redirecting to login')
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ]
};
