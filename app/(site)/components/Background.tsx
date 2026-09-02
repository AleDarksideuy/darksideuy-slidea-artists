"use client";

import { useEffect, useState } from "react";

export default function Background() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * 0.25);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* 🎬 PARALLAX */}
      <div
        className="fixed inset-0 -z-10 bg-black/100 bg-cover bg-center "
        style={{
  backgroundImage: `url(/background-image.jpeg)`,
  transform: `translateY(${offset}px) scale(1.1)`,
  filter: "blur(2px)",
}}
      />

      {/* 🌑 OVERLAY */}
      <div className="fixed inset-0 -z-10 bg-black/50" />
    </>
  );
}