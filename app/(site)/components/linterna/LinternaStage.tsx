"use client";

import { useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Space_Grotesk } from "next/font/google";

import { detectQuality, hasWebGL, useReducedMotion, type Quality } from "./device";
import { useFlashlight } from "./useFlashlight";

/* El 3D se descarga aparte y solo en el navegador */
const MonogramScene = dynamic(() => import("./MonogramScene"), { ssr: false });

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["400", "700"] });

const noopSubscribe = () => () => {};

/* Recorrido de la luz cuando nadie la mueve: un ocho lento alrededor de la D */
function idlePath(t: number): [number, number] {
  return [0.5 + Math.sin(t * 0.45) * 0.22, 0.42 + Math.sin(t * 0.9) * 0.12];
}

type LinternaStageProps = {
  /* Frase que solo se lee donde pega la luz */
  hiddenPhrase: string;
  className?: string;
  children: ReactNode;
};

export default function LinternaStage({ hiddenPhrase, className = "", children }: LinternaStageProps) {
  const stage = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { light, visible } = useFlashlight(stage, { reducedMotion, start: [0.62, 0.32], idle: idlePath });

  const webgl = useSyncExternalStore(noopSubscribe, hasWebGL, () => false);
  const quality = useSyncExternalStore<Quality>(noopSubscribe, detectQuality, () => "low");
  const [sceneReady, setSceneReady] = useState(false);

  return (
    <div ref={stage} className={`linterna-stage relative overflow-hidden ${className}`}>
      {/* Resplandor de la linterna sobre el fondo */}
      <div aria-hidden className="linterna-glow pointer-events-none absolute inset-0" />

      {/* La frase del manifiesto, negro sobre negro: aparece con la luz.
          Es decorativa (el mismo texto está en "Sobre nosotros"), por eso aria-hidden. */}
      <p
        aria-hidden
        className={`${spaceGrotesk.className} linterna-phrase pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center font-bold uppercase leading-[0.92] tracking-tight`}
      >
        {hiddenPhrase}
      </p>

      {/* Monograma: el logo plano mientras carga el 3D o si no hay WebGL */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {!sceneReady && (
          <div className="absolute inset-0 flex items-center justify-center pb-[18vh]">
            <Image
              src="/LOGO1.png"
              alt=""
              width={1080}
              height={1080}
              priority
              className="h-[40vh] w-auto opacity-25 invert"
            />
          </div>
        )}
        {webgl && (
          <div className={`absolute inset-0 transition-opacity duration-700 ${sceneReady ? "opacity-100" : "opacity-0"}`}>
            <MonogramScene
              light={light}
              visible={visible}
              quality={quality}
              reducedMotion={reducedMotion}
              onReady={() => setSceneReady(true)}
            />
          </div>
        )}
      </div>

      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
