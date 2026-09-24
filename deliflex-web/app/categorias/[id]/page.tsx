import { Suspense } from "react";
import type { Metadata } from "next";
import PlaceholderPage from "@/app/components/layout/placeholder-page";
import CategoryHeading from "./category-heading";

type Props = {
  searchParams: Promise<{ nombre?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { nombre } = await searchParams;

  return {
    title: nombre ?? "Categoría",
    description: nombre
      ? `Descubre los mejores negocios de ${nombre} cerca de ti en Deliflex.`
      : "Descubre negocios cerca de ti en Deliflex.",
    // Esta pantalla todavia esta en construccion (ver el mensaje de abajo):
    // no tiene sentido que Google indexe una pagina sin listado real
    // todavia - se saca este "noindex" el dia que muestre negocios de verdad.
    robots: { index: false, follow: true },
  };
}

export default function CategoriaPage() {
  return (
    <PlaceholderPage
      title={
        <Suspense fallback="Categoría">
          <CategoryHeading />
        </Suspense>
      }
    >
      Pronto vas a poder ver aquí los negocios de esta categoría.
    </PlaceholderPage>
  );
}
