import { createClient } from "@/lib/supabase/server";
import Landing from "@/components/landing/Landing";
import type { Producto } from "@/lib/tipos";

// Revalida cada 60s: los cambios del panel se ven enseguida sin rearmar el sitio.
export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();

  const [{ data: productos }, { data: contenido }] = await Promise.all([
    supabase
      .from("products")
      .select("*")
      .eq("visible", true)
      .order("sort_order", { ascending: true }),
    supabase.from("content").select("key, value"),
  ]);

  const textos: Record<string, Record<string, string>> = {};
  for (const fila of contenido ?? []) {
    textos[fila.key] = (fila.value ?? {}) as Record<string, string>;
  }

  return (
    <Landing productos={(productos ?? []) as Producto[]} textos={textos} />
  );
}
