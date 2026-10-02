"use client";

import { useEffect, useRef } from "react";

import { input } from "../_game/input";

const RADIUS = 48;

/* Joystick táctil. Mueve la perilla directo en el DOM (sin re-render
   de React en cada movimiento del dedo) para que vaya fluido. */
export default function Joystick() {
  const knob = useRef<HTMLDivElement>(null);
  const center = useRef<{ x: number; y: number } | null>(null);

  const setKnob = (x: number, y: number) => {
    if (knob.current) knob.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  };

  const release = () => {
    center.current = null;
    input.joyX = 0;
    input.joyY = 0;
    setKnob(0, 0);
  };

  useEffect(
    () => () => {
      input.joyX = 0;
      input.joyY = 0;
    },
    []
  );

  const move = (clientX: number, clientY: number) => {
    if (!center.current) return;
    let dx = clientX - center.current.x;
    let dy = clientY - center.current.y;
    const len = Math.hypot(dx, dy);
    if (len > RADIUS) {
      dx = (dx / len) * RADIUS;
      dy = (dy / len) * RADIUS;
    }
    input.joyX = dx / RADIUS;
    input.joyY = dy / RADIUS;
    input.target = null;
    setKnob(dx, dy);
  };

  return (
    <div
      aria-hidden
      className="absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-6 z-20 h-32 w-32 touch-none rounded-full border border-white/15 bg-black/40"
      onPointerDown={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        center.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        e.currentTarget.setPointerCapture(e.pointerId);
        move(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => move(e.clientX, e.clientY)}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <div
        ref={knob}
        className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E50914]/80 shadow-[0_0_20px_rgba(229,9,20,0.6)]"
      />
    </div>
  );
}
