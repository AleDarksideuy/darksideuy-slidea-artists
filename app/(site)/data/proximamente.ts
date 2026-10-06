/* ═══════════════════════════════════════════════════════════════
   PRODUCTO SECRETO (Tu semana como artista)
   Archivo chico a propósito: lo leen el menú y el adelanto, que viajan
   al navegador. Acá NO va nada que revele el producto; los textos
   reales viven en TU_SEMANA (data/home.ts) y solo se usan al lanzar.

   INTERRUPTOR DEL LANZAMIENTO:
   false → adelanto "Próximamente" (sin nombre ni detalles), el menú dice
           "Próximamente" y /tu-semana-como-artista redirige al adelanto.
   true  → vuelve todo: sección, menú "Tu semana" y página de venta.
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
