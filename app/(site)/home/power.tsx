"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   EL ENCENDIDO
   La home arranca solo con la portada. Tocar la D "prende" la página
   y aparecen todas las secciones.
   Red de seguridad (para no perder visitas): también se prende al
   intentar bajar, al usar el menú o un botón que lleve a una sección,
   o al entrar por un link directo (#artists, ?tema=…). Queda prendida
   durante toda la visita.
   ═══════════════════════════════════════════════════════════════ */

const SESSION_KEY = "ds-power";
export const POWER_EVENT = "ds:power-on";

type PowerContextValue = { on: boolean; turnOn: (scrollTo?: string) => void };

const PowerContext = createContext<PowerContextValue>({ on: true, turnOn: () => {} });

export function usePower() {
  return useContext(PowerContext);
}

/* Pedido de encendido desde fuera de la home (por ejemplo, el menú) */
export function requestPowerOn(sectionId?: string) {
  window.dispatchEvent(new CustomEvent(POWER_EVENT, { detail: sectionId }));
}

export function PowerProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useState(false);
  const [flash, setFlash] = useState(false);
  const onRef = useRef(on);
  useEffect(() => {
    onRef.current = on;
  }, [on]);

  /* Prende y, si corresponde, lleva a una sección cuando ya está visible */
  const turnOn = useCallback((scrollTo?: string) => {
    const wasOn = onRef.current;
    if (!wasOn) {
      setOn(true);
      setFlash(true);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
    }
    if (scrollTo) {
      /* dos cuadros: el primero muestra las secciones, el segundo ya puede medir */
      requestAnimationFrame(() =>
        requestAnimationFrame(() => document.getElementById(scrollTo)?.scrollIntoView({ block: "start" }))
      );
    }
  }, []);

  /* Link directo o visita ya prendida: arranca prendida */
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    const hasTrack = new URLSearchParams(window.location.search).has("tema");
    let remembered = false;
    try {
      remembered = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {}
    if (hash || hasTrack || remembered) {
      const frame = requestAnimationFrame(() => {
        setOn(true);
        if (hash) requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: "start" }));
      });
      return () => cancelAnimationFrame(frame);
    }
  }, []);

  /* Red de seguridad: intentar bajar, menú, botones con #sección */
  useEffect(() => {
    let touchY = 0;
    const onWheel = (e: WheelEvent) => {
      if (!onRef.current && e.deltaY > 10) turnOn();
    };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!onRef.current && touchY - e.touches[0].clientY > 40) turnOn();
    };
    const onKey = (e: KeyboardEvent) => {
      if (!onRef.current && ["ArrowDown", "PageDown", "End", " "].includes(e.key) && e.target === document.body) turnOn();
    };
    const onHash = () => turnOn(window.location.hash.slice(1) || undefined);
    const onRequest = (e: Event) => turnOn((e as CustomEvent<string | undefined>).detail);

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onHash);
    window.addEventListener(POWER_EVENT, onRequest);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener(POWER_EVENT, onRequest);
    };
  }, [turnOn]);

  return (
    <PowerContext.Provider value={{ on, turnOn }}>
      {children}

      {/* Destello rojo de "luces que se prenden" */}
      <AnimatePresence>
        {flash && (
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0] }}
            transition={{ duration: 0.9, times: [0, 0.15, 1] }}
            onAnimationComplete={() => setFlash(false)}
            className="pointer-events-none fixed inset-0 z-40 bg-[radial-gradient(circle_at_50%_40%,rgba(229,9,20,0.6),transparent_70%)] motion-reduce:hidden"
          />
        )}
      </AnimatePresence>
    </PowerContext.Provider>
  );
}

/* Las secciones de la home: están en el HTML desde el principio (para
   buscadores y lectores), pero ocultas hasta que se prende la página */
export function PoweredSections({ children }: { children: ReactNode }) {
  const { on } = usePower();
  return (
    <motion.div
      hidden={!on}
      initial={false}
      animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
