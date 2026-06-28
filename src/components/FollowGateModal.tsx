"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, ExternalLink, Download, CheckCircle2, Camera, AlertCircle, Loader2 } from "lucide-react";

const STORAGE_KEY = "insta1011_followed";

export function hasFollowed(): boolean {
  if (typeof window === "undefined") return false;
  try { return localStorage.getItem(STORAGE_KEY) === "true"; } catch { return false; }
}

function markFollowed(): void {
  try { localStorage.setItem(STORAGE_KEY, "true"); } catch { /* */ }
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDownload: () => Promise<boolean>;
  username: string;
}

export default function FollowGateModal({ isOpen, onClose, onConfirmDownload, username }: Props) {
  const [clickedFollow, setClickedFollow] = useState(false);
  const [phase, setPhase] = useState<"gate" | "downloading" | "done" | "error">("gate");
  const already = useRef(false);
  const triggered = useRef(false);

  useEffect(() => {
    if (isOpen) {
      already.current = hasFollowed();
      triggered.current = false;
      setClickedFollow(false);
      setPhase("gate");
    }
  }, [isOpen]);

  // Auto-download for returning users
  useEffect(() => {
    if (isOpen && already.current && !triggered.current) {
      triggered.current = true;
      setPhase("downloading");
      onConfirmDownload().then(ok => {
        setPhase(ok ? "done" : "error");
        if (ok) setTimeout(onClose, 1000);
      });
    }
  }, [isOpen, onConfirmDownload, onClose]);

  const handleFollowClick = () => {
    window.open("https://www.instagram.com/ARVINDJAAT1011", "_blank");
    setClickedFollow(true);
  };

  const handleDownload = async () => {
    markFollowed();
    setPhase("downloading");
    const ok = await onConfirmDownload();
    setPhase(ok ? "done" : "error");
    if (ok) setTimeout(onClose, 1200);
  };

  // ── Returning user: quick overlay ──
  if (isOpen && already.current) {
    return (
      <>
        <motion.div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
        <motion.div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
          <motion.div className="w-full max-w-xs rounded-3xl overflow-hidden"
            style={{ background: "rgba(15,15,20,0.98)", border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}>
            <div className="h-1" style={{ background: "linear-gradient(90deg, var(--accent-1, #833ab4), var(--accent-2, #fd1d1d), var(--text-orange, #fcb045))" }} />
            <div className="p-8 text-center">
              {phase === "downloading" && (
                <>
                  <Loader2 className="w-12 h-12 text-purple-400 mx-auto mb-3 animate-spin" />
                  <p className="text-white font-semibold">Generating PDF...</p>
                  <p className="text-white/30 text-xs mt-1">@{username}</p>
                </>
              )}
              {phase === "done" && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                  <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-3" />
                  <p className="text-white font-semibold">PDF Downloaded!</p>
                </motion.div>
              )}
              {phase === "error" && (
                <>
                  <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-3" />
                  <p className="text-white font-semibold">Download Failed</p>
                  <button onClick={onClose} className="text-white/40 text-sm mt-3 hover:text-white/60">Close</button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      </>
    );
  }

  if (!isOpen) return null;

  return (
    <>
      <motion.div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} />
      <motion.div className="fixed inset-0 z-[101] flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="relative w-full max-w-md overflow-hidden"
          style={{ background: "rgba(15,15,20,0.98)", border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 24, boxShadow: "0 25px 80px rgba(0,0,0,0.5)" }}
          initial={{ scale: 0.8, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={e => e.stopPropagation()}>

          <div className="h-1" style={{ background: "linear-gradient(90deg, var(--accent-1, #833ab4), var(--accent-2, #fd1d1d), var(--text-orange, #fcb045))" }} />
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center z-10"
            style={{ background: "rgba(255,255,255,0.05)" }}>
            <X className="w-4 h-4 text-white/40 hover:text-white/80 transition-colors" />
          </button>

          <div className="p-7 pt-6">
            <AnimatePresence mode="wait">
              {phase === "downloading" && (
                <motion.div key="dl" className="text-center py-10"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Loader2 className="w-14 h-14 text-purple-400 mx-auto mb-4 animate-spin" />
                  <p className="text-white font-semibold text-lg">Generating PDF...</p>
                  <p className="text-white/30 text-xs mt-1">This may take a moment</p>
                </motion.div>
              )}
              {phase === "done" && (
                <motion.div key="done" className="text-center py-10"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}>
                    <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">PDF Downloaded!</h3>
                  <p className="text-white/30 text-xs">Future downloads are instant</p>
                </motion.div>
              )}
              {phase === "error" && (
                <motion.div key="err" className="text-center py-10"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Download Failed</h3>
                  <p className="text-white/40 text-sm mb-4">Please try again</p>
                  <button onClick={onClose}
                    className="px-6 py-2.5 rounded-xl text-white/50 text-sm glass-tab">Close</button>
                </motion.div>
              )}
              {phase === "gate" && (
                <motion.div key="gate"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex justify-center mb-5">
                    <motion.div className="relative"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
                      <div className="w-20 h-20 rounded-2xl overflow-hidden" style={{
                        background: "linear-gradient(135deg, var(--accent-1, #833ab4), var(--accent-2, #fd1d1d), var(--text-orange, #fcb045))",
                        boxShadow: "0 0 40px rgba(131,58,180,0.4)" }}>
                        <div className="absolute inset-[3px] rounded-[13px] bg-black/90 flex items-center justify-center">
                          <Camera className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="text-center mb-5">
                    <h2 className="text-lg font-bold text-white mb-1.5">Download PDF Report</h2>
                    <p className="text-white/40 text-sm">
                      Full analysis for <span className="text-purple-400 font-semibold">@{username}</span>
                    </p>
                  </div>

                  <div className="rounded-2xl p-5 mb-4" style={{
                    background: "rgba(var(--text-purple-rgb),0.06)", border: "1px solid rgba(var(--text-purple-rgb),0.12)" }}>
                    <p className="text-center text-white/50 text-sm mb-3.5">
                      One-time only: follow the creator to unlock
                    </p>
                    <motion.button onClick={handleFollowClick}
                      className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-white font-semibold text-[15px] relative overflow-hidden group"
                      style={{ background: "linear-gradient(135deg, var(--accent-1, #833ab4), var(--accent-2, #fd1d1d), var(--text-orange, #fcb045))",
                        boxShadow: "0 4px 20px rgba(131,58,180,0.4)" }}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: "linear-gradient(135deg, var(--text-orange, #fcb045), var(--accent-2, #fd1d1d), var(--accent-1, #833ab4))" }} />
                      <Heart className="w-5 h-5 relative z-10 fill-white" />
                      <span className="relative z-10">Follow @ARVINDJAAT1011</span>
                      <ExternalLink className="w-4 h-4 relative z-10 opacity-60" />
                    </motion.button>
                    {clickedFollow && (
                      <motion.p className="text-center text-emerald-400/70 text-xs mt-2.5"
                        initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                        Instagram opened - follow and come back!
                      </motion.p>
                    )}
                  </div>

                  <motion.button onClick={handleDownload}
                    disabled={!clickedFollow}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                      clickedFollow ? "text-emerald-400" : "text-white/25 cursor-not-allowed"
                    }`}
                    style={{
                      background: clickedFollow ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${clickedFollow ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.06)"}`,
                    }}
                    whileHover={clickedFollow ? { scale: 1.02 } : {}}
                    whileTap={clickedFollow ? { scale: 0.98 } : {}}>
                    <Download className="w-4 h-4" />
                    {clickedFollow ? "I've Followed - Download PDF" : "Follow first to unlock download"}
                  </motion.button>

                  <button onClick={onClose}
                    className="w-full py-3 text-white/25 text-sm hover:text-white/40 transition-colors mt-1">
                    Maybe Later
                  </button>
                  <p className="text-center text-white/12 text-[10px] mt-2">
                    This prompt appears only once. Future downloads are instant.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
