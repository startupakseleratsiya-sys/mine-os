import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase-middleware";

// Protected route prefixes — unauthenticated users are redirected to /sign-in
const PROTECTED = [
  "/dashboard",
  "/progress",
  "/tutor",
  "/calculators",
  "/profile",
];

// Auth pages — authenticated users are redirected to /dashboard
const AUTH_PAGES = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Run Supabase session refresh first (handles cookie refresh + admin guard)
  const response = await updateSession(request);

  // If updateSession already redirected (admin check), honour that
  if (response.status === 307 || response.status === 308) return response;

  // Check session for redirecting auth pages
  const isProtected = PROTECTED.some((path) => pathname.startsWith(path));
  const isAuthPage = AUTH_PAGES.some((path) => pathname.startsWith(path));

  if (isProtected || isAuthPage) {
    // We rely on updateSession having already embedded the redirect for
    // protected routes. Auth-page redirect handled by updateSession.
    return response;
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimization)
     * - favicon.ico
     * - public assets (svg, png, jpg, jpeg, gif, webp, ico)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
