"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, UserPlus, X } from "lucide-react";

import { LLAMADO } from "../data/home";

/* ═══════════════════════════════════════════════════════════════
   LLAMADO DE ARTISTAS — LA ENTRADA
   Una entrada de show: el número es el próximo lugar en la lista de
   inscriptos. El botón abre el formulario (mismo envío que antes).
   ═══════════════════════════════════════════════════════════════ */

/* Contador de inscriptos: mismo comportamiento que la versión anterior */
function useInscriptos() {
  const [count, setCount] = useState(LLAMADO.baseCount);
  useEffect(() => {
    const saved = Number(localStorage.getItem(LLAMADO.storageKey));
    const frame = requestAnimationFrame(() => setCount(saved || LLAMADO.baseCount));
    if (!saved) localStorage.setItem(LLAMADO.storageKey, String(LLAMADO.baseCount));
    const interval = setInterval(() => {
      setCount((prev) => {
        const next = prev + (Math.random() < 0.3 ? 1 : 0);
        localStorage.setItem(LLAMADO.storageKey, String(next));
        return next;
      });
    }, 6000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(interval);
    };
  }, []);
  return count;
}

export default function Llamado() {
  const count = useInscriptos();
  const [open, setOpen] = useState(false);

  return (
    <section id="llamado-artistas" className="relative px-5 pt-24 md:px-10 md:pt-36">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red">Convocatoria abierta</p>
        <h2 className="mt-3 font-display text-[clamp(2.6rem,11vw,6rem)] font-bold uppercase leading-[0.9]">
          Llamado de
          <br />
          artistas
        </h2>

        {/* La entrada */}
        <div className="mt-10 flex flex-col overflow-hidden rounded-3xl md:flex-row">
          <div className="relative flex-1 bg-ds-red p-6 md:p-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/80">Darkside UY · Admite 1 artista</p>
            <p className="mt-6 font-display text-[clamp(4rem,22vw,9rem)] font-bold leading-[0.85] tabular-nums">{count}</p>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/85">Artistas inscriptos</p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/90">{LLAMADO.text}</p>
          </div>

          {/* Troquel */}
          <div aria-hidden className="relative h-0 border-t-2 border-dashed border-black/40 md:h-auto md:w-0 md:border-l-2 md:border-t-0">
            <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-black md:-left-3 md:-top-3" />
            <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-black md:-bottom-3 md:-left-3 md:right-auto md:top-auto" />
          </div>

          {/* Talón */}
          <div className="flex flex-col justify-between gap-6 bg-[#c40812] p-6 md:w-72 md:p-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">Tu lugar</p>
              <p className="mt-1 font-mono text-3xl font-bold tabular-nums">N° {String(count + 1).padStart(4, "0")}</p>
              <p className="mt-3 text-sm text-white/80">Si aún no formás parte, inscribite.</p>
            </div>
            <button
              onClick={() => setOpen(true)}
              className="flex min-h-[54px] items-center justify-center gap-2 rounded-2xl bg-black px-6 font-display text-sm font-bold uppercase tracking-[0.18em] active:scale-[0.98] md:hover:bg-black/80"
            >
              <UserPlus size={17} /> Quiero participar
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>{open && <ApplicationForm onClose={() => setOpen(false)} />}</AnimatePresence>
    </section>
  );
}

const EMPTY = { nombre: "", tipo: "", descripcion: "", redes: "", email: "" };

function ApplicationForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      await fetch(LLAMADO.endpoint, { method: "POST", body: JSON.stringify(form) });
      setStatus("sent");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    }
  };

  const field =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-base text-white placeholder:text-white/35 outline-none focus:border-ds-red";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/80 md:items-center"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Aplicar como artista"
        initial={{ y: 40 }}
        animate={{ y: 0 }}
        exit={{ y: 40 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-3xl border border-white/10 bg-ds-ink p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:max-w-lg md:rounded-3xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-xl font-bold uppercase">Aplicar como artista</h3>
          <button onClick={onClose} aria-label="Cerrar" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
            <X size={18} />
          </button>
        </div>

        {status === "sent" ? (
          <div className="py-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ds-red">
              <Check size={26} />
            </span>
            <p className="mt-4 font-display text-xl font-bold uppercase">Aplicación enviada</p>
            <p className="mt-2 text-sm text-white/60">Gracias por sumarte. Te vamos a escribir.</p>
            <button onClick={onClose} className="mt-6 rounded-xl border border-white/15 px-6 py-3 text-sm">
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <input name="nombre" value={form.nombre} onChange={update} placeholder="Nombre" required autoComplete="name" className={field} />
            <select name="tipo" value={form.tipo} onChange={update} required className={field}>
              <option value="">Tipo de artista</option>
              {LLAMADO.tipos.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <textarea name="descripcion" value={form.descripcion} onChange={update} placeholder="Descripción breve" required rows={3} className={field} />
            <input name="redes" value={form.redes} onChange={update} placeholder="Redes sociales" required className={field} />
            <input name="email" type="email" value={form.email} onChange={update} placeholder="Correo electrónico" required autoComplete="email" className={field} />

            {status === "error" && <p className="text-sm text-ds-red-soft">No se pudo enviar. Probá de nuevo.</p>}

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-2 min-h-[54px] rounded-2xl bg-ds-red font-display text-sm font-bold uppercase tracking-[0.18em] disabled:opacity-60"
            >
              {status === "sending" ? "Enviando…" : "Enviar aplicación"}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
