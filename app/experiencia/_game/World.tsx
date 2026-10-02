"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Grid, PerformanceMonitor, Sparkles, useProgress, useTexture } from "@react-three/drei";

import { input } from "./input";
import Player from "./Player";
import { detectQuality, prefersReducedMotion } from "./quality";
import { StationView } from "./Stations";
import { optimizedImage } from "./textures";
import { RED, zones, type Station, type ZoneId } from "./zones";

type WorldProps = {
  zoneId: ZoneId;
  activeId: string | null;
  playingId: string | null;
  paused: boolean;
  onNear: (stationId: string | null) => void;
  onSelect: (station: Station) => void;
};

export default function World({ zoneId, activeId, playingId, paused, onNear, onSelect }: WorldProps) {
  const [quality] = useState(detectQuality);
  const [reducedMotion] = useState(prefersReducedMotion);
  const [dpr, setDpr] = useState(quality === "low" ? 1 : Math.min(window.devicePixelRatio, 1.75));
  const [effects, setEffects] = useState(quality === "high" && !reducedMotion);

  const zone = zones[zoneId];

  return (
    <div className="absolute inset-0 touch-none">
      <Canvas
        /* Con un panel abierto el 3D se congela: ahorra batería y el panel scrollea fluido */
        frameloop={paused ? "never" : "always"}
        dpr={dpr}
        camera={{ fov: 45, near: 0.1, far: 70, position: [0, 6, 14] }}
        gl={{ antialias: quality === "high", powerPreference: "high-performance" }}
      >
        {/* Si los FPS caen, baja la resolución y apaga las partículas */}
        <PerformanceMonitor
          onDecline={() => {
            setDpr((current) => Math.max(1, current - 0.5));
            setEffects(false);
          }}
        />

        <color attach="background" args={["#040404"]} />
        <fog attach="fog" args={["#040404", 11, 36]} />
        <ambientLight intensity={0.35} />
        <hemisphereLight args={["#ffffff", "#200000", 0.35]} />

        <Room key={`room-${zoneId}`} zoneId={zoneId} lights={quality === "low" ? 2 : 4} />

        <Suspense fallback={null}>
          <group key={`stations-${zoneId}`}>
            {zoneId === "lobby" && <LobbyLogo />}
            {zone.stations.map((station) => (
              <StationView
                key={station.id}
                station={station}
                active={activeId === station.id}
                playing={playingId === station.id}
                quality={quality}
                onSelect={onSelect}
              />
            ))}
          </group>
        </Suspense>

        <Player key={`player-${zoneId}`} zone={zone} reducedMotion={reducedMotion} onNear={onNear} />

        {effects && (
          <Sparkles
            key={`sparkles-${zoneId}`}
            count={90}
            scale={[zone.room.halfWidth * 2, 6, zone.room.maxZ - zone.room.minZ]}
            position={[0, 3, (zone.room.maxZ + zone.room.minZ) / 2]}
            size={2.2}
            speed={0.25}
            opacity={0.5}
            color={RED}
          />
        )}
      </Canvas>

      <LoadingOverlay />
    </div>
  );
}

/* ───────────────────────── Salón ───────────────────────── */

function Room({ zoneId, lights }: { zoneId: ZoneId; lights: number }) {
  const { room } = zones[zoneId];
  const width = room.halfWidth * 2;
  const depth = room.maxZ - room.minZ;
  const centerZ = (room.maxZ + room.minZ) / 2;

  return (
    <group>
      {/* Piso: tocar/clickear lleva al personaje hasta ahí */}
      <mesh
        rotation-x={-Math.PI / 2}
        position={[0, 0, centerZ]}
        onClick={(e) => {
          e.stopPropagation();
          input.target = [e.point.x, e.point.z];
        }}
      >
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#0a0a0c" roughness={0.3} metalness={0.7} />
      </mesh>

      <Grid
        position={[0, 0.005, centerZ]}
        args={[width, depth]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#2a0a0c"
        sectionSize={4.2}
        sectionThickness={1.1}
        sectionColor={RED}
        fadeDistance={28}
        fadeStrength={1.4}
        followCamera={false}
        infiniteGrid={false}
      />

      {/* Paredes laterales y del fondo con tubos de neón */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * room.halfWidth, 0, centerZ]}>
          <mesh rotation-y={-side * (Math.PI / 2)} position={[0, 4, 0]}>
            <planeGeometry args={[depth, 8]} />
            <meshStandardMaterial color="#08080a" roughness={0.9} />
          </mesh>
          <mesh position={[-side * 0.05, 0.12, 0]}>
            <boxGeometry args={[0.06, 0.06, depth]} />
            <meshBasicMaterial color={RED} toneMapped={false} />
          </mesh>
          <mesh position={[-side * 0.05, 6.5, 0]}>
            <boxGeometry args={[0.04, 0.04, depth]} />
            <meshBasicMaterial color="#5a070b" toneMapped={false} />
          </mesh>
        </group>
      ))}
      <group position={[0, 0, room.minZ]}>
        <mesh position={[0, 4, 0]}>
          <planeGeometry args={[width, 8]} />
          <meshStandardMaterial color="#08080a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.12, 0.05]}>
          <boxGeometry args={[width, 0.06, 0.06]} />
          <meshBasicMaterial color={RED} toneMapped={false} />
        </mesh>
      </group>

      {/* Luces rojas repartidas a lo largo del salón */}
      {Array.from({ length: lights }, (_, i) => (
        <pointLight
          key={i}
          position={[0, 3.8, room.maxZ - 4 - (i * (depth - 6)) / Math.max(1, lights - 1)]}
          color={RED}
          intensity={16}
          distance={13}
          decay={1.6}
        />
      ))}
    </group>
  );
}

/* Logo de Darkside pintado en el piso, en el centro del lobby */
function LobbyLogo() {
  const logo = useTexture(optimizedImage("/Darksideuy.png", 828));
  const width = 8;

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.015, 0.5]}>
      <planeGeometry args={[width, width / (1817 / 394)]} />
      <meshBasicMaterial map={logo} transparent opacity={0.22} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/* Mientras se descargan las fotos de una zona */
function LoadingOverlay() {
  const { active, progress } = useProgress();
  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center">
      <div className="rounded-full border border-white/10 bg-black/70 px-4 py-2 font-mono text-[11px] tracking-[0.3em] text-white/60 backdrop-blur">
        CARGANDO {Math.round(progress)}%
      </div>
    </div>
  );
}
