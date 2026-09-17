import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import styles from "./section-header.module.css";

type Props = {
  icon: IconDefinition;
  color: string;
  title: string;
};

// Mismo patron que HomeSectionHeader en la app movil: una insignia
// circular de color + titulo, para distinguir cada seccion del home de un
// vistazo aunque compartan el mismo formato de tarjetas/lista.
export default function SectionHeader({ icon, color, title }: Props) {
  return (
    <div className={styles.header}>
      <span className={styles.badge} style={{ backgroundColor: color }}>
        <FontAwesomeIcon icon={icon} />
      </span>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}
