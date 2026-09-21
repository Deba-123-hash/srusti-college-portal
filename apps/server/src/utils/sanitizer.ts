// =============================================================================
// Srusti Academy of Management and Technology — College Portal
// Rich Text Sanitizer Utility
// =============================================================================

/**
 * Sanitizes rich text / HTML content by stripping potentially dangerous tags and attributes.
 * Disallows <script>, <iframe>, <object>, <embed>, event handlers, and javascript: protocols.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty || typeof dirty !== "string") {
    return "";
  }

  let clean = dirty;

  // 1. Remove script tags and contents
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // 2. Remove iframe tags and contents
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");

  // 3. Remove object, embed, applet, meta, link tags
  clean = clean.replace(/<\/?(?:object|embed|applet|meta|link|base)\b[^>]*>/gi, "");

  // 4. Remove inline event handlers (e.g. onload, onerror, onclick, onmouseover)
  clean = clean.replace(/\s+on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");

  // 5. Remove javascript: pseudo-protocol in attributes
  clean = clean.replace(/(?:href|src|data)\s*=\s*["']?\s*javascript:[^"'>\s]*/gi, "");

  return clean.trim();
}
