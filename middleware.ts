import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  // Rotas públicas
  if (pathname === "/login") {
    if (isLoggedIn) {
      const dest = role === "ADMIN" ? "/admin" : "/dashboard";
      return NextResponse.redirect(new URL(dest, req.url));
    }
    return NextResponse.next();
  }

  // Rota raiz → redireciona
  if (pathname === "/") {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
    const dest = role === "ADMIN" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  // Requer autenticação
  if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));

  // Admin tentando acessar área de aluno e vice-versa
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
