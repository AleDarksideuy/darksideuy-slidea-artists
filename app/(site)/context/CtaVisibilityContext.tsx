"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type CtaVisibilityContextValue = {
  isCtaVisible: boolean;
  showCta: () => void;
};

const CtaVisibilityContext = createContext<CtaVisibilityContextValue | null>(
  null
);

export function CtaVisibilityProvider({ children }: { children: ReactNode }) {
  const [isCtaVisible, setIsCtaVisible] = useState(false);

  const showCta = () => setIsCtaVisible(true);

  return (
    <CtaVisibilityContext.Provider value={{ isCtaVisible, showCta }}>
      {children}
    </CtaVisibilityContext.Provider>
  );
}

export function useCtaVisibility() {
  const ctx = useContext(CtaVisibilityContext);
  if (!ctx) {
    throw new Error(
      "useCtaVisibility debe usarse dentro de CtaVisibilityProvider"
    );
  }
  return ctx;
}
