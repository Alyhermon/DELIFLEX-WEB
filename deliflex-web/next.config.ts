import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Sin esto, Turbopack sube directorios buscando un lockfile y encuentra
  // uno suelto en C:\Users\Alina (ajeno a este proyecto), lo toma como raiz
  // del monorepo y a veces resuelve mal los paquetes de node_modules -
  // sintoma: "Module not found" que aparece y desaparece solo entre
  // recompilaciones, sin haber cambiado nada.
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      { hostname: "localhost" },
      // Mismo proyecto Supabase que usa deliflex-admin y la app movil
      // (fotos de negocios, productos, avatares, etc.).
      { hostname: "qiokcjzdqqsgapgqlnlu.supabase.co" },
    ],
  },
};

export default nextConfig;
