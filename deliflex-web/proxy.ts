import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Mismo esquema que deliflex-admin: la sesion vive en una cookie httpOnly
// "auth_token" (puesta por /api/auth/set-cookie tras el login contra el
// backend), y este proxy (Next 16 renombro middleware.ts a proxy.ts) es lo
// que corta el paso a las rutas que requieren cuenta antes de que la pagina
// llegue a renderizar.
export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/core/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cuenta/:path*", "/pedidos/:path*"],
};
