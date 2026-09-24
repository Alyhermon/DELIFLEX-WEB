import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (token) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout-everywhere`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".deliflex.app" : undefined,
  });

  return response;
}
