import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Cliente de Supabase para Server Components / Route Handlers. */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Se llama desde un Server Component: el middleware ya refresca la sesión.
          }
        },
      },
    }
  );
}

/**
 * Devuelve el usuario SOLO si está en la lista blanca de administradores.
 *
 * La fuente de verdad es la tabla public.admins (consultada vía is_admin()),
 * NO una variable de entorno: así el cliente puede cambiar su correo desde el
 * panel sin quedarse afuera. Las policies RLS son el candado definitivo.
 */
export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: esAdmin, error } = await supabase.rpc("is_admin");
  if (error || !esAdmin) return null;

  return user;
}
