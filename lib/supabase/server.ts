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
 * La verificación real de permisos vive en las policies RLS de Postgres;
 * esto es la capa de UI/servidor.
 */
export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const permitido = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase().trim();
  if (!permitido || user.email.toLowerCase().trim() !== permitido) return null;

  return user;
}
