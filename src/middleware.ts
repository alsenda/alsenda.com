import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Extract subdomain
  const parts = hostname.split('.');
  const subdomain = parts[0];

  // List of subdomains that should be routed to specific applications
  const appSubdomains = ['app1', 'app2', 'app3'];

  // If the subdomain is an app subdomain, route to the app
  if (appSubdomains.includes(subdomain)) {
    return NextResponse.rewrite(
      new URL(`/apps/${subdomain}${pathname}`, request.url)
    );
  }

  // Otherwise, continue with the main portfolio
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
