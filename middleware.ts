import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_PATHS = [
  "/dashboard",
  "/writing",
  "/quizzes",
  "/flashcards",
  "/progress",
  "/profile",
];

// Routes to redirect away from when already logged in
const AUTH_PATHS = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Firebase auth session cookie
  // Firebase sets __session cookie when using session cookies,
  // but for client-side auth we rely on a custom flag cookie we set on login.
  const authCookie = request.cookies.get("sprachy-auth");
  const isAuthenticated = Boolean(authCookie?.value === "1");

  // Protect private routes
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/signup → dashboard
  const isAuthPage = AUTH_PATHS.some((p) => pathname === p);
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
