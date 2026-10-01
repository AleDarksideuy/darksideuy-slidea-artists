"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, Sparkles, useTexture } from "@react-three/drei";
import * as THREE from "three";

import { artists, type Artist } from "../../(site)/data/artists";
import { player, readDirection } from "./input";
import {
  END_Z,
  INTERACT_RADIUS,
  posterSlots,
  START_Z,
  WALK_X,
  type PosterSlot,
} from "./gallery";
import { createLabelTexture, createPlayerSheet, SPRITE_FRAMES } from "./sprite";

const RED = "#E50914";
const SPEED = 4.6;

type WorldProps = {
  activeSlug: string | null;
  onNear: (slug: string | null) => void;
  onSelect: (slug: string) => void;
};

export default function World({ activeSlug, onNear, onSelect }: WorldProps) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 45, near: 0.1, far: 80, position: [0, 6, START_Z + 9] }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#040404"]} />
      <fog attach="fog" args={["#040404", 10, 34]} />

      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#ffffff", "#200000", 0.35]} />

      <Corridor />

      <Suspense fallback={null}>
        {posterSlots.map((slot) => {
          const artist = artists.find((a) => a.slug === slot.slug)!;
          return (
            <ArtistPoster
              key={slot.slug}
              slot={slot}
              artist={artist}
              active={activeSlug === slot.slug}
              onSelect={onSelect}
            />
          );
        })}
        <EndGate />
      </Suspense>

      <Player onNear={onNear} />

      <Sparkles
        count={120}
        scale={[14, 6, Math.abs(END_Z) + 14]}
        position={[0, 3, END_Z / 2]}
        size={2.2}
        speed={0.25}
        opacity={0.5}
        color={RED}
      />
    </Canvas>
  );
}

/* ───────────────────────── Escenario ───────────────────────── */

function Corridor() {
  const length = Math.abs(END_Z) + START_Z + 20;
  const centerZ = (END_Z + START_Z) / 2;
  const lights = Math.ceil(length / 9);

  return (
    <group>
      {/* Piso */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, centerZ]}>
        <planeGeometry args={[16, length]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.3} metalness={0.7} />
      </mesh>

      <Grid
        position={[0, 0.005, centerZ]}
        args={[16, length]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#2a0a0c"
        sectionSize={4.2}
        sectionThickness={1.1}
        sectionColor={RED}
        fadeDistance={26}
        fadeStrength={1.4}
        followCamera={false}
        infiniteGrid={false}
      />

      {/* Paredes con tubos de neón */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 7.5, 0, centerZ]}>
          <mesh rotation-y={-side * (Math.PI / 2)} position={[0, 4, 0]}>
            <planeGeometry args={[length, 8]} />
            <meshStandardMaterial color="#08080a" roughness={0.9} />
          </mesh>
          <mesh position={[-side * 0.05, 0.12, 0]}>
            <boxGeometry args={[0.06, 0.06, length]} />
            <meshBasicMaterial color={RED} toneMapped={false} />
          </mesh>
          <mesh position={[-side * 0.05, 6.5, 0]}>
            <boxGeometry args={[0.04, 0.04, length]} />
            <meshBasicMaterial color="#5a070b" toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* Luces rojas a lo largo del pasillo */}
      {Array.from({ length: lights }, (_, i) => (
        <pointLight
          key={i}
          position={[0, 3.5, START_Z - i * 9]}
          color={RED}
          intensity={14}
          distance={11}
          decay={1.6}
        />
      ))}
    </group>
  );
}

/* Brillo circular para el piso (debajo de carteles y personaje) */
function useGlowTexture(inner: string, outer: string) {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, inner);
    gradient.addColorStop(1, outer);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, [inner, outer]);
}

/* ───────────────────────── Carteles ───────────────────────── */

const PHOTO_W = 2.4;
const PHOTO_H = 3.2;
const PHOTO_Y = 2.45;

type ArtistPosterProps = {
  slot: PosterSlot;
  artist: Artist;
  active: boolean;
  onSelect: (slug: string) => void;
};

function ArtistPoster({ slot, artist, active, onSelect }: ArtistPosterProps) {
  const group = useRef<THREE.Group>(null);
  const border = useRef<THREE.MeshBasicMaterial>(null);
  const glow = useRef<THREE.MeshBasicMaterial>(null);

  const source = useTexture(encodeURI(artist.image));
  const glowTexture = useGlowTexture("rgba(229,9,20,0.9)", "rgba(229,9,20,0)");
  const label = useMemo(
    () => createLabelTexture(artist.name, { font: "bold 46px monospace" }),
    [artist.name]
  );
  const labelW = Math.min(label.aspect * 0.42, PHOTO_W + 0.4);

  /* Recorte tipo "cover" para que ninguna foto se deforme */
  const photo = useMemo(() => {
    const texture = source.clone();
    const image = source.image as { width: number; height: number };
    const imageAspect = image.width / image.height;
    const frameAspect = PHOTO_W / PHOTO_H;
    texture.colorSpace = THREE.SRGBColorSpace;
    if (imageAspect > frameAspect) {
      texture.repeat.set(frameAspect / imageAspect, 1);
      texture.offset.set((1 - texture.repeat.x) / 2, 0);
    } else {
      texture.repeat.set(1, imageAspect / frameAspect);
      texture.offset.set(0, (1 - texture.repeat.y) / 2);
    }
    texture.needsUpdate = true;
    return texture;
  }, [source]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = 1 - Math.exp(-delta * 8);
    const scale = active ? 1.07 : 1;
    group.current.scale.lerp(new THREE.Vector3(scale, scale, scale), t);
    group.current.position.y = active
      ? Math.sin(state.clock.elapsedTime * 2) * 0.06 + 0.08
      : THREE.MathUtils.lerp(group.current.position.y, 0, t);

    border.current?.color.lerp(new THREE.Color(active ? "#ff2a35" : "#4a070a"), t);
    if (glow.current) {
      glow.current.opacity = THREE.MathUtils.lerp(glow.current.opacity, active ? 0.9 : 0.35, t);
    }
  });

  return (
    <group position={slot.position} rotation-y={slot.rotationY}>
      <group
        ref={group}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(artist.slug);
        }}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "")}
      >
        {/* Soporte */}
        <mesh position={[0, PHOTO_Y, -0.08]}>
          <boxGeometry args={[PHOTO_W + 0.3, PHOTO_H + 0.3, 0.12]} />
          <meshStandardMaterial color="#111114" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Marco de neón */}
        <mesh position={[0, PHOTO_Y, -0.005]}>
          <planeGeometry args={[PHOTO_W + 0.14, PHOTO_H + 0.14]} />
          <meshBasicMaterial ref={border} color="#4a070a" toneMapped={false} />
        </mesh>

        {/* Foto del artista */}
        <mesh position={[0, PHOTO_Y, 0]}>
          <planeGeometry args={[PHOTO_W, PHOTO_H]} />
          <meshBasicMaterial map={photo} toneMapped={false} />
        </mesh>

        {/* Nombre */}
        <mesh position={[0, 0.42, 0.02]}>
          <planeGeometry args={[labelW, labelW / label.aspect]} />
          <meshBasicMaterial map={label.texture} transparent toneMapped={false} />
        </mesh>
      </group>

      {/* Brillo en el piso */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 1.2]}>
        <planeGeometry args={[3.6, 2.6]} />
        <meshBasicMaterial
          ref={glow}
          map={glowTexture}
          transparent
          opacity={0.35}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

/* Fondo del pasillo: adelanto de la próxima zona */
function EndGate() {
  const logo = useTexture("/LOGO1.png");
  const title = useMemo(
    () => createLabelTexture("PRÓXIMA ZONA · MÚSICA", { color: RED, font: "bold 40px monospace" }),
    []
  );

  return (
    <group position={[0, 0, END_Z]}>
      <mesh position={[0, 3.6, 0]}>
        <planeGeometry args={[3.4, 3.4]} />
        <meshBasicMaterial map={logo} transparent toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <planeGeometry args={[5, 5 / title.aspect]} />
        <meshBasicMaterial map={title.texture} transparent toneMapped={false} />
      </mesh>
      {/* Portón cerrado */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 3.2, 3, -0.2]}>
          <boxGeometry args={[0.15, 6, 0.15]} />
          <meshBasicMaterial color={RED} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, 6, -0.2]}>
        <boxGeometry args={[6.55, 0.15, 0.15]} />
        <meshBasicMaterial color={RED} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ───────────────────────── Personaje ───────────────────────── */

const SPRITE_H = 1.7;

function Player({ onNear }: { onNear: (slug: string | null) => void }) {
  const { camera } = useThree();
  const root = useRef<THREE.Group>(null);
  const sprite = useRef<THREE.Mesh>(null);
  const spriteMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const nearRef = useRef<string | null>(null);
  const facing = useRef(1);
  const walkTime = useRef(0);
  const cameraReady = useRef(false);

  const sheet = useMemo(() => createPlayerSheet(), []);
  const shadow = useGlowTexture("rgba(0,0,0,0.85)", "rgba(0,0,0,0)");
  const spriteW = SPRITE_H * sheet.aspect;

  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const [dx, dz] = readDirection();
    const moving = dx !== 0 || dz !== 0;

    player.x = THREE.MathUtils.clamp(player.x + dx * SPEED * delta, -WALK_X, WALK_X);
    player.z = THREE.MathUtils.clamp(player.z + dz * SPEED * delta, END_Z + 2.5, START_Z + 2);

    if (root.current) root.current.position.set(player.x, 0, player.z);

    /* Animación del sprite: 3 cuadros, se da vuelta según la dirección */
    if (dx !== 0) facing.current = dx > 0 ? 1 : -1;
    walkTime.current = moving ? walkTime.current + delta : 0;
    const frame = moving ? 1 + (Math.floor(walkTime.current * 8) % 2) : 0;
    if (spriteMaterial.current?.map) {
      spriteMaterial.current.map.offset.x = frame / SPRITE_FRAMES;
    }

    if (sprite.current) {
      sprite.current.scale.x = facing.current;
      sprite.current.position.y =
        SPRITE_H / 2 + (moving ? Math.abs(Math.sin(walkTime.current * 16)) * 0.06 : 0);
    }

    /* Cámara que sigue al personaje desde arriba y atrás */
    cameraTarget.set(player.x * 0.55, 6.2, player.z + 8.6);
    lookTarget.set(player.x * 0.55, 1.2, player.z - 2.8);
    if (!cameraReady.current) {
      camera.position.copy(cameraTarget);
      cameraReady.current = true;
    } else {
      camera.position.lerp(cameraTarget, 1 - Math.exp(-delta * 4));
    }
    camera.lookAt(lookTarget);

    /* ¿Hay un artista cerca? */
    let closest: string | null = null;
    let best = INTERACT_RADIUS;
    for (const slot of posterSlots) {
      const d = Math.hypot(player.x - slot.spot[0], player.z - slot.spot[1]);
      if (d < best) {
        best = d;
        closest = slot.slug;
      }
    }
    if (closest !== nearRef.current) {
      nearRef.current = closest;
      onNear(closest);
    }
  });

  return (
    <group ref={root}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.03, 0]}>
        <planeGeometry args={[1.3, 0.8]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} />
      </mesh>
      <mesh ref={sprite} rotation-x={-0.2}>
        <planeGeometry args={[spriteW, SPRITE_H]} />
        <meshBasicMaterial
          ref={spriteMaterial}
          map={sheet.texture}
          transparent
          alphaTest={0.5}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
