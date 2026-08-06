"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type EstadoGuardado = "quieto" | "escribiendo" | "guardando" | "guardado";

/**
 * Guarda el formulario solo, poco después de que dejás de escribir.
 * Devuelve el estado para mostrarle al usuario qué está pasando.
 *
 * El objeto que devuelve es estable (useMemo): si cambiara en cada render y
 * alguien lo usara como dependencia de un efecto, se armaría un bucle de
 * guardar -> refrescar -> re-render -> guardar.
 */
export function useAutoGuardado({
  activo = true,
  retraso = 800,
}: { activo?: boolean; retraso?: number } = {}) {
  const formRef = useRef<HTMLFormElement>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [estado, setEstado] = useState<EstadoGuardado>("quieto");

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

  /** Guarda ya mismo, sin esperar (para checkboxes y archivos). */
  const guardarYa = useCallback(() => {
    if (!activo) return;
    if (temporizador.current) clearTimeout(temporizador.current);
    setEstado("guardando");
    formRef.current?.requestSubmit();
  }, [activo]);

  const marcarGuardado = useCallback(() => setEstado("guardado"), []);

  return useMemo(
    () => ({ formRef, estado, alCambiar, guardarYa, marcarGuardado }),
    [estado, alCambiar, guardarYa, marcarGuardado]
  );
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

/**
 * Ejecuta algo UNA sola vez por cada resultado nuevo de un Server Action.
 * Compara identidad del objeto: useActionState devuelve uno nuevo por
 * invocación, así que sirve para no reaccionar de más en cada render.
 */
export function useResultadoNuevo<T>(resultado: T, alRecibir: (r: T) => void) {
  const anterior = useRef(resultado);
  const callback = useRef(alRecibir);
  callback.current = alRecibir;

  useEffect(() => {
    if (resultado !== anterior.current) {
      anterior.current = resultado;
      callback.current(resultado);
    }
  }, [resultado]);
}
