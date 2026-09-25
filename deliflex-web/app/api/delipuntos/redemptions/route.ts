import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Historial de canjes del cliente logueado (get_my_points_redemptions ya
// junta canjes de recompensas del Marketplace y de productos de tienda) -
// mismo patron de autenticacion que /api/delipuntos/me.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "No autenticado" }, { status: 401 });
  }

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return NextResponse.json(
      { message: "Falta configurar Supabase en .env.local" },
      { status: 500 },
    );
  }

  const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!meRes.ok) {
    return NextResponse.json({ message: "Token inválido" }, { status: 401 });
  }

  const user = await meRes.json();

  const rpcRes = await fetch(
    `${SUPABASE_URL}/rest/v1/rpc/get_my_points_redemptions`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_customer_id: user.id }),
    },
  );

  if (!rpcRes.ok) {
    return NextResponse.json(
      { message: "No se pudo cargar tu historial de canjes" },
      { status: 502 },
    );
  }

  const rows = await rpcRes.json();

  return NextResponse.json(
    (Array.isArray(rows) ? rows : []).map((r) => ({
      id: r.id,
      source: r.source,
      productName: r.product_name,
      productImageUrl: r.product_image_url,
      pointsSpent: r.points_spent,
      status: r.status,
      redemptionCode: r.redemption_code,
      createdAt: r.created_at,
    })),
  );
}
