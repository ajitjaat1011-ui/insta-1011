"use client";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorDisplay({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <motion.div className="max-w-lg mx-auto px-4 py-8"
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
      <div className="liquid-glass rounded-3xl p-8 text-center relative overflow-hidden"
        style={{ borderColor:"rgba(239,68,68,0.12)" }}>
        <motion.div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)" }}
          initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring" }}>
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </motion.div>
        <h3 className="text-lg font-bold text-white mb-1.5">Couldn&apos;t Analyze</h3>
        <p className="text-white/35 text-sm mb-5 max-w-sm mx-auto">{message}</p>
        <motion.button onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium glass-tab"
          whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
          <RotateCcw className="w-3.5 h-3.5" />Try Again
        </motion.button>
      </div>
    </motion.div>
  );
}
