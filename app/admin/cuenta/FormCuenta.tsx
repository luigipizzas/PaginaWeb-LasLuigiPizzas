"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { actualizarCuenta, type EstadoCuenta } from "./actions";
import styles from "./cuenta.module.css";

function BotonGuardar() {
  const { pending } = useFormStatus();
  return (
    <button className={styles.boton} type="submit" disabled={pending}>
      {pending ? "Guardando…" : "Guardar cambios"}
    </button>
  );
}

export default function FormCuenta({ emailActual }: { emailActual: string }) {
  const [estado, accion] = useActionState<EstadoCuenta, FormData>(
    actualizarCuenta,
    {}
  );

  return (
    <form action={accion} className={styles.form}>
      {estado?.error && <div className={styles.error}>{estado.error}</div>}
      {estado?.ok && <div className={styles.ok}>{estado.ok}</div>}

      <fieldset className={styles.grupo}>
        <legend className={styles.leyenda}>Tu correo</legend>
        <label className={styles.campo}>
          <span className={styles.etiqueta}>Correo para entrar</span>
          <input
            className={styles.input}
            type="email"
            name="email"
            defaultValue={emailActual}
            autoComplete="username"
          />
        </label>
      </fieldset>

      <fieldset className={styles.grupo}>
        <legend className={styles.leyenda}>Cambiar contraseña</legend>
        <p className={styles.ayuda}>Dejalo vacío si no querés cambiarla.</p>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Contraseña nueva</span>
          <input
            className={styles.input}
            type="password"
            name="password_nueva"
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
          />
        </label>

        <label className={styles.campo}>
          <span className={styles.etiqueta}>Repetir contraseña nueva</span>
          <input
            className={styles.input}
            type="password"
            name="password_repetir"
            autoComplete="new-password"
          />
        </label>
      </fieldset>

      <fieldset className={`${styles.grupo} ${styles.grupoConfirmar}`}>
        <legend className={styles.leyenda}>Confirmá que sos vos</legend>
        <label className={styles.campo}>
          <span className={styles.etiqueta}>Tu contraseña actual</span>
          <input
            className={styles.input}
            type="password"
            name="password_actual"
            autoComplete="current-password"
            required
          />
        </label>
      </fieldset>

      <BotonGuardar />
    </form>
  );
}
