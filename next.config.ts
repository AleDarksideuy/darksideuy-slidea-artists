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
    return {
      ...nextConfig,
      experimental: { ...nextConfig.experimental, workerThreads: true },
      /* Para probar desde el celular en la misma red (http://IP-de-la-PC:3000).
         Si la IP de la PC cambia, actualizarla acá. */
      allowedDevOrigins: ["172.20.10.2"],
    };
  }
  return nextConfig;
}
