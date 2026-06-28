"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    if (typeof window !== "undefined" && sessionStorage.getItem("pwa-dismissed")) {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 8 seconds
      setTimeout(() => setShow(true), 8000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem("pwa-dismissed", "1");
  };

  if (dismissed || !show) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 left-4 right-4 z-[90] max-w-md mx-auto"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="liquid-glass rounded-2xl p-4 flex items-center gap-3"
          style={{ boxShadow: "0 -4px 30px rgba(0,0,0,0.4), 0 0 40px rgba(var(--text-purple-rgb),0.08)" }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, var(--accent-1, #833ab4), var(--accent-2, #fd1d1d), var(--text-orange, #fcb045))" }}>
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold">Install Insta 1011</p>
            <p className="text-white/30 text-[11px]">Add to home screen for app-like experience</p>
          </div>
          <motion.button onClick={handleInstall}
            className="px-4 py-2 rounded-xl text-white font-semibold text-xs flex-shrink-0 flex items-center gap-1.5"
            style={{ background: "linear-gradient(135deg, var(--accent-1, #7c3aed), var(--accent-2, #db2777))", boxShadow: "0 2px 12px rgba(var(--accent-1-rgb),0.3)" }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Download className="w-3.5 h-3.5" />
            Install
          </motion.button>
          <button onClick={handleDismiss} className="p-1.5 text-white/20 hover:text-white/50 transition-colors flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
