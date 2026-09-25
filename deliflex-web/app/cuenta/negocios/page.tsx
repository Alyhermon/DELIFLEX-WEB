import PlaceholderPage from "@/app/components/layout/placeholder-page";

export default function MisNegociosPage() {
  return (
    <PlaceholderPage
      title="Mis Negocios"
      breadcrumb={[
        { label: "Inicio", href: "/" },
        { label: "Mi Perfil", href: "/cuenta" },
        { label: "Mis Negocios" },
      ]}
    >
      Contenido en construcción.
    </PlaceholderPage>
  );
}
