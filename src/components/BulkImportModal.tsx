import React, { useState } from "react";
import { X, UploadCloud, AlertCircle } from "lucide-react";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (urls: string[]) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const lines = text
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (lines.length === 0) {
      setError("Please paste at least one valid URL.");
      return;
    }

    onImport(lines);
    setText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#191510] p-6 shadow-2xl relative text-stone-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-lime-300/10 text-lime-300 border border-lime-300/20">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-semibold text-stone-50">Bulk Import</h3>
            <p className="text-xs text-stone-400 font-mono">POST /links/import</p>
          </div>
        </div>

        <p className="text-sm text-stone-400 mt-2 mb-4">
          Paste multiple URLs (one per line). Shorty will generate unique codes and stream background unfurl jobs for each.
        </p>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder={`https://github.com/alchemy-run/alchemy\nhttps://effect.website\nhttps://news.ycombinator.com`}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-mono text-stone-100 placeholder:text-stone-600 outline-none focus:border-lime-300/60"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-stone-500 font-mono">
              {text.split(/[\n,]+/).filter((s) => s.trim().length > 0).length} links detected
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-lime-300 px-5 py-2 text-xs font-semibold text-stone-900 hover:bg-lime-200 transition-colors shadow-sm"
              >
                Import All
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
