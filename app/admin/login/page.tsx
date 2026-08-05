import styles from "./login.module.css";
import FormLogin from "./FormLogin";

export const metadata = { title: "Ingresar · Panel Las Luigi Pizzas" };

export default function LoginPage() {
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
          Ingresá con tu correo y contraseña para editar tu página.
        </p>

        <FormLogin />

        <p className={styles.nota}>
          Acceso exclusivo del dueño. Podés cambiar tu correo y tu contraseña
          desde el panel.
        </p>
      </div>
    </main>
  );
}
