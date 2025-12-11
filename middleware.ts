import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

const ADMIN_PREFIXES = ["/admin", "/api/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Never protect the login page via middleware to avoid redirect loops.
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const isAdminRoute = ADMIN_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session?.user) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Strict role check - only ADMIN role allowed
    const role = (session.user as any)?.role;
    if (role !== "ADMIN") {
      // Non-admin users get redirected to home with 403 status
      const homeUrl = new URL("/", req.url);
      return NextResponse.redirect(homeUrl, { status: 403 });
    }

    return NextResponse.next();
  } catch (error) {
    // If auth fails (e.g., NEXTAUTH_SECRET not set), allow access to login page
    // but redirect other admin routes to login
    console.error("[MIDDLEWARE] Auth error:", error);
    
    // If we're already on login page, allow it
    if (pathname.startsWith("/admin/login")) {
      return NextResponse.next();
    }
    
    // For other admin routes, redirect to login
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    loginUrl.searchParams.set("error", "configuration");
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};


