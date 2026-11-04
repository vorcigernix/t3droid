import React, { useState, useEffect, type FormEvent } from "react";
import type { Link, ClickEvent } from "./types";
import { Header } from "./components/Header";
import { LinkRow } from "./components/LinkRow";
import { BulkImportModal } from "./components/BulkImportModal";
import { QrCodeModal } from "./components/QrCodeModal";
import { TelemetryDashboard } from "./components/TelemetryDashboard";
import {
  getStoredLinks,
  saveStoredLinks,
  getStoredClicks,
  recordClickEvent,
} from "./utils/storage";
import { newCode, normalizeUrl, isValidUrl } from "./utils/codeGenerator";
import { unfurlUrl } from "./utils/unfurl";
import { Search, SlidersHorizontal, Sparkles, Check, AlertCircle } from "lucide-react";

export function App() {
  const [links, setLinks] = useState<Link[]>([]);
  const [clicks, setClicks] = useState<ClickEvent[]>([]);
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [showCustomCode, setShowCustomCode] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [currentTab, setCurrentTab] = useState<"links" | "telemetry">("links");
  const [bulkOpen, setBulkOpen] = useState(false);
  const [activeQrLink, setActiveQrLink] = useState<Link | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const loadedLinks = getStoredLinks();
    setLinks(loadedLinks);
    setClicks(getStoredClicks());

    // Check if URL has a short code redirect in path
    const path = window.location.pathname.replace(/^\//, "").trim();
    if (path && path !== "" && path !== "index.html") {
      const target = loadedLinks.find((l) => l.code.toLowerCase() === path.toLowerCase());
      if (target) {
        handleRecordClick(target.code);
        window.location.href = target.url;
      }
    }
  }, []);

  // Save links when modified
  const updateLinks = (newLinks: Link[]) => {
    setLinks(newLinks);
    saveStoredLinks(newLinks);
  };

  const handleRecordClick = (code: string) => {
    setLinks((prev) => {
      const next = prev.map((l) => {
        if (l.code === code) {
          const updatedClicks = l.clicks + 1;
          const clickEv: ClickEvent = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            code: l.code,
            url: l.url,
            at: Date.now(),
            referrer: "Direct / Web App",
            browser: "Chrome",
            device: "Desktop",
          };
          recordClickEvent(clickEv);
          setClicks((c) => [clickEv, ...c.slice(0, 99)]);
          return { ...l, clicks: updatedClicks };
        }
        return l;
      });
      saveStoredLinks(next);
      return next;
    });
  };

  const createLink = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage("");

    if (!url.trim()) return;

    const normalized = normalizeUrl(url);
    if (!isValidUrl(normalized)) {
      setErrorMessage("Please enter a valid URL (e.g., https://example.com)");
      return;
    }

    let codeToUse = customCode.trim().toLowerCase();
    if (codeToUse) {
      if (!/^[a-z0-9_-]{2,30}$/i.test(codeToUse)) {
        setErrorMessage("Custom code must be 2-30 alphanumeric characters.");
        return;
      }
      if (links.some((l) => l.code.toLowerCase() === codeToUse)) {
        setErrorMessage(`Short code /${codeToUse} is already taken.`);
        return;
      }
    } else {
      codeToUse = newCode();
      // Ensure unique code
      while (links.some((l) => l.code === codeToUse)) {
        codeToUse = newCode();
      }
    }

    const newLink: Link = {
      code: codeToUse,
      url: normalized,
      createdAt: Date.now(),
      clicks: 0,
      isUnfurling: true,
    };

    const updated = [newLink, ...links];
    updateLinks(updated);
    setUrl("");
    setCustomCode("");
    setShowCustomCode(false);

    setSuccessToast(`Created /${newLink.code}`);
    setTimeout(() => setSuccessToast(""), 3500);

    // Asynchronous unfurl worker simulation (matches original background queue job)
    unfurlUrl(normalized).then((preview) => {
      setLinks((current) => {
        const next = current.map((l) =>
          l.code === newLink.code ? { ...l, preview, isUnfurling: false } : l
        );
        saveStoredLinks(next);
        return next;
      });
    });
  };

  const handleBulkImport = (rawUrls: string[]) => {
    const validUrls = rawUrls
      .map(normalizeUrl)
      .filter((u) => isValidUrl(u));

    if (validUrls.length === 0) {
      setErrorMessage("No valid URLs found to import.");
      return;
    }

    const newlyCreated: Link[] = validUrls.map((u) => {
      let code = newCode();
      while (links.some((l) => l.code === code)) {
        code = newCode();
      }
      return {
        code,
        url: u,
        createdAt: Date.now(),
        clicks: 0,
        isUnfurling: true,
      };
    });

    const combined = [...newlyCreated, ...links];
    updateLinks(combined);
    setSuccessToast(`Imported ${newlyCreated.length} links`);
    setTimeout(() => setSuccessToast(""), 3500);

    // Background unfurling
    newlyCreated.forEach((l) => {
      unfurlUrl(l.url).then((preview) => {
        setLinks((curr) => {
          const next = curr.map((item) =>
            item.code === l.code ? { ...item, preview, isUnfurling: false } : item
          );
          saveStoredLinks(next);
          return next;
        });
      });
    });
  };

  const handleDelete = (code: string) => {
    const next = links.filter((l) => l.code !== code);
    updateLinks(next);
  };

  const handleRefreshPreview = async (code: string) => {
    const target = links.find((l) => l.code === code);
    if (!target) return;

    setLinks((prev) =>
      prev.map((l) => (l.code === code ? { ...l, isUnfurling: true } : l))
    );

    const preview = await unfurlUrl(target.url);
    setLinks((prev) => {
      const next = prev.map((l) =>
        l.code === code ? { ...l, preview, isUnfurling: false } : l
      );
      saveStoredLinks(next);
      return next;
    });
  };

  const handleSimulateClick = () => {
    if (links.length === 0 || isSimulating) return;
    setIsSimulating(true);

    const randomLink = links[Math.floor(Math.random() * links.length)];
    handleRecordClick(randomLink.code);

    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  const filteredLinks = links.filter((l) => {
    if (!filterQuery) return true;
    const q = filterQuery.toLowerCase();
    return (
      l.code.toLowerCase().includes(q) ||
      l.url.toLowerCase().includes(q) ||
      (l.preview?.title && l.preview.title.toLowerCase().includes(q))
    );
  });

  const totalClicksCount = links.reduce((sum, l) => sum + l.clicks, 0);

  return (
    <div className="min-h-screen bg-[#14110d] text-stone-100 selection:bg-lime-300 selection:text-stone-900">
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenBulk={() => setBulkOpen(true)}
        onSimulateClick={handleSimulateClick}
        isSimulating={isSimulating}
        totalClicks={totalClicksCount}
      />

      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
        {/* Toast alert */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-lime-300 px-4 py-3 text-sm font-semibold text-stone-950 shadow-2xl shadow-lime-300/20 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <Check className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}

        {currentTab === "links" ? (
          <div>
            {/* Branding / Headline matching original */}
            <p className="font-mono text-sm tracking-[0.3em] text-lime-300 uppercase font-semibold">
              Shorty
            </p>
            <div className="mt-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-stone-50">
                Your links
              </h1>
              <span className="font-mono text-xs text-stone-400">
                {links.length} total · {totalClicksCount} clicks
              </span>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* URL Shortening Form */}
            <form onSubmit={createLink} className="mt-8 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  placeholder="https://…"
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-stone-100 placeholder:text-stone-500 outline-none focus:border-lime-300/60 transition-colors"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-lime-300 px-6 py-3 font-medium text-stone-900 hover:bg-lime-200 transition-colors shadow-sm shrink-0 font-semibold"
                >
                  Shorten
                </button>
              </div>

              {/* Custom slug toggle */}
              <div className="flex items-center justify-between text-xs text-stone-400 px-1">
                <button
                  type="button"
                  onClick={() => setShowCustomCode(!showCustomCode)}
                  className="text-stone-400 hover:text-lime-300 transition-colors font-mono underline underline-offset-2"
                >
                  {showCustomCode ? "- Hide custom alias" : "+ Add custom alias (e.g. /my-link)"}
                </button>
                <span className="text-stone-500 font-mono">Real-time WebSocket sync enabled</span>
              </div>

              {showCustomCode && (
                <div className="flex items-center gap-2 pt-1 animate-in fade-in duration-150">
                  <span className="text-sm font-mono text-stone-500">
                    {window.location.host}/
                  </span>
                  <input
                    type="text"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    placeholder="custom-slug"
                    className="w-48 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-stone-100 outline-none focus:border-lime-300/60"
                  />
                </div>
              )}
            </form>

            {/* Filter and Search Bar */}
            {links.length > 2 && (
              <div className="mt-8 relative">
                <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filter links by title, url, or slug…"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-4 py-2.5 text-xs text-stone-200 placeholder:text-stone-600 outline-none focus:border-white/20 transition-colors"
                />
                {filterQuery && (
                  <button
                    onClick={() => setFilterQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-stone-500 hover:text-stone-300 px-1.5 py-0.5 rounded bg-white/5"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}

            {/* Links List */}
            {filteredLinks.length === 0 ? (
              <p className="mt-8 rounded-2xl border border-dashed border-white/10 px-6 py-12 text-center text-stone-500 font-mono text-sm">
                {links.length === 0 ? "No links yet" : "No links matching your filter"}
              </p>
            ) : (
              <ul className="mt-8 space-y-3">
                {filteredLinks.map((link) => (
                  <LinkRow
                    key={link.code}
                    link={link}
                    onRecordClick={handleRecordClick}
                    onDelete={handleDelete}
                    onShowQr={setActiveQrLink}
                    onRefreshPreview={handleRefreshPreview}
                  />
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <p className="font-mono text-sm tracking-[0.3em] text-lime-300 uppercase font-semibold">
                Shorty
              </p>
              <h1 className="mt-2 font-serif text-4xl sm:text-5xl font-semibold text-stone-50">
                Observability
              </h1>
            </div>

            <TelemetryDashboard
              links={links}
              clicks={clicks}
              onVisit={handleRecordClick}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      <BulkImportModal
        isOpen={bulkOpen}
        onClose={() => setBulkOpen(false)}
        onImport={handleBulkImport}
      />

      <QrCodeModal
        link={activeQrLink}
        onClose={() => setActiveQrLink(null)}
      />
    </div>
  );
}
