"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { UNDERFEST } from "../data/home";
import { useReducedMotion } from "../lib/device";

const STORY_MS = 5000;

/* ═══════════════════════════════════════════════════════════════
   SKATEPARK UNDERFEST — EN HISTORIAS
   El formato que el público ya usa en Instagram: las experiencias
   pasan solas, tocar a la derecha avanza, a la izquierda vuelve y
   mantener apretado pausa.
   ═══════════════════════════════════════════════════════════════ */

export default function Underfest() {
  /* La primera historia presenta el evento; después, las experiencias */
  const experiences = [
    { number: "", title: UNDERFEST.title, text: `${UNDERFEST.since} · ${UNDERFEST.place}`, image: UNDERFEST.cover as string | null },
    ...UNDERFEST.experiences,
  ];
  const total = UNDERFEST.experiences.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const reducedMotion = useReducedMotion();
  const card = useRef<HTMLDivElement>(null);
  const holdStart = useRef(0);

  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.6 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const running = inView && !paused && !reducedMotion;

  const go = (step: number) => setIndex((i) => (i + step + experiences.length) % experiences.length);
  const story = experiences[index];

  return (
    <section id="underfest" className="relative px-5 pt-24 md:px-10 md:pt-36">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(0,26rem)_1fr] md:items-center md:gap-16">
        <header className="md:order-2">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ds-red-soft">
            {UNDERFEST.since} · {UNDERFEST.place}
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.6rem,11vw,6rem)] font-bold uppercase leading-[0.9]">
            Skatepark
            <br />
            Underfest
          </h2>

          {/* En escritorio, la lista de experiencias también navega las historias */}
          <ol className="mt-8 hidden divide-y divide-white/10 border-y border-white/10 md:block">
            {experiences.map((e, i) => i > 0 && (
              <li key={e.number}>
                <button
                  onClick={() => setIndex(i)}
                  aria-current={i === index}
                  className={`flex w-full items-baseline gap-4 py-4 text-left transition-colors ${i === index ? "text-white" : "text-white/40 hover:text-white/80"}`}
                >
                  <span className={`font-mono text-xs ${i === index ? "text-ds-red-soft" : ""}`}>{e.number}</span>
                  <span className="font-display text-xl font-bold uppercase">{e.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </header>

        {/* La historia */}
        <div
          ref={card}
          className="relative aspect-[4/5] w-full select-none overflow-hidden rounded-3xl border border-white/10 bg-ds-ink md:order-1"
          onPointerDown={() => {
            holdStart.current = performance.now();
            setPaused(true);
          }}
          onPointerUp={() => setPaused(false)}
          onPointerCancel={() => setPaused(false)}
          onPointerLeave={() => setPaused(false)}
        >
          {experiences.map((e, i) =>
            e.image ? (
              <Image
                key={e.title}
                src={e.image}
                alt={i === index ? e.title : ""}
                fill
                sizes="(max-width: 768px) 100vw, 26rem"
                className={`object-cover transition-opacity duration-500 motion-reduce:transition-none ${i === index ? "opacity-100" : "opacity-0"}`}
              />
            ) : (
              /* Sin foto: placa tipográfica con el número */
              <div
                key={e.title}
                aria-hidden
                className={`absolute inset-0 flex items-start justify-end bg-ds-red text-white p-6 transition-opacity duration-500 ${i === index ? "opacity-100" : "opacity-0"}`}
              >
                <span className="font-display text-[11rem] font-bold leading-none text-black/25">{e.number}</span>
              </div>
            )
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />

          {/* Progreso */}
          <div className="absolute inset-x-3 top-3 flex gap-1.5" aria-hidden>
            {experiences.map((e, i) => (
              <span key={e.title} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
                <span
                  key={i === index ? `active-${index}` : i}
                  className="block h-full origin-left bg-white"
                  /* La historia avanza cuando termina su barra: pausar la barra pausa todo */
                  onAnimationEnd={() => i === index && go(1)}
                  style={
                    i === index && !reducedMotion
                      ? { animation: `story-progress ${STORY_MS}ms linear forwards`, animationPlayState: running ? "running" : "paused" }
                      : { transform: `scaleX(${i < index || (i === index && reducedMotion) ? 1 : 0})` }
                  }
                />
              </span>
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 md:p-7" aria-live="polite">
            <p className="font-mono text-xs text-ds-red-soft">
              {story.number ? `${story.number} / ${String(total).padStart(2, "0")}` : "Underfest"}
            </p>
            <p className="mt-1 font-display text-3xl font-bold uppercase leading-none">{story.title}</p>
            <p className="mt-3 max-w-xs text-sm text-white/80">{story.text}</p>
          </div>

          {/* Zonas táctiles: izquierda vuelve, derecha avanza */}
          <button
            aria-label="Experiencia anterior"
            onClick={() => performance.now() - holdStart.current < 350 && go(-1)}
            className="absolute inset-y-0 left-0 w-1/3"
          />
          <button
            aria-label="Experiencia siguiente"
            onClick={() => performance.now() - holdStart.current < 350 && go(1)}
            className="absolute inset-y-0 right-0 w-2/3"
          />
        </div>
      </div>
    </section>
  );
}
