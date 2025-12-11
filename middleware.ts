import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PREFIXES = ["/admin", "/api/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ALWAYS allow login page to load - check this FIRST before anything else
  if (pathname === "/admin/login" || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const isAdminRoute = ADMIN_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  // Check if NEXTAUTH_SECRET is set (basic validation)
  if (!process.env.NEXTAUTH_SECRET) {
    console.error("[MIDDLEWARE] NEXTAUTH_SECRET is not set");
    // Redirect to login for admin routes (but login page itself is already handled above)
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    loginUrl.searchParams.set("error", "configuration");
    return NextResponse.redirect(loginUrl);
  }

  // Dynamically import auth to avoid Edge Runtime issues
  // Wrap in try-catch to handle any import or execution errors
  try {
    const authModule = await import("./lib/auth").catch((importError) => {
      console.error("[MIDDLEWARE] Failed to import auth module:", importError);
      return null;
    });

    if (!authModule || !authModule.auth) {
      console.error("[MIDDLEWARE] Auth module not available");
      // Allow login page, redirect other admin routes
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
      loginUrl.searchParams.set("error", "configuration");
      return NextResponse.redirect(loginUrl);
    }

    const session = await authModule.auth().catch((authError) => {
      console.error("[MIDDLEWARE] Auth function error:", authError);
      return null;
    });
    
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
    // If anything fails, allow access to login page but redirect other admin routes to login
    console.error("[MIDDLEWARE] Unexpected error:", error);
    console.error("[MIDDLEWARE] Error details:", error instanceof Error ? error.message : String(error));
    console.error("[MIDDLEWARE] Error stack:", error instanceof Error ? error.stack : "No stack");
    
    // For admin routes (except login), redirect to login
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    loginUrl.searchParams.set("error", "configuration");
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};


