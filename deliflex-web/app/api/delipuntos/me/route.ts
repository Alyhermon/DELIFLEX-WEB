import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// El balance de DeliPuntos y el nivel de fidelidad no los expone el backend
// de NestJS todavia (get_customer_points_status vive directo en Supabase,
// como funcion RPC), asi que esta ruta habla con Supabase usando la llave
// de servicio, igual que /api/upload en deliflex-admin - la llave nunca
// viaja al navegador. El customer_id sale del auth_token (nunca del
// cliente), porque esa funcion RPC acepta cualquier customer_id sin
// verificar que sea "el mio".
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

  const rpcHeaders = {
    apikey: SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    "Content-Type": "application/json",
  };

  // get_customer_points_status.total_points son los puntos GANADOS de por
  // vida (para calcular el nivel, como las millas de una aerolinea): no
  // resta lo ya canjeado, asi que no sirve como saldo para gastar. Lo que
  // el cliente puede canjear ahora mismo sale de get_my_available_points
  // (ganados - canjeados, sin contar los cancelados).
  const [statusRes, availableRes] = await Promise.all([
    fetch(`${SUPABASE_URL}/rest/v1/rpc/get_customer_points_status`, {
      method: "POST",
      headers: rpcHeaders,
      body: JSON.stringify({ p_customer_id: user.id }),
    }),
    fetch(`${SUPABASE_URL}/rest/v1/rpc/get_my_available_points`, {
      method: "POST",
      headers: rpcHeaders,
      body: JSON.stringify({ p_customer_id: user.id }),
    }),
  ]);

  if (!statusRes.ok || !availableRes.ok) {
    return NextResponse.json(
      { message: "No se pudo cargar tus DeliPuntos" },
      { status: 502 },
    );
  }

  const statusRows = await statusRes.json();
  const availablePoints = await availableRes.json();
  const estado = statusRows?.[0] ?? {
    current_tier_name: null,
    current_discount_percent: null,
    current_free_shipping: null,
    current_exclusive_access: null,
    next_tier_name: null,
    next_tier_min_points: null,
    points_to_next_tier: null,
  };

  return NextResponse.json({
    availablePoints: availablePoints ?? 0,
    currentTierName: estado.current_tier_name,
    currentDiscountPercent: estado.current_discount_percent,
    currentFreeShipping: estado.current_free_shipping,
    currentExclusiveAccess: estado.current_exclusive_access,
    nextTierName: estado.next_tier_name,
    nextTierMinPoints: estado.next_tier_min_points,
    pointsToNextTier: estado.points_to_next_tier,
  });
}
