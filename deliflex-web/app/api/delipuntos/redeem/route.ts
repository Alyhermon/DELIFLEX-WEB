import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Envia un canje de una recompensa del Marketplace (boton "Canjear" en
// /delipuntos). redeem_reward_with_points solo tiene EXECUTE para
// service_role a proposito: el customer_id que le pasamos sale del
// auth_token ya verificado, nunca de lo que mande el navegador, para que
// nadie pueda canjear puntos de otro cliente.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
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

  const { rewardId } = await request.json();

  if (!rewardId) {
    return NextResponse.json({ message: "Falta la recompensa" }, { status: 400 });
  }

  const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!meRes.ok) {
    return NextResponse.json({ message: "Token inválido" }, { status: 401 });
  }

  const user = await meRes.json();

  const rpcRes = await fetch(
    `${SUPABASE_URL}/rest/v1/rpc/redeem_reward_with_points`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_customer_id: user.id, p_reward_id: rewardId }),
    },
  );

  const data = await rpcRes.json().catch(() => null);

  if (!rpcRes.ok) {
    // Postgres manda el mensaje de la excepcion (ej. "Te faltan X puntos")
    // en `message`; sin este fallback el cliente veria un JSON crudo.
    const mensaje =
      (data && typeof data === "object" && "message" in data
        ? String(data.message)
        : null) ?? "No se pudo registrar el canje";
    return NextResponse.json({ message: mensaje }, { status: 400 });
  }

  const canje = Array.isArray(data) ? data[0] : data;

  return NextResponse.json({
    id: canje?.id,
    redemptionCode: canje?.redemption_code,
    pointsSpent: canje?.points_spent,
    createdAt: canje?.created_at,
  });
}
