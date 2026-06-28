"use client";
import { motion } from "framer-motion";

function P({ className }: { className?: string }) {
  return (
    <motion.div className={`rounded-xl ${className || ""}`}
      style={{ background:"rgba(255,255,255,0.035)" }}
      animate={{ opacity:[0.3,0.65,0.3] }}
      transition={{ duration:1.4, repeat:Infinity, ease:"easeInOut" }} />
  );
}

export default function LoadingSkeleton() {
  return (
    <motion.div className="max-w-5xl mx-auto px-4 py-5 space-y-4"
      initial={{ opacity:0 }} animate={{ opacity:1 }}>
      {/* Tab bar skeleton */}
      <P className="h-12 rounded-2xl" />
      {/* Profile */}
      <div className="rounded-3xl p-7" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <P className="w-28 h-28 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2.5 w-full">
            <P className="h-7 w-48 mx-auto md:mx-0" />
            <P className="h-4 w-32 mx-auto md:mx-0" />
            <P className="h-3 w-64 mx-auto md:mx-0" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2.5 mt-6">
          {[1,2,3].map(i => <P key={i} className="h-20 rounded-2xl" />)}
        </div>
      </div>
      {/* Score */}
      <div className="rounded-3xl p-7" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center gap-7">
          <P className="w-[130px] h-[130px] rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2.5">
            <P className="h-5 w-44" />
            <P className="h-3 w-56" />
            <div className="flex gap-2">
              {[1,2,3].map(i => <P key={i} className="h-7 w-24 rounded-full" />)}
            </div>
          </div>
        </div>
      </div>
      {/* Wave */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center gap-[3px]">
          {Array.from({length:9}).map((_,i)=>(
            <motion.div key={i} className="w-[3px] rounded-full"
              style={{ background:"linear-gradient(to top,var(--accent-1, #7c3aed),var(--text-pink, #ec4899))" }}
              animate={{ height:[5,22,5], opacity:[0.25,1,0.25] }}
              transition={{ duration:0.6, repeat:Infinity, delay:i*0.065, ease:"easeInOut" }} />
          ))}
        </div>
        <motion.p className="text-[13px] mt-3" style={{ color:"rgba(255,255,255,0.2)" }}
          animate={{ opacity:[0.25,0.6,0.25] }}
          transition={{ duration:2, repeat:Infinity }}>
          Fetching real Instagram data…
        </motion.p>
      </div>
    </motion.div>
  );
}
