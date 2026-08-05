import { redirect } from "next/navigation";
import { getAdminUser, createClient } from "@/lib/supabase/server";
import Editor from "./Editor";
import type { Producto } from "@/lib/tipos";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editor · Panel Las Luigi Pizzas" };

export default async function EditorPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const supabase = await createClient();

  const [{ data: productos }, { data: contenido }] = await Promise.all([
    supabase.from("products").select("*").order("sort_order", { ascending: true }),
    supabase.from("content").select("key, value"),
  ]);

  const textos: Record<string, Record<string, string>> = {};
  for (const fila of contenido ?? []) {
    textos[fila.key] = (fila.value ?? {}) as Record<string, string>;
  }

  return (
    <Editor
      productos={(productos ?? []) as Producto[]}
      textos={textos}
      email={user.email ?? ""}
    />
  );
}
