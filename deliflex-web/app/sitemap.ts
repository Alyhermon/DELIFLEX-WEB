import type { MetadataRoute } from "next";

const SITE_URL = "https://deliflex.app";

// Solo las paginas publicas con contenido real. Las categorias
// (/categorias/[id]) siguen en construccion (ver page.tsx ahi) y /buscar
// no se indexa (ver robots.ts) - ninguna de las dos pertenece aqui todavia.
export default function sitemap(): MetadataRoute.Sitemap {
  const rutasEstaticas = ["", "/nosotros", "/cupones", "/soporte"];

  return rutasEstaticas.map((ruta) => ({
    url: `${SITE_URL}${ruta}`,
    lastModified: new Date(),
    changeFrequency: ruta === "" ? "daily" : "monthly",
    priority: ruta === "" ? 1 : 0.6,
  }));
}
