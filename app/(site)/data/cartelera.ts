/* ═══════════════════════════════════════════════════════════════
   CARTELERA — LAS FECHAS DE LA PRODUCTORA
   Se actualiza cada mes y es lo único que hay que tocar:

   1. Sacá de EVENTS los eventos que ya pasaron (igual se ocultan solos
      al día siguiente) y borrá sus afiches de public/cartelera/.
   2. Sumá los nuevos, en cualquier orden: la sección los ordena por
      fecha, los agrupa por mes, pone el mes en la marquesina y marca
      "Hoy" y "Próxima fecha" sola.
   3. Si no queda ninguno, la sección muestra "la cartelera de <mes que
      viene> está en preparación" con el link a Instagram.

   Cada evento:
     id       único, en minúsculas y con guiones. Arma el link para
              compartir: darksideuy.com/#evento-<id>
     date     "AAAA-MM-DD". Si todavía no hay día: null, y month "AAAA-MM"
     time     "21:00", hora de Uruguay. Opcional
     title    nombre del evento
     type     "Show en vivo", "Skate", "Fiesta", "Feria"…
     place    el lugar ("Plaza de deportes"). Opcional
     city     "Ciudad, Departamento" ("Mercedes, Soriano")
     text     una o dos líneas. Opcional
     artists  slugs de data/artists.ts (enlazan a su ficha) o nombres
              sueltos. Opcional
     poster   afiche en public/cartelera/: webp, 1080 px de ancho como
              máximo y menos de 150 KB. Opcional
     entry    { kind: "libre" } o { kind: "paga", price: 300, link: "…" }
              (precio en pesos uruguayos; price y link son opcionales)
     info     link a la publicación de Instagram, o a una sección de la
              home ("/#skaters-del-interior"). Opcional
     status   "agotado", "postergado" o "cancelado". Opcional

   No inventar datos: si falta el día, va null; si falta el lugar, no va.
   Eventos de Skaters del Interior: respetar las reglas de la liga
   (comentario de LIGA_SKATERS en data/home.ts).
   ═══════════════════════════════════════════════════════════════ */

export type EventStatus = "agotado" | "postergado" | "cancelado";

export type CarteleraEvent = {
  id: string;
  date: string | null;
  month?: string;
  time?: string;
  title: string;
  type: string;
  place?: string;
  city: string;
  text?: string;
  artists?: string[];
  poster?: { src: string; alt: string; width: number; height: number };
  entry?: { kind: "libre" } | { kind: "paga"; price?: number; link?: string };
  info?: string;
  status?: EventStatus;
};

export const EVENTS: CarteleraEvent[] = [
  {
    id: "final-skaters-del-interior",
    date: null,
    month: "2026-12",
    title: "Final de Skaters del Interior",
    type: "Skate",
    city: "Mercedes, Soriano",
    text: "La final de la liga: premia a todos los que participaron.",
    info: "/#skaters-del-interior",
  },
];

/* Textos de la sección */
export const CARTELERA = {
  id: "cartelera",
  kicker: "Fechas de Darkside · Se renueva cada mes",
  title: "Cartelera",
  text: "Lo que se viene: fechas, lugares y cómo entrar.",
  /* Renglón de arriba de la marquesina */
  presents: "Darkside presenta",
  empty: {
    signTop: "La cartelera de",
    signBottom: "En preparación",
    title: "Estamos cerrando las fechas",
    text: "La cartelera nueva sale primero en Instagram.",
  },
  follow: "Las fechas nuevas salen primero en",
};
