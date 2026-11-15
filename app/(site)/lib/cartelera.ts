import type { CarteleraEvent } from "../data/cartelera";

/* ═══════════════════════════════════════════════════════════════
   LÓGICA DE LA CARTELERA
   Fechas en hora de Uruguay y en español de acá ("setiembre": Intl
   dice "septiembre", por eso los nombres van escritos a mano).
   Sin dependencias, para poder probarla sola.
   ═══════════════════════════════════════════════════════════════ */

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"];
const MONTHS_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "set", "oct", "nov", "dic"];
const WEEKDAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const WEEKDAYS_SHORT = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

export const TIME_ZONE = "America/Montevideo";

/* El día de hoy en Uruguay ("2026-11-15") */
export const todayInUruguay = () => new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(new Date());

/* "AAAA-MM" del evento: el de su fecha o, si no tiene día, el que se anunció */
export const monthOf = (event: CarteleraEvent) => (event.date ? event.date.slice(0, 7) : (event.month ?? ""));

export function monthName(ym: string) {
  return MONTHS[Number(ym.slice(5, 7)) - 1] ?? "";
}

export function monthShort(ym: string) {
  return MONTHS_SHORT[Number(ym.slice(5, 7)) - 1] ?? "";
}

/* El mes siguiente a un día o a un mes ("2026-12-20" → "2027-01") */
export function nextMonth(dateOrMonth: string) {
  const year = Number(dateOrMonth.slice(0, 4));
  const month = Number(dateOrMonth.slice(5, 7));
  return month === 12 ? `${year + 1}-01` : `${year}-${String(month + 1).padStart(2, "0")}`;
}

/* Partes de una fecha "AAAA-MM-DD" para mostrarla (el día de la semana
   se calcula en UTC para que no lo corra la zona horaria del teléfono) */
export function dateParts(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return {
    year,
    day,
    month: MONTHS[month - 1],
    monthShort: MONTHS_SHORT[month - 1],
    weekday: WEEKDAYS[weekday],
    weekdayShort: WEEKDAYS_SHORT[weekday],
  };
}

/* "sábado 12 de diciembre" o "diciembre (fecha a confirmar)" */
export function whenLabel(event: CarteleraEvent) {
  if (!event.date) return `${monthName(monthOf(event))} (fecha a confirmar)`;
  const p = dateParts(event.date);
  return `${p.weekday} ${p.day} de ${p.month}${event.time ? `, ${event.time} h` : ""}`;
}

export type EventState = "today" | "next" | null;
export type CarteleraGroup = { month: string; events: { event: CarteleraEvent; state: EventState }[] };

/* Orden: por día; los "a confirmar" al final de su mes; después por hora */
const sortKey = (e: CarteleraEvent) => `${e.date ?? `${monthOf(e)}-99`} ${e.time ?? "99:99"} ${e.title}`;

/* La cartelera de hoy: sin lo que ya pasó, ordenada, agrupada por mes
   y con "Hoy" o "Próxima fecha" marcados. Sin hoy (en el servidor) se
   muestra todo sin marcar nada, así el build nunca congela un estado. */
export function buildCartelera(events: CarteleraEvent[], today: string | null): CarteleraGroup[] {
  const thisMonth = today?.slice(0, 7) ?? "";
  const upcoming = events
    .filter((e) => !today || (e.date ? e.date >= today : monthOf(e) >= thisMonth))
    .sort((a, b) => sortKey(a).localeCompare(sortKey(b)));

  const states = new Map<string, EventState>();
  if (today) {
    for (const e of upcoming) if (e.date === today && e.status !== "cancelado") states.set(e.id, "today");
    if (!states.size) {
      const next = upcoming.find((e) => e.date && e.status !== "cancelado");
      if (next) states.set(next.id, "next");
    }
  }

  const groups: CarteleraGroup[] = [];
  for (const event of upcoming) {
    const month = monthOf(event);
    let group = groups[groups.length - 1];
    if (!group || group.month !== month) {
      group = { month, events: [] };
      groups.push(group);
    }
    group.events.push({ event, state: states.get(event.id) ?? null });
  }
  return groups;
}

/* Link para agendar en Google Calendar (hora de Uruguay). Con hora, se
   agenda un bloque de 3 horas; sin hora, el día entero. */
export function calendarUrl(event: CarteleraEvent, pageUrl: string) {
  if (!event.date || event.status === "cancelado") return null;
  const [y, m, d] = event.date.split("-").map(Number);
  const stamp = (date: Date, withTime: boolean) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const day = `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
    return withTime ? `${day}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00` : day;
  };
  let dates: string;
  if (event.time) {
    const [hh, mm] = event.time.split(":").map(Number);
    const start = new Date(Date.UTC(y, m - 1, d, hh, mm));
    dates = `${stamp(start, true)}/${stamp(new Date(start.getTime() + 3 * 3600_000), true)}`;
  } else {
    const start = new Date(Date.UTC(y, m - 1, d));
    dates = `${stamp(start, false)}/${stamp(new Date(start.getTime() + 24 * 3600_000), false)}`;
  }
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates,
    ctz: TIME_ZONE,
    location: [event.place, event.city].filter(Boolean).join(", "),
    details: [event.text, pageUrl].filter(Boolean).join("\n\n"),
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/* "Entrada libre", "Entrada $ 1.200" o "Con entrada" */
export function entryLabel(entry: NonNullable<CarteleraEvent["entry"]>) {
  if (entry.kind === "libre") return "Entrada libre";
  if (entry.price === undefined) return "Con entrada";
  return `Entrada $ ${entry.price.toLocaleString("es-UY")}`;
}
