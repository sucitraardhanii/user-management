import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("auth_token")?.value || 
                request.headers.get("Authorization")?.replace("Bearer ", "") || 
                null;

  const { pathname } = request.nextUrl;

  // ✅ Halaman yang tidak butuh login
  const publicPaths = ["/login"];

  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  // ⛔ Belum login, akses private route
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Sudah login, buka halaman login? Arahkan ke dashboard
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
