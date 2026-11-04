import type { Preview } from "../types";

/**
 * Intelligent unfurler that extracts realistic title, domain metadata,
 * and favicon for shortened links.
 */
export async function unfurlUrl(urlStr: string): Promise<Preview> {
  // Simulate network unfurling latency between 300ms to 700ms
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));

  try {
    const parsed = new URL(urlStr);
    const hostname = parsed.hostname.replace(/^www\./, "");
    const pathname = parsed.pathname;

    let title = hostname;
    let description = `Destination: ${parsed.origin}${pathname}`;

    // Common recognized domains
    if (hostname.includes("github.com")) {
      const parts = pathname.split("/").filter(Boolean);
      if (parts.length >= 2) {
        title = `${parts[0]}/${parts[1]}: GitHub Repository`;
        description = `Source code and collaboration on GitHub`;
      } else if (parts.length === 1) {
        title = `${parts[0]} - GitHub Profile`;
      } else {
        title = "GitHub: Where the world builds software";
      }
    } else if (hostname.includes("alchemy.run")) {
      title = "Alchemy · Infrastructure-as-Effects";
      description = "Cloud infrastructure and application logic as a single, type-safe Effect program.";
    } else if (hostname.includes("effect.website")) {
      title = "Effect: The best way to build robust apps in TypeScript";
      description = "A powerful functional programming system for TypeScript.";
    } else if (hostname.includes("cloudflare.com")) {
      title = "Cloudflare - The Web Performance & Security Company";
      description = "Cloudflare Workers, Pages, and global edge network.";
    } else if (hostname.includes("news.ycombinator.com")) {
      title = "Hacker News";
      description = "Social news website focusing on computer science and entrepreneurship.";
    } else if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
      title = "YouTube Video";
      description = "Watch videos, listen to music, and stream content.";
    } else if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
      title = "X (formerly Twitter)";
      description = "Breaking news, entertainment, sports and politics.";
    } else {
      // Format readable title from pathname
      const pathSegments = pathname.split("/").filter(Boolean);
      if (pathSegments.length > 0) {
        const last = pathSegments[pathSegments.length - 1];
        const formatted = decodeURIComponent(last)
          .replace(/[-_.]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        title = `${formatted} | ${hostname}`;
      } else {
        const parts = hostname.split(".");
        const brand = parts.length > 1 ? parts[0] : hostname;
        title = `${brand.charAt(0).toUpperCase() + brand.slice(1)} - Home`;
      }
    }

    return {
      title,
      description,
      fetchedAt: Date.now(),
      favicon: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
    };
  } catch {
    return {
      title: urlStr,
      fetchedAt: Date.now(),
    };
  }
}
