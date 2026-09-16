/** Convierte cualquier precio escrito por una persona a pesos enteros. */
export function precioANumero(valor: string | null | undefined): number {
  if (!valor) return 0;

  // En el panel los importes se escriben sin centavos. Por eso tanto puntos
  // como comas se interpretan como separadores visuales de miles.
  const digitos = valor.replace(/\D/g, "");
  const numero = Number.parseInt(digitos, 10);
  return Number.isFinite(numero) ? numero : 0;
}

/** Formato argentino para mostrar importes: 10500 -> "$10.500". */
export function formatearPrecio(numero: number): string {
  return `$${Math.max(0, Math.round(numero)).toLocaleString("es-AR")}`;
}

/** Formato de edición sin el signo pesos: "10500" -> "10.500". */
export function formatearNumeroConMiles(valor: string | null | undefined): string {
  const numero = precioANumero(valor);
  return numero ? numero.toLocaleString("es-AR") : "";
}

/** Normaliza lo que llega del formulario antes de guardarlo en la base. */
export function normalizarPrecio(valor: string | null | undefined): string | null {
  const numero = precioANumero(valor);
  return numero ? formatearPrecio(numero) : null;
}
