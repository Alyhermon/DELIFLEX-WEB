import type { ReactNode } from "react";
import styles from "./placeholder-page.module.css";

type Props = {
  title: ReactNode;
  children: ReactNode;
};

// Layout compartido por las paginas que todavia no tienen contenido real
// (Nosotros, Cupones, Soporte, Mi perfil, Categoria) - evita repetir el
// mismo bloque centrado en cada una.
export default function PlaceholderPage({ title, children }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{children}</p>
      </div>
    </div>
  );
}
