"use client";

import { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  BufferGeometry,
  CanvasTexture,
  DirectionalLight,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";

import type { Quality } from "../lib/device";

/* ═══════════════════════════════════════════════════════════════
   LA TABLA DE SKATE EN 3D
   Hecha con código: solo la tabla (nose, tail y cóncavo), con el logo
   de Darkside impreso en la lija (los logos que ya usa el sitio).
   La parte de abajo nunca se ve: todos los giros son shove-it, sobre
   el eje que sale de la lija. Entra deslizando con un shove-it,
   arrastrarla la gira y tocarla hace otro.
   ═══════════════════════════════════════════════════════════════ */

const RED = 0xe50914;
const FOV = 30;
const ENTER_S = 1.5;
const SPIN_S = 0.7;
/* Altura de la línea del piso en el cuadro (0 arriba, 1 abajo): coincide con la de LigaSkaters */
export const GROUND = 0.76;

/* Medidas de la tabla (largo total 2) */
const HALF_L = 1;
const HALF_W = 0.25;
const THICK = 0.035;
const KICK_FROM = 0.66;

/* Ancho de la tabla en cada punto del largo: recta en el medio, redonda en las puntas */
const halfWidth = (x: number) => {
  const straight = HALF_L - HALF_W;
  const ax = Math.abs(x);
  if (ax <= straight) return HALF_W;
  const d = Math.min(ax - straight, HALF_W);
  return Math.sqrt(HALF_W * HALF_W - d * d);
};
/* Altura de la superficie: nose y tail levantados, y el cóncavo de lado a lado */
const lift = (x: number, y: number) => {
  const ax = Math.abs(x);
  const kick = ax > KICK_FROM ? Math.pow(ax - KICK_FROM, 2) * 1.1 : 0;
  return kick + 0.5 * y * y;
};

/* La tabla: cara de arriba (lija con el logo), cara de abajo y canto (madera) */
function deckGeometry(nu: number, nv: number) {
  const pos: number[] = [];
  const uv: number[] = [];
  const index: number[] = [];
  const grid = (side: 1 | -1) => {
    const start = pos.length / 3;
    for (let i = 0; i <= nu; i++) {
      const x = -HALF_L + (2 * HALF_L * i) / nu;
      const w = halfWidth(x);
      for (let j = 0; j <= nv; j++) {
        const y = -w + (2 * w * j) / nv;
        pos.push(x, y, lift(x, y) + (side * THICK) / 2);
        uv.push((x / HALF_L + 1) / 2, (y / HALF_W + 1) / 2);
      }
    }
    const groupStart = index.length;
    for (let i = 0; i < nu; i++) {
      for (let j = 0; j < nv; j++) {
        const a = start + i * (nv + 1) + j;
        const b = a + nv + 1;
        if (side === 1) index.push(a, b, a + 1, b, b + 1, a + 1);
        else index.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
    return { start, groupStart, count: index.length - groupStart };
  };
  const top = grid(1);
  const bottom = grid(-1);

  /* Canto: recorre el borde (un lado de punta a punta y vuelve por el otro) */
  const ring: number[] = [];
  for (let i = 0; i <= nu; i++) ring.push(i * (nv + 1));
  for (let i = nu; i >= 0; i--) ring.push(i * (nv + 1) + nv);
  const edgeStart = pos.length / 3;
  ring.forEach((k, n) => {
    for (const base of [top.start, bottom.start]) {
      const p = (base + k) * 3;
      pos.push(pos[p], pos[p + 1], pos[p + 2]);
      uv.push(n / ring.length, base === top.start ? 1 : 0);
    }
  });
  const edgeGroup = index.length;
  for (let n = 0; n < ring.length - 1; n++) {
    const t0 = edgeStart + n * 2;
    const t1 = t0 + 2;
    index.push(t0, t0 + 1, t1, t1, t0 + 1, t1 + 1);
  }

  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  geo.setIndex(index);
  geo.addGroup(top.groupStart, top.count, 0);
  geo.addGroup(bottom.groupStart, bottom.count, 1);
  geo.addGroup(edgeGroup, index.length - edgeGroup, 2);
  geo.computeVertexNormals();
  return geo;
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/* Pinta la forma del logo (blanco, con o sin fondo) de un color */
function tinted(img: HTMLImageElement, color: string) {
  const c = document.createElement("canvas");
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, c.width, c.height);
  const px = data.data;
  for (let i = 0; i < px.length; i += 4) {
    const lum = (px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114) / 255;
    px[i + 3] = Math.round(px[i + 3] * lum);
  }
  ctx.putImageData(data, 0, 0);
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, c.width, c.height);
  return c;
}

/* La lija: negra con grano y "Darksideuy" en blanco, centrado.
   El logo va en la parte plana (nose y tail se levantan desde el 17 % de cada punta). */
function gripTexture(width: number, wordmark: HTMLImageElement | null, font: string) {
  const h = width / 4;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#121212";
  ctx.fillRect(0, 0, width, h);

  if (wordmark) {
    const wm = tinted(wordmark, "#f2f2f2");
    const ww = width * 0.54;
    const wh = (ww * wordmark.naturalHeight) / wordmark.naturalWidth;
    ctx.drawImage(wm, (width - ww) / 2, (h - wh) / 2, ww, wh);
  } else {
    ctx.fillStyle = "#f2f2f2";
    ctx.font = `700 ${h * 0.3}px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("DARKSIDEUY", width / 2, h / 2);
  }

  /* Grano de lija por encima de todo, logo incluido */
  const grain = ctx.getImageData(0, 0, width, h);
  const px = grain.data;
  for (let i = 0; i < px.length; i += 4) {
    const n = (Math.random() - 0.5) * 34;
    px[i] = Math.max(0, Math.min(255, px[i] + n));
    px[i + 1] = Math.max(0, Math.min(255, px[i + 1] + n));
    px[i + 2] = Math.max(0, Math.min(255, px[i + 2] + n));
  }
  ctx.putImageData(grain, 0, 0);

  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function shadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(0,0,0,0.7)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new CanvasTexture(canvas);
}

type LigaBoardProps = {
  visible: boolean;
  quality: Quality;
  onReady: () => void;
};

export default function LigaBoard({ visible, quality, onReady }: LigaBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const live = useRef({ visible, enterStart: null as number | null, entered: false });
  const readyRef = useRef(onReady);

  useEffect(() => {
    readyRef.current = onReady;
  });

  useEffect(() => {
    live.current.visible = visible;
    /* La primera vez que aparece, entra con el kickflip */
    if (visible && !live.current.entered && live.current.enterStart === null) live.current.enterStart = performance.now() / 1000;
  }, [visible]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const low = quality === "low";
    let disposed = false;
    let cleanup = () => {};

    const font = getComputedStyle(canvas).getPropertyValue("--font-space-grotesk").trim() || "sans-serif";
    const logo = loadImage("/Darksideuy.png").catch(() => null);

    logo.then((wordmark) => {
      if (disposed) return;

      const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: !low, powerPreference: "high-performance" });
      renderer.setPixelRatio(low ? 1 : Math.min(window.devicePixelRatio, 1.75));
      renderer.toneMapping = ACESFilmicToneMapping;

      const scene = new Scene();
      const camera = new PerspectiveCamera(FOV, 1, 0.1, 50);
      camera.position.set(0, 0.3, 7);
      camera.lookAt(0, -0.1, 0);

      scene.add(new AmbientLight(0xffffff, 0.55));
      const key = new DirectionalLight(0xffffff, 2.2);
      key.position.set(2, 3, 5);
      const rim = new DirectionalLight(0xffffff, 1.4);
      rim.position.set(-3, 2, -3);
      const bounce = new PointLight(RED, 10, 0, 2);
      bounce.position.set(-1.5, -1.4, 2);
      scene.add(key, rim, bounce);

      /* Materiales: lija con el logo, abajo y canto de madera */
      const gripTex = gripTexture(low ? 1024 : 2048, wordmark, font);
      const shadowTex = shadowTexture();
      const grip = new MeshStandardMaterial({ map: gripTex, roughness: 0.95, metalness: 0 });
      const under = new MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 });
      const wood = new MeshStandardMaterial({ color: 0xc9a27a, roughness: 0.8 });
      const shadowMat = new MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });

      const deckGeo = deckGeometry(low ? 40 : 80, low ? 6 : 10);
      const board = new Mesh(deckGeo, [grip, under, wood]);

      /* root: posición · pose: inclinada hacia atrás, con la lija a la cámara · spin: shove-it */
      const root = new Group();
      const pose = new Group();
      const spin = new Group();
      spin.add(board);
      pose.add(spin);
      root.add(pose);
      const shadow = new Mesh(new PlaneGeometry(2.6, 0.9), shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      scene.add(root, shadow);

      /* Inclinación fija: lo bastante chica para que la parte de abajo no aparezca nunca */
      const POSE_X = -0.55;
      const POSE_Z = 0.1;

      let scale = 1;
      let startX = -6;
      let floatY = 0;
      let groundY = -1;
      const resize = () => {
        const { clientWidth: w, clientHeight: h } = canvas;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const viewH = 2 * Math.tan((FOV * Math.PI) / 360) * camera.position.z;
        const viewW = viewH * camera.aspect;
        const portrait = camera.aspect < 1;
        scale = Math.min(viewW * (portrait ? 0.46 : 0.42), viewH * 0.7);
        root.scale.setScalar(scale);
        startX = -(viewW / 2 + scale * 1.3);
        camera.updateMatrixWorld();
        const ray = new Vector3(0, 1 - 2 * GROUND, 0.5).unproject(camera).sub(camera.position);
        groundY = camera.position.y + (ray.y * -camera.position.z) / ray.z;
        /* En celular sube más, para que no quede pegada al piso ni tapada por el menú */
        floatY = groundY + scale * 0.5 + (portrait ? viewH * 0.14 : 0);
        shadow.scale.setScalar(scale);
        shadow.position.y = groundY;
      };
      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(canvas);

      /* Arrastrar de costado la gira sobre la lija (y vuelve sola al derecho); un toque, shove-it */
      let spinAngle = 0;
      let spinSpeed = 0;
      let shoveStart: number | null = null;
      let dragX: number | null = null;
      let moved = 0;
      const down = (e: PointerEvent) => {
        dragX = e.clientX;
        moved = 0;
        canvas.setPointerCapture(e.pointerId);
      };
      const move = (e: PointerEvent) => {
        if (dragX === null) return;
        const dx = e.clientX - dragX;
        moved += Math.abs(dx);
        spinAngle -= (dx / canvas.clientWidth) * Math.PI * 1.6;
        spinSpeed = 0;
        dragX = e.clientX;
      };
      const up = () => {
        if (dragX !== null && moved < 6 && live.current.entered && shoveStart === null) shoveStart = performance.now() / 1000;
        dragX = null;
      };
      canvas.addEventListener("pointerdown", down);
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerup", up);
      canvas.addEventListener("pointercancel", up);

      let last = performance.now();
      let frame = 0;
      let first = true;
      const tick = () => {
        frame = requestAnimationFrame(tick);
        if (!live.current.visible && !first) return;

        const now = performance.now();
        const delta = Math.min((now - last) / 1000, 0.1);
        last = now;
        const t = now / 1000;

        let x = live.current.entered ? 0 : startX;
        let hop = 0;
        let shove = 0;

        const start = live.current.enterStart;
        if (start !== null) {
          /* Entrada: desliza y, en el último tramo, shove-it de 360 hasta quedar derecha */
          const p = Math.min(1, (t - start) / ENTER_S);
          x = startX * Math.pow(1 - p, 3);
          const f = Math.max(0, (p - 0.4) / 0.6);
          shove = (1 - Math.pow(1 - f, 2)) * Math.PI * 2 - Math.PI * 2;
          hop = Math.sin(f * Math.PI) * 0.4;
          if (p >= 1) {
            live.current.enterStart = null;
            live.current.entered = true;
          }
        } else if (live.current.entered) {
          if (shoveStart !== null) {
            const f = Math.min(1, (t - shoveStart) / SPIN_S);
            shove = (1 - Math.pow(1 - f, 2)) * Math.PI * 2;
            hop = Math.sin(f * Math.PI) * 0.35;
            if (f >= 1) shoveStart = null;
          }
          /* Sin arrastre: vuelve a la posición derecha más cercana con un resorte suave */
          if (dragX === null) {
            const target = Math.round(spinAngle / (Math.PI * 2)) * Math.PI * 2;
            spinSpeed += ((target - spinAngle) * 9 - spinSpeed * 3.2) * delta;
            spinAngle += spinSpeed * delta;
          }
        }

        root.position.set(x, floatY + hop * scale + Math.sin(t * 1.2) * scale * 0.03, 0);
        pose.rotation.set(POSE_X + Math.sin(t * 0.6) * 0.04, Math.sin(t * 0.45) * 0.08, POSE_Z);
        spin.rotation.z = spinAngle + shove;
        shadow.position.x = x;
        shadow.scale.setScalar(scale * (1 - hop * 0.5));

        renderer.render(scene, camera);
        if (first) {
          first = false;
          readyRef.current();
        }
      };
      frame = requestAnimationFrame(tick);

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        canvas.removeEventListener("pointerdown", down);
        canvas.removeEventListener("pointermove", move);
        canvas.removeEventListener("pointerup", up);
        canvas.removeEventListener("pointercancel", up);
        [deckGeo, shadow.geometry].forEach((g) => g.dispose());
        [grip, under, wood, shadowMat].forEach((m) => m.dispose());
        [gripTex, shadowTex].forEach((tex) => tex.dispose());
        renderer.dispose();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, [quality]);

  return <canvas ref={canvasRef} aria-hidden className="block h-full w-full cursor-grab touch-pan-y active:cursor-grabbing" />;
}
