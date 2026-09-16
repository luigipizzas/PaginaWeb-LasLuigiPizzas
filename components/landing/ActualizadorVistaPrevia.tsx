"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/** Actualiza los datos del iframe del editor sin recargar toda la landing. */
export default function ActualizadorVistaPrevia() {
  const router = useRouter();
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const alRecibir = (evento: MessageEvent) => {
      if (evento.origin !== window.location.origin) return;
      if (evento.data?.tipo !== "luigi:actualizar-vista") return;

      if (temporizador.current) clearTimeout(temporizador.current);
      temporizador.current = setTimeout(() => router.refresh(), 80);
    };

    window.addEventListener("message", alRecibir);
    return () => {
      window.removeEventListener("message", alRecibir);
      if (temporizador.current) clearTimeout(temporizador.current);
    };
  }, [router]);

  return null;
}
