"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { input, player, readDirection } from "./input";
import { stationSpot, type Zone } from "./zones";
import { createPlayerSheet, SPRITE_FRAMES } from "./sprite";
import { glowTexture } from "./textures";

const SPEED = 4.6;
const SPRITE_H = 1.7;
const INTERACT_RADIUS = 2.3;
const BODY_RADIUS = 0.45;
const STATION_RADIUS = 0.95;

type PlayerProps = {
  zone: Zone;
  reducedMotion: boolean;
  onNear: (stationId: string | null) => void;
};

export default function Player({ zone, reducedMotion, onNear }: PlayerProps) {
  const { camera, size } = useThree();
  const root = useRef<THREE.Group>(null);
  const sprite = useRef<THREE.Mesh>(null);
  const spriteMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const nearRef = useRef<string | null>(null);
  const facing = useRef(1);
  const walkTime = useRef(0);
  const cameraReady = useRef(false);

  const sheet = useMemo(() => createPlayerSheet(), []);
  const spriteW = SPRITE_H * sheet.aspect;

  /* Datos precalculados de la zona para no recalcular 60 veces por segundo */
  const spots = useMemo(
    () => zone.stations.map((station) => ({ id: station.id, spot: stationSpot(station) })),
    [zone]
  );
  const colliders = useMemo(
    () => zone.stations.filter((s) => s.visual.kind !== "portal").map((s) => s.position),
    [zone]
  );

  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const [dx, dz] = readDirection();
    const moving = dx !== 0 || dz !== 0;
    const { walk } = zone;

    let x = THREE.MathUtils.clamp(player.x + dx * SPEED * delta, walk.minX, walk.maxX);
    let z = THREE.MathUtils.clamp(player.z + dz * SPEED * delta, walk.minZ, walk.maxZ);

    /* Colisiones simples: el personaje no atraviesa las estaciones */
    for (const [cx, cz] of colliders) {
      const ox = x - cx;
      const oz = z - cz;
      const dist = Math.hypot(ox, oz);
      const min = BODY_RADIUS + STATION_RADIUS;
      if (dist < min && dist > 0.0001) {
        x = cx + (ox / dist) * min;
        z = cz + (oz / dist) * min;
      }
    }
    /* Si tocó un punto detrás de una estación y quedó trabado, se frena */
    if (input.target && moving && Math.hypot(x - player.x, z - player.z) < SPEED * delta * 0.2) {
      input.target = null;
    }
    player.x = x;
    player.z = z;

    if (root.current) root.current.position.set(x, 0, z);

    /* Sprite: 3 cuadros de animación, se da vuelta según la dirección */
    if (Math.abs(dx) > 0.05) facing.current = dx > 0 ? 1 : -1;
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
    /* En pantallas verticales (celular) la cámara se aleja y sigue más
       de cerca al personaje, para que entre más mundo en lo angosto */
    const portrait = size.width < size.height;
    const distance = portrait ? 1.45 : 1;
    const follow = portrait ? 0.95 : zone.id === "lobby" ? 0.75 : 0.55;
    cameraTarget.set(x * follow, 6.2 * distance, z + 8.6 * distance);
    lookTarget.set(x * follow, 1.2, z - (portrait ? 4.2 : 2.8));
    if (!cameraReady.current || reducedMotion) {
      camera.position.copy(cameraTarget);
      cameraReady.current = true;
    } else {
      camera.position.lerp(cameraTarget, 1 - Math.exp(-delta * 4));
    }
    camera.lookAt(lookTarget);

    /* ¿Qué estación está cerca? */
    let closest: string | null = null;
    let best = INTERACT_RADIUS;
    for (const { id, spot } of spots) {
      const d = Math.hypot(x - spot[0], z - spot[1]);
      if (d < best) {
        best = d;
        closest = id;
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
        <meshBasicMaterial map={glowTexture("rgba(0,0,0,0.85)", "rgba(0,0,0,0)")} transparent depthWrite={false} />
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
