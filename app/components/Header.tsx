"use client";

import Link from "next/link";
import { Headphones, Mic2, Users } from "lucide-react";

const navigationItems = [
  {
    label: "DARKSIDE'S PICK",
    href: "/#darkside-pick",
    icon: Headphones,
  },
  {
    label: "LLAMADO DE ARTISTAS",
    href: "/#llamado-artistas",
    icon: Mic2,
  },
  {
    label: "NUESTROS ARTISTAS",
    href: "/#artists",
    icon: Users,
  },
];

export default function Header() {
  return (
    <header
      className="
        fixed
        top-0
        left-0
        right-0
        z-50
        pointer-events-none
      "
    >
      <div
        className="
          w-full
          px-4
          md:px-6
          lg:px-10
          pt-4
          md:pt-6
        "
      >
        <nav
          className="
            pointer-events-auto
            mx-auto
            w-fit
            max-w-full

            flex
            items-center
            gap-2
            md:gap-3

            rounded-2xl

            border
            border-white/10

            bg-black/55
            backdrop-blur-xl

            shadow-[0_20px_60px_rgba(0,0,0,0.35)]

            p-2
          "
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="
                  group

                  flex
                  items-center
                  gap-2
                  md:gap-3

                  rounded-xl

                  px-3
                  py-2.5

                  md:px-4
                  md:py-3

                  border
                  border-transparent

                  transition-all
                  duration-300

                  hover:border-[#E50914]/40
                  hover:bg-[#E50914]/10
                  hover:-translate-y-0.5
                "
              >
                <Icon
                  className="
                    h-[18px]
                    w-[18px]

                    shrink-0

                    text-white/70

                    transition-all
                    duration-300

                    group-hover:text-[#E50914]
                    group-hover:scale-110
                  "
                  strokeWidth={1.7}
                />

                <span
                  className="
                    hidden
                    lg:block

                    whitespace-nowrap

                    text-[10px]
                    font-semibold

                    tracking-[0.16em]

                    text-white/65

                    transition-colors
                    duration-300

                    group-hover:text-white
                  "
                >
                  {item.label}
                </span>

                {/* Texto reducido para pantallas medianas */}
                <span
                  className="
                    hidden
                    sm:block
                    lg:hidden

                    whitespace-nowrap

                    text-[9px]
                    font-semibold

                    tracking-[0.12em]

                    text-white/65

                    transition-colors
                    duration-300

                    group-hover:text-white
                  "
                >
                  {item.label === "DARKSIDE'S PICK"
                    ? "PICK"
                    : item.label === "LLAMADO DE ARTISTAS"
                      ? "LLAMADO"
                      : "ARTISTAS"}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}