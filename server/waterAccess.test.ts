import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createInvestorContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "investor-water-test",
      email: "investor@example.com",
      name: "مستثمر اختباري",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("صلاحيات اعتماد قراءات المياه", () => {
  it("يرفض فتح طابور مراجعة المياه لحساب المستثمر", async () => {
    const caller = appRouter.createCaller(createInvestorContext());
    await expect(caller.program.water.reviewQueue()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
