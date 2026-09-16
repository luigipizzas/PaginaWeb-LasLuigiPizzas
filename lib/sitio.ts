const SITIO_POR_DEFECTO = "https://lasluigipizzas.vercel.app";

/** URL pública estable para metadata, sitemap y datos estructurados. */
export function obtenerUrlSitio(): string {
  const candidatos = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    SITIO_POR_DEFECTO,
  ];

  for (const bruto of candidatos) {
    const valor = bruto?.trim();
    if (!valor) continue;
    const conProtocolo = /^https?:\/\//i.test(valor) ? valor : `https://${valor}`;
    try {
      return new URL(conProtocolo).origin;
    } catch {
      // Si una variable está mal escrita, se prueba la siguiente.
    }
  }

  return SITIO_POR_DEFECTO;
}
