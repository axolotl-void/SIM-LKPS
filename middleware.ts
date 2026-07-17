export { auth as middleware } from "@/lib/auth";

export const config = {
  // Protect all routes except auth, health, api/auth, static files
  matcher: ["/((?!api/auth|api/health|_next/static|_next/image|favicon.ico|login).*)"],
};
