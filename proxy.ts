import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresca la sesión de Supabase en cada request y protege /admin.
 * Ojo: esto es la capa de UX/servidor. El candado real está en las
 * policies RLS de Postgres (solo public.admins puede escribir).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const esRutaAdmin = pathname.startsWith("/admin");
  const esLogin = pathname === "/admin/login";
  const permitido = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase().trim();
  const esAdmin =
    !!user?.email && user.email.toLowerCase().trim() === permitido;

  // Sin permiso y entrando al panel -> al login
  if (esRutaAdmin && !esLogin && !esAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // Ya logueado y yendo al login -> derecho al panel
  if (esLogin && esAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Todo menos estáticos y archivos de imagen/video
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|ico)$).*)",
  ],
};
