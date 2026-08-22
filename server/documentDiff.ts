export function compareDocumentText(previous: string, current: string) {
  const split = (value: string) => value.split(/[.،]\s*/).map((part) => part.trim()).filter(Boolean);
  const previousParts = split(previous);
  const currentParts = split(current);

  return {
    added: currentParts.filter((part) => !previousParts.includes(part)),
    removed: previousParts.filter((part) => !currentParts.includes(part)),
  };
}
