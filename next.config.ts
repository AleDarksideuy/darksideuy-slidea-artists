import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

const nextConfig: NextConfig = {
  /* config options here */
};

export default function config(phase: string): NextConfig {
  /* Solo en el servidor local: en esta PC con Windows, abrir procesos hijos
     falla de forma intermitente ("Jest worker encountered 2 child process
     exceptions") al preparar las fichas de artista. Con hilos de trabajo no
     se abren procesos nuevos. El sitio publicado se arma igual que siempre. */
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return { ...nextConfig, experimental: { ...nextConfig.experimental, workerThreads: true } };
  }
  return nextConfig;
}
