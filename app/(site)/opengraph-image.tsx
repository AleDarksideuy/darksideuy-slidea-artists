import { ImageResponse } from "next/og";

import { SITE } from "./data/site";
import { monogramData, OG_SIZE, RED, wordmarkData } from "./og";

export const alt = SITE.title;
export const size = OG_SIZE;
export const contentType = "image/png";

/* Imagen al compartir la home: el monograma D iluminado en rojo */
export default async function Image() {
  const [monogram, wordmark] = await Promise.all([monogramData(420), wordmarkData()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: `radial-gradient(circle at 26% 50%, rgba(229,9,20,0.45), #000 55%)`,
          padding: "0 70px",
          gap: 56,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={monogram} width={340} height={340} alt="" />
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wordmark} width={520} height={112} alt="" />
          <div style={{ display: "flex", fontSize: 25, color: "rgba(255,255,255,0.75)", letterSpacing: 3 }}>
            PRODUCTORA CULTURAL INDEPENDIENTE
          </div>
          <div style={{ display: "flex", fontSize: 25, color: RED, letterSpacing: 3 }}>MERCEDES · URUGUAY</div>
        </div>
      </div>
    ),
    size
  );
}
