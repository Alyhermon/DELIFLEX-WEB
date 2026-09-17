"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./hero-banner.module.css";

type Slide = {
  type: "static" | "sponsored";
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
};

// Mismas imagenes estaticas que el carrusel de la home en la app movil
// (banner.component.tsx -> assets/imgBanner/*), como respaldo cuando no
// hay ningun negocio pagando por un banner patrocinado ahora mismo. Cada
// una con su propio texto (no tiene sentido repetir el mismo anuncio en
// las 4).
const STATIC_SLIDES: Slide[] = [
  {
    type: "static",
    src: "/images/banner/deli.png",
    alt: "Deliflex",
    title: "Pide con Deliflex",
    subtitle: "Tus restaurantes y negocios favoritos a un clic de distancia.",
    ctaLabel: "Explorar",
    ctaHref: "/buscar",
  },
  {
    type: "static",
    src: "/images/banner/cocorao-restaurant.png",
    alt: "Cocorao Restaurant",
    title: "Cocorao Restaurant",
    subtitle:
      "Disfruta la mejor experiencia gastronómica dominicana con platos únicos y ambiente elegante.",
    ctaLabel: "Ver Restaurante",
    ctaHref: "/buscar?q=Cocorao",
  },
  {
    type: "static",
    src: "/images/banner/delidelivery.png",
    alt: "Deli Delivery",
    title: "Entrega rápida y segura",
    subtitle: "Tu pedido llega caliente y a tiempo, siempre.",
    ctaLabel: "Ordena ahora",
    ctaHref: "/buscar",
  },
  {
    type: "static",
    src: "/images/banner/banner2Cocorao.png",
    alt: "Cocorao",
    title: "Descubre nuevos sabores",
    subtitle: "Explora restaurantes, mercados y mucho más en Deliflex.",
    ctaLabel: "Explorar",
    ctaHref: "/buscar",
  },
];

const AUTOPLAY_MS = 7000;

export default function HeroBanner() {
  const [slides, setSlides] = useState<Slide[]>(STATIC_SLIDES);
  const [index, setIndex] = useState(0);

  // Misma vista que consulta la app movil: active_banner_sponsor (negocios
  // que pagaron por salir destacados ahora mismo). Los patrocinados van
  // primero, y las imagenes estaticas se quedan como respaldo/relleno.
  useEffect(() => {
    const loadSponsoredBanners = async () => {
      const { data, error } = await supabase
        .from("active_banner_sponsor")
        .select("store_id, store_name, banner_url")
        .order("started_at", { ascending: false });

      if (error || !data?.length) {
        if (error) console.error(error);
        return;
      }

      const sponsored: Slide[] = data
        .filter((s) => s.banner_url)
        .map((s) => ({
          type: "sponsored",
          src: s.banner_url as string,
          alt: s.store_name ?? "Negocio patrocinado",
          title: s.store_name ?? "Negocio destacado",
          subtitle: "Negocio destacado en Deliflex.",
          ctaLabel: "Ver negocio",
          ctaHref: `/buscar?q=${encodeURIComponent(s.store_name ?? "")}`,
        }));

      setSlides([...sponsored, ...STATIC_SLIDES]);
    };

    loadSponsoredBanners();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [slides.length]);

  // El arreglo de slides cambia de tamano cuando llegan los patrocinados
  // (4 estaticos -> 2 patrocinados + 4 estaticos): sin este modulo, el
  // index podria apuntar mas alla del ultimo slide real y el carrusel se
  // veria en blanco hasta el siguiente tick del autoplay.
  const safeIndex = slides.length > 0 ? index % slides.length : 0;

  return (
    <div className="page-container">
      <div className={styles.hero}>
        {/* La caja nunca se mueve: en vez de deslizar todos los slides uno
            al lado del otro, cada uno queda apilado exactamente en el
            mismo lugar (position:absolute) y solo se hace un fundido de
            opacidad entre el que se va y el que entra. */}
        {slides.map((slide, i) => {
          const isActive = i === safeIndex;

          return (
            <div
              className={styles.slide}
              key={`${slide.src}-${i}`}
              style={{ opacity: isActive ? 1 : 0 }}
              aria-hidden={!isActive}
              inert={!isActive}
            >
              {slide.type === "sponsored" ? (
                // El banner_url de un patrocinado sale de la tabla stores,
                // que en la practica tiene fotos en dominios sueltos (no
                // solo nuestro bucket de Supabase) - next/image exige
                // lista blanca de hosts y lanza un error que puede tumbar
                // todo el carrusel si aparece uno no configurado. Un <img>
                // normal no tiene ese riesgo.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={slide.src} alt={slide.alt} className={styles.image} />
              ) : (
                // Son pocas (4 fijas) y todas por encima del pliegue: sin
                // "priority" aqui, next/image las carga de forma perezosa,
                // y el carrusel avanza a una que ni siquiera empezo a
                // descargarse - se ve en blanco hasta que termina.
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className={styles.image}
                  sizes="1140px"
                  priority
                />
              )}

              <div className={styles.overlay} />

              {slide.type === "sponsored" && (
                <span className={styles.badge}>Publicidad</span>
              )}

              <div className={styles.content}>
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <Link href={slide.ctaHref} className={styles.button}>
                  {slide.ctaLabel}
                </Link>
              </div>
            </div>
          );
        })}

        <div className={styles.dots}>
          {slides.map((slide, i) => (
            <button
              key={`${slide.src}-${i}`}
              className={`${styles.dot} ${i === safeIndex ? styles.active : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Ir al banner ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
