import { z } from "zod";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getDocumentVersion,
  getExportDocument,
  listCurrentDocuments,
  listDocumentHistory,
  listRoadmapMilestones,
  setRoadmapProgress,
} from "../programData";
import { compareDocumentText } from "../documentDiff";

export const programRouter = router({
  roadmap: router({
    list: publicProcedure.query(() => listRoadmapMilestones()),
    updateProgress: adminProcedure
      .input(z.object({ code: z.string().min(1), progressPercent: z.number().int().min(0).max(100) }))
      .mutation(({ input }) => setRoadmapProgress(input.code, input.progressPercent)),
  }),
  documents: router({
    list: protectedProcedure.query(({ ctx }) => listCurrentDocuments(ctx.user.role)),
    history: adminProcedure
      .input(z.object({ documentKey: z.string().min(1) }))
      .query(({ input }) => listDocumentHistory(input.documentKey)),
    compare: adminProcedure
      .input(z.object({ previousId: z.number().int().positive(), currentId: z.number().int().positive() }))
      .query(async ({ input }) => {
        const [previous, current] = await Promise.all([
          getDocumentVersion(input.previousId),
          getDocumentVersion(input.currentId),
        ]);

        if (!previous || !current || previous.documentKey !== current.documentKey) {
          throw new Error("تعذر مقارنة النسختين المطلوبتين.");
        }

        return {
          previous,
          current,
          summaryDiff: compareDocumentText(previous.summary, current.summary),
          contentDiff: compareDocumentText(previous.content, current.content),
        };
      }),
    exportPayload: protectedProcedure
      .input(z.object({ documentKey: z.string().min(1) }))
      .mutation(({ ctx, input }) => getExportDocument(input.documentKey, ctx.user.role)),
  }),
});
