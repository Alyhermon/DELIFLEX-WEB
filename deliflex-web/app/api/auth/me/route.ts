import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  const user = await res.json();
  return NextResponse.json(user);
}
