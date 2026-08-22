import { describe, expect, it } from "vitest";
import { isNotificationsMuted } from "./notificationPreferences";

describe("isNotificationsMuted", () => {
  it("يكتم الإشعارات فقط قبل موعد انتهاء الكتم", () => {
    const now = Date.UTC(2026, 7, 22, 12, 0, 0);
    expect(isNotificationsMuted(new Date(now + 60_000), now)).toBe(true);
    expect(isNotificationsMuted(new Date(now), now)).toBe(false);
    expect(isNotificationsMuted(null, now)).toBe(false);
  });
});
