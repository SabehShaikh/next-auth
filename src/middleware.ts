import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath =
    path === "/login" || path === "/signup" || path === "/verifyemail";

  const token = request.cookies.get("token")?.value || "";

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
    // Redirect to the home page if a logged-in user tries to visit public pages
  }
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
    // Redirect to the login page if a user without a token tries to visit private pages
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/login", "/signup", "/verifyemail", "/profile"],
};
