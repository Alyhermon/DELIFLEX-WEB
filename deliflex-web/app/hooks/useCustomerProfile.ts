import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/app/types/user";

type CustomerProfile = {
  full_name: string | null;
  email: string | null;
};

type PointsStatus = {
  total_points: number;
  current_tier_name: string | null;
};

export const TIER_COLORS: Record<string, string> = {
  Plata: "#9CA3AF",
  Oro: "#D4A017",
  Platino: "#5B7A9D",
  Black: "#1a1a1a",
};

// Compartido entre /cuenta y el menu de usuario del header: los dos
// necesitan el mismo nombre/nivel. Recibe el "user" ya resuelto (por
// useAuth() del que lo llama) en vez de pedirlo de nuevo aqui adentro -
// sin eso, cada componente que use este hook dispararia su propio fetch a
// /api/auth/me por separado.
export function useCustomerProfile(user: User | null) {
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [pointsStatus, setPointsStatus] = useState<PointsStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const [profileRes, pointsRes] = await Promise.all([
        supabase.rpc("get_my_customer_profile", { p_customer_id: user.id }),
        supabase.rpc("get_customer_points_status", { p_customer_id: user.id }),
      ]);

      if (profileRes.error) console.error(profileRes.error);
      else setCustomerProfile(profileRes.data?.[0] ?? null);

      if (pointsRes.error) console.error(pointsRes.error);
      else setPointsStatus(pointsRes.data?.[0] ?? null);

      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const displayName =
    customerProfile?.full_name || user?.username || user?.email || "Mi perfil";
  const tierName = pointsStatus?.current_tier_name ?? "Plata";
  const tierColor = TIER_COLORS[tierName] ?? "#585858";
  const totalPoints = pointsStatus?.total_points ?? 0;

  return { loading, displayName, tierName, tierColor, totalPoints };
}
