export type SearchSegment = {
  text: string;
  isMatch: boolean;
};

export function getSearchSegments(value: string, searchTerm: string): SearchSegment[] {
  const query = searchTerm.trim();
  if (!query) return [{ text: value, isMatch: false }];

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const expression = new RegExp(`(${escapedQuery})`, "gi");

  return value.split(expression).map((text) => ({
    text,
    isMatch: text.toLocaleLowerCase() === query.toLocaleLowerCase(),
  }));
}
