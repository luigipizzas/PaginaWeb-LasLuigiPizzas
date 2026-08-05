import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminUser } from "@/lib/supabase/server";
import FormCuenta from "./FormCuenta";
import styles from "./cuenta.module.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Mi cuenta · Panel Las Luigi Pizzas" };

export default async function CuentaPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  return (
    <main className={styles.pantalla}>
      <div className={styles.contenedor}>
        <Link href="/admin" className={styles.volver}>
          ← Volver al panel
        </Link>

        <h1 className={styles.titulo}>Mi cuenta</h1>
        <p className={styles.bajada}>
          Cambiá el correo y la contraseña con los que entrás al panel.
        </p>

        <FormCuenta emailActual={user.email ?? ""} />
      </div>
    </main>
  );
}
