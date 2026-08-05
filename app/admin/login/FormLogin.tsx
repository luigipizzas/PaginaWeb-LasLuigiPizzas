"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { iniciarSesion, type EstadoLogin } from "./actions";
import styles from "./login.module.css";

function BotonEntrar() {
  const { pending } = useFormStatus();
  return (
    <button className={styles.boton} type="submit" disabled={pending}>
      {pending ? "Entrando…" : "Entrar al panel"}
    </button>
  );
}

export default function FormLogin() {
  const [estado, accion] = useActionState<EstadoLogin, FormData>(
    iniciarSesion,
    {}
  );

  return (
    <form action={accion} className={styles.form}>
      {estado?.error && <div className={styles.error}>{estado.error}</div>}

      <label className={styles.campo}>
        <span className={styles.etiqueta}>Correo</span>
        <input
          className={styles.input}
          type="email"
          name="email"
          autoComplete="username"
          placeholder="tucorreo@gmail.com"
          required
        />
      </label>

      <label className={styles.campo}>
        <span className={styles.etiqueta}>Contraseña</span>
        <input
          className={styles.input}
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </label>

      <BotonEntrar />
    </form>
  );
}
