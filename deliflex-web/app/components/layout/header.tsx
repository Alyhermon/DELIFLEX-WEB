"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./header.module.css";
import { useAuth } from "@/app/hooks/useAuth";
import LocationPicker from "./location-picker";
import UserMenu from "./user-menu";
import AuthModal from "@/app/components/auth/auth-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCircleInfo,
  faTags,
  faHeadset,
  faUser,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";

// Mismas 4 secciones que las pestañas de la app movil (Inicio, Ofertas,
// Soporte, Mi perfil - ver App.tsx del repo frontend), mas "Nosotros" que
// no existe en la app pero tiene sentido en la web publica.
const NAV_ITEMS = [
  { href: "/", label: "Home", icon: faHouse },
  { href: "/nosotros", label: "Nosotros", icon: faCircleInfo },
  { href: "/cupones", label: "Cupones", icon: faTags },
  { href: "/soporte", label: "Soporte", icon: faHeadset },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [query, setQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/buscar?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className={styles.header}>
      <div className={`page-container ${styles.bar}`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoText}>Deliflex</span>
          </Link>
          <LocationPicker />
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.link} ${active ? styles.active : ""}`}
              >
                <FontAwesomeIcon icon={item.icon} className={styles.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {!loading && (user ? (
          <UserMenu user={user} />
        ) : (
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className={`${styles.link} ${styles.profileLink}`}
          >
            <FontAwesomeIcon icon={faUser} className={styles.icon} />
            <span>Iniciar sesión</span>
          </button>
        ))}
      </div>

      <div className={`page-container ${styles.searchRow}`}>
        <form className={styles.searchBox} onSubmit={handleSearch}>
          <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Busca restaurantes, mercados, productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </header>
  );
}
