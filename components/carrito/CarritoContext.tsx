"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ItemCarrito = {
  id: string;
  nombre: string;
  precio: number; // en pesos, ya convertido a número
  cantidad: number;
};

type Carrito = {
  items: ItemCarrito[];
  unidades: number;
  total: number;
  nombreCliente: string;
  setNombreCliente: (n: string) => void;
  agregar: (p: { id: string; nombre: string; precio: string | null }) => void;
  quitar: (id: string) => void;
  sacarTodo: (id: string) => void;
  vaciar: () => void;
  abierto: boolean;
  setAbierto: (v: boolean) => void;
  aviso: string | null;
  irASucursales: (texto: string) => void;
};

const Ctx = createContext<Carrito | null>(null);
const CLAVE = "luigi-carrito";

/**
 * Los precios se guardan como texto libre ("$8.900") porque el dueño los
 * escribe a mano desde el panel. Acá se pasan a número para poder sumarlos:
 * se descarta todo lo que no sea dígito, tomando el punto como separador de
 * miles (que es como se escribe en Argentina).
 */
export function precioANumero(precio: string | null | undefined): number {
  if (!precio) return 0;
  const limpio = precio.replace(/[^\d,]/g, "").replace(",", ".");
  const n = Number.parseFloat(limpio);
  return Number.isFinite(n) ? Math.round(n) : 0;
}

/** 8900 -> "$8.900" */
export function formatearPrecio(n: number): string {
  return "$" + n.toLocaleString("es-AR");
}

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [nombreCliente, setNombreCliente] = useState("");
  const [abierto, setAbierto] = useState(false);
  const [cargado, setCargado] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  // Recuperar lo guardado (si cerró la pestaña sin pedir)
  useEffect(() => {
    try {
      const crudo = localStorage.getItem(CLAVE);
      if (crudo) {
        const d = JSON.parse(crudo);
        if (Array.isArray(d.items)) setItems(d.items);
        if (typeof d.nombre === "string") setNombreCliente(d.nombre);
      }
    } catch {
      // Si está corrupto, arrancamos limpio.
    }
    setCargado(true);
  }, []);

  useEffect(() => {
    if (!cargado) return; // no pisar lo guardado antes de leerlo
    try {
      localStorage.setItem(
        CLAVE,
        JSON.stringify({ items, nombre: nombreCliente })
      );
    } catch {
      // Modo incógnito o sin espacio: no es motivo para romper nada.
    }
  }, [items, nombreCliente, cargado]);

  const valor = useMemo<Carrito>(() => {
    const unidades = items.reduce((s, i) => s + i.cantidad, 0);
    const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);

    return {
      items,
      unidades,
      total,
      nombreCliente,
      setNombreCliente,
      abierto,
      setAbierto,
      aviso,

      /**
       * Lleva a la sección de sucursales y deja un aviso a la vista.
       * Usa Lenis si está activo (el scroll suave de la landing); si no,
       * cae al scroll nativo.
       */
      irASucursales: (texto: string) => {
        setAbierto(false);
        setAviso(texto);

        const destino = document.getElementById("local");
        if (destino) {
          const lenis = (window as unknown as { lenis?: { scrollTo: (t: Element, o?: object) => void } }).lenis;
          if (lenis) lenis.scrollTo(destino, { offset: -70 });
          else destino.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        window.clearTimeout((window as unknown as { _avisoT?: number })._avisoT);
        (window as unknown as { _avisoT?: number })._avisoT = window.setTimeout(
          () => setAviso(null),
          6000
        );
      },

      agregar: ({ id, nombre, precio }) =>
        setItems((prev) => {
          const i = prev.findIndex((x) => x.id === id);
          if (i >= 0) {
            const copia = [...prev];
            copia[i] = { ...copia[i], cantidad: copia[i].cantidad + 1 };
            return copia;
          }
          return [
            ...prev,
            { id, nombre, precio: precioANumero(precio), cantidad: 1 },
          ];
        }),

      quitar: (id) =>
        setItems((prev) =>
          prev
            .map((x) => (x.id === id ? { ...x, cantidad: x.cantidad - 1 } : x))
            .filter((x) => x.cantidad > 0)
        ),

      sacarTodo: (id) => setItems((prev) => prev.filter((x) => x.id !== id)),

      vaciar: () => setItems([]),
    };
  }, [items, nombreCliente, abierto, aviso]);

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useCarrito() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCarrito necesita estar dentro de CarritoProvider");
  return ctx;
}

/** Arma el mensaje de WhatsApp con el detalle del pedido. */
export function armarMensaje(
  items: ItemCarrito[],
  total: number,
  nombreCliente: string,
  sucursal: string
): string {
  const lineas = [
    `¡Hola Las Luigi Pizzas! Quiero hacer un pedido en *${sucursal}*.`,
    "",
    "*Mi pedido:*",
    ...items.map(
      (i) =>
        `• ${i.cantidad}x ${i.nombre} — ${formatearPrecio(i.precio * i.cantidad)}`
    ),
    "",
    `*Total: ${formatearPrecio(total)}*`,
  ];
  if (nombreCliente.trim()) {
    lineas.push("", `Mi nombre es ${nombreCliente.trim()}.`);
  }
  return lineas.join("\n");
}
