import type { Metadata } from "next";
import PlaceholderPage from "@/app/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce Deliflex, la app dominicana de delivery que conecta a sus usuarios con restaurantes, mercados, farmacias y más.",
};

export default function NosotrosPage() {
  return <PlaceholderPage title="Nosotros">Contenido en construcción.</PlaceholderPage>;
}
