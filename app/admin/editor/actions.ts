"use server";

import { revalidatePath } from "next/cache";
import { createClient, getAdminUser } from "@/lib/supabase/server";
import { normalizarPrecio } from "@/lib/precios";

export type Resultado = { ok?: string; error?: string };

/** Todas las acciones revalidan la landing para que el cambio se vea al toque. */
function refrescarSitio() {
  revalidatePath("/", "page");
  revalidatePath("/admin/editor", "page");
}

async function exigirAdmin() {
  const user = await getAdminUser();
  if (!user) throw new Error("Tu sesión venció. Volvé a entrar.");
  return createClient();
}

/* ============================ PRODUCTOS ============================ */

export async function guardarProducto(
  _prev: Resultado,
  formData: FormData
): Promise<Resultado> {
  try {
    const supabase = await exigirAdmin();

    const id = String(formData.get("id") ?? "").trim();
    const name = String(formData.get("name") ?? "").trim();
    if (!name) return { error: "El producto necesita un nombre." };

    const fila = {
      name,
      tag: String(formData.get("tag") ?? "").trim() || null,
      price: normalizarPrecio(String(formData.get("price") ?? "")),
      description: String(formData.get("description") ?? "").trim() || null,
      image_url: String(formData.get("image_url") ?? "").trim() || null,
      visible: formData.get("visible") === "on",
      sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    };

    const { error } = id
      ? await supabase.from("products").update(fila).eq("id", id)
      : await supabase.from("products").insert(fila);

    if (error) return { error: "No pudimos guardar el producto." };

    refrescarSitio();
    return { ok: id ? "Producto actualizado." : "Producto agregado." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Algo salió mal." };
  }
}

export async function borrarProducto(
  _prev: Resultado,
  formData: FormData
): Promise<Resultado> {
  try {
    const supabase = await exigirAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return { error: "Falta el producto a borrar." };

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return { error: "No pudimos borrar el producto." };

    refrescarSitio();
    return { ok: "Producto borrado." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Algo salió mal." };
  }
}

/* ============================== REELS ============================== */

export async function guardarReel(
  _prev: Resultado,
  formData: FormData
): Promise<Resultado> {
  try {
    const supabase = await exigirAdmin();

    const id = String(formData.get("id") ?? "").trim();
    const title = String(formData.get("title") ?? "").trim();
    if (!title) return { error: "El reel necesita un título." };

    const fila = {
      title,
      caption: String(formData.get("caption") ?? "").trim() || null,
      ig_url: String(formData.get("ig_url") ?? "").trim() || null,
      video_url: String(formData.get("video_url") ?? "").trim() || null,
      poster_url: String(formData.get("poster_url") ?? "").trim() || null,
      visible: formData.get("visible") === "on",
      sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    };

    const { error } = id
      ? await supabase.from("reels").update(fila).eq("id", id)
      : await supabase.from("reels").insert(fila);

    if (error) return { error: "No pudimos guardar el reel." };

    refrescarSitio();
    return { ok: id ? "Reel actualizado." : "Reel agregado." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Algo salió mal." };
  }
}

export async function borrarReel(
  _prev: Resultado,
  formData: FormData
): Promise<Resultado> {
  try {
    const supabase = await exigirAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return { error: "Falta el reel a borrar." };

    const { error } = await supabase.from("reels").delete().eq("id", id);
    if (error) return { error: "No pudimos borrar el reel." };

    refrescarSitio();
    return { ok: "Reel borrado." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Algo salió mal." };
  }
}

/* ============================ SUCURSALES ============================ */

export async function guardarSucursal(
  _prev: Resultado,
  formData: FormData
): Promise<Resultado> {
  try {
    const supabase = await exigirAdmin();

    const id = String(formData.get("id") ?? "").trim();
    const nombre = String(formData.get("nombre") ?? "").trim();
    if (!nombre) return { error: "La sucursal necesita un nombre." };

    const fila = {
      nombre,
      tag: String(formData.get("tag") ?? "").trim() || null,
      direccion: String(formData.get("direccion") ?? "").trim() || null,
      horario: String(formData.get("horario") ?? "").trim() || null,
      telefono: String(formData.get("telefono") ?? "").trim() || null,
      whatsapp: String(formData.get("whatsapp") ?? "").trim() || null,
      maps_url: String(formData.get("maps_url") ?? "").trim() || null,
      mapa_query: String(formData.get("mapa_query") ?? "").trim() || null,
      visible: formData.get("visible") === "on",
      sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    };

    const { error } = id
      ? await supabase.from("sucursales").update(fila).eq("id", id)
      : await supabase.from("sucursales").insert(fila);

    if (error) return { error: "No pudimos guardar la sucursal." };

    refrescarSitio();
    return { ok: id ? "Sucursal actualizada." : "Sucursal agregada." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Algo salió mal." };
  }
}

export async function borrarSucursal(
  _prev: Resultado,
  formData: FormData
): Promise<Resultado> {
  try {
    const supabase = await exigirAdmin();
    const id = String(formData.get("id") ?? "");
    if (!id) return { error: "Falta la sucursal a borrar." };

    const { error } = await supabase.from("sucursales").delete().eq("id", id);
    if (error) return { error: "No pudimos borrar la sucursal." };

    refrescarSitio();
    return { ok: "Sucursal borrada." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Algo salió mal." };
  }
}

/* ============================ ORDEN ============================ */

const TABLAS_ORDENABLES = ["products", "reels", "sucursales"] as const;
export type TablaOrdenable = (typeof TABLAS_ORDENABLES)[number];

/**
 * Sube o baja un elemento intercambiando su posición con el vecino.
 * Evita que el cliente tenga que entender números de orden.
 */
export async function moverElemento(
  tabla: TablaOrdenable,
  id: string,
  direccion: "arriba" | "abajo"
): Promise<Resultado> {
  try {
    if (!TABLAS_ORDENABLES.includes(tabla)) return { error: "Sección inválida." };
    const supabase = await exigirAdmin();

    const { data: filas, error: errorLectura } = await supabase
      .from(tabla)
      .select("id, sort_order")
      .order("sort_order", { ascending: true });

    if (errorLectura || !filas) return { error: "No pudimos leer el orden." };

    const i = filas.findIndex((f) => f.id === id);
    if (i < 0) return { error: "No encontramos el elemento." };

    const j = direccion === "arriba" ? i - 1 : i + 1;
    if (j < 0 || j >= filas.length) return { ok: "Ya está en la punta." };

    // Intercambiamos posiciones. Reescribimos por índice para normalizar
    // valores repetidos o con huecos que pudieran venir de antes.
    const orden = filas.map((_, k) => k + 1);
    [orden[i], orden[j]] = [orden[j], orden[i]];

    for (let k = 0; k < filas.length; k++) {
      const { error } = await supabase
        .from(tabla)
        .update({ sort_order: orden[k] })
        .eq("id", filas[k].id);
      if (error) return { error: "No pudimos guardar el orden." };
    }

    refrescarSitio();
    return { ok: "Orden actualizado." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Algo salió mal." };
  }
}

/* ============================ TEXTOS ============================ */

export async function guardarTextos(
  _prev: Resultado,
  formData: FormData
): Promise<Resultado> {
  try {
    const supabase = await exigirAdmin();

    // Cada campo viaja como "clave.subclave" y se agrupa por clave.
    const agrupado: Record<string, Record<string, string>> = {};
    for (const [campo, valor] of formData.entries()) {
      if (typeof valor !== "string") continue;
      const punto = campo.indexOf(".");
      if (punto < 0) continue;
      const clave = campo.slice(0, punto);
      const sub = campo.slice(punto + 1);
      (agrupado[clave] ??= {})[sub] = valor;
    }

    const filas = Object.entries(agrupado).map(([key, value]) => ({
      key,
      value,
    }));
    if (filas.length === 0) return { error: "No había nada para guardar." };

    const { error } = await supabase
      .from("content")
      .upsert(filas, { onConflict: "key" });

    if (error) return { error: "No pudimos guardar los textos." };

    refrescarSitio();
    return { ok: "Textos actualizados." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Algo salió mal." };
  }
}
