/* ═══════════════════════════════════════════════════════════════
   PRODUCTO SECRETO (Expediente del Artista)
   Archivo chico a propósito: lo leen el menú y el adelanto, que viajan
   al navegador. Acá NO va nada que revele el producto; los textos
   reales viven en TU_SEMANA (data/home.ts) y solo se usan al lanzar.

   INTERRUPTOR DEL LANZAMIENTO:
   false → adelanto "Próximamente" (sin nombre ni detalles) y el menú dice
           "Próximamente" con candado. /expediente-del-artista sigue
           funcionando para quien tenga el link, pero no aparece en el
           sitio ni en el sitemap, y le pide a Google que no la indexe.
   true  → vuelve todo: sección, menú "Expediente" y página de venta.
   ═══════════════════════════════════════════════════════════════ */

export const PRODUCT_LAUNCHED = false;

export const TEASER = {
  id: "proximamente",
  kicker: "Para artistas",
  title: "Algo se viene.",
  text: "No podemos contar más. Todavía.",
  follow: "Enterate primero en Instagram",
  denied: "Acceso restringido",
};
