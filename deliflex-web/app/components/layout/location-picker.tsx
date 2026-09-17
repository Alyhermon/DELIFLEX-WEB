"use client";

import { useEffect, useState } from "react";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "@/app/components/components-items/dropdown";

const STORAGE_KEY = "deliflex_selected_location";

// Sectores de referencia mientras no haya autocompletado real de
// direcciones - el mismo estilo de ubicacion fija que muestra la app
// movil ("c. San Valentín, Naco") en su barra superior.
const LOCATIONS = [
  "Naco",
  "Piantini",
  "Bella Vista",
  "Gazcue",
  "Zona Colonial",
  "Arroyo Hondo",
];

export default function LocationPicker() {
  const [location, setLocation] = useState(LOCATIONS[0]);

  useEffect(() => {
    const loadSavedLocation = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setLocation(saved);
      } catch {
        // Sin localStorage disponible (modo privado, etc.): se queda en la default.
      }
    };

    loadSavedLocation();
  }, []);

  const handleChange = (value: string) => {
    setLocation(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Sin localStorage disponible: la seleccion solo dura esta visita.
    }
  };

  return (
    <Dropdown
      options={LOCATIONS}
      value={location}
      onChange={handleChange}
      icon={faLocationDot}
    />
  );
}
