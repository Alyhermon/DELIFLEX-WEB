import PlaceholderPage from "@/app/components/layout/placeholder-page";

export default function PremiumPage() {
  return (
    <PlaceholderPage
      title="Deliflex Premium"
      breadcrumb={[
        { label: "Inicio", href: "/" },
        { label: "Mi Perfil", href: "/cuenta" },
        { label: "Premium" },
      ]}
    >
      Contenido en construcción.
    </PlaceholderPage>
  );
}
