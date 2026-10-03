"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Headphones, Mic2, Sparkles, Users, type LucideIcon } from "lucide-react";

type NavItem = { id: string; label: string; href: string; icon: LucideIcon };

/* Los tres caminos principales de la home + el infoproducto */
const ITEMS: NavItem[] = [
  { id: "artists", label: "Artistas", href: "/#artists", icon: Users },
  { id: "darkside-pick", label: "Música", href: "/#darkside-pick", icon: Headphones },
  { id: "llamado-artistas", label: "Llamado", href: "/#llamado-artistas", icon: Mic2 },
];
const TU_SEMANA = { label: "Tu semana", href: "/tu-semana-como-artista" };

/* Qué sección de la home está en pantalla, para marcarla en el menú */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    /* Se observan todas las secciones: en las que no están en el menú
       (Underfest, Producciones…) no se marca nada */
    const sections = [...document.querySelectorAll<HTMLElement>("main section[id]")];
    const inMenu = new Set(ITEMS.map((item) => item.id));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(inMenu.has(entry.target.id) ? entry.target.id : null);
        }
      },
      /* una franja en el medio de la pantalla */
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [enabled]);

  return enabled ? active : null;
}

/* El logo arriba aparece recién al pasar la portada (la portada ya lo muestra) */
function usePastHero() {
  const [past, setPast] = useState(false);
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      setPast(window.scrollY > window.innerHeight * 0.7);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    frame = requestAnimationFrame(check);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return past;
}

export default function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const active = useActiveSection(isHome);
  const pastHero = usePastHero();
  const showLogo = !isHome || pastHero;
  /* En celular, las fichas de artista tienen su propia barra arriba */
  const showMobileLogo = isHome && pastHero;

  return (
    <>
      {/* ═══════════════ CELULAR: logo arriba ═══════════════ */}
      <AnimatePresence>
        {showMobileLogo && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/85 to-transparent px-4 pb-6 pt-[max(0.75rem,env(safe-area-inset-top))] md:hidden"
          >
            <Link href="/" aria-label="Darkside UY — inicio" className="pointer-events-auto inline-block">
              <Image src="/Darksideuy.png" alt="Darkside UY" width={1817} height={394} className="h-5 w-auto" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════ CELULAR: barra al alcance del pulgar ═══════════════ */}
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
      >
        <ul className="grid grid-cols-4 rounded-2xl border border-white/10 bg-black/80 p-1 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`relative flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                    isActive ? "text-white" : "text-white/55 active:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-mobile"
                      className="absolute inset-0 rounded-xl bg-white/[0.07]"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <Icon className={`relative h-5 w-5 ${isActive ? "text-[#E50914]" : ""}`} strokeWidth={1.8} />
                  <span className="relative">{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href={TU_SEMANA.href}
              className="flex min-h-[56px] flex-col items-center justify-center gap-1 rounded-xl bg-[#E50914]/15 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#ff5b63] active:bg-[#E50914]/25"
            >
              <Sparkles className="h-5 w-5" strokeWidth={1.8} />
              <span>{TU_SEMANA.label}</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* ═══════════════ ESCRITORIO: píldora arriba ═══════════════ */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden px-6 pt-6 md:block lg:px-10">
        <nav
          aria-label="Principal"
          className="pointer-events-auto mx-auto flex w-fit items-center gap-1 rounded-2xl border border-white/10 bg-black/55 p-2 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
        >
          <AnimatePresence initial={false}>
            {showLogo && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <Link href="/" aria-label="Darkside UY — inicio" className="block px-3 py-2">
                  <Image src="/Darksideuy.png" alt="Darkside UY" width={1817} height={394} className="h-5 w-auto max-w-none" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={isActive ? "location" : undefined}
                className={`group relative flex items-center gap-2 rounded-xl px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                  isActive ? "text-white" : "text-white/65 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-desktop"
                    className="absolute inset-0 rounded-xl border border-[#E50914]/40 bg-[#E50914]/10"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <Icon
                  className={`relative h-[18px] w-[18px] transition-colors ${isActive ? "text-[#E50914]" : "group-hover:text-[#E50914]"}`}
                  strokeWidth={1.7}
                />
                <span className="relative">{item.label}</span>
              </Link>
            );
          })}

          <span className="mx-1 h-6 w-px bg-white/10" aria-hidden />

          <Link
            href={TU_SEMANA.href}
            className="flex items-center gap-2 rounded-xl border border-[#E50914]/50 bg-[#E50914]/15 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_0_24px_rgba(229,9,20,0.25)] transition hover:bg-[#E50914]/25"
          >
            <Sparkles className="h-[18px] w-[18px] text-[#E50914]" strokeWidth={1.7} />
            {TU_SEMANA.label} como artista
          </Link>
        </nav>
      </header>
    </>
  );
}
