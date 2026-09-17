import { faHeart } from "@fortawesome/free-solid-svg-icons";
import SectionHeader from "./section-header";
import styles from "./favorites-row.module.css";

// Mismo estado vacio que "Tus Favoritos" en la home de la app movil
// (favoriteStores.length === 0 -> "Aqui aparecen tus negocios favoritos"):
// todavia no hay forma de marcar un negocio como favorito desde la web,
// asi que por ahora siempre se ve este mensaje.
export default function FavoritesRow() {
  return (
    <div className={`page-container ${styles.container}`}>
      <SectionHeader icon={faHeart} color="#e0245e" title="Tus Favoritos" />
      <p className={styles.empty}>Aquí aparecen tus negocios favoritos.</p>
    </div>
  );
}
