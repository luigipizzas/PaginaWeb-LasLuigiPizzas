"use server";

import { revalidatePath } from "next/cache";
import { createClient, getAdminUser } from "@/lib/supabase/server";

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
      price: String(formData.get("price") ?? "").trim() || null,
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

/* ============================ IMÁGENES ============================ */

export async function subirImagen(formData: FormData): Promise<Resultado & { url?: string }> {
  try {
    const supabase = await exigirAdmin();
    const archivo = formData.get("archivo") as File | null;

    if (!archivo || archivo.size === 0) return { error: "Elegí una imagen." };
    if (!archivo.type.startsWith("image/") && !archivo.type.startsWith("video/")) {
      return { error: "El archivo tiene que ser una imagen o un video." };
    }
    if (archivo.size > 50 * 1024 * 1024) {
      return { error: "El archivo no puede pesar más de 50 MB." };
    }

    const ext = archivo.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const nombre = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await supabase.storage
      .from("media")
      .upload(nombre, archivo, { cacheControl: "3600", upsert: false });

    if (error) return { error: "No pudimos subir el archivo." };

    const { data } = supabase.storage.from("media").getPublicUrl(nombre);

    refrescarSitio();
    return { ok: "Archivo subido.", url: data.publicUrl };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Algo salió mal." };
  }
}
