"use client";

import { useSearchParams } from "next/navigation";

export default function CategoryHeading() {
  const nombre = useSearchParams().get("nombre");
  return <>{nombre ?? "Categoría"}</>;
}
