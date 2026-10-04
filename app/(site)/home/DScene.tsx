"use client";

import { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  DirectionalLight,
  ExtrudeGeometry,
  Mesh,
  MeshStandardMaterial,
  Path,
  PerspectiveCamera,
  PointLight,
  Scene,
  Shape,
  Vector2,
  WebGLRenderer,
} from "three";

import type { Quality } from "../lib/device";
import { MONOGRAM, MONOGRAM_ASPECT } from "./monogram";

/* ═══════════════════════════════════════════════════════════════
   LA D EN 3D
   El monograma de Darkside extruido (trazado desde LOGO1.png).
   Apagada: casi negra, con una luz roja que la recorre despacio.
   Al encender: da un giro y se ilumina.
   Escrita con three.js directo (solo las piezas que usa) para que el
   celular descargue y procese lo mínimo.
   ═══════════════════════════════════════════════════════════════ */

const RED = 0xe50914;
const FOV = 32;

type DSceneProps = {
  on: boolean;
  visible: boolean;
  quality: Quality;
  onReady: () => void;
  onContextLost: () => void;
  onContextRestored: () => void;
};

export default function DScene({ on, visible, quality, onReady, onContextLost, onContextRestored }: DSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* Estado que lee el loop sin reiniciar la escena */
  const live = useRef({ on, visible, spinStart: null as number | null });
  const callbacks = useRef({ onReady, onContextLost, onContextRestored });

  useEffect(() => {
    callbacks.current = { onReady, onContextLost, onContextRestored };
  });

  useEffect(() => {
    if (on && !live.current.on) live.current.spinStart = performance.now() / 1000;
    live.current.on = on;
  }, [on]);

  useEffect(() => {
    live.current.visible = visible;
  }, [visible]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: quality === "high", powerPreference: "high-performance" });
    renderer.setPixelRatio(quality === "low" ? 1 : Math.min(window.devicePixelRatio, 1.75));
    /* mismo ajuste de color "de cine" que tenía la versión anterior */
    renderer.toneMapping = ACESFilmicToneMapping;

    const scene = new Scene();
    const camera = new PerspectiveCamera(FOV, 1, 0.1, 50);
    camera.position.set(0, 0, 5);

    /* Luces: contraluz tenue, luz de frente (sube al encender) y la roja que gira */
    scene.add(new AmbientLight(0xffffff, 0.05));
    const rim = new DirectionalLight(0xffffff, 0.9);
    rim.position.set(-2, 3, -4);
    const key = new DirectionalLight(0xffffff, 0.05);
    key.position.set(0, 1.5, 4);
    const lamp = new PointLight(RED, 16, 0, 2);
    scene.add(rim, key, lamp);

    /* La letra */
    const shapes = MONOGRAM.map(({ outer, holes }) => {
      const shape = new Shape(outer.map(([x, y]) => new Vector2(x, y)));
      shape.holes = holes.map((hole) => new Path(hole.map(([x, y]) => new Vector2(x, y))));
      return shape;
    });
    const geometry = new ExtrudeGeometry(shapes, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.022,
      bevelSize: 0.01,
      bevelSegments: quality === "low" ? 1 : 4,
    });
    geometry.center();
    const material = new MeshStandardMaterial({
      color: 0x0d0d0f,
      emissive: RED,
      emissiveIntensity: 0,
      metalness: 0.65,
      roughness: 0.3,
    });
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    /* Tamaño: que la letra entre en el cuadro */
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const viewH = 2 * Math.tan((FOV * Math.PI) / 360) * camera.position.z;
      const viewW = viewH * camera.aspect;
      mesh.scale.setScalar(Math.min(viewH * 0.8, (viewW * 0.8) / MONOGRAM_ASPECT));
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    /* Si el navegador libera la placa de video, se ve la D plana */
    const lost = (e: Event) => {
      e.preventDefault();
      callbacks.current.onContextLost();
    };
    const restored = () => callbacks.current.onContextRestored();
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);

    let last = performance.now();
    let frame = 0;
    let first = true;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      /* fuera de pantalla no dibuja (ahorra batería) */
      if (!live.current.visible && !first) return;

      const now = performance.now();
      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;
      const t = now / 1000;
      const k = 1 - Math.exp(-delta * 3);
      const isOn = live.current.on;

      lamp.position.set(Math.sin(t * 0.7) * 1.6, Math.cos(t * 0.9) * 1.1, 1.5);
      lamp.intensity += ((isOn ? 48 : 16) - lamp.intensity) * k;
      key.intensity += ((isOn ? 2.6 : 0.05) - key.intensity) * k;
      material.emissiveIntensity += ((isOn ? 0.35 : 0) - material.emissiveIntensity) * k;

      let spin = 0;
      const start = live.current.spinStart;
      if (start !== null) {
        const p = Math.min(1, (t - start) / 1.2);
        spin = (1 - Math.pow(1 - p, 3)) * Math.PI * 2;
        if (p >= 1) live.current.spinStart = null;
      }
      mesh.rotation.y = Math.sin(t * 0.5) * 0.28 + spin;
      mesh.rotation.x = Math.sin(t * 0.35) * 0.08;

      renderer.render(scene, camera);
      if (first) {
        first = false;
        callbacks.current.onReady();
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [quality]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none block h-full w-full" />;
}
