import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import styles from "./section-list.module.css";

export type SectionItem = {
  id: string;
  name: string;
  icon: IconDefinition;
  href?: string;
  onClick?: () => void;
};

type Props = {
  title: string;
  items: SectionItem[];
};

// Mismo patron que "Perfil" / "Actividad" / "Configuración" en la home de
// profile.page.tsx: un titulo de seccion y una lista de filas con icono +
// nombre + flecha. Los items sin href ni onClick quedan sin interaccion,
// igual que "Mi Dirección" o "Notificaciones" en la app movil (todavia no
// tienen pantalla propia ahi tampoco).
export default function SectionList({ title, items }: Props) {
  return (
    <div className={styles.section}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.list}>
        {items.map((item) => {
          const content = (
            <>
              <span className={styles.itemLeft}>
                <FontAwesomeIcon icon={item.icon} className={styles.itemIcon} />
                <span className={styles.itemName}>{item.name}</span>
              </span>
              {(item.href || item.onClick) && (
                <FontAwesomeIcon icon={faChevronRight} className={styles.chevron} />
              )}
            </>
          );

          if (item.href) {
            return (
              <Link key={item.id} href={item.href} className={styles.item}>
                {content}
              </Link>
            );
          }

          if (item.onClick) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className={styles.item}
              >
                {content}
              </button>
            );
          }

          return (
            <div key={item.id} className={`${styles.item} ${styles.itemStatic}`}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
