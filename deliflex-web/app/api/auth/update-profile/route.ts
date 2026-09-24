import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// La cookie httpOnly no la puede leer el componente cliente, asi que la
// pagina de editar perfil llama a esta ruta (mismo origen) en vez de
// pegarle directo al backend - aqui si se puede leer y reenviarla como
// Bearer, igual que en /api/auth/me y /api/auth/logout-everywhere.
export async function PATCH(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  const body = await request.json();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
