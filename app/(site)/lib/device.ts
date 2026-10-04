import { useSyncExternalStore } from "react";

/* Capacidades del dispositivo para decidir cuánto 3D mostrar. */

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

/* "low": celulares modestos o ahorro de datos → escena estática que solo
   se redibuja cuando la persona toca. "high": escena animada. */
export type Quality = "low" | "high";

let quality: Quality | null = null;

export function detectQuality(): Quality {
  if (quality) return quality;
  const nav = navigator as NavigatorHints;
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const saveData = nav.connection?.saveData === true;
  quality = saveData || (touch && (cores <= 4 || memory <= 4)) ? "low" : "high";
  return quality;
}

/* ¿El navegador soporta WebGL? Solo mira si existe la API: no crea un
   contexto de prueba (al refrescar, la pestaña anterior a veces todavía
   no liberó la placa de video y la prueba fallaba sin motivo real).
   Si crear el 3D falla de verdad, el componente cae a la versión plana. */
export function hasWebGL() {
  return typeof window !== "undefined" && ("WebGL2RenderingContext" in window || "WebGLRenderingContext" in window);
}

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useIsTouch() {
  return useMediaQuery("(pointer: coarse)");
}
