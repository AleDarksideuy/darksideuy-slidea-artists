"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

import { RED, type Station } from "./zones";
import { createLabelTexture, createSignTexture, glowTexture, optimizedImage } from "./textures";
import type { Quality } from "./quality";

const DIM = new THREE.Color("#4a070a");
const BRIGHT = new THREE.Color("#ff2a35");
const tmpScale = new THREE.Vector3();

type StationProps = {
  station: Station;
  active: boolean;
  playing: boolean;
  quality: Quality;
  onSelect: (station: Station) => void;
};

/* Envoltorio común: posición, animación al estar cerca, clic, nombre y
   brillo en el piso. Lo de adentro depende del tipo de estación. */
export function StationView({ station, active, playing, quality, onSelect }: StationProps) {
  const group = useRef<THREE.Group>(null);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const accent = useRef<THREE.MeshBasicMaterial>(null);

  const { visual } = station;
  const isPortal = visual.kind === "portal";

  const label = useMemo(
    () =>
      createLabelTexture(station.label, {
        font: isPortal ? "900 52px monospace" : "bold 44px monospace",
        color: isPortal ? RED : "#ffffff",
      }),
    [station.label, isPortal]
  );
  const labelH = isPortal ? 0.5 : 0.38;
  const labelW = Math.min(label.aspect * labelH, 3.2);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = 1 - Math.exp(-delta * 8);
    const scale = active ? 1.07 : 1;
    group.current.scale.lerp(tmpScale.set(scale, scale, scale), t);
    group.current.position.y = active
      ? Math.sin(state.clock.elapsedTime * 2) * 0.05 + 0.06
      : THREE.MathUtils.lerp(group.current.position.y, 0, t);

    accent.current?.color.lerp(active ? BRIGHT : DIM, t);
    if (glow.current) {
      glow.current.opacity = THREE.MathUtils.lerp(glow.current.opacity, active ? 0.85 : 0.3, t);
    }
  });

  return (
    <group position={[station.position[0], 0, station.position[1]]} rotation-y={station.rotationY}>
      <group
        ref={group}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(station);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => (document.body.style.cursor = "")}
      >
        {visual.kind === "poster" && (
          <Poster image={visual.image} fit={visual.fit} w={visual.w} h={visual.h} quality={quality} accentRef={accent} />
        )}
        {visual.kind === "sign" && (
          <Sign kicker={visual.kicker} title={visual.title} body={visual.body} accentRef={accent} />
        )}
        {visual.kind === "disc" && (
          <Disc image={visual.image} playing={playing} quality={quality} accentRef={accent} />
        )}
        {visual.kind === "pillar" && <Pillar number={visual.number} accentRef={accent} />}
        {visual.kind === "portal" && <Portal accentRef={accent} active={active} />}

        <mesh position={[0, isPortal ? 4.7 : 0.4, 0.05]}>
          <planeGeometry args={[labelW, labelW / label.aspect]} />
          <meshBasicMaterial map={label.texture} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      </group>

      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 1.1]}>
        <planeGeometry args={[3.6, 2.6]} />
        <meshBasicMaterial
          ref={glow}
          map={glowTexture("rgba(229,9,20,0.9)", "rgba(229,9,20,0)")}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

type AccentRef = React.RefObject<THREE.MeshBasicMaterial | null>;

/* ───────────────────────── Cartel con foto ───────────────────────── */

const FRAME_Y = 2.45;

function useFittedTexture(src: string, w: number, h: number, fit: "cover" | "contain", quality: Quality) {
  const source = useTexture(optimizedImage(src, quality === "low" ? 384 : 640));

  const fitted = useMemo(() => {
    const texture = source.clone();
    const image = source.image as { width: number; height: number };
    const imageAspect = image.width / image.height;
    const frameAspect = w / h;
    texture.colorSpace = THREE.SRGBColorSpace;

    if (fit === "contain") {
      /* Logos: entran completos, sin recortar */
      texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
      return { texture, size: imageAspect > frameAspect ? [w, w / imageAspect] : [h * imageAspect, h] } as const;
    }

    if (imageAspect > frameAspect) {
      texture.repeat.set(frameAspect / imageAspect, 1);
      texture.offset.set((1 - texture.repeat.x) / 2, 0);
    } else {
      texture.repeat.set(1, imageAspect / frameAspect);
      texture.offset.set(0, (1 - texture.repeat.y) / 2);
    }
    texture.needsUpdate = true;
    return { texture, size: [w, h] } as const;
  }, [source, w, h, fit]);

  useEffect(() => () => fitted.texture.dispose(), [fitted]);

  return fitted;
}

function Poster({
  image,
  fit = "cover",
  w = 2.4,
  h = 3.2,
  quality,
  accentRef,
}: {
  image: string;
  fit?: "cover" | "contain";
  w?: number;
  h?: number;
  quality: Quality;
  accentRef: AccentRef;
}) {
  const { texture, size } = useFittedTexture(image, w, h, fit, quality);
  const y = Math.max(FRAME_Y, h / 2 + 0.8);

  return (
    <group position-y={y}>
      <mesh position-z={-0.08}>
        <boxGeometry args={[w + 0.3, h + 0.3, 0.12]} />
        <meshStandardMaterial color="#111114" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position-z={-0.005}>
        <planeGeometry args={[w + 0.14, h + 0.14]} />
        <meshBasicMaterial ref={accentRef} color={DIM} toneMapped={false} />
      </mesh>
      {fit === "contain" && (
        <mesh position-z={0}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial color="#0b0b0d" />
        </mesh>
      )}
      <mesh position-z={0.01}>
        <planeGeometry args={[size[0], size[1]]} />
        <meshBasicMaterial map={texture} transparent={fit === "contain"} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ───────────────────────── Cartel de texto ───────────────────────── */

function Sign({
  kicker,
  title,
  body,
  accentRef,
}: {
  kicker?: string;
  title: string;
  body?: string;
  accentRef: AccentRef;
}) {
  const texture = useMemo(() => createSignTexture({ kicker, title, body, accent: RED }), [kicker, title, body]);

  return (
    <group position-y={FRAME_Y}>
      <mesh position-z={-0.08}>
        <boxGeometry args={[2.7, 3.5, 0.12]} />
        <meshStandardMaterial color="#111114" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position-z={-0.005}>
        <planeGeometry args={[2.54, 3.34]} />
        <meshBasicMaterial ref={accentRef} color={DIM} toneMapped={false} />
      </mesh>
      <mesh>
        <planeGeometry args={[2.4, 3.2]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ───────────────────────── Disco de vinilo ───────────────────────── */

function Disc({
  image,
  playing,
  quality,
  accentRef,
}: {
  image: string;
  playing: boolean;
  quality: Quality;
  accentRef: AccentRef;
}) {
  const disc = useRef<THREE.Group>(null);
  const cover = useTexture(optimizedImage(image, 384));
  const segments = quality === "low" ? 32 : 64;

  useFrame((_, delta) => {
    if (disc.current && playing) disc.current.rotation.z -= delta * 2.4;
  });

  return (
    <group>
      {/* Soporte */}
      <mesh position={[0, 0.9, -0.1]}>
        <boxGeometry args={[0.2, 1.8, 0.2]} />
        <meshStandardMaterial color="#141418" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.06, -0.1]}>
        <boxGeometry args={[1.6, 0.12, 0.8]} />
        <meshStandardMaterial color="#141418" metalness={0.7} roughness={0.35} />
      </mesh>

      <group ref={disc} position={[0, 2.6, 0]}>
        {/* Aro de neón */}
        <mesh position-z={-0.02}>
          <circleGeometry args={[1.42, segments]} />
          <meshBasicMaterial ref={accentRef} color={DIM} toneMapped={false} />
        </mesh>
        {/* Vinilo */}
        <mesh>
          <circleGeometry args={[1.35, segments]} />
          <meshBasicMaterial color="#060606" />
        </mesh>
        {[1.15, 0.95].map((r) => (
          <mesh key={r} position-z={0.004}>
            <ringGeometry args={[r - 0.01, r, segments]} />
            <meshBasicMaterial color="#1c1c1c" />
          </mesh>
        ))}
        {/* Etiqueta con la portada */}
        <mesh position-z={0.008}>
          <circleGeometry args={[0.62, segments]} />
          <meshBasicMaterial map={cover} toneMapped={false} />
        </mesh>
        <mesh position-z={0.012}>
          <circleGeometry args={[0.05, 16]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>
    </group>
  );
}

/* ───────────────────────── Pilar numerado ───────────────────────── */

function Pillar({ number, accentRef }: { number: string; accentRef: AccentRef }) {
  const digits = useMemo(() => createLabelTexture(number, { font: "900 64px monospace", color: RED }), [number]);

  return (
    <group>
      <mesh position-y={1.4}>
        <boxGeometry args={[1.3, 2.8, 1.3]} />
        <meshStandardMaterial color="#121216" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 2.86, 0]}>
        <boxGeometry args={[1.34, 0.08, 1.34]} />
        <meshBasicMaterial ref={accentRef} color={DIM} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.8, 0.66]}>
        <planeGeometry args={[1.1, 1.1 / digits.aspect]} />
        <meshBasicMaterial map={digits.texture} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ───────────────────────── Portal ───────────────────────── */

function Portal({ accentRef, active }: { accentRef: AccentRef; active: boolean }) {
  const inner = useRef<THREE.MeshBasicMaterial>(null);
  const haze = glowTexture("rgba(229,9,20,0.85)", "rgba(229,9,20,0)");

  useFrame((state) => {
    if (inner.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2.2) * 0.12;
      inner.current.opacity = (active ? 0.75 : 0.42) + pulse;
    }
  });

  return (
    <group>
      {/* Marco */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 1.6, 2.1, 0]}>
          <boxGeometry args={[0.22, 4.2, 0.22]} />
          <meshBasicMaterial color={RED} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, 4.2, 0]}>
        <boxGeometry args={[3.42, 0.22, 0.22]} />
        <meshBasicMaterial ref={accentRef} color={RED} toneMapped={false} />
      </mesh>
      {/* Interior luminoso */}
      <mesh position={[0, 2.1, -0.02]}>
        <planeGeometry args={[3, 4.1]} />
        <meshBasicMaterial
          ref={inner}
          map={haze}
          transparent
          opacity={0.42}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
