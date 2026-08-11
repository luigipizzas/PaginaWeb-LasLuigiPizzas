import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Mantiene despierta la base de datos.
 *
 * Supabase pausa los proyectos del plan gratuito que pasan una semana sin
 * actividad. Según su documentación, lo que cuenta son las llamadas a la API
 * del proyecto: por eso esta consulta sale desde acá y no desde un pg_cron
 * dentro de Postgres, que no generaría tráfico externo.
 *
 * La dispara Vercel una vez por día (ver vercel.json).
 */

// Sin caché: si Next guardara la respuesta, no habría consulta real.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  // Vercel manda este encabezado cuando existe la variable CRON_SECRET.
  // Si no está configurada, el endpoint queda abierto pero es inofensivo:
  // sólo cuenta filas y no expone datos.
  const secreto = process.env.CRON_SECRET;
  if (secreto) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secreto}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
  }

  const inicio = Date.now();

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    // Consulta mínima: pide sólo el conteo, no trae filas.
    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("[mantener-viva] falló la consulta:", error.message);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      productos: count ?? 0,
      ms: Date.now() - inicio,
      fecha: new Date().toISOString(),
    });
  } catch (e) {
    const mensaje = e instanceof Error ? e.message : "Error desconocido";
    console.error("[mantener-viva]", mensaje);
    return NextResponse.json({ ok: false, error: mensaje }, { status: 500 });
  }
}
