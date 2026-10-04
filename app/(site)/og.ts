import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

/* Utilidades para las imágenes que se ven al compartir un link
   (WhatsApp, Instagram, X…). Se generan con código: no son archivos
   en /public, así que no suman peso a cada deployment. */

export const OG_SIZE = { width: 1200, height: 630 };
export const RED = "#E50914";

const publicPath = (src: string) => join(process.cwd(), "public", src);

/* El generador de imágenes no lee WebP: se convierte a JPEG/PNG en memoria */
export async function imageData(src: string, { width, height }: { width: number; height: number }) {
  const buffer = await sharp(await readFile(publicPath(src)))
    .resize(width, height, { fit: "cover", position: "attention" })
    .jpeg({ quality: 80 })
    .toBuffer();
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

/* Monograma D en blanco (el original es negro sobre transparente) */
export async function monogramData(size: number) {
  const buffer = await sharp(await readFile(publicPath("/LOGO1.png")))
    .resize(size, size)
    .negate({ alpha: false })
    .png()
    .toBuffer();
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

/* Las fotos pesan mucho en PNG: se entregan en JPEG (~150 KB), que es
   lo que WhatsApp e Instagram muestran sin problemas */
export async function toJpegResponse(image: Response) {
  const jpeg = await sharp(Buffer.from(await image.arrayBuffer())).jpeg({ quality: 82 }).toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": "image/jpeg" } });
}

export async function wordmarkData() {
  const buffer = await readFile(publicPath("/Darksideuy.png"));
  return `data:image/png;base64,${buffer.toString("base64")}`;
}
