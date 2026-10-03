"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";

import type { Quality } from "../../lib/device";
import { spin } from "./spin";

/* ═══════════════════════════════════════════════════════════════
   EL VINILO (3D)
   Disco negro con surcos y etiqueta. Sin modelos ni texturas externas:
   la geometría y los surcos se generan acá, así pesa casi nada.
   ═══════════════════════════════════════════════════════════════ */

const RPM_33 = (33.3 / 60) * Math.PI * 2; // velocidad real de un LP

type VinylSceneProps = {
  label: string; // imagen de la etiqueta (portada del tema o monograma)
  playing: boolean;
  visible: boolean;
  quality: Quality;
  reducedMotion: boolean;
  onReady: () => void;
};

export default function VinylScene({ label, playing, visible, quality, reducedMotion, onReady }: VinylSceneProps) {
  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      dpr={quality === "low" ? 1 : [1, 1.75]}
      gl={{ antialias: quality === "high", alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 30, position: [0, 0, 5.2] }}
      onCreated={onReady}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <ambientLight intensity={0.35} />
      {/* Luz blanca rasante: el brillo que corre sobre los surcos */}
      <directionalLight position={[3, 4, 3]} intensity={2.2} />
      {/* Contraluz rojo de la marca */}
      <pointLight position={[-2.5, -1.5, 2]} color="#E50914" intensity={18} decay={2} />
      <Disc label={label} playing={playing} quality={quality} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

/* Surcos: anillos concéntricos dibujados en un canvas */
function useGrooves(size: number) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const c = size / 2;
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, size, size);
    for (let r = c * 0.36; r < c; r += 1.6) {
      /* variación fija (no aleatoria) para que siempre se dibuje igual */
      const shade = 10 + Math.round((Math.sin(r * 12.9898) * 0.5 + 0.5) * 14);
      ctx.strokeStyle = `rgb(${shade},${shade},${shade})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(c, c, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    /* separación entre temas */
    for (const k of [0.52, 0.68, 0.84]) {
      ctx.strokeStyle = "#1c1c1c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(c, c, c * k, 0, Math.PI * 2);
      ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    return texture;
  }, [size]);
}

function Disc({
  label,
  playing,
  quality,
  reducedMotion,
}: {
  label: string;
  playing: boolean;
  quality: Quality;
  reducedMotion: boolean;
}) {
  const disc = useRef<THREE.Group>(null);
  const tilt = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const grooves = useGrooves(quality === "low" ? 512 : 1024);
  const segments = quality === "low" ? 64 : 128;

  useEffect(() => () => grooves.dispose(), [grooves]);

  useFrame((state, delta) => {
    const s = spin;
    if (!disc.current) return;

    /* Con música gira a 33⅓; al arrastrar sigue al dedo y luego vuelve */
    const target = playing && !reducedMotion ? RPM_33 : 0;
    if (!s.dragging) s.velocity += (target - s.velocity) * Math.min(1, delta * 1.6);
    disc.current.rotation.y -= s.velocity * delta;

    /* Leve balanceo para que se lea el volumen */
    if (tilt.current && !reducedMotion) {
      const t = state.clock.elapsedTime;
      tilt.current.rotation.x = 1.12 + Math.sin(t * 0.5) * 0.03;
      tilt.current.rotation.z = Math.sin(t * 0.35) * 0.04;
    }
  });

  const size = Math.min(viewport.width, viewport.height) * 0.46;

  return (
    <group ref={tilt} rotation={[1.12, 0, 0]} scale={size}>
      <group ref={disc}>
        {/* Cuerpo del disco */}
        <mesh>
          <cylinderGeometry args={[1, 1, 0.025, segments]} />
          <meshPhysicalMaterial color="#050505" roughness={0.45} clearcoat={0.8} clearcoatRoughness={0.25} />
        </mesh>
        {/* Caras con surcos */}
        {[1, -1].map((side) => (
          <mesh key={side} position={[0, side * 0.0131, 0]} rotation={[-side * (Math.PI / 2), 0, 0]}>
            <circleGeometry args={[1, segments]} />
            <meshPhysicalMaterial map={grooves} roughness={0.35} clearcoat={1} clearcoatRoughness={0.2} />
          </mesh>
        ))}
        {/* Etiqueta: mientras carga la portada, rojo liso */}
        <Suspense fallback={<LabelMesh segments={segments} />}>
          <LabelTexture url={label} segments={segments} />
        </Suspense>
        {/* Agujero central */}
        <mesh position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.025, 24]} />
          <meshBasicMaterial color="#000" />
        </mesh>
      </group>
    </group>
  );
}

function LabelTexture({ url, segments }: { url: string; segments: number }) {
  const source = useLoader(THREE.TextureLoader, url);
  const texture = useMemo(() => {
    const t = source.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.needsUpdate = true;
    return t;
  }, [source]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <LabelMesh segments={segments} map={texture} />;
}

function LabelMesh({ segments, map }: { segments: number; map?: THREE.Texture }) {
  return (
    <mesh position={[0, 0.0135, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.34, segments]} />
      <meshStandardMaterial map={map ?? null} color={map ? "#ffffff" : "#E50914"} roughness={0.7} />
    </mesh>
  );
}
