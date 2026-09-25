import HeroBanner from "@/app/components/marketing/hero-banner";
import CategoriesRow from "@/app/components/marketing/categories-row";
import FavoritesRow from "@/app/components/marketing/favorites-row";
import HistoryRow from "@/app/components/marketing/history-row";
import RecommendedRow from "@/app/components/marketing/recommended-row";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <HeroBanner />
      <CategoriesRow />
      <FavoritesRow />
      <HistoryRow />
      <RecommendedRow />
    </div>
  );
}
