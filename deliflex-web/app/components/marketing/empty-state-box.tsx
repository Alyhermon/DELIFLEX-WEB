import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import styles from "./empty-state-box.module.css";

type Tone = "orange" | "blue" | "pink";

type Props = {
  tone: Tone;
  icon: IconDefinition;
  message: string;
};

// Contenedor pastel para cuando una seccion del home (Favoritos, Historial,
// Recomendado) todavia no tiene nada que mostrar - en vez de un simple
// texto gris, un color suave de fondo que combine con el icono de la
// seccion hace que se vea intencional y no como un espacio roto/vacio.
export default function EmptyStateBox({ tone, icon, message }: Props) {
  return (
    <div className={`${styles.box} ${styles[tone]}`}>
      <span className={styles.iconCircle}>
        <FontAwesomeIcon icon={icon} />
      </span>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
