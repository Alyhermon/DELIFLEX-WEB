import { Suspense } from "react";
import SearchResults from "./search-results";

export default function BuscarPage() {
  return (
    <Suspense fallback={null}>
      <SearchResults />
    </Suspense>
  );
}
