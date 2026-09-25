import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import SectionHeader from "./section-header";
import EmptyStateBox from "./empty-state-box";
import styles from "./history-row.module.css";

// Mismo estado vacio que "Historial de productos" en la home de la app
// movil (recentProducts.length === 0 -> "Aqui aparecen los productos que
// ya has pedido"): la web todavia no tiene carrito ni pedidos, asi que por
// ahora siempre se ve este mensaje.
export default function HistoryRow() {
  return (
    <div className={`page-container ${styles.container}`}>
      <SectionHeader icon={faClockRotateLeft} color="#2563eb" title="Historial de productos" />
      <EmptyStateBox
        tone="blue"
        icon={faClockRotateLeft}
        message="Aquí aparecen los productos que ya has pedido."
      />
    </div>
  );
}
