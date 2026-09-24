import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /cuenta es privado (perfil del cliente), /buscar son resultados
        // parametrizados sin valor propio para indexar, /core/login ya no
        // se usa (el login ahora es un modal), y /api son rutas de backend.
        disallow: ["/cuenta", "/buscar", "/core/login", "/api"],
      },
    ],
    sitemap: "https://deliflex.app/sitemap.xml",
  };
}
