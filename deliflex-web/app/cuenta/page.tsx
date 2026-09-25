"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMedal,
  faLocationDot,
  faCreditCard,
  faTrophy,
  faStar,
  faUserPen,
  faShop,
  faLocationPinLock,
  faBrain,
  faList,
  faGamepad,
  faCoins,
  faWallet,
  faStore,
  faBell,
  faHeadset,
  faGlobe,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/app/hooks/useAuth";
import { useCustomerProfile } from "@/app/hooks/useCustomerProfile";
import Breadcrumb from "@/app/components/layout/breadcrumb";
import SectionList from "@/app/components/account/section-list";
import styles from "./page.module.css";

export default function CuentaPage() {
  const { user, loading: authLoading } = useAuth();
  const { displayName, tierName, tierColor, totalPoints, loading: profileLoading } =
    useCustomerProfile(user);

  if (authLoading || profileLoading) {
    return <div className={styles.page} />;
  }

  return (
    <div className={styles.page}>
      <div className="page-container">
        <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Mi Perfil" }]} />

        {/* Compacto a proposito: el avatar y el nivel ya se ven apenas se
            abre el menu del header (ver UserMenu) - repetirlos aqui en
            grande solo era espacio perdido antes de llegar a lo que
            realmente se usa en esta pantalla. */}
        <div className={styles.header}>
          <h1 className={styles.name}>{displayName}</h1>
          <span className={styles.tier} style={{ color: tierColor }}>
            <FontAwesomeIcon icon={faMedal} />
            Nivel {tierName}
          </span>
        </div>

        {/* Tarjetas horizontales en vez del carrusel de iconos apilados de
            la app movil - en web hay espacio de sobra para mostrar el dato
            (ej. la cantidad de DeliPuntos) sin tener que entrar a cada una. */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>
              <FontAwesomeIcon icon={faLocationDot} />
            </span>
            <div>
              <p className={styles.statLabel}>Mi Dirección</p>
              <p className={styles.statValue}>Sin definir</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <span className={styles.statIcon}>
              <FontAwesomeIcon icon={faCreditCard} />
            </span>
            <div>
              <p className={styles.statLabel}>Mis Tarjetas</p>
              <p className={styles.statValue}>Sin tarjetas</p>
            </div>
          </div>

          <Link className={styles.statCard} href="/cuenta/premium">
            <span className={styles.statIcon}>
              <FontAwesomeIcon icon={faTrophy} />
            </span>
            <div>
              <p className={styles.statLabel}>Premium</p>
              <p className={styles.statValue}>Ver planes</p>
            </div>
          </Link>

          <Link className={styles.statCard} href="/delipuntos">
            <span className={styles.statIcon}>
              <FontAwesomeIcon icon={faStar} />
            </span>
            <div>
              <p className={styles.statLabel}>DeliPuntos</p>
              <p className={styles.statValue}>{totalPoints}</p>
            </div>
          </Link>
        </div>

        <SectionList
          title="Perfil"
          items={[
            { id: "editar", name: "Editar Perfil", icon: faUserPen, href: "/cuenta/editar" },
            { id: "negocios", name: "Mis Negocios", icon: faShop, href: "/cuenta/negocios" },
            { id: "direcciones", name: "Direcciones Guardadas", icon: faLocationPinLock },
            { id: "preferencias", name: "Preferencias Inteligentes", icon: faBrain },
          ]}
        />

        <SectionList
          title="Actividad"
          items={[
            { id: "pedidos", name: "Historial de Pedidos", icon: faList, href: "/cuenta/pedidos" },
            { id: "favoritos", name: "Favoritos", icon: faStar, href: "/cuenta/favoritos" },
            {
              id: "gamificacion",
              name: "Gamificación Deliflex",
              icon: faGamepad,
              href: "/cuenta/gamificacion",
            },
            { id: "credito", name: "Crédito Deliflex", icon: faCoins, href: "/cuenta/credito" },
            { id: "billetera", name: "Mi Billetera", icon: faWallet, href: "/cuenta/billetera" },
          ]}
        />

        <SectionList
          title="Configuración"
          items={[
            {
              id: "registrar-negocio",
              name: "Registrar Negocio",
              icon: faStore,
              href: "/cuenta/registrar-negocio",
            },
            { id: "notificaciones", name: "Notificaciones", icon: faBell },
            { id: "ayuda", name: "Centro de Ayuda", icon: faHeadset, href: "/soporte" },
            { id: "idioma", name: "Idioma y Región", icon: faGlobe },
            {
              id: "logout",
              name: "Cerrar Sesión",
              icon: faArrowUpRightFromSquare,
              onClick: async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/";
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
