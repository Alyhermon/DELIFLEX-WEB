import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import styles from "./store-card.module.css";

type Props = {
  name: string;
  imageUrl: string | null;
  rating?: number | null;
};

// Tarjeta compartida por las filas horizontales del home (Recomendado,
// mas adelante Favoritos/Historial con datos reales) - mismo formato que
// DFFavoriteTop en la app movil: imagen, nombre, estrella.
export default function StoreCard({ name, imageUrl, rating }: Props) {
  return (
    <Link href={`/buscar?q=${encodeURIComponent(name)}`} className={styles.card}>
      <div className={styles.image}>
        {imageUrl && (
          // El banner/logo de un negocio puede estar en cualquier dominio
          // (datos de prueba con URLs externas) - next/image exige lista
          // blanca de hosts, asi que un <img> normal es mas robusto aqui.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name} className={styles.img} />
        )}
      </div>
      <div className={styles.info}>
        <span className={styles.name}>{name}</span>
        {typeof rating === "number" && rating > 0 && (
          <span className={styles.rating}>
            <FontAwesomeIcon icon={faStar} className={styles.starIcon} />
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    </Link>
  );
}
