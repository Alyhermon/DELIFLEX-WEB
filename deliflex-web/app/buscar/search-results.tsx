"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatMoney } from "@/lib/currency";
import styles from "./search-results.module.css";

type Store = {
  id: string;
  name: string;
  logo_url: string | null;
  banner_url: string | null;
};

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  store_name?: string;
};

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Misma logica que search.page.tsx en la app movil: busca en stores y
  // products en paralelo, y a los productos les pega el nombre del negocio
  // al que pertenecen para poder mostrarlo en la tarjeta.
  useEffect(() => {
    let cancelled = false;

    const runSearch = async () => {
      if (!query) {
        setStores([]);
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      const [storesResponse, productsResponse] = await Promise.all([
        supabase
          .from("stores")
          .select("id, name, logo_url, banner_url")
          .eq("status", "ACTIVE")
          .ilike("name", `%${query}%`),
        supabase
          .from("products")
          .select("id, name, price, image_url, store_id")
          .ilike("name", `%${query}%`),
      ]);

      if (cancelled) return;

      if (storesResponse.error) console.error(storesResponse.error);
      if (productsResponse.error) console.error(productsResponse.error);

      const matchedProducts = productsResponse.data ?? [];
      const storeIds = [...new Set(matchedProducts.map((p) => p.store_id))];

      const productStoresResponse =
        storeIds.length > 0
          ? await supabase
              .from("stores")
              .select("id, name")
              .eq("status", "ACTIVE")
              .in("id", storeIds)
          : { data: [] as { id: string; name: string }[], error: null };

      if (cancelled) return;

      const storeById = new Map(
        (productStoresResponse.data ?? []).map((s) => [s.id, s.name]),
      );

      setStores(storesResponse.data ?? []);
      setProducts(
        matchedProducts
          .filter((p) => storeById.has(p.store_id))
          .map((p) => ({ ...p, store_name: storeById.get(p.store_id) })),
      );
      setLoading(false);
    };

    runSearch();

    return () => {
      cancelled = true;
    };
  }, [query]);

  const hasResults = stores.length > 0 || products.length > 0;

  return (
    <div className={`page-container ${styles.container}`}>
      <h1 className={styles.header}>
        {query ? `Resultados para "${query}"` : "Busca un negocio o producto"}
      </h1>

      {loading && <p className={styles.empty}>Buscando...</p>}

      {!loading && query && !hasResults && (
        <p className={styles.empty}>
          No encontramos negocios ni productos para &quot;{query}&quot;.
        </p>
      )}

      {stores.length > 0 && (
        <section>
          <h2 className={styles.sectionTitle}>Negocios</h2>
          <div className={styles.grid}>
            {stores.map((store) => {
              const imageUrl = store.banner_url || store.logo_url;

              return (
                <div className={styles.card} key={store.id}>
                  <div className={styles.cardImage}>
                    {imageUrl && (
                      // Los negocios pueden tener la imagen en cualquier
                      // dominio (datos de prueba con URLs de sitios
                      // externos), asi que next/image no sirve aqui: exige
                      // lista blanca de hosts y no podemos predecir todos.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt={store.name} className={styles.image} />
                    )}
                  </div>
                  <span className={styles.cardTitle}>{store.name}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section>
          <h2 className={styles.sectionTitle}>Productos</h2>
          <div className={styles.grid}>
            {products.map((product) => (
              <div className={styles.card} key={product.id}>
                <div className={styles.cardImage}>
                  {product.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className={styles.image}
                    />
                  )}
                </div>
                <span className={styles.cardTitle}>{product.name}</span>
                {product.store_name && (
                  <span className={styles.cardSubtitle}>{product.store_name}</span>
                )}
                <span className={styles.cardPrice}>{formatMoney(product.price)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
