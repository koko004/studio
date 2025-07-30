import { NextResponse, type NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

const protectedRoutes = ['/', '/bots/new', '/settings'];
const publicRoutes = ['/login'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  const cookie = cookies().get('session')?.value;
  const session = cookie ? await decrypt(cookie) : null;

  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (publicRoutes.includes(path) && session?.userId) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
