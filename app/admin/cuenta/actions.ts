"use server";

import { revalidatePath } from "next/cache";
import { createClient, getAdminUser } from "@/lib/supabase/server";

export type EstadoCuenta = { ok?: string; error?: string };

/**
 * Cambia correo y/o contraseña.
 * Siempre exige la contraseña actual: si alguien te roba la sesión abierta,
 * igual no puede cambiarte las credenciales y dejarte afuera.
 */
export async function actualizarCuenta(
  _prev: EstadoCuenta,
  formData: FormData
): Promise<EstadoCuenta> {
  const user = await getAdminUser();
  if (!user) return { error: "Tu sesión venció. Volvé a entrar." };

  const actual = String(formData.get("password_actual") ?? "");
  const nuevoEmail = String(formData.get("email") ?? "").trim().toLowerCase();
  const nueva = String(formData.get("password_nueva") ?? "");
  const repetir = String(formData.get("password_repetir") ?? "");

  if (!actual) return { error: "Ingresá tu contraseña actual para confirmar." };

  const supabase = await createClient();

  // Reautenticación: verificamos la contraseña actual antes de tocar nada.
  const { error: errorAuth } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: actual,
  });
  if (errorAuth) return { error: "La contraseña actual no es correcta." };

  const cambios: string[] = [];

  if (nueva || repetir) {
    if (nueva !== repetir) return { error: "Las contraseñas nuevas no coinciden." };
    if (nueva.length < 8)
      return { error: "La contraseña nueva debe tener al menos 8 caracteres." };

    const { error } = await supabase.auth.updateUser({ password: nueva });
    if (error) return { error: "No pudimos cambiar la contraseña." };
    cambios.push("contraseña");
  }

  if (nuevoEmail && nuevoEmail !== user.email?.toLowerCase()) {
    const { error } = await supabase.rpc("cambiar_email_admin", {
      nuevo_email: nuevoEmail,
    });
    if (error) {
      return { error: error.message || "No pudimos cambiar el correo." };
    }
    cambios.push("correo");
  }

  if (cambios.length === 0) return { error: "No indicaste ningún cambio." };

  revalidatePath("/admin", "layout");
  return {
    ok: `Listo, actualizamos tu ${cambios.join(" y tu ")}. Usalos la próxima vez que entres.`,
  };
}
