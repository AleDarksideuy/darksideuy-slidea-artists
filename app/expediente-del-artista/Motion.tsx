"use client";

import { useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   Animaciones de la landing (sin librerías, no renderiza nada).

   - Aparición al hacer scroll: los hijos directos de cada <section>
     (y de [data-auto]) entran solos; las listas con [data-stagger]
     entran de a un ítem.
   - [data-count]: el número sube desde 0 cuando se ve.
   - [data-spot]: luz roja que sigue al mouse (solo escritorio).
   - Barra de progreso de lectura arriba (--prog).

   Sin JavaScript o con "reducir movimiento" la página se ve completa
   y quieta: lo oculto solo existe mientras la raíz tiene data-armed.
   ═══════════════════════════════════════════════════════════════ */
export default function Motion({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Barra de progreso: va aunque se reduzca el movimiento (no anima) */
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        root.style.setProperty("--prog", String(max > 0 ? h.scrollTop / max : 0));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (reduce) {
      return () => window.removeEventListener("scroll", onScroll);
    }

    /* Orden de entrada de cada ítem de las listas */
    root.querySelectorAll<HTMLElement>("[data-stagger]").forEach((list) => {
      Array.from(list.children).forEach((child, i) => {
        (child as HTMLElement).style.setProperty("--i", String(i));
      });
    });

    /* Todo lo que entra al hacer scroll */
    const auto = root.querySelectorAll<HTMLElement>(
      "section > :not([data-stagger]), [data-auto] > :not([data-stagger])",
    );
    auto.forEach((el) => el.setAttribute("data-reveal", ""));

    const counters = root.querySelectorAll<HTMLElement>("[data-count]");
    counters.forEach((el) => {
      el.textContent = `0${el.dataset.suffix ?? ""}`;
    });

    const countUp = (el: HTMLElement) => {
      const to = Number(el.dataset.count);
      const suffix = el.dataset.suffix ?? "";
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / 1600);
        const eased = 1 - Math.pow(1 - k, 3);
        el.textContent = `${Math.round(to * eased)}${suffix}`;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    root.setAttribute("data-armed", "");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.setAttribute("data-in", "");
          el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0 },
    );
    root
      .querySelectorAll("[data-reveal], [data-stagger]")
      .forEach((el) => io.observe(el));

    /* Luz que sigue al mouse en las tarjetas */
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const card = (e.target as Element).closest?.<HTMLElement>("[data-spot]");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    root.addEventListener("pointermove", onMove);

    return () => {
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("pointermove", onMove);
      io.disconnect();
      root.removeAttribute("data-armed");
      counters.forEach((el) => {
        el.textContent = `${el.dataset.count}${el.dataset.suffix ?? ""}`;
      });
    };
  }, [rootId]);

  return null;
}
