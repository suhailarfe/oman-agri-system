import { z } from "zod";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  approveDocumentVersion,
  createSavedAuditFilter,
  createDocumentDraft,
  deleteSavedAuditFilter,
  getDocumentVersion,
  getExportDocument,
  getNotificationPreferences,
  getWeeklyProgramSummary,
  listAppNotifications,
  listCurrentDocuments,
  listDocumentHistory,
  listRoadmapMilestones,
  listRoadmapProgressAudits,
  listSavedAuditFilters,
  markAllAppNotificationsRead,
  markAppNotificationRead,
  renameSavedAuditFilter,
  reorderSavedAuditFilters,
  saveNotificationPreferences,
  setRoadmapProgress,
} from "../programData";
import { compareDocumentText } from "../documentDiff";

export const programRouter = router({
  roadmap: router({
    list: publicProcedure.query(() => listRoadmapMilestones()),
    weeklySummary: publicProcedure.query(() => getWeeklyProgramSummary()),
    auditHistory: adminProcedure
      .input(z.object({ query: z.string().trim().max(160).optional(), fromDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), toDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }).optional())
      .query(({ input }) => listRoadmapProgressAudits(input)),
    updateProgress: adminProcedure
      .input(z.object({ code: z.string().min(1), progressPercent: z.number().int().min(0).max(100), reason: z.string().trim().min(4).max(500) }))
      .mutation(({ ctx, input }) => setRoadmapProgress(input.code, input.progressPercent, input.reason, ctx.user)),
    savedFilters: router({
      list: adminProcedure.query(({ ctx }) => listSavedAuditFilters(ctx.user.openId)),
      create: adminProcedure
        .input(z.object({ name: z.string().trim().min(2).max(96), query: z.string().trim().max(160).optional(), fromDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), toDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }))
        .mutation(({ ctx, input }) => createSavedAuditFilter({ ...input, userOpenId: ctx.user.openId })),
      delete: adminProcedure
        .input(z.object({ id: z.number().int().positive() }))
        .mutation(({ ctx, input }) => deleteSavedAuditFilter(input.id, ctx.user.openId)),
      rename: adminProcedure
        .input(z.object({ id: z.number().int().positive(), name: z.string().trim().min(2).max(96) }))
        .mutation(({ ctx, input }) => renameSavedAuditFilter(input.id, input.name, ctx.user.openId)),
      reorder: adminProcedure
        .input(z.object({ ids: z.array(z.number().int().positive()).min(1).max(100) }))
        .mutation(({ ctx, input }) => reorderSavedAuditFilters(input.ids, ctx.user.openId)),
    }),
  }),
  documents: router({
    list: protectedProcedure.query(({ ctx }) => listCurrentDocuments(ctx.user.role)),
    history: adminProcedure
      .input(z.object({ documentKey: z.string().min(1) }))
      .query(({ input }) => listDocumentHistory(input.documentKey)),
    createDraft: adminProcedure
      .input(z.object({
        documentKey: z.string().trim().min(3).max(96),
        versionTag: z.string().trim().min(1).max(32),
        title: z.string().trim().min(3).max(255),
        category: z.string().trim().min(2).max(64),
        summary: z.string().trim().min(10),
        content: z.string().trim().min(20),
        changeSummary: z.string().trim().min(10),
      }))
      .mutation(({ ctx, input }) => createDocumentDraft({ ...input, createdByOpenId: ctx.user.openId })),
    approveVersion: adminProcedure
      .input(z.object({ id: z.number().int().positive(), releaseToInvestors: z.boolean(), approvalNote: z.string().trim().min(4).max(500) }))
      .mutation(({ ctx, input }) => approveDocumentVersion({ ...input, approvedByOpenId: ctx.user.openId })),
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
  notifications: router({
    list: protectedProcedure.query(({ ctx }) => listAppNotifications(ctx.user.openId)),
    markRead: protectedProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(({ ctx, input }) => markAppNotificationRead(input.id, ctx.user.openId)),
    markAllRead: protectedProcedure.mutation(({ ctx }) => markAllAppNotificationsRead(ctx.user.openId)),
    preferences: protectedProcedure.query(({ ctx }) => getNotificationPreferences(ctx.user.openId)),
    updatePreferences: protectedProcedure
      .input(z.object({ draftNotificationsEnabled: z.boolean(), publishedNotificationsEnabled: z.boolean(), mutedUntil: z.number().int().positive().nullable() }))
      .mutation(({ ctx, input }) => saveNotificationPreferences({ ...input, userOpenId: ctx.user.openId })),
  }),
});
