"use client";

import { useEffect, useState } from "react";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/lib/supabase";
import SectionHeader from "./section-header";
import StoreCard from "./store-card";
import EmptyStateBox from "./empty-state-box";
import styles from "./recommended-row.module.css";

type Store = {
  id: string;
  name: string;
  logo_url: string | null;
  banner_url: string | null;
  rating: number | null;
};

// "Recomendado para ti" en la app movil: negocios con algun plan de boost
// activo (store_boost_status), ordenados por prioridad de boost, no por
// calificacion ni cercania.
export default function RecommendedRow() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommended = async () => {
      const boostResponse = await supabase
        .from("store_boost_status")
        .select("store_id, boost_priority")
        .order("boost_priority", { ascending: false });

      if (boostResponse.error) {
        console.error(boostResponse.error);
        setLoading(false);
        return;
      }

      const boostedStoreIds = (boostResponse.data ?? []).map((row) => row.store_id);

      if (boostedStoreIds.length === 0) {
        setStores([]);
        setLoading(false);
        return;
      }

      const storesResponse = await supabase
        .from("stores")
        .select("id, name, logo_url, banner_url, rating")
        .in("id", boostedStoreIds)
        .eq("status", "ACTIVE");

      if (storesResponse.error) {
        console.error(storesResponse.error);
        setLoading(false);
        return;
      }

      const storeById = new Map((storesResponse.data ?? []).map((s) => [s.id, s]));

      setStores(
        boostedStoreIds
          .map((id) => storeById.get(id))
          .filter((s): s is Store => Boolean(s))
          .slice(0, 10),
      );
      setLoading(false);
    };

    loadRecommended();
  }, []);

  return (
    <div className={`page-container ${styles.container}`}>
      <SectionHeader icon={faBullhorn} color="#d97706" title="Recomendado para ti" />

      {loading ? (
        <div className={styles.scroll}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div className={styles.skeleton} key={`skeleton-${i}`} />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <EmptyStateBox
          tone="orange"
          icon={faBullhorn}
          message="Todavía no hay negocios patrocinados."
        />
      ) : (
        <div className={styles.scroll}>
          {stores.map((store) => (
            <StoreCard
              key={store.id}
              name={store.name}
              imageUrl={store.banner_url || store.logo_url}
              rating={store.rating}
            />
          ))}
        </div>
      )}
    </div>
  );
}
