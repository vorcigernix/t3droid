const CHARSET = "abcdefghijkmnpqrstuvwxyz23456789";

/**
 * Generate a short, URL-safe 6-character code matching original Shorty algorithm.
 * Excludes ambiguous characters like 0, O, 1, l.
 */
export function newCode(length = 6): string {
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes, (b) => CHARSET.charAt(b % CHARSET.length)).join("");
}

/**
 * Normalizes URL string with protocol if missing.
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * Validates whether string is a plausible URL.
 */
export function isValidUrl(url: string): boolean {
  try {
    const normalized = normalizeUrl(url);
    const parsed = new URL(normalized);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
