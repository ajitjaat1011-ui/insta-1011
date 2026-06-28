"use client";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Play, Image as ImageIcon, TrendingUp } from "lucide-react";
import type { InstagramProfile } from "@/lib/instagram";

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toLocaleString();
}

export default function SectionPosts({ profile }: { profile: InstagramProfile }) {
  const posts = profile.recentPosts;

  if (!posts.length) {
    return (
      <motion.div className="liquid-glass rounded-3xl p-10 text-center"
        initial={{ opacity:0 }} animate={{ opacity:1 }}>
        <ImageIcon className="w-14 h-14 text-white/10 mx-auto mb-3" />
        <p className="text-white/25 text-sm">No posts available — account may be private or newly created</p>
      </motion.div>
    );
  }

  // Find best & worst posts
  const sorted = [...posts].sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  return (
    <div className="space-y-4">
      {/* Best & worst post */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { post: best, label: "🏆 Best Performing", color: "#22c55e" },
          { post: worst, label: "📉 Lowest Performing", color: "#f59e0b" },
        ].map(({ post, label, color }) => (
          <motion.a
            key={label}
            href={`https://www.instagram.com/p/${post.shortcode}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass rounded-2xl p-4 flex gap-4 items-center group"
            initial={{ opacity:0, y:15 }}
            animate={{ opacity:1, y:0 }}
            whileHover={{ scale:1.02 }}
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{
              background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)",
            }}>
              {post.imageUrl ? (
                <img src={post.imageUrl} alt="" className="w-full h-full object-cover"
                  onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-white/10" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium" style={{ color }}>{label}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-white font-bold text-sm flex items-center gap-1">
                  <Heart className="w-3 h-3 text-pink-400" />{fmt(post.likes)}
                </span>
                <span className="text-white font-bold text-sm flex items-center gap-1">
                  <MessageCircle className="w-3 h-3 text-blue-400" />{fmt(post.comments)}
                </span>
              </div>
              <p className="text-white/20 text-[10px] mt-0.5 truncate">
                {post.caption?.slice(0, 60) || "No caption"}
              </p>
            </div>
            <TrendingUp className="w-4 h-4 text-white/10 flex-shrink-0 group-hover:text-white/30 transition-colors" />
          </motion.a>
        ))}
      </div>

      {/* Posts heading */}
      <div className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-orange-400" />
        <h3 className="text-sm font-bold text-white">All Recent Posts</h3>
        <span className="text-white/15 text-[11px] ml-auto">{posts.length} analyzed</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {posts.map((post, i) => (
          <motion.a
            key={post.id || i}
            href={`https://www.instagram.com/p/${post.shortcode}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl overflow-hidden group relative aspect-square"
            style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.04)" }}
            initial={{ opacity:0, scale:0.88 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ delay:0.05*i, type:"spring", stiffness:160 }}
            whileHover={{ scale:1.04, y:-3 }}
          >
            {post.imageUrl ? (
              <img src={post.imageUrl} alt="" loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={e=>{(e.target as HTMLImageElement).style.display="none";}} />
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{ background:"linear-gradient(135deg,rgba(124,58,237,0.15),rgba(219,39,119,0.15))" }}>
                <ImageIcon className="w-8 h-8 text-white/10" />
              </div>
            )}
            {post.isVideo && (
              <div className="absolute top-1.5 right-1.5 rounded-full px-2 py-0.5 flex items-center gap-1"
                style={{ background:"rgba(0,0,0,0.55)", backdropFilter:"blur(8px)" }}>
                <Play className="w-2.5 h-2.5 text-white fill-white" />
                <span className="text-[9px] text-white font-medium">Reel</span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
              style={{ background:"rgba(0,0,0,0.6)", backdropFilter:"blur(4px)" }}>
              <div className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-white fill-white" /><span className="text-white font-bold text-xs">{fmt(post.likes)}</span></div>
              <div className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5 text-white fill-white" /><span className="text-white font-bold text-xs">{fmt(post.comments)}</span></div>
            </div>
            {/* Engagement bar at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px]">
              <motion.div className="h-full"
                style={{ background:"linear-gradient(90deg,#7c3aed,#ec4899)" }}
                initial={{ width:0 }}
                animate={{ width:`${Math.min(((post.likes+post.comments)/Math.max(...posts.map(p=>p.likes+p.comments),1))*100, 100)}%` }}
                transition={{ delay:0.3+i*0.04, duration:0.8 }} />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
