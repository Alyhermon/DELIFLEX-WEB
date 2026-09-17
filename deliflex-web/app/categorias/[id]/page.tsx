import { Suspense } from "react";
import PlaceholderPage from "@/app/components/layout/placeholder-page";
import CategoryHeading from "./category-heading";

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
