"use server";

import { headers } from "next/headers";
import nodemailer from "nodemailer";

import { CONTACT } from "../data/home";

/* ═══════════════════════════════════════════════════════════════
   ENVÍO DEL FORMULARIO "HABLEMOS"
   Manda el mensaje al correo de la productora desde su propio Gmail
   (SMTP de Google). Necesita dos variables de entorno en Vercel:
     GMAIL_USER          → la cuenta que envía (productora@darksideuy.com)
     GMAIL_APP_PASSWORD  → "contraseña de aplicación" de esa cuenta
   La respuesta del mail va directo a quien escribió (Reply-To).
   ═══════════════════════════════════════════════════════════════ */

export type ContactState = {
  status: "idle" | "ok" | "error";
  message: string;
  /* lo que escribió, para no perderlo si algo falla */
  values?: Record<string, string>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 80, email: 120, message: 4000 };

/* Freno simple contra envíos en ráfaga (por instancia del servidor) */
const lastByIp = new Map<string, number>();
const COOLDOWN_MS = 30_000;

const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);
const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = {
    name: clean(formData.get("name"), LIMITS.name),
    email: clean(formData.get("email"), LIMITS.email),
    topic: clean(formData.get("topic"), 40),
    message: clean(formData.get("message"), LIMITS.message),
  };

  /* Trampa para bots: campo oculto que una persona nunca completa */
  if (clean(formData.get("website"), 200)) return { status: "ok", message: "¡Mensaje enviado!" };

  if (!values.name || !values.email || !values.message)
    return { status: "error", message: "Completá tu nombre, tu correo y el mensaje.", values };
  if (!EMAIL_RE.test(values.email)) return { status: "error", message: "Revisá tu correo: parece que tiene un error.", values };
  if (values.message.length < 10) return { status: "error", message: "Contanos un poco más en el mensaje.", values };
  const topic = (CONTACT.topics as readonly string[]).includes(values.topic) ? values.topic : "Otro";

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  if (now - (lastByIp.get(ip) ?? 0) < COOLDOWN_MS)
    return { status: "error", message: "Ya recibimos un mensaje tuyo hace un momento. Esperá unos segundos.", values };

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.error("[contacto] Faltan GMAIL_USER / GMAIL_APP_PASSWORD");
    return { status: "error", message: `No pudimos enviarlo. Escribinos a ${CONTACT.email}.`, values };
  }

  try {
    const transport = nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user, pass } });
    await transport.sendMail({
      from: `"Web Darkside UY" <${user}>`,
      to: CONTACT.email,
      replyTo: `"${values.name.replace(/"/g, "")}" <${values.email}>`,
      subject: `[Web] ${topic} — ${values.name}`,
      text: `${values.message}\n\n—\n${values.name} · ${values.email}\nMotivo: ${topic}\nEnviado desde el formulario de darksideuy.com`,
      html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#111">
<p style="white-space:pre-wrap">${escapeHtml(values.message)}</p>
<hr style="border:none;border-top:1px solid #ddd">
<p style="color:#555;font-size:13px"><b>${escapeHtml(values.name)}</b> · ${escapeHtml(values.email)}<br>Motivo: ${escapeHtml(topic)}<br>Enviado desde el formulario de darksideuy.com. Respondé este correo para contestarle.</p>
</div>`,
    });
    lastByIp.set(ip, now);
    return { status: "ok", message: "¡Mensaje enviado! Te respondemos a la brevedad." };
  } catch (err) {
    console.error("[contacto] Error al enviar:", err);
    return { status: "error", message: `No pudimos enviarlo. Probá de nuevo o escribinos a ${CONTACT.email}.`, values };
  }
}
