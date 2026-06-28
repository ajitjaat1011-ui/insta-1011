"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, BarChart3, Image as ImageIcon, Shield, ChevronRight, Download, FileText } from "lucide-react";
import type { InstagramProfile, ProfileAnalysis } from "@/lib/instagram";
import SectionOverview from "./sections/SectionOverview";
import SectionAnalytics from "./sections/SectionAnalytics";
import SectionPosts from "./sections/SectionPosts";
import SectionAuthenticity from "./sections/SectionAuthenticity";
import FollowGateModal, { hasFollowed } from "./FollowGateModal";
import { generateProfilePDF } from "@/lib/generatePDF";

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "posts", label: "Posts", icon: ImageIcon },
  { id: "authenticity", label: "Authenticity", icon: Shield },
] as const;

type TabId = typeof tabs[number]["id"];

export default function ResultsView({
  profile, analysis,
}: {
  profile: InstagramProfile;
  analysis: ProfileAnalysis;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);

  useEffect(() => { setIsFollowed(hasFollowed()); }, [showFollowModal]);

  const triggerPDF = useCallback(async (): Promise<boolean> => {
    return generateProfilePDF(profile);
  }, [profile]);

  const handleDownloadClick = useCallback(async () => {
    if (hasFollowed()) {
      generateProfilePDF(profile);
      return;
    }
    setShowFollowModal(true);
  }, [profile]);

  return (
    <motion.div className="px-4 pb-6" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
      {/* Divider */}
      <motion.div className="flex items-center gap-4 pt-2 mb-4"
        initial={{ opacity:0, scaleX:0 }} animate={{ opacity:1, scaleX:1 }}
        transition={{ delay:0.1, duration:0.5 }}>
        <div className="flex-1 h-[1px]" style={{ background:"linear-gradient(90deg,transparent,rgba(168,85,247,0.25))" }} />
        <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color:"rgba(255,255,255,0.18)" }}>Analysis Results</span>
        <div className="flex-1 h-[1px]" style={{ background:"linear-gradient(90deg,rgba(168,85,247,0.25),transparent)" }} />
      </motion.div>

      {/* Download Banner */}
      <motion.div className="liquid-glass rounded-2xl p-4 mb-4 flex items-center justify-between gap-4 flex-wrap"
        initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background:"rgba(168,85,247,0.12)" }}>
            <FileText className="w-5 h-5 text-purple-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold">Export Full Report</p>
            <p className="text-white/30 text-[11px] truncate">
              {isFollowed ? "Download PDF report instantly" : "Download professional PDF for @" + profile.username}
            </p>
          </div>
        </div>
        <motion.button onClick={handleDownloadClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm flex-shrink-0"
          style={{
            background: isFollowed ? "linear-gradient(135deg, #16a34a, #22c55e)" : "linear-gradient(135deg, #7c3aed, #db2777)",
            boxShadow: isFollowed ? "0 4px 15px rgba(34,197,94,0.3)" : "0 4px 15px rgba(124,58,237,0.3)",
          }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Download className="w-4 h-4" />
          Download PDF
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <motion.div className="liquid-glass rounded-2xl p-1.5 mb-5 flex gap-1 overflow-x-auto relative z-20"
        initial={{ opacity:0, y:15 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
        {tabs.map(tab => (
          <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[12px] font-medium flex-1 justify-center
              transition-all duration-300 relative whitespace-nowrap
              ${activeTab === tab.id ? "text-white glass-tab-active" : "text-white/35 hover:text-white/60"}`}
            whileTap={{ scale:0.96 }}>
            <tab.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div className="absolute inset-0 rounded-xl"
                style={{ background:"linear-gradient(135deg, rgba(168,85,247,0.08), rgba(236,72,153,0.06))",
                  border:"1px solid rgba(168,85,247,0.15)" }}
                layoutId="activeTabBg"
                transition={{ type:"spring", stiffness:400, damping:30 }} />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity:0, y:20, filter:"blur(8px)" }}
          animate={{ opacity:1, y:0, filter:"blur(0px)" }}
          exit={{ opacity:0, y:-15, filter:"blur(8px)" }}
          transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}>
          {activeTab === "overview" && <SectionOverview profile={profile} analysis={analysis} onNavigate={setActiveTab} />}
          {activeTab === "analytics" && <SectionAnalytics profile={profile} analysis={analysis} />}
          {activeTab === "posts" && <SectionPosts profile={profile} />}
          {activeTab === "authenticity" && <SectionAuthenticity profile={profile} analysis={analysis} />}
        </motion.div>
      </AnimatePresence>

      {/* Quick nav */}
      {activeTab !== "authenticity" && (
        <motion.div className="flex justify-center mt-6"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}>
          <motion.button
            onClick={() => {
              const idx = tabs.findIndex(t => t.id === activeTab);
              if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] text-white/30 hover:text-white/60 glass-tab transition-all"
            whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}>
            Next: {tabs[tabs.findIndex(t => t.id === activeTab) + 1]?.label}
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.button>
        </motion.div>
      )}

      <FollowGateModal
        isOpen={showFollowModal}
        onClose={() => setShowFollowModal(false)}
        onConfirmDownload={triggerPDF}
        username={profile.username}
      />
    </motion.div>
  );
}
