import * as THREE from "three";

/* Personaje en pixel art (16×24) dibujado a mano.
   Es la parte "2D" del estilo híbrido: sprites planos en un mundo 3D.
   Para cambiar el diseño alcanza con editar las letras de abajo. */

const PALETTE: Record<string, string> = {
  K: "#050505", // contorno
  H: "#1d1d22", // buzo
  G: "#34343c", // luces del buzo
  R: "#E50914", // rojo Darkside
  S: "#d9a07a", // piel
  J: "#262a3a", // jean
  B: "#e8e8e8", // championes
};

const BODY = [
  "......KKKK......",
  ".....KHHHHK.....",
  "....KHGGHHHK....",
  "...KHGHHHHHHK...",
  "...KHHSSSSHHK...",
  "...KHSKSSKSHK...",
  "...KHSSSSSSHK...",
  "...KHHSSSSHHK...",
  "....KHHHHHHK....",
  "...KHHHRRHHHK...",
  "..KHGHHRRHHHHK..",
  "..KHKHHHHHHKHK..",
  "..KHKHRRRRHKHK..",
  "..KSKHHHHHHKSK..",
  "...K.KHHHHK.K...",
];

const LEGS_IDLE = [
  ".....KJJJJK.....",
  ".....KJJJJK.....",
  ".....KJKKJK.....",
  ".....KJKKJK.....",
  ".....KJKKJK.....",
  ".....KJKKJK.....",
  "....KBBKKBBK....",
  "....KKKKKKKK....",
  "................",
];

const LEGS_STEP = [
  ".....KJJJJK.....",
  ".....KJJJJK.....",
  "....KJJKKJK.....",
  "....KJK.KJK.....",
  "...KJK...KJK....",
  "...KJK...KJK....",
  "..KBBK...KBBK...",
  "..KKKK...KKKK...",
  "................",
];

const W = 16;
const H = BODY.length + LEGS_IDLE.length;

function drawFrame(
  ctx: CanvasRenderingContext2D,
  rows: string[],
  offsetX: number,
  mirror: boolean
) {
  rows.forEach((row, y) => {
    const line = row.padEnd(W, ".");
    for (let x = 0; x < W; x++) {
      const color = PALETTE[line[mirror ? W - 1 - x : x]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(offsetX + x, y, 1, 1);
    }
  });
}

/* Hoja de sprites con 3 cuadros: quieto, paso A, paso B */
export const SPRITE_FRAMES = 3;

export function createPlayerSheet() {
  const canvas = document.createElement("canvas");
  canvas.width = W * SPRITE_FRAMES;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  const frames: [string[], boolean][] = [
    [[...BODY, ...LEGS_IDLE], false],
    [[...BODY, ...LEGS_STEP], false],
    [[...BODY, ...LEGS_STEP], true],
  ];

  frames.forEach(([rows, mirror], i) => drawFrame(ctx, rows, i * W, mirror));

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.repeat.set(1 / SPRITE_FRAMES, 1);

  return { texture, aspect: W / H };
}

/* Cartel de texto pixelado (nombres, títulos de zona) */
export function createLabelTexture(
  text: string,
  { color = "#ffffff", background = "", font = "bold 44px monospace" } = {}
) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = font;
  const width = Math.ceil(ctx.measureText(text).width) + 48;
  canvas.width = width;
  canvas.height = 72;

  if (background) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;

  return { texture, aspect: canvas.width / canvas.height };
}
