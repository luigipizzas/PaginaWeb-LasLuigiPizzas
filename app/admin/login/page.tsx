import styles from "./login.module.css";
import BotonGoogle from "./BotonGoogle";

const MENSAJES: Record<string, string> = {
  no_autorizado:
    "Esa cuenta no tiene permiso. Entrá con el correo autorizado de Las Luigi Pizzas.",
  auth: "No pudimos validar tu sesión. Probá de nuevo.",
  sin_codigo: "El enlace de acceso venció. Probá de nuevo.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const mensaje = error ? MENSAJES[error] ?? MENSAJES.auth : null;

  return (
    <main className={styles.pantalla}>
      <div className={styles.tarjeta}>
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
            <path
              d="M24 4 19 14l5 1 5-1-5-10Z"
              fill="#E23528"
              stroke="#1C140C"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
          </svg>
          <span>LUIGI PIZZAS</span>
        </div>

        <h1 className={styles.titulo}>Panel de administración</h1>
        <p className={styles.bajada}>
          Entrá con la cuenta de Google autorizada para editar la página.
        </p>

        {mensaje && <div className={styles.error}>{mensaje}</div>}

        <BotonGoogle />

        <p className={styles.nota}>
          Acceso exclusivo del dueño. Cualquier otra cuenta será rechazada.
        </p>
      </div>
    </main>
  );
}
