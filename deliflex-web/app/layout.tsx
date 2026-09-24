import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import SupportWidget from "./components/support/support-widget";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

config.autoAddCss = false;

// deliflex.app es el dominio real (www.deliflex.app solo redirige hacia
// aca) - un canonical/OG apuntando al que redirige en vez del destino
// final le resta señal a Google, asi que la base tiene que ser este.
const SITE_URL = "https://deliflex.app";
const SITE_DESCRIPTION =
  "Pide comida, mercado, farmacia y mucho más a domicilio en República Dominicana con Deliflex. Restaurantes, heladerías y negocios favoritos a un clic de tu puerta.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Deliflex | Pide comida y más a domicilio en RD",
    template: "%s | Deliflex",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Deliflex",
  keywords: [
    "delivery República Dominicana",
    "pedir comida a domicilio",
    "restaurantes cerca de mi",
    "Deliflex",
    "app de delivery RD",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    siteName: "Deliflex",
    title: "Deliflex | Pide comida y más a domicilio en RD",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "es_DO",
    images: [
      {
        url: "/images/brand/banner-main.jpg",
        width: 1024,
        height: 747,
        alt: "Deliflex",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Deliflex | Pide comida y más a domicilio en RD",
    description: SITE_DESCRIPTION,
    images: ["/images/brand/banner-main.jpg"],
  },
};

// Le dice a Google que Deliflex es un negocio real (no solo una pagina
// mas) y que hay una caja de busqueda interna - ambas cosas pueden
// destrabar resultados enriquecidos (sitelinks, logo) en el buscador.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Deliflex",
      url: SITE_URL,
      logo: `${SITE_URL}/images/brand/logo.png`,
    },
    {
      "@type": "WebSite",
      name: "Deliflex",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/buscar?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <SupportWidget />
      </body>
    </html>
  );
}
