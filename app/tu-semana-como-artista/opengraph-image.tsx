import { ImageResponse } from "next/og";

import { monogramData, OG_SIZE, RED } from "../(site)/og";

export const alt = "Expediente del Artista — Darkside UY";
export const size = OG_SIZE;
export const contentType = "image/png";

/* Imagen al compartir la landing (DM de Instagram, WhatsApp…).
   Se genera con código: no suma archivos a /public. */
export default async function Image() {
  const monogram = await monogramData(64);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: `radial-gradient(circle at 85% 20%, rgba(229,9,20,0.45), #0a0a0b 55%)`,
          padding: "0 80px",
          color: "#fff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={monogram} width={44} height={44} alt="" />
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 5, fontWeight: 800 }}>
            DARKSIDE <span style={{ color: RED, marginLeft: 10 }}>UY</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 118, fontWeight: 900, lineHeight: 0.95, letterSpacing: -4 }}>
          EXPEDIENTE
        </div>
        <div style={{ display: "flex", fontSize: 118, fontWeight: 900, lineHeight: 0.95, letterSpacing: -4 }}>
          DEL <span style={{ color: RED, marginLeft: 28 }}>ARTISTA</span>
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "rgba(255,255,255,0.7)", marginTop: 40 }}>
          Nivel 1 · Todo lo que tu proyecto ya tiene, por escrito.
        </div>
      </div>
    ),
    size,
  );
}
