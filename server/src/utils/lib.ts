export function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function isHtmlResponse(contentType: string): boolean {
  return /\b(text\/html|application\/xhtml\+xml)\b/i.test(contentType);
}

