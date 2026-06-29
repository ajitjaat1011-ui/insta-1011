"use client";
import { createContext, useContext, ReactNode } from "react";

type WCContextType = {
  isActive: boolean;
  endsAt: number;
  hoursLeft: number;
};

const WorldCupContext = createContext<WCContextType>({ isActive: true, endsAt: 0, hoursLeft: 999 });

// FIFA World Cup 2026 – Argentina Edition – PERMANENT
export function useWorldCup() {
  return useContext(WorldCupContext);
}

export default function WorldCupProvider({ children }: { children: ReactNode }) {
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-wc", "2026");
  }

  const value = { isActive: true, endsAt: 0, hoursLeft: 999 };

  return (
    <WorldCupContext.Provider value={value}>
      {children}
    </WorldCupContext.Provider>
  );
}
