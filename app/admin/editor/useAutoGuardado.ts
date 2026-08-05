"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type EstadoGuardado = "quieto" | "escribiendo" | "guardando" | "guardado";

/**
 * Guarda el formulario solo, poco después de que dejás de escribir.
 * Devuelve el estado para mostrarle al usuario qué está pasando, así no
 * queda la duda de si el cambio se guardó o no.
 */
export function useAutoGuardado({
  activo = true,
  retraso = 800,
}: { activo?: boolean; retraso?: number } = {}) {
  const formRef = useRef<HTMLFormElement>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [estado, setEstado] = useState<EstadoGuardado>("quieto");

  // Limpiamos el temporizador si el componente se desmonta a mitad de camino.
  useEffect(() => {
    return () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    };
  }, []);

  const alCambiar = useCallback(() => {
    if (!activo) return;
    setEstado("escribiendo");
    if (temporizador.current) clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => {
      setEstado("guardando");
      formRef.current?.requestSubmit();
    }, retraso);
  }, [activo, retraso]);

  /** Guarda ya mismo, sin esperar (para checkboxes y selects). */
  const guardarYa = useCallback(() => {
    if (!activo) return;
    if (temporizador.current) clearTimeout(temporizador.current);
    setEstado("guardando");
    formRef.current?.requestSubmit();
  }, [activo]);

  const marcarGuardado = useCallback(() => setEstado("guardado"), []);

  return { formRef, estado, alCambiar, guardarYa, marcarGuardado };
}

/** Texto corto para mostrar al lado del formulario. */
export function textoEstado(estado: EstadoGuardado): string {
  switch (estado) {
    case "escribiendo":
      return "Escribiendo…";
    case "guardando":
      return "Guardando…";
    case "guardado":
      return "Guardado ✓";
    default:
      return "";
  }
}
