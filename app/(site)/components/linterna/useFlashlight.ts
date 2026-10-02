"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

/* ═══════════════════════════════════════════════════════════════
   LA LINTERNA
   Sigue al cursor (o al dedo) dentro de un elemento, con un poco de
   inercia, y publica la posición de la luz:
   - como variables CSS --lx / --ly (px) en el elemento, para los
     degradados que revelan texto y fotos;
   - en un ref, para la escena 3D y para saber qué tarjeta está iluminada.
   Solo trabaja mientras el elemento está en pantalla.
   ═══════════════════════════════════════════════════════════════ */

export type Light = {
  /* posición suavizada, en px dentro del elemento */
  x: number;
  y: number;
  /* lo mismo normalizado de -1 a 1 (y hacia arriba) */
  nx: number;
  ny: number;
  /* hay una persona moviendo la luz ahora mismo */
  active: boolean;
  width: number;
  height: number;
};

type Options = {
  reducedMotion: boolean;
  /* Posición inicial, en fracción del elemento (0 a 1) */
  start?: [number, number];
  /* Recorrido automático cuando nadie mueve la luz (fracciones 0 a 1).
     Se desactiva con prefers-reduced-motion. */
  idle?: (seconds: number) => [number, number];
  /* Se llama cada vez que la luz se mueve */
  onMove?: (light: Light) => void;
};

const IDLE_AFTER_MS = 2500;

export function useFlashlight<T extends HTMLElement>(ref: RefObject<T | null>, options: Options) {
  const [visible, setVisible] = useState(false);
  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  const light = useRef<Light>({ x: 0, y: 0, nx: 0, ny: 0, active: false, width: 1, height: 1 });
  const target = useRef({ x: 0, y: 0 });
  const lastInput = useRef(-Infinity);
  const ready = useRef(false);

  const write = useCallback(() => {
    const el = ref.current;
    const l = light.current;
    if (!el) return;
    l.nx = (l.x / l.width) * 2 - 1;
    l.ny = -((l.y / l.height) * 2 - 1);
    el.style.setProperty("--lx", `${l.x.toFixed(1)}px`);
    el.style.setProperty("--ly", `${l.y.toFixed(1)}px`);
    optionsRef.current.onMove?.(l);
  }, [ref]);

  /* Mover la luz a un punto (px). snap = sin inercia (teclado, toques) */
  const moveTo = useCallback(
    (x: number, y: number, snap = false) => {
      target.current = { x, y };
      lastInput.current = performance.now();
      if (snap || optionsRef.current.reducedMotion) {
        light.current.x = x;
        light.current.y = y;
        write();
      }
    },
    [write]
  );

  /* Tamaño y posición inicial */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const resize = () => {
      const l = light.current;
      const { width, height } = el.getBoundingClientRect();
      l.width = Math.max(1, width);
      l.height = Math.max(1, height);
      if (!ready.current) {
        const [fx, fy] = optionsRef.current.start ?? [0.5, 0.4];
        l.x = target.current.x = fx * l.width;
        l.y = target.current.y = fy * l.height;
        ready.current = true;
      }
      write();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, write]);

  /* Visible en pantalla */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "100px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  /* Cursor y dedo */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const local = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      return [e.clientX - rect.left, e.clientY - rect.top] as const;
    };
    const onMove = (e: PointerEvent) => {
      /* En pantallas táctiles la luz sigue al dedo solo mientras toca */
      if (e.pointerType === "touch" && e.buttons === 0) return;
      const [x, y] = local(e);
      light.current.active = true;
      moveTo(x, y);
    };
    const onDown = (e: PointerEvent) => {
      const [x, y] = local(e);
      light.current.active = true;
      moveTo(x, y, e.pointerType === "touch");
    };
    const onLeave = () => {
      light.current.active = false;
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, moveTo]);

  /* Loop de animación, solo con el elemento visible */
  useEffect(() => {
    if (!visible) return;
    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const { reducedMotion, idle } = optionsRef.current;
      const l = light.current;

      if (idle && !reducedMotion && now - lastInput.current > IDLE_AFTER_MS) {
        const [fx, fy] = idle((now - start) / 1000);
        target.current = { x: fx * l.width, y: fy * l.height };
      }

      const dx = target.current.x - l.x;
      const dy = target.current.y - l.y;
      if (Math.abs(dx) + Math.abs(dy) > 0.3) {
        const k = reducedMotion ? 1 : 0.14;
        l.x += dx * k;
        l.y += dy * k;
        write();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, write]);

  return { light, visible, moveTo };
}
