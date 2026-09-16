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
  const version = useRef(0);
  const versionEnviada = useRef(0);
  const enviando = useRef(false);
  const [estado, setEstado] = useState<EstadoGuardado>("quieto");

  const conectarFormulario = useCallback((nodo: HTMLFormElement | null) => {
    formRef.current = nodo;
  }, []);

  useEffect(() => {
    return () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    };
  }, []);

  const enviar = useCallback(() => {
    if (!activo || enviando.current || !formRef.current) return;
    enviando.current = true;
    versionEnviada.current = version.current;
    setEstado("guardando");
    formRef.current.requestSubmit();
  }, [activo]);

  const programar = useCallback((espera: number) => {
    if (temporizador.current) clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => {
      temporizador.current = null;
      enviar();
    }, espera);
  }, [enviar]);

  const alCambiar = useCallback(() => {
    if (!activo) return;
    version.current += 1;
    setEstado("escribiendo");
    if (!enviando.current) programar(retraso);
  }, [activo, retraso, programar]);

  /** Guarda ya mismo, sin esperar (para checkboxes y archivos). */
  const guardarYa = useCallback(() => {
    if (!activo) return;
    version.current += 1;
    if (temporizador.current) clearTimeout(temporizador.current);
    temporizador.current = null;
    if (!enviando.current) enviar();
    else setEstado("escribiendo");
  }, [activo, enviar]);

  const marcarGuardado = useCallback(() => {
    enviando.current = false;
    if (version.current > versionEnviada.current) {
      setEstado("escribiendo");
      programar(120);
      return;
    }
    setEstado("guardado");
  }, [programar]);

  const marcarError = useCallback(() => {
    enviando.current = false;
    setEstado("quieto");
  }, []);

  return useMemo(
    () => ({ conectarFormulario, estado, alCambiar, guardarYa, marcarGuardado, marcarError }),
    [conectarFormulario, estado, alCambiar, guardarYa, marcarGuardado, marcarError]
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

  useEffect(() => {
    callback.current = alRecibir;
  }, [alRecibir]);

  useEffect(() => {
    if (resultado !== anterior.current) {
      anterior.current = resultado;
      callback.current(resultado);
    }
  }, [resultado]);
}
