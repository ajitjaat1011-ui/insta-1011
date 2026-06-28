"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { InstagramProfile, ProfileAnalysis } from "@/lib/instagram";
import SplashScreen from "@/components/SplashScreen";
import Background from "@/components/Background";
import SearchSection from "@/components/SearchSection";
import ResultsView from "@/components/ResultsView";
import Footer from "@/components/Footer";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorDisplay from "@/components/ErrorDisplay";
import InstallPrompt from "@/components/InstallPrompt";

interface Result {
  profile: InstagramProfile;
  analysis: ProfileAnalysis;
}

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastSearch, setLastSearch] = useState("");

  const handleSearch = useCallback(async (username: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLastSearch(username);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setResult({
        profile: data.profile as InstagramProfile,
        analysis: data.analysis as ProfileAnalysis,
      });

      setTimeout(() => {
        window.scrollTo({ top: 180, behavior: "smooth" });
      }, 250);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setResult(null); setError(null); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!showSplash && (
          <motion.div className="min-h-screen relative"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}>
            <Background />

            <div className="relative z-10 max-w-5xl mx-auto">
              <SearchSection onSearch={handleSearch} isLoading={isLoading} />

              <AnimatePresence mode="wait">
                {isLoading && (
                  <motion.div key="loading" initial={{ opacity:0 }}
                    animate={{ opacity:1 }} exit={{ opacity:0 }}>
                    <LoadingSkeleton />
                  </motion.div>
                )}

                {error && !isLoading && (
                  <motion.div key="error" initial={{ opacity:0 }}
                    animate={{ opacity:1 }} exit={{ opacity:0 }}>
                    <ErrorDisplay message={error}
                      onRetry={() => lastSearch && handleSearch(lastSearch)} />
                  </motion.div>
                )}

                {result && !isLoading && (
                  <motion.div key="results"
                    initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                    <ResultsView profile={result.profile} analysis={result.analysis} />
                  </motion.div>
                )}
              </AnimatePresence>

              <Footer />
            </div>

            <InstallPrompt />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
