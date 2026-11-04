import type { Link, ClickEvent } from "../types";

const LINKS_KEY = "shorty_links_v1";
const CLICKS_KEY = "shorty_clicks_v1";

const INITIAL_SEEDS: Link[] = [
  {
    code: "alchemy",
    url: "https://alchemy.run",
    createdAt: Date.now() - 3600000 * 24 * 3,
    preview: {
      title: "Alchemy · Infrastructure-as-Effects",
      description: "Cloud infrastructure and application logic as a single, type-safe Effect program.",
      fetchedAt: Date.now() - 3600000 * 24 * 3,
      favicon: "https://www.google.com/s2/favicons?domain=alchemy.run&sz=64",
    },
    clicks: 142,
  },
  {
    code: "effect",
    url: "https://effect.website",
    createdAt: Date.now() - 3600000 * 24 * 2,
    preview: {
      title: "Effect: The best way to build robust apps in TypeScript",
      description: "A powerful functional programming system for TypeScript.",
      fetchedAt: Date.now() - 3600000 * 24 * 2,
      favicon: "https://www.google.com/s2/favicons?domain=effect.website&sz=64",
    },
    clicks: 89,
  },
  {
    code: "gh-repo",
    url: "https://github.com/alchemy-run/alchemy",
    createdAt: Date.now() - 3600000 * 24,
    preview: {
      title: "alchemy-run/alchemy: Infrastructure as Effects",
      description: "Source code repository for Alchemy framework on GitHub",
      fetchedAt: Date.now() - 3600000 * 24,
      favicon: "https://www.google.com/s2/favicons?domain=github.com&sz=64",
    },
    clicks: 53,
  },
  {
    code: "cf-work",
    url: "https://developers.cloudflare.com/workers",
    createdAt: Date.now() - 3600000 * 12,
    preview: {
      title: "Cloudflare Workers Documentation",
      description: "Build serverless applications and deploy across Cloudflare edge network",
      fetchedAt: Date.now() - 3600000 * 12,
      favicon: "https://www.google.com/s2/favicons?domain=cloudflare.com&sz=64",
    },
    clicks: 37,
  },
];

export function getStoredLinks(): Link[] {
  try {
    const raw = localStorage.getItem(LINKS_KEY);
    if (!raw) {
      saveStoredLinks(INITIAL_SEEDS);
      return INITIAL_SEEDS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SEEDS;
  } catch {
    return INITIAL_SEEDS;
  }
}

export function saveStoredLinks(links: Link[]): void {
  try {
    localStorage.setItem(LINKS_KEY, JSON.stringify(links));
  } catch (err) {
    console.error("Failed to save links to localStorage", err);
  }
}

export function getStoredClicks(): ClickEvent[] {
  try {
    const raw = localStorage.getItem(CLICKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordClickEvent(event: ClickEvent): void {
  try {
    const events = getStoredClicks();
    events.unshift(event);
    // Keep last 150 events
    localStorage.setItem(CLICKS_KEY, JSON.stringify(events.slice(0, 150)));
  } catch (err) {
    console.error("Failed to record click event", err);
  }
}
