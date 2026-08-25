export function regionDetailHref(code: string) {
  return `/region/${encodeURIComponent(code.trim())}`;
}
