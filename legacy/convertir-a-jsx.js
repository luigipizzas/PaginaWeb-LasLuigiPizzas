/**
 * Conversor HTML -> JSX para portar la landing original.
 * Se usó una sola vez para generar los componentes; queda como referencia.
 *   node legacy/convertir-a-jsx.js
 */
const fs = require("fs");

const VACIOS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

// Atributos que en JSX van en camelCase
const MAPA = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  colspan: "colSpan",
  rowspan: "rowSpan",
  maxlength: "maxLength",
  autocomplete: "autoComplete",
  autoplay: "autoPlay",
  playsinline: "playsInline",
  preload: "preload",
  srcset: "srcSet",
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-opacity": "strokeOpacity",
  "fill-rule": "fillRule",
  "fill-opacity": "fillOpacity",
  "clip-rule": "clipRule",
  "clip-path": "clipPath",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "text-anchor": "textAnchor",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-weight": "fontWeight",
  "letter-spacing": "letterSpacing",
  "baseline-shift": "baselineShift",
  "dominant-baseline": "dominantBaseline",
  "vector-effect": "vectorEffect",
  "shape-rendering": "shapeRendering",
  "color-interpolation-filters": "colorInterpolationFilters",
  "xmlns:xlink": "xmlnsXlink",
  viewbox: "viewBox",
  preserveaspectratio: "preserveAspectRatio",
  crossorigin: "crossOrigin",
  referrerpolicy: "referrerPolicy",
  spellcheck: "spellCheck",
  contenteditable: "contentEditable",
  enterkeyhint: "enterKeyHint",
  allowfullscreen: "allowFullScreen",
  inputmode: "inputMode",
};

function styleAObjeto(css) {
  const props = css
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((par) => {
      const i = par.indexOf(":");
      if (i < 0) return null;
      const clave = par.slice(0, i).trim();
      const valor = par.slice(i + 1).trim();
      const camel = clave.startsWith("--")
        ? `"${clave}"`
        : clave.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      return `${camel}: ${JSON.stringify(valor)}`;
    })
    .filter(Boolean);
  return `{{ ${props.join(", ")} }}`;
}

function convertirAtributos(attrs) {
  let salida = "";
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(\s*=\s*("([^"]*)"|'([^']*)'))?/g;
  let m;
  while ((m = re.exec(attrs))) {
    const nombre = m[1];
    const tieneValor = m[2] !== undefined;
    const valor = m[4] !== undefined ? m[4] : m[5];

    if (nombre.startsWith("data-") || nombre.startsWith("aria-")) {
      salida += ` ${nombre}=${tieneValor ? JSON.stringify(valor) : "{true}"}`;
      continue;
    }
    if (nombre.toLowerCase() === "style" && tieneValor) {
      salida += ` style=${styleAObjeto(valor)}`;
      continue;
    }
    const jsx = MAPA[nombre.toLowerCase()] || nombre;
    salida += tieneValor ? ` ${jsx}=${JSON.stringify(valor)}` : ` ${jsx}={true}`;
  }
  return salida;
}

function convertir(html) {
  let out = html;

  // Comentarios HTML -> comentarios JSX
  out = out.replace(/<!--([\s\S]*?)-->/g, (_, c) => `{/*${c.replace(/\*\//g, "*\\/")}*/}`);

  // Etiquetas de apertura / autocerradas
  out = out.replace(
    /<([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^<>]*?)?)\s*(\/?)>/g,
    (full, tag, attrs, cierre) => {
      const t = tag.toLowerCase();
      const a = convertirAtributos(attrs || "");
      if (VACIOS.has(t)) return `<${tag}${a} />`;
      return `<${tag}${a}${cierre ? " /" : ""}>`;
    }
  );

  // Llaves sueltas en texto romperían JSX
  out = out.replace(/>([^<>{}]*)</g, (full, texto) => {
    if (!/[{}]/.test(texto)) return full;
    return ">" + texto.replace(/([{}])/g, "{'$1'}") + "<";
  });

  return out;
}

if (require.main === module) {
  const entrada = process.argv[2] || "legacy/body-markup.html";
  const salida = process.argv[3] || "legacy/body-convertido.jsx";
  fs.writeFileSync(salida, convertir(fs.readFileSync(entrada, "utf8")), "utf8");
  console.log("Convertido:", entrada, "->", salida);
}

module.exports = { convertir };
