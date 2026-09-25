"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import SectionHeader from "@/app/components/marketing/section-header";
import EmptyStateBox from "@/app/components/marketing/empty-state-box";
import Toast from "@/app/components/components-items/toast/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGift,
  faCoins,
  faTrophy,
  faClockRotateLeft,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./delipuntos.module.css";

type PointsStatus = {
  availablePoints: number;
  currentTierName: string | null;
  currentDiscountPercent: number | null;
  currentFreeShipping: boolean | null;
  currentExclusiveAccess: boolean | null;
  nextTierName: string | null;
  nextTierMinPoints: number | null;
  pointsToNextTier: number | null;
};

type Reward = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  points_cost: number;
  stock: number | null;
  is_active: boolean;
  business_id: string | null;
  business_name: string | null;
  external_business_name: string | null;
};

type Redemption = {
  id: string;
  source: "product" | "reward";
  productName: string | null;
  productImageUrl: string | null;
  pointsSpent: number;
  status: "PENDING" | "FULFILLED" | "CANCELLED";
  redemptionCode: string;
  createdAt: string;
};

const API = process.env.NEXT_PUBLIC_API_URL;

const numero = (valor: number) => valor.toLocaleString("es-DO");

const fecha = (iso: string) =>
  new Date(iso).toLocaleDateString("es-DO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const ESTADO_LABELS: Record<Redemption["status"], string> = {
  PENDING: "Por recoger",
  FULFILLED: "Entregado",
  CANCELLED: "Cancelado",
};

export default function DeliPuntosPage() {
  const { user, loading: authLoading } = useAuth();

  const [status, setStatus] = useState<PointsStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [rewardsLoading, setRewardsLoading] = useState(true);

  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [redemptionsLoading, setRedemptionsLoading] = useState(true);

  const [rewardToRedeem, setRewardToRedeem] = useState<Reward | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState("");

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(
    null,
  );

  const cargarStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/delipuntos/me");
      const data = await res.json();
      setStatus(res.ok ? data : null);
    } catch (error) {
      console.error(error);
    } finally {
      setStatusLoading(false);
    }
  }, []);

  const cargarRedemptions = useCallback(async () => {
    try {
      const res = await fetch("/api/delipuntos/redemptions");
      const data = await res.json();
      setRedemptions(res.ok && Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setRedemptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading || !user) return;

    let cancelado = false;

    fetch("/api/delipuntos/me")
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!cancelado) setStatus(ok ? data : null);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        if (!cancelado) setStatusLoading(false);
      });

    fetch("/api/delipuntos/redemptions")
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!cancelado) setRedemptions(ok && Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        if (!cancelado) setRedemptionsLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, [authLoading, user]);

  useEffect(() => {
    let cancelado = false;

    fetch(`${API}/delipuntos/rewards`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelado) setRewards(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        if (!cancelado) setRewardsLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, []);

  // Al cliente solo le mostramos lo que de verdad puede canjear ahora
  // mismo: el admin ve las inactivas/agotadas para poder reactivarlas o
  // reponer stock, pero aca solo estorbarian.
  const rewardsDisponibles = rewards.filter(
    (r) => r.is_active && (r.stock === null || r.stock > 0),
  );

  const abrirConfirmacion = (reward: Reward) => {
    setRedeemError("");
    setRewardToRedeem(reward);
  };

  const confirmarCanje = async () => {
    if (!rewardToRedeem) return;

    setRedeeming(true);
    setRedeemError("");

    try {
      const res = await fetch("/api/delipuntos/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId: rewardToRedeem.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "No se pudo registrar el canje");
      }

      setRewardToRedeem(null);
      setToast({
        message: `¡Canje enviado! Código ${data.redemptionCode}`,
        type: "success",
      });
      await Promise.all([cargarStatus(), cargarRedemptions()]);
    } catch (error) {
      setRedeemError(
        error instanceof Error ? error.message : "No se pudo registrar el canje",
      );
    } finally {
      setRedeeming(false);
    }
  };

  if (authLoading) {
    return <div className={styles.page} />;
  }

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={`page-container ${styles.container}`}>
          <EmptyStateBox
            tone="orange"
            icon={faCoins}
            message="Inicia sesión para ver tus DeliPuntos y el Marketplace."
          />
        </div>
      </div>
    );
  }

  const saldoInsuficiente =
    rewardToRedeem != null &&
    status != null &&
    status.availablePoints < rewardToRedeem.points_cost;

  return (
    <div className={styles.page}>
      <div className={`page-container ${styles.container}`}>
        <h1 className={styles.title}>Mis DeliPuntos</h1>

        <div className={styles.balanceCard}>
          <div className={styles.balanceMain}>
            <span className={styles.balanceIcon}>
              <FontAwesomeIcon icon={faCoins} />
            </span>
            <div>
              {statusLoading ? (
                <span className={styles.balanceNumber}>...</span>
              ) : (
                <span className={styles.balanceNumber}>
                  {numero(status?.availablePoints ?? 0)}
                </span>
              )}
              <span className={styles.balanceLabel}>DeliPuntos disponibles</span>
            </div>
          </div>

          {!statusLoading && status?.currentTierName && (
            <div className={styles.tierInfo}>
              <span className={styles.tierBadge}>
                <FontAwesomeIcon icon={faTrophy} /> Nivel {status.currentTierName}
              </span>
              {status.nextTierName ? (
                <span className={styles.tierHint}>
                  Te faltan {numero(status.pointsToNextTier ?? 0)} puntos para llegar a{" "}
                  {status.nextTierName}
                </span>
              ) : (
                <span className={styles.tierHint}>Ya estás en el nivel máximo</span>
              )}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <SectionHeader icon={faGift} color="#e35433" title="Marketplace" />

          {rewardsLoading ? (
            <p className={styles.hint}>Cargando recompensas...</p>
          ) : rewardsDisponibles.length === 0 ? (
            <EmptyStateBox
              tone="orange"
              icon={faGift}
              message="Todavía no hay recompensas disponibles en el Marketplace."
            />
          ) : (
            <div className={styles.grid}>
              {rewardsDisponibles.map((reward) => {
                const alcanza = (status?.availablePoints ?? 0) >= reward.points_cost;

                return (
                  <div key={reward.id} className={styles.card}>
                    <div className={styles.cardImage}>
                      {reward.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={reward.image_url} alt={reward.name} />
                      ) : (
                        <FontAwesomeIcon icon={faGift} />
                      )}
                    </div>

                    <div className={styles.cardBody}>
                      <h3 className={styles.cardTitle}>{reward.name}</h3>

                      <span className={styles.sourceBadge}>
                        {reward.business_id
                          ? reward.business_name
                          : (reward.external_business_name ?? "Deliflex")}
                      </span>

                      {reward.description && (
                        <p className={styles.cardDescription}>{reward.description}</p>
                      )}

                      <div className={styles.cardFoot}>
                        <span className={styles.pointsCost}>
                          <FontAwesomeIcon icon={faCoins} /> {numero(reward.points_cost)} pts
                        </span>

                        <button
                          type="button"
                          className={styles.redeemBtn}
                          disabled={!alcanza}
                          onClick={() => abrirConfirmacion(reward)}
                        >
                          Canjear
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <SectionHeader icon={faClockRotateLeft} color="#7a3ea1" title="Historial de canjes" />

          {redemptionsLoading ? (
            <p className={styles.hint}>Cargando...</p>
          ) : redemptions.length === 0 ? (
            <EmptyStateBox
              tone="orange"
              icon={faClockRotateLeft}
              message="Aún no has hecho ningún canje."
            />
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Recompensa</th>
                    <th>Puntos</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {redemptions.map((r) => (
                    <tr key={r.id}>
                      <td>{r.redemptionCode}</td>
                      <td>{r.productName ?? "Producto eliminado"}</td>
                      <td>{numero(r.pointsSpent)}</td>
                      <td>
                        <span
                          className={`${styles.statusPill} ${
                            r.status === "FULFILLED"
                              ? styles.statusActive
                              : r.status === "CANCELLED"
                                ? styles.statusInactive
                                : styles.statusPending
                          }`}
                        >
                          {ESTADO_LABELS[r.status]}
                        </span>
                      </td>
                      <td>{fecha(r.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {rewardToRedeem && (
        <div
          className={styles.overlay}
          onClick={(e) => {
            if (e.target === e.currentTarget && !redeeming) setRewardToRedeem(null);
          }}
        >
          <div className={styles.confirmCard}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setRewardToRedeem(null)}
              disabled={redeeming}
              aria-label="Cerrar"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>

            <h2 className={styles.confirmTitle}>Confirmar canje</h2>
            <p className={styles.confirmText}>
              Vas a canjear <strong>{rewardToRedeem.name}</strong> por{" "}
              <strong>{numero(rewardToRedeem.points_cost)} DeliPuntos</strong>.
            </p>

            {saldoInsuficiente && (
              <p className={styles.errorText}>No tienes suficientes DeliPuntos.</p>
            )}
            {redeemError && <p className={styles.errorText}>{redeemError}</p>}

            <button
              type="button"
              className={styles.confirmBtn}
              onClick={confirmarCanje}
              disabled={redeeming || saldoInsuficiente}
            >
              {redeeming ? "Enviando..." : "Confirmar canje"}
            </button>
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
