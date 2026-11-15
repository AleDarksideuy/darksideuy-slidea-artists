"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarPlus, Check, Clock, MapPin, Share2, Ticket, X } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

import { CARTELERA, EVENTS, type CarteleraEvent, type EventStatus } from "../data/cartelera";
import { artists } from "../data/artists";
import { CONTACT } from "../data/home";
import {
  buildCartelera,
  calendarUrl,
  dateParts,
  entryLabel,
  monthName,
  monthOf,
  monthShort,
  nextMonth,
  todayInUruguay,
  whenLabel,
  type EventState,
} from "../lib/cartelera";
import { shareLink } from "../lib/share";

/* ═══════════════════════════════════════════════════════════════
   CARTELERA — LA MARQUESINA
   Las fechas de la productora, como la marquesina de un cine de
   barrio: letras intercambiables que alguien sube a mano cada mes y
   una fila de bombitas que se prende al llegar (como la página al
   tocar la D). Abajo, la lista: qué, cuándo, dónde y cómo entrar.
   Lo que ya pasó se va solo; los datos están en data/cartelera.ts.
   ═══════════════════════════════════════════════════════════════ */

const noopSubscribe = () => () => {};

const STATUS_LABEL: Record<EventStatus, string> = {
  agotado: "Agotado",
  postergado: "Postergado",
  cancelado: "Cancelado",
};

const INSTAGRAM_HANDLE = `@${CONTACT.instagram.replace(/\/+$/, "").split("/").pop()}`;

export default function Cartelera() {
  /* Hoy en Uruguay; en el servidor no hay "hoy" y se muestra todo */
  const today = useSyncExternalStore<string | null>(noopSubscribe, todayInUruguay, () => null);
  const groups = buildCartelera(EVENTS, today);
  const count = groups.reduce((n, g) => n + g.events.length, 0);
  const first = groups[0]?.month;
  const year = first?.slice(0, 4);
  /* El año solo si todas las fechas son del mismo (diciembre → enero, no) */
  const oneYear = groups.every((g) => g.month.startsWith(year ?? ""));

  /* Lo que dice la marquesina */
  const sign = first
    ? {
        top: CARTELERA.presents,
        word: monthName(first),
        bottom: `${count} ${count === 1 ? "fecha" : "fechas"}${oneYear ? ` · ${year}` : ""}`,
      }
    : {
        top: CARTELERA.empty.signTop,
        word: today ? monthName(nextMonth(today)) : "pronto",
        bottom: CARTELERA.empty.signBottom,
      };

  return (
    <section id={CARTELERA.id} className="relative px-5 pt-24 md:px-10 md:pt-36">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">{CARTELERA.kicker}</p>
            <h2 className="mt-3 font-display text-[clamp(2.6rem,11vw,6rem)] font-bold uppercase leading-[0.9]">
              {CARTELERA.title}
            </h2>
          </div>
          <p className="max-w-xs text-sm text-white/55">{CARTELERA.text}</p>
        </header>

        <Marquesina {...sign} />

        {groups.length > 0 ? (
          <>
            <div className="mt-8 space-y-10 md:mt-10">
              {groups.map((group) => {
                const label = `${monthName(group.month)} ${group.month.slice(0, 4)}`;
                return (
                  <div key={group.month}>
                    {/* Con más de un mes, cada uno con su renglón */}
                    {groups.length > 1 && (
                      <p className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/55">
                        <span className="h-px w-6 bg-ds-red" aria-hidden />
                        {label}
                      </p>
                    )}
                    <ol aria-label={`Fechas de ${label}`} className="grid gap-4">
                      {group.events.map(({ event, state }) => (
                        <EventCard key={event.id} event={event} state={state} />
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>

            <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
              {CARTELERA.follow}
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 text-white/75 md:hover:text-white"
              >
                <FaInstagram size={13} aria-hidden /> {INSTAGRAM_HANDLE}
              </a>
            </p>
          </>
        ) : (
          /* Cartelera vacía: nunca un hueco */
          <div className="mt-8 flex flex-col gap-5 rounded-3xl border border-white/10 bg-ds-ink p-6 md:mt-10 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <p className="font-display text-2xl font-bold uppercase leading-tight md:text-3xl">{CARTELERA.empty.title}</p>
              <p className="mt-2 text-sm text-white/60">{CARTELERA.empty.text}</p>
            </div>
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-ds-red px-6 font-display text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_40px_rgba(229,9,20,0.35)] transition active:scale-[0.98] md:hover:brightness-110"
            >
              <FaInstagram size={16} aria-hidden /> {INSTAGRAM_HANDLE}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── La marquesina: tres renglones de letras sueltas y las bombitas ── */
function Marquesina({ top, word, bottom }: { top: string; word: string; bottom: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);
  const [visible, setVisible] = useState(false);

  /* Se prende la primera vez que entra en pantalla; fuera de pantalla
     las bombitas se quedan quietas (no gastan batería) */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setLit(true);
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Las letras de los tres renglones se numeran seguidas: así suben
     una atrás de la otra, como si alguien las fuera colgando */
  const rows = [
    { text: top, size: "small" as const },
    { text: word, size: "big" as const },
    { text: bottom, size: "small" as const },
  ];
  let index = 0;

  return (
    <div
      ref={ref}
      data-lit={lit}
      data-visible={visible}
      className={`cartel relative mt-10 overflow-hidden rounded-[1.4rem] border border-white/10 bg-ds-ink p-[14px] transition-shadow duration-1000 md:mt-14 md:p-[18px] ${
        lit ? "shadow-[0_0_90px_rgba(229,9,20,0.18)]" : ""
      }`}
    >
      <div aria-hidden className="cartel-bulbs pointer-events-none absolute inset-0" />

      <div
        aria-hidden
        className="relative flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-[#0d0d0f] px-3 py-5 md:gap-5 md:px-10 md:py-9"
      >
        {rows.map((row, r) => (
          <p
            key={r}
            className={`flex w-full flex-wrap justify-center border-b-2 border-white/[0.07] pb-1.5 font-display font-bold uppercase ${
              row.size === "big"
                ? "gap-[0.12em] text-[clamp(1.3rem,6.3vw,4rem)]"
                : "gap-[0.14em] text-[clamp(0.7rem,2.9vw,1.05rem)]"
            }`}
          >
            {[...row.text.toUpperCase()].map((char, i) => {
              if (char === " ") return <span key={i} className="w-[0.45em]" />;
              const n = index++;
              return (
                <span
                  key={i}
                  className={`cartel-tile ${row.size === "big" ? "cartel-tile-big" : ""}`}
                  style={{ "--i": n, "--r": `${((n * 7) % 5) * 0.5 - 1}deg` } as CSSProperties}
                >
                  {char}
                </span>
              );
            })}
          </p>
        ))}
      </div>

      {/* Lo que dice la marquesina, para lectores de pantalla */}
      <p className="sr-only">{`${top} ${word}. ${bottom}.`}</p>
    </div>
  );
}

/* ── Una fecha de la cartelera ── */
function EventCard({ event, state }: { event: CarteleraEvent; state: EventState }) {
  const [copied, setCopied] = useState(false);
  const parts = event.date ? dateParts(event.date) : null;
  const month = monthOf(event);
  const cancelled = event.status === "cancelado";
  const soldOut = event.status === "agotado";
  const path = `/#evento-${event.id}`;
  const highlight = state === "today" || state === "next";

  /* El link de Google Calendar lleva la dirección de la página: se arma
     recién en el navegador (en el servidor no hay window) */
  const calendar = useSyncExternalStore(
    noopSubscribe,
    () => calendarUrl(event, new URL(path, window.location.origin).toString()),
    () => null
  );

  const lineup = (event.artists ?? []).map((name) => {
    const artist = artists.find((a) => a.slug === name);
    return artist ? { name: artist.name, href: `/artists/${artist.slug}` } : { name, href: null };
  });

  const share = async () => {
    const result = await shareLink({
      title: `${event.title} — Darkside UY`,
      text: `${event.title} · ${whenLabel(event)} · ${event.city}`,
      path,
    });
    if (result === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const ticketLink = event.entry?.kind === "paga" && !soldOut && !cancelled ? event.entry.link : undefined;
  const internalInfo = event.info?.startsWith("/") || event.info?.startsWith("#");

  return (
    <li
      id={`evento-${event.id}`}
      className={`grid grid-cols-[4.75rem_minmax(0,1fr)] gap-4 rounded-3xl border p-4 md:grid-cols-[7rem_minmax(0,1fr)] md:gap-8 md:p-6 ${
        highlight
          ? "border-ds-red/50 bg-[linear-gradient(135deg,rgba(229,9,20,0.12),transparent_55%)] shadow-[0_0_40px_rgba(229,9,20,0.12)]"
          : "border-white/10 bg-ds-ink"
      } ${cancelled ? "opacity-70" : ""}`}
    >
      {/* La fecha, como un taco de almanaque; abajo, el afiche */}
      <div className="flex flex-col gap-2 md:row-span-2">
        <time
          dateTime={event.date ?? month}
          className={`flex flex-col items-center rounded-2xl border py-3 text-center ${
            highlight ? "border-ds-red/40 bg-ds-red/10" : "border-white/10 bg-black/40"
          }`}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
            {parts ? parts.weekdayShort : "Día"}
          </span>
          <span
            className={`my-0.5 font-display text-[2.6rem] font-bold leading-none md:text-6xl ${parts ? "" : "text-outline"}`}
          >
            {parts ? parts.day : "??"}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ds-red-soft">{monthShort(month)}</span>
        </time>
        {event.poster && <Poster poster={event.poster} title={event.title} />}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.25em] text-ds-red-soft">{event.type}</span>
          {state === "today" && (
            <Chip tone="red">
              <span className="h-1.5 w-1.5 rounded-full bg-white motion-safe:animate-pulse" aria-hidden /> Hoy
            </Chip>
          )}
          {state === "next" && <Chip tone="red">Próxima fecha</Chip>}
          {!event.date && <Chip>Fecha a confirmar</Chip>}
          {event.status && <Chip tone={cancelled ? "muted" : "red"}>{STATUS_LABEL[event.status]}</Chip>}
        </div>

        <h3
          className={`mt-2 font-display text-[clamp(1.35rem,5.6vw,2.4rem)] font-bold uppercase leading-[0.95] ${
            cancelled ? "text-white/45 line-through decoration-ds-red decoration-2" : ""
          }`}
        >
          {event.title}
        </h3>

        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-white/70">
          <li className="flex items-center gap-1.5">
            <MapPin size={14} className="shrink-0 text-ds-red" aria-hidden />
            {[event.place, event.city].filter(Boolean).join(" · ")}
          </li>
          {event.time && (
            <li className="flex items-center gap-1.5">
              <Clock size={14} className="shrink-0 text-ds-red" aria-hidden />
              {event.time} h
            </li>
          )}
          {event.entry && (
            <li className="flex items-center gap-1.5">
              <Ticket size={14} className="shrink-0 text-ds-red" aria-hidden />
              {entryLabel(event.entry)}
            </li>
          )}
        </ul>

        {event.text && <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">{event.text}</p>}

        {lineup.length > 0 && (
          <p className="mt-3 text-sm leading-6 text-white/70">
            <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Con</span>
            {lineup.map((a, i) => (
              <span key={a.name}>
                {i > 0 && ", "}
                {a.href ? (
                  <Link href={a.href} className="underline decoration-white/25 underline-offset-4 md:hover:decoration-ds-red">
                    {a.name}
                  </Link>
                ) : (
                  a.name
                )}
              </span>
            ))}
          </p>
        )}
      </div>

      {/* Acciones: en celular, a todo el ancho de la tarjeta */}
      <div className="col-span-2 flex flex-wrap items-center gap-2 md:col-span-1 md:col-start-2">
        {ticketLink && (
          <a
            href={ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-ds-red px-4 font-display text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(229,9,20,0.3)] transition active:scale-[0.98] md:hover:brightness-110"
          >
            Entradas <ArrowUpRight size={15} aria-hidden />
          </a>
        )}
        {event.info && (
          <a
            href={event.info}
            {...(internalInfo ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-white/15 px-4 font-display text-xs font-bold uppercase tracking-[0.16em] transition active:scale-[0.98] md:hover:border-ds-red"
          >
            Más info <ArrowUpRight size={15} aria-hidden />
          </a>
        )}
        {calendar && (
          <a
            href={calendar}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Agendar ${event.title} en Google Calendar`}
            title="Agendar"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-white/75 transition active:scale-[0.96] md:hover:border-ds-red md:hover:text-white"
          >
            <CalendarPlus size={17} aria-hidden />
          </a>
        )}
        <button
          type="button"
          onClick={share}
          aria-label={copied ? "Link copiado" : `Compartir ${event.title}`}
          title="Compartir"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 text-white/75 transition active:scale-[0.96] md:hover:border-ds-red md:hover:text-white"
        >
          {copied ? <Check size={17} className="text-ds-red-soft" aria-hidden /> : <Share2 size={17} aria-hidden />}
        </button>
        <span aria-live="polite" className="font-mono text-[10px] uppercase tracking-[0.2em] text-ds-red-soft">
          {copied ? "Link copiado" : ""}
        </span>
      </div>
    </li>
  );
}

function Chip({ tone = "neutral", children }: { tone?: "red" | "neutral" | "muted"; children: ReactNode }) {
  const tones = {
    red: "border-ds-red/60 bg-ds-red/15 text-white",
    neutral: "border-white/15 text-white/65",
    muted: "border-white/10 text-white/45",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/* ── El afiche: chico en la tarjeta, grande al tocarlo ── */
function Poster({ poster, title }: { poster: NonNullable<CarteleraEvent["poster"]>; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={`Ver el afiche de ${title}`}
        className="block overflow-hidden rounded-xl border border-white/10 transition active:scale-[0.98] md:hover:border-ds-red"
      >
        <Image
          src={poster.src}
          alt=""
          width={poster.width}
          height={poster.height}
          sizes="(min-width: 768px) 7rem, 4.75rem"
          className="h-auto w-full"
        />
      </button>
      <dialog
        ref={dialog}
        aria-label={`Afiche de ${title}`}
        /* Tocar afuera del afiche lo cierra (Esc también) */
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="m-auto w-[min(92vw,32rem)] overflow-visible bg-transparent p-0 text-white backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      >
        <Image
          src={poster.src}
          alt={poster.alt}
          width={poster.width}
          height={poster.height}
          sizes="(min-width: 768px) 32rem, 92vw"
          className="h-auto max-h-[85svh] w-full rounded-2xl object-contain"
        />
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          aria-label="Cerrar el afiche"
          className="absolute -top-3 right-0 inline-flex h-11 w-11 -translate-y-full items-center justify-center rounded-full border border-white/20 bg-black/70 text-white"
        >
          <X size={18} aria-hidden />
        </button>
      </dialog>
    </>
  );
}
