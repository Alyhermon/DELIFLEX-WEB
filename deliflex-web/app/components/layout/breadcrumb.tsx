import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./breadcrumb.module.css";

type Crumb = {
  label: string;
  href?: string;
};

// En movil no hace falta esto (siempre hay una flecha de "atras" nativa),
// pero en la web alguien puede llegar a "Editar Perfil" por un link
// directo o refrescando la pagina - sin esto no tiene como saber que esta
// dentro de "Mi Perfil" ni volver ahi sin usar el boton atras del navegador.
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} style={{ display: "contents" }}>
            {index > 0 && (
              <FontAwesomeIcon icon={faChevronRight} className={styles.separator} />
            )}
            {item.href && !isLast ? (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? styles.current : undefined}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
