import PlaceholderPage from "@/app/components/layout/placeholder-page";

export default function BilleteraPage() {
  return (
    <PlaceholderPage
      title="Mi Billetera"
      breadcrumb={[
        { label: "Inicio", href: "/" },
        { label: "Mi Perfil", href: "/cuenta" },
        { label: "Mi Billetera" },
      ]}
    >
      Contenido en construcción.
    </PlaceholderPage>
  );
}
