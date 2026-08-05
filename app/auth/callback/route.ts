import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Intercambia el código de OAuth por una sesión y valida la lista blanca. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin";

  if (!code) {
    return NextResponse.redirect(`${origin}/admin/login?error=sin_codigo`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/admin/login?error=auth`);
  }

  // Cortamos acá si el email no es el autorizado: cerramos sesión enseguida.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const permitido = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase().trim();
  if (!user?.email || user.email.toLowerCase().trim() !== permitido) {
    await supabase.auth.signOut();
    return NextResponse.redirect(`${origin}/admin/login?error=no_autorizado`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
