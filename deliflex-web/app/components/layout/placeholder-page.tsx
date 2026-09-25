import type { ReactNode } from "react";
import Breadcrumb from "./breadcrumb";
import styles from "./placeholder-page.module.css";

type Props = {
  title: ReactNode;
  children: ReactNode;
  breadcrumb?: { label: string; href?: string }[];
};

// Layout compartido por las paginas que todavia no tienen contenido real
// (Nosotros, Cupones, Soporte, Mi perfil, Categoria) - evita repetir el
// mismo bloque centrado en cada una. El breadcrumb es opcional porque solo
// tiene sentido en las que cuelgan de otra seccion (ej. las de /cuenta);
// Nosotros/Cupones/Soporte, que estan un nivel debajo del menu principal,
// no lo necesitan.
export default function PlaceholderPage({ title, children, breadcrumb }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {breadcrumb && (
          <div className={styles.breadcrumbWrap}>
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{children}</p>
      </div>
    </div>
  );
}
