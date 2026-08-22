export function isNotificationsMuted(mutedUntil: Date | null | undefined, now = Date.now()) {
  return Boolean(mutedUntil && mutedUntil.getTime() > now);
}
