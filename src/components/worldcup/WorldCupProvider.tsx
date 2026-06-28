"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";

type WCContextType = {
  isActive: boolean;
  endsAt: number;
  hoursLeft: number;
};

const WorldCupContext = createContext<WCContextType>({ isActive: false, endsAt: 0, hoursLeft: 0 });

const WC_END_IST = new Date("2026-06-29T00:00:00+05:30").getTime();

export function useWorldCup() {
  return useContext(WorldCupContext);
}

export default function WorldCupProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const check = () => {
      const t = Date.now();
      setNow(t);
      const on = t < WC_END_IST;
      setActive(on);
      if (on) {
        document.documentElement.setAttribute("data-wc", "2026");
      } else {
        document.documentElement.removeAttribute("data-wc");
      }
      return on;
    };
    check();
    const iv = setInterval(() => {
      if (!check()) {
        clearInterval(iv);
        // auto-revert, hard reload to clear any cached themed styles
        location.reload();
      }
    }, 30000);
    return () => clearInterval(iv);
  }, []);

  const value = useMemo(() => ({
    isActive: active,
    endsAt: WC_END_IST,
    hoursLeft: Math.max(0, Math.floor((WC_END_IST - now) / 3600000)),
  }), [active, now]);

  return (
    <WorldCupContext.Provider value={value}>
      {children}
    </WorldCupContext.Provider>
  );
}
