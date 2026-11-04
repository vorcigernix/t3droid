import React from "react";
import { Link2, BarChart3, PlusCircle, Radio, Sparkles } from "lucide-react";

interface HeaderProps {
  currentTab: "links" | "telemetry";
  onTabChange: (tab: "links" | "telemetry") => void;
  onOpenBulk: () => void;
  onSimulateClick: () => void;
  isSimulating: boolean;
  totalClicks: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenBulk,
  onSimulateClick,
  isSimulating,
  totalClicks,
}) => {
  return (
    <header className="border-b border-white/10 bg-[#14110d]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto max-w-4xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-lime-300 text-stone-950 font-bold flex items-center justify-center shadow-lg shadow-lime-300/20">
            <Link2 className="w-5 h-5 text-stone-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs tracking-[0.25em] text-lime-300 uppercase font-semibold">
                Shorty
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-lime-300/10 text-lime-300 border border-lime-300/20">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-400 animate-pulse" />
                Live WS
              </span>
            </div>
            <p className="text-xs text-stone-400">High-performance link router & metrics</p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => onTabChange("links")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              currentTab === "links"
                ? "bg-white/10 text-white border border-white/15"
                : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            Links
          </button>

          <button
            onClick={() => onTabChange("telemetry")}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              currentTab === "telemetry"
                ? "bg-white/10 text-white border border-white/15"
                : "text-stone-400 hover:text-stone-200 hover:bg-white/5"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Telemetry
          </button>

          <button
            onClick={onOpenBulk}
            className="px-3 py-1.5 text-xs font-medium rounded-lg text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Bulk Import
          </button>

          <button
            onClick={onSimulateClick}
            disabled={isSimulating}
            title="Fire a random live click to test real-time WebSocket counter"
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              isSimulating
                ? "bg-lime-400/20 text-lime-200 cursor-wait border border-lime-300/30"
                : "bg-lime-300 text-stone-900 hover:bg-lime-200 shadow-sm shadow-lime-300/30 font-medium"
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
            {isSimulating ? "Streaming..." : "Simulate Click"}
          </button>
        </div>
      </div>
    </header>
  );
};
