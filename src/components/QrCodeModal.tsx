import React from "react";
import { X, QrCode as QrIcon, Download, Copy, Check } from "lucide-react";
import type { Link } from "../types";

interface QrCodeModalProps {
  link: Link | null;
  onClose: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ link, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!link) return null;

  const shortUrl = `${window.location.origin}/${link.code}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    shortUrl
  )}&bgcolor=14-11-0d&color=bef264&margin=10`;

  const copyUrl = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#191510] p-6 shadow-2xl relative text-stone-100 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-10 h-10 rounded-xl bg-lime-300/10 text-lime-300 border border-lime-300/20 flex items-center justify-center mb-3">
          <QrIcon className="w-5 h-5" />
        </div>

        <h3 className="font-serif text-2xl font-semibold text-stone-50">QR Code</h3>
        <p className="font-mono text-sm text-lime-300 mt-1">/{link.code}</p>
        <p className="text-xs text-stone-400 mt-1 truncate px-4">{link.url}</p>

        <div className="mt-5 p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center">
          <img
            src={qrUrl}
            alt={`QR code for /${link.code}`}
            className="w-48 h-48 rounded-lg shadow-lg"
          />
        </div>

        <div className="mt-5 flex gap-2 justify-center">
          <button
            onClick={copyUrl}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-stone-200 hover:bg-white/10 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-lime-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy URL"}
          </button>
          <a
            href={qrUrl}
            download={`qr-${link.code}.png`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-xl bg-lime-300 px-4 py-2 text-xs font-semibold text-stone-900 hover:bg-lime-200 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>
      </div>
    </div>
  );
};
