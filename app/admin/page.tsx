import { redirect } from "next/navigation";
import { getAdminUser, createClient } from "@/lib/supabase/server";
import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const supabase = await createClient();
  const [{ count: productos }, { count: reels }, { count: sucursales }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("reels").select("*", { count: "exact", head: true }),
      supabase.from("sucursales").select("*", { count: "exact", head: true }),
    ]);

  return (
    <main className={styles.panel}>
      <header className={styles.barra}>
        <div className={styles.marca}>
          <svg viewBox="0 0 48 48" className={styles.logo} aria-hidden="true">
            <path
              d="M24 4 8 40l16-6 16 6L24 4Z"
              fill="#7FB63C"
              stroke="#1C140C"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            <path
              d="M24 4 15 24l9 3 9-3L24 4Z"
              fill="#F4B400"
              stroke="#1C140C"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
          </svg>
          <span>Panel · Las Luigi Pizzas</span>
        </div>

        <div className={styles.sesion}>
          <span className={styles.email}>{user.email}</span>
          <form action="/auth/signout" method="post">
            <button className={styles.salir} type="submit">
              Salir
            </button>
          </form>
        </div>
      </header>

      <section className={styles.contenido}>
        <h1 className={styles.titulo}>Editá tu página</h1>
        <p className={styles.bajada}>
          Abrí el editor para ver tu página tal cual la ve un cliente y cambiar
          textos, fotos y precios haciendo clic sobre ellos.
        </p>

        <div className={styles.grilla}>
          <a className={styles.tarjetaAccion} href="/admin/editor">
            <span className={styles.tarjetaTitulo}>Editor visual</span>
            <span className={styles.tarjetaTexto}>
              Ver la página completa y editar cualquier parte al hacer clic.
            </span>
          </a>

          <a className={styles.tarjetaAccion} href="/" target="_blank">
            <span className={styles.tarjetaTitulo}>Ver sitio publicado</span>
            <span className={styles.tarjetaTexto}>
              Abre la página real en una pestaña nueva.
            </span>
          </a>

          <a className={styles.tarjetaAccion} href="/admin/cuenta">
            <span className={styles.tarjetaTitulo}>Mi cuenta</span>
            <span className={styles.tarjetaTexto}>
              Cambiá el correo y la contraseña con los que entrás.
            </span>
          </a>
        </div>

        <div className={styles.metricas}>
          <div className={styles.metrica}>
            <strong>{productos ?? 0}</strong>
            <span>Productos</span>
          </div>
          <div className={styles.metrica}>
            <strong>{reels ?? 0}</strong>
            <span>Reels</span>
          </div>
          <div className={styles.metrica}>
            <strong>{sucursales ?? 0}</strong>
            <span>Sucursales</span>
          </div>
        </div>
      </section>
    </main>
  );
}
