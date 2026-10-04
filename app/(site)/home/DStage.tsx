"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChevronDown, Power } from "lucide-react";

import { detectQuality, hasWebGL, useReducedMotion, type Quality } from "../lib/device";
import { usePower } from "./power";

/* La D en 3D se descarga aparte, solo en el navegador */
const DScene = dynamic(() => import("./DScene"), { ssr: false });

const noopSubscribe = () => () => {};

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

/* La D de la portada: tocarla prende la página */
export default function DStage() {
  const { on, turnOn } = usePower();
  const stage = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();
  const webgl = useSyncExternalStore(noopSubscribe, hasWebGL, () => false);
  const quality = useSyncExternalStore<Quality>(noopSubscribe, detectQuality, () => "low");
  const visible = useVisible(stage);
  const [ready, setReady] = useState(false);

  /* En celulares lentos, sin WebGL o con movimiento reducido: la D plana */
  const use3D = webgl && quality === "high" && !reducedMotion;

  return (
    <div className="flex flex-col items-center">
      <button
        ref={stage}
        type="button"
        onClick={() => turnOn()}
        aria-label={on ? "Darkside UY" : "Encender la página"}
        aria-pressed={on}
        className="relative aspect-square w-[min(66vw,38svh,24rem)] select-none outline-none focus-visible:ring-2 focus-visible:ring-ds-red md:w-[min(40vw,32rem)]"
      >
        {/* Resplandor que crece al encender */}
        <span
          aria-hidden
          className={`absolute inset-[12%] rounded-full bg-ds-red blur-[70px] transition-opacity duration-700 ${on ? "opacity-40" : "opacity-15"}`}
        />

        {(!use3D || !ready) && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/LOGO1.png"
              alt=""
              width={1080}
              height={1080}
              priority
              className={`h-[86%] w-auto invert transition-[filter,opacity] duration-700 ${
                on ? "opacity-100 drop-shadow-[0_0_30px_rgba(229,9,20,0.9)]" : "opacity-30"
              }`}
            />
          </span>
        )}
        {use3D && (
          <span className={`absolute inset-0 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}>
            <DScene on={on} visible={visible} quality={quality} onReady={() => setReady(true)} />
          </span>
        )}
      </button>

      {/* Indicación: tocar para encender / bajar para recorrer */}
      <p
        aria-live="polite"
        className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/55"
      >
        {on ? (
          <>
            <ChevronDown size={14} className="text-ds-red motion-safe:animate-bounce" /> Encendido · bajá para recorrer
          </>
        ) : (
          <>
            <Power size={13} className="text-ds-red motion-safe:animate-pulse" /> Tocá la D para encender
          </>
        )}
      </p>
    </div>
  );
}
