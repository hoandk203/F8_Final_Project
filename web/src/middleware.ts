import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_NAMES } from './utils/cookies';

// Define route configuration types
interface RoleConfig {
  paths: string[];
  loginRedirect: string;
}

type RouteConfig = {
  public: string[];
  driver: RoleConfig;
  store: RoleConfig;
  vendor: RoleConfig;
  admin: RoleConfig;
};

// Define route configurations
const ROUTE_CONFIG: RouteConfig = {
  // Public routes (no authentication required)
  public: [
    '/',
    '/login',
    '/store-login', 
    '/vendor-login',
    '/register',
    '/forgot-password',
    '/verify-email',
  ],
  
  // Role-specific routes
  driver: {
    paths: ['/driver'],
    loginRedirect: '/login'
  },
  
  store: {
    paths: ['/store'],
    loginRedirect: '/store-login'
  },
  
  vendor: {
    paths: ['/vendor'],
    loginRedirect: '/vendor-login'
  },
  
  admin: {
    paths: ['/admin'],
    loginRedirect: '/vendor-login'
  }
};

// Type guard to check if a config is a RoleConfig
function isRoleConfig(config: string[] | RoleConfig): config is RoleConfig {
  return typeof config === 'object' && 'paths' in config && 'loginRedirect' in config;
}

function isPublicRoute(pathname: string): boolean {
  return ROUTE_CONFIG.public.some(route => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });
}

function getRequiredRole(pathname: string): keyof Omit<RouteConfig, 'public'> | null {
  const roleKeys: (keyof Omit<RouteConfig, 'public'>)[] = ['driver', 'store', 'vendor', 'admin'];
  
  for (const role of roleKeys) {
    const config = ROUTE_CONFIG[role];
    if (isRoleConfig(config) && config.paths.some(path => pathname.startsWith(path))) {
      return role;
    }
  }
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Get authentication data from cookies
  const accessToken = request.cookies.get(COOKIE_NAMES.ACCESS_TOKEN)?.value;
  const refreshToken = request.cookies.get(COOKIE_NAMES.REFRESH_TOKEN)?.value;
  const userRole = request.cookies.get(COOKIE_NAMES.USER_ROLE)?.value;

  const isAuthenticated = Boolean(accessToken && refreshToken);
  
  // Handle public routes
  if (isPublicRoute(pathname)) {
    // If authenticated user tries to access login pages, redirect to their dashboard
    if (isAuthenticated && userRole) {
      if (pathname === '/login' || pathname === '/store-login' || pathname === '/vendor-login') {
        switch (userRole) {
          case 'driver':
            return NextResponse.redirect(new URL('/driver', request.url));
          case 'store':
            return NextResponse.redirect(new URL('/store', request.url));
          case 'vendor':
            return NextResponse.redirect(new URL('/vendor', request.url));
          case 'admin':
            return NextResponse.redirect(new URL('/admin', request.url));
          default:
            return NextResponse.next();
        }
      }
    }
    return NextResponse.next();
  }

  // Handle protected routes
  const requiredRole = getRequiredRole(pathname);
  
  if (!requiredRole) {
    // Unknown route, let it through (will be handled by 404)
    return NextResponse.next();
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    const roleConfig = ROUTE_CONFIG[requiredRole];
    const loginRedirect = isRoleConfig(roleConfig) ? roleConfig.loginRedirect : '/login';
    return NextResponse.redirect(new URL(loginRedirect, request.url));
  }

  // Check if user has the required role
  if (userRole !== requiredRole) {
    // User is authenticated but doesn't have the right role
    let redirectPath = '/login';
    
    // Redirect to appropriate dashboard based on current user role
    switch (userRole) {
      case 'driver':
        redirectPath = '/driver';
        break;
      case 'store':
        redirectPath = '/store';
        break;
      case 'vendor':
        redirectPath = '/vendor';
        break;
      case 'admin':
        redirectPath = '/admin';
        break;
      default:
        redirectPath = '/login';
    }
    
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // User is authenticated and has the right role
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 