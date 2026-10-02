import * as THREE from "three";

/* Las fotos pasan por el optimizador de imágenes de Next: llegan
   redimensionadas y en WebP/AVIF. Una foto de 600 KB baja a ~40 KB,
   que es lo que más pesa al cargar cada zona en un celular. */
export function optimizedImage(src: string, width: 384 | 640 | 828 = 640) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}

function canvasTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/* Texto de una línea (nombres debajo de cada estación) */
export function createLabelTexture(
  text: string,
  { color = "#ffffff", font = "bold 44px monospace" } = {}
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = font;
  canvas.width = Math.ceil(ctx.measureText(text).width) + 48;
  canvas.height = 72;

  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 2);

  return { texture: canvasTexture(canvas), aspect: canvas.width / canvas.height };
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/* Cartel con texto (estaciones sin foto: manifiesto, contacto, etc.) */
export function createSignTexture({
  kicker,
  title,
  body,
  accent,
}: {
  kicker?: string;
  title: string;
  body?: string;
  accent: string;
}) {
  const W = 480;
  const H = 640;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, "#141418");
  gradient.addColorStop(1, "#070708");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = accent;
  ctx.fillRect(40, 56, 56, 6);

  let y = 110;
  if (kicker) {
    ctx.font = "bold 22px monospace";
    ctx.fillStyle = accent;
    ctx.fillText(kicker.toUpperCase(), 40, y);
    y += 56;
  }

  ctx.font = "900 50px Arial, Helvetica, sans-serif";
  ctx.fillStyle = "#ffffff";
  for (const line of wrap(ctx, title.toUpperCase(), W - 80)) {
    ctx.fillText(line, 40, y);
    y += 56;
  }

  if (body) {
    y += 18;
    ctx.font = "24px Arial, Helvetica, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.62)";
    for (const line of wrap(ctx, body, W - 80).slice(0, 8)) {
      ctx.fillText(line, 40, y);
      y += 34;
    }
  }

  return canvasTexture(canvas);
}

/* Brillo circular (piso debajo de estaciones, sombra del personaje) */
const glowCache = new Map<string, THREE.Texture>();

export function glowTexture(inner: string, outer: string) {
  const key = inner + outer;
  const hit = glowCache.get(key);
  if (hit) return hit;

  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(1, outer);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const texture = canvasTexture(canvas);
  glowCache.set(key, texture);
  return texture;
}
