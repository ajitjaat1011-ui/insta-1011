"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Sparkles } from "lucide-react";

export default function SearchSection({ onSearch, isLoading }: { onSearch:(u:string)=>void; isLoading:boolean }) {
  const [username, setUsername] = useState("");
  const [focused, setFocused] = useState(false);

  const submit = useCallback((e:React.FormEvent)=>{
    e.preventDefault();
    if(username.trim()&&!isLoading) onSearch(username.trim());
  },[username,isLoading,onSearch]);

  const suggestions = ["cristiano","instagram","kyliejenner","natgeo","nike"];

  return (
    <motion.section className="relative z-10 flex flex-col items-center pt-10 pb-4 px-4"
      initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.8, ease:[0.22,1,0.36,1] }}>
      {/* Logo */}
      <motion.div className="flex flex-col items-center mb-7"
        initial={{ scale:0.5, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ type:"spring", stiffness:140, damping:12 }}>
        <motion.div className="w-14 h-14 rounded-[16px] relative overflow-hidden mb-3 cursor-pointer"
          style={{
            background:"linear-gradient(135deg,#833ab4,#fd1d1d 50%,#fcb045)",
            boxShadow:"0 0 35px rgba(131,58,180,0.3),0 6px 24px rgba(0,0,0,0.4)",
          }}
          whileHover={{ scale:1.1, rotate:5 }} whileTap={{ scale:0.92 }}>
          <div className="absolute inset-[2px] rounded-[14px] bg-black/85 flex items-center justify-center">
            <motion.div className="absolute w-[140%] h-[300%] -rotate-45"
              style={{ background:"linear-gradient(transparent 38%,rgba(255,255,255,0.05) 50%,transparent 62%)" }}
              animate={{ y:["-120%","120%"] }}
              transition={{ duration:3.5, repeat:Infinity, ease:"linear" }} />
            <span className="text-sm font-black text-white relative z-10"
              style={{ textShadow:"0 0 12px rgba(168,85,247,0.5)" }}>1011</span>
          </div>
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          <span style={{ background:"linear-gradient(135deg,#a855f7,#ec4899,#f97316)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Insta</span>
          {" "}<span className="text-white">1011</span>
        </h1>
        <p className="text-[10px] tracking-[0.25em] uppercase mt-1" style={{ color:"rgba(255,255,255,0.22)" }}>
          Real Profile Intelligence
        </p>
      </motion.div>

      {/* Search */}
      <motion.form onSubmit={submit} className="w-full max-w-lg relative"
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}>
        <AnimatePresence>
          {focused && (
            <motion.div className="absolute -inset-[3px] rounded-[24px]"
              style={{ background:"linear-gradient(135deg,rgba(168,85,247,0.4),rgba(236,72,153,0.4),rgba(249,115,22,0.35))",
                filter:"blur(10px)" }}
              initial={{ opacity:0 }} animate={{ opacity:0.55 }} exit={{ opacity:0 }} />
          )}
        </AnimatePresence>
        <div className="liquid-glass rounded-[20px] flex items-center gap-3 px-5 py-3 relative z-10">
          <span className="text-base font-bold" style={{ background:"linear-gradient(135deg,#a855f7,#ec4899)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>@</span>
          <input type="text" value={username}
            onChange={e=>setUsername(e.target.value.replace(/\s/g,""))}
            onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
            placeholder="Enter any Instagram username..."
            className="flex-1 bg-transparent text-white text-[15px] outline-none placeholder:text-white/20"
            disabled={isLoading} autoComplete="off" spellCheck={false} autoCapitalize="off" />
          <motion.button type="submit" disabled={isLoading||!username.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-white font-semibold text-sm disabled:opacity-25"
            style={{ background:"linear-gradient(135deg,#7c3aed,#db2777)",
              boxShadow:"0 4px 18px rgba(124,58,237,0.35)" }}
            whileHover={{ scale:1.05 }} whileTap={{ scale:0.93 }}>
            {isLoading?<Loader2 className="w-4 h-4 animate-spin"/>:<Search className="w-4 h-4"/>}
            <span>{isLoading?"Analyzing":"Analyze"}</span>
          </motion.button>
        </div>
      </motion.form>

      <motion.div className="flex flex-wrap items-center gap-2 mt-4 justify-center"
        initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.55 }}>
        <Sparkles className="w-3 h-3 text-white/15" />
        <span className="text-white/15 text-[11px]">Try:</span>
        {suggestions.map((s,i)=>(
          <motion.button key={s}
            onClick={()=>{setUsername(s);onSearch(s);}}
            className="text-[11px] px-3 py-1 rounded-full text-white/30 hover:text-white glass-tab"
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.65+i*0.07 }}
            whileHover={{ scale:1.08 }} whileTap={{ scale:0.9 }}
            disabled={isLoading}>
            @{s}
          </motion.button>
        ))}
      </motion.div>
    </motion.section>
  );
}
