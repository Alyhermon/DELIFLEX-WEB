import { Suspense } from "react";
import type { Metadata } from "next";
import SearchResults from "./search-results";

export const metadata: Metadata = {
  title: "Buscar",
  // Pagina de resultados parametrizada (?q=...), no un contenido propio
  // que valga la pena posicionar - ver tambien el disallow en robots.ts.
  robots: { index: false, follow: true },
};

export default function BuscarPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  );
}
