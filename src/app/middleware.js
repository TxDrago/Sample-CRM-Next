import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  // If token is missing and user is not on the login page
  if (!token && !request.nextUrl.pathname.startsWith("/tenantlogin")) {
    return NextResponse.redirect(new URL("/tenantlogin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/panel/Advisory/:path*", "/panel/Brokerage/:path*", "/panel/RealEstate/:path*"],
};
