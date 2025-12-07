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
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};


