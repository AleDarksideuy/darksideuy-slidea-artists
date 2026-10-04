"use client";

import { useEffect, useRef } from "react";

import { useReducedMotion } from "../lib/device";
import { useMusic } from "./MusicProvider";

/* ═══════════════════════════════════════════════════════════════
   EL ANILLO
   Barras rojas alrededor del disco que reaccionan a la música en
   tiempo real (frecuencias del audio que suena). Si el navegador no
   permite analizar el audio, se simula. Solo dibuja en pantalla.
   ═══════════════════════════════════════════════════════════════ */

const BARS = 72;

export default function Visualizer({ innerRatio = 0.62 }: { innerRatio?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { analyser, isPlaying } = useMusic();
  const reducedMotion = useReducedMotion();
  const playing = useRef(isPlaying);

  useEffect(() => {
    playing.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let visible = true;
    const levels = new Float32Array(BARS);
    let data: Uint8Array<ArrayBuffer> | null = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = el.clientWidth * dpr;
      el.height = el.clientHeight * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(draw);
    });
    io.observe(el);

    function draw(now: number) {
      frame = 0;
      if (!visible || !ctx || !el) return;
      const w = el.width;
      const h = el.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = (Math.min(w, h) / 2) * innerRatio;
      const maxLen = Math.min(w, h) / 2 - radius - 4;

      /* Niveles: frecuencias reales, simulación o reposo */
      const node = analyser.current;
      if (node && playing.current) {
        if (!data || data.length !== node.frequencyBinCount) data = new Uint8Array(node.frequencyBinCount);
        node.getByteFrequencyData(data);
      }
      const t = now / 1000;
      for (let i = 0; i < BARS; i++) {
        /* espejo: el anillo es simétrico (graves arriba y abajo) */
        const k = i < BARS / 2 ? i : BARS - 1 - i;
        let target = 0.06;
        if (playing.current && !reducedMotion) {
          if (node && data) {
            const bin = Math.floor((k / (BARS / 2)) * (data.length * 0.7));
            target = Math.max(0.06, data[bin] / 255);
          } else {
            target = 0.25 + 0.35 * Math.abs(Math.sin(t * 2.2 + k * 0.45) * Math.cos(t * 1.3 + k * 0.17));
          }
        } else if (playing.current) {
          target = 0.3;
        }
        levels[i] += (target - levels[i]) * 0.35;
      }

      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.lineWidth = Math.max(2, (Math.PI * 2 * radius) / BARS - 3);
      for (let i = 0; i < BARS; i++) {
        const angle = (i / BARS) * Math.PI * 2 - Math.PI / 2;
        const len = 3 + levels[i] * maxLen;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const alpha = 0.35 + levels[i] * 0.65;
        ctx.strokeStyle = levels[i] > 0.55 ? `rgba(255,91,99,${alpha})` : `rgba(229,9,20,${alpha})`;
        ctx.beginPath();
        ctx.moveTo(cx + cos * (radius + 6), cy + sin * (radius + 6));
        ctx.lineTo(cx + cos * (radius + 6 + len), cy + sin * (radius + 6 + len));
        ctx.stroke();
      }

      /* Sigue animando mientras suena o mientras las barras bajan */
      const settling = levels.some((v) => v > 0.08);
      if (playing.current || settling) frame = requestAnimationFrame(draw);
    }

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
    };
  }, [analyser, innerRatio, reducedMotion, isPlaying]);

  return <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
