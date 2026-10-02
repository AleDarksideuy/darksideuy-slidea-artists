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

/* Se calcula una sola vez: cada getContext crea un contexto WebGL nuevo
   y los navegadores permiten pocos a la vez. */
let webgl: boolean | null = null;

export function hasWebGL() {
  if (webgl === null) {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      webgl = Boolean(gl);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webgl = false;
    }
  }
  return webgl;
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
