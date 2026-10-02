/* Nivel de calidad según el dispositivo.
   "low": celulares modestos o modo ahorro de datos → menos luces,
   sin partículas, sin antialias y resolución 1x.
   Además, durante el juego, si los FPS caen, World baja la resolución sola. */

export type Quality = "low" | "high";

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

let cached: Quality | null = null;

export function detectQuality(): Quality {
  if (cached) return cached;

  const nav = navigator as NavigatorHints;
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const saveData = nav.connection?.saveData === true;

  cached = saveData || (touch && (cores <= 4 || memory <= 4)) ? "low" : "high";
  return cached;
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* Se calcula una sola vez: cada getContext crea un contexto WebGL nuevo
   y los navegadores permiten pocos a la vez. */
let webglSupport: boolean | null = null;

export function hasWebGL() {
  if (webglSupport === null) {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      webglSupport = Boolean(gl);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
