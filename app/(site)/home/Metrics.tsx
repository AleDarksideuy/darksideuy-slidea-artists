"use client";

import { useEffect, useRef, useState } from "react";

import { METRICS } from "../data/home";
import { useReducedMotion } from "../lib/device";

/* Los números de la productora: cuentan hasta su valor cuando aparecen */
export default function Metrics({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDListElement>(null);
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = reducedMotion ? 1 : Math.min(1, (now - start) / 1200);
          setProgress(1 - Math.pow(1 - t, 3));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <dl ref={ref} className={`grid grid-cols-3 divide-x divide-white/10 border-y border-white/10 ${className}`}>
      {METRICS.map((m) => (
        <div key={m.label} className="px-2 py-6 text-center md:py-8">
          <dt className="sr-only">{m.label}</dt>
          <dd className="font-display text-[clamp(2.4rem,12vw,5rem)] font-bold leading-none tabular-nums" aria-label={`${m.value} ${m.label}`}>
            {Math.round(m.value * progress)}
          </dd>
          <dd aria-hidden className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/50 md:text-[11px]">
            {m.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}
