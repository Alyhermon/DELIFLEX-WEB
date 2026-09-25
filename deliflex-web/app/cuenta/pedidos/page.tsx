"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { formatMoney } from "@/lib/currency";
import Breadcrumb from "@/app/components/layout/breadcrumb";
import styles from "./pedidos.module.css";

type OrderItem = {
  product_id: string;
  product_name: string;
  image_url: string | null;
  quantity: number;
  subtotal: number;
};

type Order = {
  order_id: string;
  order_code: string;
  status: string;
  total: number;
  created_at: string;
  store_id: string;
  store_name: string;
  store_logo_url: string | null;
  store_banner_url: string | null;
  items: OrderItem[];
};

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: "Pendiente", color: "#B8860B", bg: "#FBF0D9" },
  ACCEPTED: { label: "Aceptado", color: "#2563EB", bg: "#DBEAFE" },
  PREPARING: { label: "En preparación", color: "#2563EB", bg: "#DBEAFE" },
  READY_FOR_PICKUP: { label: "Listo para retirar", color: "#4A8C3F", bg: "#DCFCE7" },
  ON_THE_WAY: { label: "En camino", color: "#4A8C3F", bg: "#DCFCE7" },
  DELIVERED: { label: "Entregado", color: "#4A8C3F", bg: "#DCFCE7" },
  CANCELLED: { label: "Cancelado", color: "#C50D0D", bg: "#FEE2E2" },
};

const FILTERS = [
  { id: "all", name: "Todos", statuses: null as string[] | null },
  { id: "on_the_way", name: "En camino", statuses: ["ON_THE_WAY", "READY_FOR_PICKUP"] },
  { id: "delivered", name: "Entregados", statuses: ["DELIVERED"] },
  { id: "preparing", name: "En Preparación", statuses: ["PENDING", "ACCEPTED", "PREPARING"] },
  { id: "cancelled", name: "Cancelados", statuses: ["CANCELLED"] },
];

const fechaHora = (iso: string) =>
  new Date(iso).toLocaleString("es-DO", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

export default function PedidosPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  // Mismo RPC que historial.page.tsx en la app movil: get_order_history,
  // con el id de usuario que ya trae useAuth() en vez de AsyncStorage.
  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc("get_order_history", {
        p_customer_id: user.id,
      });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setOrders(data ?? []);
      setLoading(false);
    };

    loadOrders();
  }, [user]);

  const filter = FILTERS.find((f) => f.id === activeFilter);
  const visibleOrders = filter?.statuses
    ? orders.filter((order) => filter.statuses!.includes(order.status))
    : orders;

  if (authLoading || loading) {
    return <div className={styles.page} />;
  }

  return (
    <div className={styles.page}>
      <div className="page-container">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Mi Perfil", href: "/cuenta" },
            { label: "Historial de Pedidos" },
          ]}
        />
        <h1 className={styles.title}>Historial de Pedidos</h1>

        <div className={styles.filters}>
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.filterButton} ${
                activeFilter === item.id ? styles.filterButtonActive : ""
              }`}
              onClick={() => setActiveFilter(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>

        {visibleOrders.length === 0 && (
          <p className={styles.empty}>No tienes pedidos en esta categoría todavía.</p>
        )}

        <div className={styles.list}>
          {visibleOrders.map((order) => {
            const meta = STATUS_META[order.status] ?? STATUS_META.PENDING;
            const storeImage = order.store_logo_url || order.store_banner_url;

            return (
              <div className={styles.card} key={order.order_id}>
                <div className={styles.cardHeader}>
                  <div className={styles.storeImageWrap}>
                    {storeImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={storeImage}
                        alt={order.store_name}
                        className={styles.storeImage}
                      />
                    )}
                  </div>

                  <div className={styles.storeInfo}>
                    <span className={styles.storeName}>{order.store_name}</span>
                    <span className={styles.orderDate}>
                      {order.order_code} · {fechaHora(order.created_at)}
                    </span>
                  </div>

                  <span
                    className={styles.statusBadge}
                    style={{ background: meta.bg, color: meta.color }}
                  >
                    {meta.label}
                  </span>
                </div>

                <div className={styles.divider} />

                <div className={styles.itemsList}>
                  {order.items.map((item) => (
                    <div className={styles.itemRow} key={item.product_id}>
                      <div className={styles.itemImageWrap}>
                        {item.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image_url}
                            alt={item.product_name}
                            className={styles.itemImage}
                          />
                        )}
                      </div>
                      <span className={styles.itemName}>
                        {item.quantity}x {item.product_name}
                      </span>
                      <span className={styles.itemPrice}>
                        {formatMoney(item.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.divider} />

                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span>{formatMoney(order.total)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
