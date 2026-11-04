import React, { useState } from "react";
import type { Link } from "../types";
import { Copy, Check, ExternalLink, QrCode, Trash2, ArrowUpRight, Globe, RefreshCw } from "lucide-react";

interface LinkRowProps {
  link: Link;
  onRecordClick: (code: string) => void;
  onDelete: (code: string) => void;
  onShowQr: (link: Link) => void;
  onRefreshPreview: (code: string) => void;
}

export const LinkRow: React.FC<LinkRowProps> = ({
  link,
  onRecordClick,
  onDelete,
  onShowQr,
  onRefreshPreview,
}) => {
  const [copied, setCopied] = useState(false);
  const [justClicked, setJustClicked] = useState(false);

  const shortUrl = `${window.location.origin}/${link.code}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVisit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRecordClick(link.code);
    setJustClicked(true);
    setTimeout(() => setJustClicked(false), 800);
    window.open(link.url, "_blank", "noopener,noreferrer");
  };

  const handleQuickClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRecordClick(link.code);
    setJustClicked(true);
    setTimeout(() => setJustClicked(false), 800);
  };

  return (
    <li className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border transition-all duration-200 px-6 py-4 ${
      justClicked 
        ? "border-lime-300/60 bg-lime-400/5 shadow-md shadow-lime-300/10" 
        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
    }`}>
      {/* Left info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {link.preview?.favicon ? (
            <img
              src={link.preview.favicon}
              alt=""
              className="w-4 h-4 rounded-sm shrink-0 opacity-80"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <Globe className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          )}

          <p className="truncate text-lg font-medium text-stone-100">
            {link.preview?.title ?? (
              <span className="text-stone-500 italic animate-pulse">Fetching preview…</span>
            )}
          </p>

          {link.isUnfurling && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-lime-300/20 text-lime-300 font-mono animate-pulse">
              unfurling
            </span>
          )}
        </div>

        <p className="truncate text-sm text-stone-400 mt-1 font-mono group-hover:text-stone-300 transition-colors">
          {link.url}
        </p>

        {link.preview?.description && (
          <p className="text-xs text-stone-500 line-clamp-1 mt-1">
            {link.preview.description}
          </p>
        )}
      </div>

      {/* Action controls & Code & Tabular Live Clicks */}
      <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-center shrink-0">
        <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleCopy}
            title={copied ? "Copied!" : "Copy short URL"}
            className="p-1.5 rounded-lg text-stone-400 hover:text-lime-300 hover:bg-white/10 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-lime-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onShowQr(link)}
            title="View QR Code"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-white/10 transition-colors"
          >
            <QrCode className="w-4 h-4" />
          </button>

          <button
            onClick={() => onRefreshPreview(link.code)}
            title="Re-unfurl metadata"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-white/10 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${link.isUnfurling ? "animate-spin text-lime-300" : ""}`} />
          </button>

          <button
            onClick={handleVisit}
            title="Open target URL (tracks click)"
            className="p-1.5 rounded-lg text-stone-400 hover:text-lime-300 hover:bg-white/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(link.code)}
            title="Delete link"
            className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Short Code link */}
        <button
          onClick={handleVisit}
          className="font-mono text-sm text-lime-300 hover:underline flex items-center gap-0.5 group/code"
          title="Visit short link"
        >
          <span>/{link.code}</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover/code:opacity-100 group-hover/code:translate-x-0.5 group-hover/code:-translate-y-0.5 transition-transform" />
        </button>

        {/* Tabular Live Clicks */}
        <div 
          onClick={handleQuickClick}
          title="Click count recorded by Durable Object. Click badge to increment!"
          className={`cursor-pointer select-none text-right transition-transform ${justClicked ? "scale-110" : ""}`}
        >
          <p className={`w-20 font-mono text-2xl tabular-nums font-semibold transition-colors ${
            justClicked ? "text-lime-300" : "text-stone-100"
          }`}>
            {link.clicks.toLocaleString()}
          </p>
          <span className="text-[10px] font-mono text-stone-500 block -mt-0.5">clicks</span>
        </div>
      </div>
    </li>
  );
};
