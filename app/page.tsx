import { createClient } from "@/lib/supabase/server";
import Landing from "@/components/landing/Landing";
import type { Producto } from "@/lib/tipos";

// Revalida cada 60s: los cambios del panel se ven enseguida sin rearmar el sitio.
export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("visible", true)
    .order("sort_order", { ascending: true });

  return <Landing productos={(data ?? []) as Producto[]} />;
}
