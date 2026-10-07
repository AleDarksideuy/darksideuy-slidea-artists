"use client";

import { useActionState, useEffect, useRef } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

import { CONTACT } from "../data/home";
import { sendContact, type ContactState } from "./contact-action";

/* ═══════════════════════════════════════════════════════════════
   FORMULARIO "HABLEMOS"
   El mensaje sale desde la página directo al correo de la productora
   (ver contact-action.ts). Motivo con chips, validación del lado del
   servidor y lo escrito no se pierde si algo falla.
   ═══════════════════════════════════════════════════════════════ */

const initial: ContactState = { status: "idle", message: "" };

const field =
  "w-full rounded-2xl border border-white/12 bg-black/40 px-4 py-3.5 text-base text-white placeholder:text-white/30 outline-none transition-colors focus:border-ds-red";

export default function ContactForm() {
  const [state, action, pending] = useActionState(sendContact, initial);
  const form = useRef<HTMLFormElement>(null);
  const v = state.values ?? {};

  /* Enviado: se vacía el formulario */
  useEffect(() => {
    if (state.status === "ok") form.current?.reset();
  }, [state]);

  return (
    <form
      ref={form}
      action={action}
      className="mt-6 rounded-3xl border border-white/10 bg-ds-ink p-5 md:p-8"
      aria-describedby="contact-status"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="font-display text-lg font-bold uppercase">Escribinos</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Llega a {CONTACT.email}</p>
      </div>

      {/* Motivo */}
      <fieldset className="mt-5">
        <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Motivo</legend>
        <div className="flex flex-wrap gap-2" key={state.status === "ok" ? "reset" : "keep"}>
          {CONTACT.topics.map((topic, i) => (
            <label key={topic} className="cursor-pointer">
              <input
                type="radio"
                name="topic"
                value={topic}
                defaultChecked={v.topic ? v.topic === topic : i === 0}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-[40px] items-center rounded-full border border-white/15 px-4 text-sm text-white/70 transition-colors peer-checked:border-ds-red peer-checked:bg-ds-red/15 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-ds-red md:hover:border-white/30">
                {topic}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Nombre</span>
          <input name="name" required maxLength={80} autoComplete="name" defaultValue={v.name} placeholder="Tu nombre o el de tu proyecto" className={field} />
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Correo</span>
          <input name="email" type="email" required maxLength={120} autoComplete="email" inputMode="email" defaultValue={v.email} placeholder="Para poder responderte" className={field} />
        </label>
      </div>

      <label className="mt-3 block">
        <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">Mensaje</span>
        <textarea name="message" required minLength={10} maxLength={4000} rows={5} defaultValue={v.message} placeholder="Contanos qué tenés en mente" className={`${field} resize-y`} />
      </label>

      {/* Trampa para bots: invisible para las personas */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Sitio web
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p
          id="contact-status"
          aria-live="polite"
          className={`flex items-center gap-2 text-sm ${state.status === "error" ? "text-ds-red-soft" : "text-white/80"}`}
        >
          {state.status === "ok" && <CheckCircle2 size={18} className="shrink-0 text-ds-red-soft" />}
          {state.message}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="flex min-h-[54px] items-center justify-center gap-2 rounded-2xl bg-ds-red px-8 font-display text-sm font-bold uppercase tracking-[0.14em] text-white active:scale-[0.98] disabled:opacity-60 md:hover:brightness-110"
        >
          {pending ? (
            <>
              <Loader2 size={17} className="animate-spin" /> Enviando…
            </>
          ) : (
            <>
              Enviar mensaje <ArrowRight size={17} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
