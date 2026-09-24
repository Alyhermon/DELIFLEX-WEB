import type { Metadata } from "next";
import PlaceholderPage from "@/app/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Centro de ayuda",
  description: "¿Necesitas ayuda con tu pedido o tu cuenta de Deliflex? Contáctanos aquí.",
};

export default function SoportePage() {
  return (
    <PlaceholderPage title="Centro de ayuda">Contenido en construcción.</PlaceholderPage>
  );
}
