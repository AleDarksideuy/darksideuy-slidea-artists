"use client";

import { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Pause, Play } from "lucide-react";

import { detectQuality, hasWebGL, useReducedMotion, type Quality } from "../../lib/device";
import { useMusic } from "../../music/MusicProvider";
import { spin } from "./spin";

/* El 3D se descarga aparte, solo en el navegador */
const VinylScene = dynamic(() => import("./VinylScene"), { ssr: false });

const noopSubscribe = () => () => {};

/* Etiqueta por defecto: rojo Darkside con el monograma D en blanco */
function useMonogramLabel() {
  const [label, setLabel] = useState<string | null>(null);
  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      const size = 512;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#E50914";
      ctx.fillRect(0, 0, size, size);
      /* monograma en blanco */
      const mark = document.createElement("canvas");
      mark.width = mark.height = size;
      const m = mark.getContext("2d")!;
      m.drawImage(img, size * 0.22, size * 0.22, size * 0.56, size * 0.56);
      m.globalCompositeOperation = "source-in";
      m.fillStyle = "#fff";
      m.fillRect(0, 0, size, size);
      ctx.drawImage(mark, 0, 0);
      setLabel(canvas.toDataURL("image/png"));
    };
    img.src = "/LOGO1.png";
  }, []);
  return label;
}

/* Visible en pantalla (el 3D se pausa fuera de vista) */
function useVisible(ref: React.RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}

export default function VinylStage() {
  const { tracks, current, isPlaying, toggle } = useMusic();
  const stage = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; t: number; moved: number; lastX: number; lastT: number } | null>(null);

  const reducedMotion = useReducedMotion();
  const webgl = useSyncExternalStore(noopSubscribe, hasWebGL, () => false);
  const quality = useSyncExternalStore<Quality>(noopSubscribe, detectQuality, () => "low");
  const visible = useVisible(stage);
  const monogram = useMonogramLabel();
  const [ready, setReady] = useState(false);

  const featured = current ?? tracks[0];
  const playing = isPlaying && current !== null;
  /* En celulares lentos o con movimiento reducido: el disco en CSS */
  const use3D = webgl && quality === "high" && !reducedMotion;
  const label = current
    ? `/_next/image?url=${encodeURIComponent(current.cover)}&w=384&q=75`
    : monogram;

  /* Arrastrar = girar el disco; tocar = play/pausa */
  const onPointerDown = (e: React.PointerEvent) => {
    gesture.current = { x: e.clientX, t: performance.now(), moved: 0, lastX: e.clientX, lastT: performance.now() };
    spin.dragging = true;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const g = gesture.current;
    if (!g) return;
    const now = performance.now();
    const dx = e.clientX - g.lastX;
    g.moved += Math.abs(dx);
    spin.velocity = (-dx / Math.max(8, now - g.lastT)) * 30;
    g.lastX = e.clientX;
    g.lastT = now;
  };
  const onPointerUp = () => {
    const g = gesture.current;
    spin.dragging = false;
    gesture.current = null;
    if (g && g.moved < 8 && performance.now() - g.t < 400) toggle(featured.id);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={stage}
        role="button"
        tabIndex={0}
        aria-label={`${playing ? "Pausar" : "Escuchar"} ${featured.title} de ${featured.artist}`}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle(featured.id);
          }
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative aspect-square w-[min(70vw,40svh,26rem)] cursor-pointer touch-pan-y select-none outline-none focus-visible:ring-2 focus-visible:ring-ds-red md:w-[min(42vw,34rem)]"
      >
        {/* Disco en CSS: mientras carga el 3D, o como versión liviana */}
        {(!use3D || !ready) && (
          <CssVinyl label={label} playing={playing && !reducedMotion} />
        )}
        {use3D && label && (
          <div className={`absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}>
            <Suspense fallback={null}>
              <VinylScene
                label={label}
                playing={playing}
                visible={visible}
                quality={quality}
                reducedMotion={reducedMotion}
                onReady={() => setReady(true)}
              />
            </Suspense>
          </div>
        )}
      </div>

      {/* Qué suena */}
      <button
        onClick={() => toggle(featured.id)}
        className="mt-2 flex max-w-full items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] py-2 pl-2 pr-5 text-left active:scale-[0.98]"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ds-red">
          {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" className="ml-0.5" />}
        </span>
        <span className="min-w-0">
          <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
            {playing ? "Sonando · Darkside's Pick" : "Tocá el disco · Darkside's Pick"}
          </span>
          <span className="block truncate text-sm font-semibold">
            {featured.title} <span className="font-normal text-white/50">— {featured.artist}</span>
          </span>
        </span>
      </button>
    </div>
  );
}

/* Versión CSS del vinilo: surcos con degradados y etiqueta circular */
function CssVinyl({ label, playing }: { label: string | null; playing: boolean }) {
  return (
    <div className="absolute inset-[6%] [perspective:900px]">
      <div
        className="relative h-full w-full rounded-full shadow-[0_30px_80px_rgba(0,0,0,0.8),0_0_80px_rgba(229,9,20,0.15)] [transform:rotateX(22deg)]"
        style={{
          background:
            "radial-gradient(circle, transparent 33%, rgba(0,0,0,0) 34%), repeating-radial-gradient(circle, #0b0b0b 0 2px, #151515 2px 3px), conic-gradient(from 45deg, rgba(255,255,255,0.08), transparent 20%, rgba(255,255,255,0.06) 50%, transparent 70%)",
        }}
      >
        <div
          className={`absolute inset-[33%] overflow-hidden rounded-full bg-ds-red ${playing ? "animate-[spin_1.8s_linear_infinite]" : ""}`}
        >
          {label && <Image src={label} alt="" fill sizes="160px" className="object-cover" unoptimized />}
        </div>
        <div className="absolute left-1/2 top-1/2 h-[3%] w-[3%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}
