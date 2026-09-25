"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { supabase } from "@/lib/supabase";
import { getFavoriteIds, toggleFavorite } from "@/lib/favorites";
import Breadcrumb from "@/app/components/layout/breadcrumb";
import styles from "./favoritos.module.css";

type Store = {
  id: string;
  name: string;
  address: string | null;
  logo_url: string | null;
  banner_url: string | null;
};

// Igual que favorite-stores.page.tsx en la app movil: los favoritos son
// locales a este dispositivo (no hay tabla de favoritos en el backend),
// asi que se leen del almacenamiento local del navegador, no de Supabase -
// solo los detalles de cada negocio salen de la base.
export default function FavoritosPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStores = async () => {
      const favoriteIds = getFavoriteIds();

      // Aunque no haya ids, se deja correr la consulta igual (Postgrest
      // maneja bien un "in" vacio, devolviendo cero filas) en vez de
      // cortar antes del primer await - asi el unico setState sincrono
      // dentro del efecto es el de mas abajo, ya despues de esperar.
      const { data, error } = await supabase
        .from("stores")
        .select("id, name, address, logo_url, banner_url")
        .in("id", favoriteIds);

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setStores(data ?? []);
      setLoading(false);
    };

    loadStores();
  }, []);

  const handleRemove = (storeId: string) => {
    toggleFavorite(storeId);
    setStores((prev) => prev.filter((store) => store.id !== storeId));
  };

  return (
    <div className={styles.page}>
      <div className="page-container">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Mi Perfil", href: "/cuenta" },
            { label: "Favoritos" },
          ]}
        />
        <h1 className={styles.title}>Favoritos</h1>

        {loading && <p className={styles.empty}>Cargando...</p>}

        {!loading && stores.length === 0 && (
          <p className={styles.empty}>
            Todavía no tienes negocios favoritos. Guarda uno desde su página
            para verlo aquí.
          </p>
        )}

        <div className={styles.list}>
          {stores.map((store) => {
            const imageUrl = store.logo_url || store.banner_url;

            return (
              <div className={styles.card} key={store.id}>
                <div className={styles.imageWrap}>
                  {imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl} alt={store.name} className={styles.image} />
                  )}
                </div>

                <div className={styles.info}>
                  <span className={styles.name}>{store.name}</span>
                  {store.address && (
                    <span className={styles.address}>{store.address}</span>
                  )}
                </div>

                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemove(store.id)}
                  aria-label={`Quitar ${store.name} de favoritos`}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
