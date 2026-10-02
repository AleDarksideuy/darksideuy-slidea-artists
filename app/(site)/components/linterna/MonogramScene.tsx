"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { MONOGRAM, MONOGRAM_ASPECT } from "./monogram";
import type { Quality } from "./device";
import type { Light } from "./useFlashlight";

const RED = "#E50914";

type SceneProps = {
  light: RefObject<Light>;
  visible: boolean;
  quality: Quality;
  reducedMotion: boolean;
  onReady?: () => void;
};

/* El monograma D en 3D: negro, casi invisible en la oscuridad, hasta que
   la linterna roja lo alcanza. */
export default function MonogramScene({ light, visible, quality, reducedMotion, onReady }: SceneProps) {
  /* En celulares modestos (o con movimiento reducido) la escena es
     estática: solo se redibuja cuando la luz se mueve. */
  const onDemand = quality === "low" || reducedMotion;

  return (
    <Canvas
      frameloop={!visible ? "never" : onDemand ? "demand" : "always"}
      dpr={quality === "low" ? 1 : [1, 1.75]}
      gl={{ antialias: quality === "high", alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 35, position: [0, 0, 5] }}
      onCreated={() => onReady?.()}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <Monogram light={light} quality={quality} reducedMotion={reducedMotion} onDemand={onDemand} />
    </Canvas>
  );
}

function Monogram({
  light,
  quality,
  reducedMotion,
  onDemand,
}: {
  light: RefObject<Light>;
  quality: Quality;
  reducedMotion: boolean;
  onDemand: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const lamp = useRef<THREE.PointLight>(null);
  const { viewport, invalidate } = useThree();

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

  /* Escena estática: redibujar cuando cambia la luz */
  useEffect(() => {
    if (!onDemand) return;
    let frame = 0;
    let last = "";
    const check = () => {
      const key = `${light.current.nx.toFixed(3)},${light.current.ny.toFixed(3)}`;
      if (key !== last) {
        last = key;
        invalidate();
      }
      frame = requestAnimationFrame(check);
    };
    frame = requestAnimationFrame(check);
    return () => cancelAnimationFrame(frame);
  }, [onDemand, invalidate, light]);

  /* Que entre en pantallas angostas */
  const scale = Math.min(viewport.height * 0.42, (viewport.width * (viewport.width < viewport.height ? 0.52 : 0.7)) / MONOGRAM_ASPECT);

  useFrame((_, delta) => {
    const { nx, ny } = light.current;

    /* La linterna, delante de la letra */
    lamp.current?.position.set(nx * viewport.width * 0.5, ny * viewport.height * 0.5 + 0.2, 1.6);

    /* La letra gira apenas hacia la luz, como mirándola */
    if (mesh.current && !reducedMotion) {
      const k = onDemand ? 1 : 1 - Math.exp(-delta * 3);
      mesh.current.rotation.y += (nx * 0.42 - mesh.current.rotation.y) * k;
      mesh.current.rotation.x += (-ny * 0.22 - mesh.current.rotation.x) * k;
    }
  });

  return (
    <>
      <ambientLight intensity={0.05} />
      {/* Contraluz blanco muy tenue para que el contorno se adivine */}
      <directionalLight position={[-2, 3, -4]} intensity={0.9} />
      <directionalLight position={[0, 2, 4]} intensity={0.06} />
      <pointLight ref={lamp} color={RED} intensity={22} distance={0} decay={2} />

      <mesh ref={mesh} geometry={geometry} scale={scale} position={[0, viewport.height * 0.09, 0]}>
        <meshStandardMaterial color="#0d0d0f" metalness={0.65} roughness={0.3} />
      </mesh>
    </>
  );
}
