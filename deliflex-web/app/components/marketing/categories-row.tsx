"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faBasketShopping,
  faKitMedical,
  faMugHot,
  faIceCream,
  faCookie,
  faStore,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./categories-row.module.css";

// Mismo mapeo que CATEGORY_ICONS en home.tsx de la app movil: el nombre
// de categoria viene tal cual de stores_categories, sin un campo de icono
// propio en la tabla, asi que hay que traducirlo a mano.
const CATEGORY_ICONS: Record<string, IconDefinition> = {
  Restaurante: faUtensils,
  Mercado: faBasketShopping,
  Farmacias: faKitMedical,
  Cafeteria: faMugHot,
  Heladeria: faIceCream,
  Reposteria: faCookie,
};

type Category = {
  id: string;
  name: string;
  icon: IconDefinition;
};

export default function CategoriesRow() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const { data, error } = await supabase
        .from("stores_categories")
        .select("id, category_name")
        .eq("is_active", true)
        .order("code");

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setCategories(
        (data ?? []).map((item) => ({
          id: item.id,
          name: item.category_name,
          icon: CATEGORY_ICONS[item.category_name] ?? faStore,
        })),
      );
      setLoading(false);
    };

    loadCategories();
  }, []);

  return (
    <div className={`page-container ${styles.container}`}>
      <div className={styles.scroll}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div className={styles.item} key={`skeleton-${i}`}>
                <div className={styles.circleSkeleton} />
                <div className={styles.labelSkeleton} />
              </div>
            ))
          : categories.map((category) => (
              <Link
                href={`/categorias/${category.id}?nombre=${encodeURIComponent(category.name)}`}
                className={styles.item}
                key={category.id}
              >
                <span className={styles.circle}>
                  <FontAwesomeIcon icon={category.icon} />
                </span>
                <span className={styles.label}>{category.name}</span>
              </Link>
            ))}
      </div>
    </div>
  );
}
