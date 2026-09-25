"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./user-menu.module.css";
import { useCustomerProfile } from "@/app/hooks/useCustomerProfile";
import type { User } from "@/app/types/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faRightFromBracket,
  faLaptop,
  faMedal,
} from "@fortawesome/free-solid-svg-icons";

const getInitials = (nombre: string) => {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[1][0]).toUpperCase();
};

// Se pide el nivel aqui mismo (con useCustomerProfile, el mismo hook que
// usa /cuenta) para que esa informacion se vea "desde el principio" - o
// sea, apenas se abre el menu del header, sin tener que entrar a Mi Perfil
// primero.
export default function UserMenu({ user }: { user: User }) {
  const { displayName, tierName, tierColor } = useCustomerProfile(user);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const cerrarSesion = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  const cerrarSesionEnTodos = async () => {
    await fetch("/api/auth/logout-everywhere", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.avatarBtn}
        onClick={() => setOpen((v) => !v)}
        aria-label="Menú de cuenta"
      >
        {getInitials(displayName)}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{displayName}</span>
            <span className={styles.userTier} style={{ color: tierColor }}>
              <FontAwesomeIcon icon={faMedal} />
              Nivel {tierName}
            </span>
            <span className={styles.userEmail}>{user.email}</span>
          </div>

          <Link href="/cuenta" className={styles.item} onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faGear} className={styles.itemIcon} />
            Configuración
          </Link>

          <button type="button" className={styles.item} onClick={cerrarSesion}>
            <FontAwesomeIcon icon={faRightFromBracket} className={styles.itemIcon} />
            Cerrar sesión
          </button>

          <button
            type="button"
            className={`${styles.item} ${styles.itemDanger}`}
            onClick={cerrarSesionEnTodos}
          >
            <FontAwesomeIcon icon={faLaptop} className={styles.itemIcon} />
            <span>
              Cerrar sesión en todos los dispositivos
              <span className={styles.itemHint}>
                Cierra tu sesión en cualquier otro navegador o dispositivo
              </span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
