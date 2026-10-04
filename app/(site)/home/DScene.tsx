"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import type { Quality } from "../lib/device";
import { MONOGRAM, MONOGRAM_ASPECT } from "./monogram";

/* ═══════════════════════════════════════════════════════════════
   LA D EN 3D
   El monograma de Darkside extruido (trazado desde LOGO1.png).
   Apagada: casi negra, con una luz roja que la recorre despacio.
   Al encender: da un giro y se ilumina.
   ═══════════════════════════════════════════════════════════════ */

const RED = "#E50914";

type DSceneProps = {
  on: boolean;
  visible: boolean;
  quality: Quality;
  onReady: () => void;
};

export default function DScene({ on, visible, quality, onReady }: DSceneProps) {
  return (
    <Canvas
      frameloop={visible ? "always" : "never"}
      dpr={quality === "low" ? 1 : [1, 1.75]}
      gl={{ antialias: quality === "high", alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 32, position: [0, 0, 5] }}
      onCreated={onReady}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <Monogram on={on} quality={quality} />
    </Canvas>
  );
}

function Monogram({ on, quality }: { on: boolean; quality: Quality }) {
  const mesh = useRef<THREE.Mesh>(null);
  const lamp = useRef<THREE.PointLight>(null);
  const key = useRef<THREE.DirectionalLight>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const spinStart = useRef<number | null>(null);
  const { viewport, clock } = useThree();

  const geometry = useMemo(() => {
    const shapes = MONOGRAM.map(({ outer, holes }) => {
      const shape = new THREE.Shape(outer.map(([x, y]) => new THREE.Vector2(x, y)));
      shape.holes = holes.map((hole) => new THREE.Path(hole.map(([x, y]) => new THREE.Vector2(x, y))));
      return shape;
    });
    const geo = new THREE.ExtrudeGeometry(shapes, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.022,
      bevelSize: 0.01,
      bevelSegments: quality === "low" ? 1 : 4,
    });
    geo.center();
    return geo;
  }, [quality]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  /* Al encender: un giro completo */
  useEffect(() => {
    if (on) spinStart.current = clock.elapsedTime;
  }, [on, clock]);

  const scale = Math.min(viewport.height * 0.8, (viewport.width * 0.8) / MONOGRAM_ASPECT);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const k = 1 - Math.exp(-delta * 3);

    /* La luz roja da vueltas delante de la letra */
    if (lamp.current) {
      lamp.current.position.set(Math.sin(t * 0.7) * 1.6, Math.cos(t * 0.9) * 1.1, 1.5);
      lamp.current.intensity += ((on ? 48 : 16) - lamp.current.intensity) * k;
    }
    /* Encendida: entra una luz blanca de frente */
    if (key.current) key.current.intensity += ((on ? 2.6 : 0.05) - key.current.intensity) * k;
    /* y la letra toma un brillo rojo propio */
    if (material.current) material.current.emissiveIntensity += ((on ? 0.35 : 0) - material.current.emissiveIntensity) * k;

    if (!mesh.current) return;
    let spin = 0;
    if (spinStart.current !== null) {
      const p = Math.min(1, (t - spinStart.current) / 1.2);
      spin = (1 - Math.pow(1 - p, 3)) * Math.PI * 2;
      if (p >= 1) spinStart.current = null;
    }
    /* Balanceo suave + el giro del encendido */
    mesh.current.rotation.y = Math.sin(t * 0.5) * 0.28 + spin;
    mesh.current.rotation.x = Math.sin(t * 0.35) * 0.08;
  });

  return (
    <>
      <ambientLight intensity={0.05} />
      {/* Contraluz blanco tenue: el contorno se adivine en la oscuridad */}
      <directionalLight position={[-2, 3, -4]} intensity={0.9} />
      <directionalLight ref={key} position={[0, 1.5, 4]} intensity={0.05} />
      <pointLight ref={lamp} color={RED} intensity={16} decay={2} />

      <mesh ref={mesh} geometry={geometry} scale={scale}>
        <meshStandardMaterial ref={material} color="#0d0d0f" emissive="#E50914" emissiveIntensity={0} metalness={0.65} roughness={0.3} />
      </mesh>
    </>
  );
}
