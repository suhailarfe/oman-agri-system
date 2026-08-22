import { asc, desc, eq, inArray } from "drizzle-orm";
import { appNotifications, mvpDocumentVersions, notificationPreferences, roadmapMilestones, roadmapProgressAudits, savedAuditFilters, users } from "../drizzle/schema";
import { getDb } from "./db";
import { createRoleAwareExport } from "./documentAccess";
import { buildRoadmapProgressAudit } from "./roadmapAudit";
import { buildVersionApproval } from "./versionApproval";

const roadmapSeed = [
  {
    code: "foundation",
    title: "المرحلة الأولى: التأسيس والبنية التحتية",
    timeframe: "الربع الأول - الربع الثاني 2026",
    status: "complete" as const,
    description: "إطلاق النواة الأولى للمنصة وربط قاعدة البيانات الدائمة وخريطة المناطق الزراعية ومحطات الري الرئيسية.",
    progressPercent: 100,
    sortOrder: 1,
    investorVisible: 1,
  },
  {
    code: "investment-suite",
    title: "المرحلة الثانية: حوسبة الاستثمار وعقود الشراكة الرقمية",
    timeframe: "الربع الثالث - الربع الرابع 2026",
    status: "active" as const,
    description: "تطوير لوحة تحكم المستثمرين وحاسبة العوائد والعقود الرقمية مع رمز تحقق لكل عقد.",
    progressPercent: 68,
    sortOrder: 2,
    investorVisible: 1,
  },
  {
    code: "field-telemetry",
    title: "المرحلة الثالثة: الربط الحي لحساسات الطقس والمياه",
    timeframe: "2027 - 2030",
    status: "planned" as const,
    description: "توسيع شبكة الاستشعار الميداني لربط الطقس والرطوبة والملوحة بالمنصة.",
    progressPercent: 30,
    sortOrder: 3,
    investorVisible: 1,
  },
  {
    code: "vision-2040",
    title: "المرحلة الرابعة: التكامل الشامل والوصول لاستهداف 2040",
    timeframe: "2031 - 2040",
    status: "future" as const,
    description: "توسيع التتبع والحوكمة والتصدير وفق مؤشرات تشغيلية قابلة للمراجعة.",
    progressPercent: 5,
    sortOrder: 4,
    investorVisible: 1,
  },
];

const documentSeed = [
  {
    documentKey: "mvp-data-spec",
    versionTag: "v0.9",
    title: "مواصفات بيانات الحد الأدنى للمنتج",
    category: "data",
    status: "مسودة داخلية مؤرشفة",
    summary: "مسودة أولية لنموذج البيانات التشغيلي الخاص بالأراضي والمياه والمواسم.",
    content: "تحدد المسودة قواعد حفظ التواريخ بتوقيت UTC، وعدم حفظ الملفات داخل قاعدة البيانات، وربط السجلات التشغيلية بمصدرها الزراعي.",
    changeSummary: "نسخة مرجعية قبل اعتماد الحقول الخاصة بتدقيق التصدير وسجل الصلاحيات.",
    accessLevel: "admin" as const,
    createdByOpenId: null,
  },
  {
    documentKey: "mvp-data-spec",
    versionTag: "v1.0",
    title: "مواصفات بيانات الحد الأدنى للمنتج",
    category: "data",
    status: "معتمد رسمياً",
    summary: "يحدد الهيكل الأساسي لبيانات الجداول الاستثمارية ومصادر المياه وإحداثيات المناطق الزراعية في عُمان.",
    content: "تتضمن المواصفات هياكل علائقية للمناطق ومصادر المياه وعقود الشراكة ومؤشرات الأمن الغذائي، وتوضح أن الملفات تحفظ خارج قاعدة البيانات مع تسجيل مفاتيح الوصول والبيانات الوصفية.",
    changeSummary: "أضيفت ضوابط تدقيق التصدير والفصل بين الدور العام للمستخدم ودوره التشغيلي، مع تثبيت حقول مصدر المياه ونتائج الفحص.",
    accessLevel: "investor" as const,
    createdByOpenId: null,
  },
  {
    documentKey: "ui-release-spec",
    versionTag: "v2.1",
    title: "مواصفات واجهة المستخدم وإصدار المنصة",
    category: "ui",
    status: "معتمد وساري",
    summary: "دليل الواجهة والهوية المؤسسية للمنصة مع معايير الوضوح والمقروئية.",
    content: "يعتمد الدليل اللون الأخضر الفلجي باعتباره اللون الدلالي الأساسي، ويطلب استخدام صور الأراضي الحقيقية، وترتيب واجهات عربية متجاوبة قابلة للوصول.",
    changeSummary: "اعتماد رموز ألوان موحدة، وتحسينات واجهات الوثائق وخارطة الطريق، وضوابط التصدير بحسب الدور.",
    accessLevel: "investor" as const,
    createdByOpenId: null,
  },
  {
    documentKey: "mvp-approval-record",
    versionTag: "v1.2",
    title: "سجل اعتماد وتدقيق الإصدار",
    category: "approval",
    status: "مكتمل التدقيق",
    summary: "سجل المراجعات والموافقات الأمنية والإدارية المتعلقة بإصدار MVP.",
    content: "يوثق السجل مراجعة بنية البيانات، ضوابط الصلاحيات، وأساليب تحقق العقود الرقمية قبل نشر الميزات الاستثمارية للمستخدمين.",
    changeSummary: "إضافة مراجعة لصلاحيات تنزيل الوثائق وسجل الفروقات بين الإصدارات المعتمدة.",
    accessLevel: "admin" as const,
    createdByOpenId: null,
  },
  {
    documentKey: "program-roadmap",
    versionTag: "v2.0",
    title: "خارطة طريق منصة واحات ومزارع عُمان 2040",
    category: "strategy",
    status: "قيد التنفيذ النشط",
    summary: "مراحل تأسيس المنصة والتحقق والتوسع والتصدير، مع فصل واضح بين التخطيط والبيانات الميدانية الفعلية.",
    content: "تعرض الخارطة بوابات التحقق من السوق والأرض والمياه والتقنية والتشغيل والجودة والمال، وتبني مراحل التنفيذ على سجل بيانات ومراجعات قابلة للتدقيق.",
    changeSummary: "ربط نسب الإنجاز المعروضة مباشرة بجدول مراحل خارطة الطريق في قاعدة البيانات.",
    accessLevel: "investor" as const,
    createdByOpenId: null,
  },
];

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  return db;
}

export async function ensureProgramReferenceData() {
  const db = await requireDb();
  const [storedMilestones, storedDocuments] = await Promise.all([
    db.select({ id: roadmapMilestones.id }).from(roadmapMilestones).limit(1),
    db.select({ id: mvpDocumentVersions.id }).from(mvpDocumentVersions).limit(1),
  ]);

  if (storedMilestones.length === 0) {
    await db.insert(roadmapMilestones).values(roadmapSeed);
  }

  if (storedDocuments.length === 0) {
    await db.insert(mvpDocumentVersions).values(documentSeed);
  }
}

export async function listRoadmapMilestones() {
  await ensureProgramReferenceData();
  const db = await requireDb();
  return db
    .select()
    .from(roadmapMilestones)
    .where(eq(roadmapMilestones.investorVisible, 1))
    .orderBy(asc(roadmapMilestones.sortOrder));
}

export async function setRoadmapProgress(
  code: string,
  progressPercent: number,
  reason: string,
  actor: { openId: string; name: string | null }
) {
  const db = await requireDb();
  const rows = await db.select().from(roadmapMilestones).where(eq(roadmapMilestones.code, code)).limit(1);
  const current = rows[0];
  if (!current) throw new Error("المرحلة المطلوب تحديثها غير موجودة.");

  await db
    .update(roadmapMilestones)
    .set({ progressPercent })
    .where(eq(roadmapMilestones.code, code));

  await db.insert(roadmapProgressAudits).values(buildRoadmapProgressAudit({
    milestoneCode: code,
    previousProgressPercent: current.progressPercent,
    nextProgressPercent: progressPercent,
    reason,
    changedByOpenId: actor.openId,
    changedByName: actor.name,
  }));

  return listRoadmapMilestones();
}

export async function listRoadmapProgressAudits(filters: { query?: string; fromDate?: string; toDate?: string } = {}) {
  const db = await requireDb();
  const rows = await db
    .select({
      id: roadmapProgressAudits.id,
      milestoneCode: roadmapProgressAudits.milestoneCode,
      milestoneTitle: roadmapMilestones.title,
      previousProgressPercent: roadmapProgressAudits.previousProgressPercent,
      nextProgressPercent: roadmapProgressAudits.nextProgressPercent,
      reason: roadmapProgressAudits.reason,
      changedByName: roadmapProgressAudits.changedByName,
      changedAt: roadmapProgressAudits.changedAt,
    })
    .from(roadmapProgressAudits)
    .innerJoin(roadmapMilestones, eq(roadmapProgressAudits.milestoneCode, roadmapMilestones.code))
    .orderBy(desc(roadmapProgressAudits.changedAt))
    .limit(250);

  const query = filters.query?.trim().toLocaleLowerCase();
  const fromTime = filters.fromDate ? new Date(`${filters.fromDate}T00:00:00.000Z`).getTime() : null;
  const toTime = filters.toDate ? new Date(`${filters.toDate}T23:59:59.999Z`).getTime() : null;

  return rows.filter((row) => {
    const changedAt = new Date(row.changedAt).getTime();
    const matchesQuery = !query || `${row.changedByName ?? ""} ${row.milestoneTitle} ${row.reason}`.toLocaleLowerCase().includes(query);
    return matchesQuery && (fromTime === null || changedAt >= fromTime) && (toTime === null || changedAt <= toTime);
  });
}

async function createRoleNotification(input: {
  recipientRole: "admin" | "user";
  type: "draft" | "published" | "system";
  title: string;
  content: string;
  documentKey?: string;
}) {
  const db = await requireDb();
  const recipients = await db
    .select({ openId: users.openId })
    .from(users)
    .where(eq(users.role, input.recipientRole));
  if (recipients.length === 0) return;
  const preferences = await db
    .select()
    .from(notificationPreferences)
    .where(inArray(notificationPreferences.userOpenId, recipients.map((recipient) => recipient.openId)));
  const preferencesByUser = new Map(preferences.map((preference) => [preference.userOpenId, preference]));
  const eligibleRecipients = recipients.filter((recipient) => {
    const preference = preferencesByUser.get(recipient.openId);
    if (!preference) return true;
    if (input.type === "draft") return preference.draftNotificationsEnabled === 1;
    if (input.type === "published") return preference.publishedNotificationsEnabled === 1;
    return true;
  });
  if (eligibleRecipients.length === 0) return;
  await db.insert(appNotifications).values(eligibleRecipients.map((recipient) => ({ ...input, recipientOpenId: recipient.openId })));
}

export async function getNotificationPreferences(userOpenId: string) {
  const db = await requireDb();
  const rows = await db.select().from(notificationPreferences).where(eq(notificationPreferences.userOpenId, userOpenId)).limit(1);
  return rows[0] ?? { userOpenId, draftNotificationsEnabled: 1, publishedNotificationsEnabled: 1 };
}

export async function saveNotificationPreferences(input: { userOpenId: string; draftNotificationsEnabled: boolean; publishedNotificationsEnabled: boolean }) {
  const db = await requireDb();
  await db
    .insert(notificationPreferences)
    .values({ userOpenId: input.userOpenId, draftNotificationsEnabled: input.draftNotificationsEnabled ? 1 : 0, publishedNotificationsEnabled: input.publishedNotificationsEnabled ? 1 : 0 })
    .onDuplicateKeyUpdate({ set: { draftNotificationsEnabled: input.draftNotificationsEnabled ? 1 : 0, publishedNotificationsEnabled: input.publishedNotificationsEnabled ? 1 : 0 } });
  return getNotificationPreferences(input.userOpenId);
}

export async function listAppNotifications(openId: string) {
  const db = await requireDb();
  return db
    .select()
    .from(appNotifications)
    .where(eq(appNotifications.recipientOpenId, openId))
    .orderBy(desc(appNotifications.createdAt))
    .limit(30);
}

export async function markAppNotificationRead(id: number, openId: string) {
  const db = await requireDb();
  const rows = await db.select().from(appNotifications).where(eq(appNotifications.id, id)).limit(1);
  const notification = rows[0];
  if (!notification || notification.recipientOpenId !== openId) throw new Error("الإشعار المطلوب غير متاح لهذا الحساب.");
  await db.update(appNotifications).set({ isRead: 1 }).where(eq(appNotifications.id, id));
  return { id, isRead: true };
}

export async function markAllAppNotificationsRead(openId: string) {
  const db = await requireDb();
  await db.update(appNotifications).set({ isRead: 1 }).where(eq(appNotifications.recipientOpenId, openId));
  return { success: true };
}

export async function listSavedAuditFilters(userOpenId: string) {
  const db = await requireDb();
  return db.select().from(savedAuditFilters).where(eq(savedAuditFilters.userOpenId, userOpenId)).orderBy(desc(savedAuditFilters.createdAt));
}

export async function createSavedAuditFilter(input: { userOpenId: string; name: string; query?: string; fromDate?: string; toDate?: string }) {
  const db = await requireDb();
  await db.insert(savedAuditFilters).values(input);
  return listSavedAuditFilters(input.userOpenId);
}

export async function deleteSavedAuditFilter(id: number, userOpenId: string) {
  const db = await requireDb();
  const rows = await db.select().from(savedAuditFilters).where(eq(savedAuditFilters.id, id)).limit(1);
  if (!rows[0] || rows[0].userOpenId !== userOpenId) throw new Error("الفِلتر المطلوب غير متاح لهذا الحساب.");
  await db.delete(savedAuditFilters).where(eq(savedAuditFilters.id, id));
  return listSavedAuditFilters(userOpenId);
}

export async function listCurrentDocuments(role: "admin" | "user") {
  await ensureProgramReferenceData();
  const db = await requireDb();
  const rows = await db.select().from(mvpDocumentVersions).orderBy(desc(mvpDocumentVersions.id));
  const latestByDocument = new Map<string, (typeof rows)[number]>();

  for (const row of rows) {
    if (role !== "admin" && (row.accessLevel !== "investor" || row.publicationState !== "approved")) continue;
    if (!latestByDocument.has(row.documentKey)) latestByDocument.set(row.documentKey, row);
  }

  return Array.from(latestByDocument.values());
}

export async function listDocumentHistory(documentKey: string) {
  await ensureProgramReferenceData();
  const db = await requireDb();
  return db
    .select()
    .from(mvpDocumentVersions)
    .where(eq(mvpDocumentVersions.documentKey, documentKey))
    .orderBy(desc(mvpDocumentVersions.id));
}

export async function getDocumentVersion(id: number) {
  const db = await requireDb();
  const rows = await db.select().from(mvpDocumentVersions).where(eq(mvpDocumentVersions.id, id)).limit(1);
  return rows[0];
}

export async function createDocumentDraft(input: {
  documentKey: string;
  versionTag: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  changeSummary: string;
  createdByOpenId: string;
}) {
  const db = await requireDb();
  await db.insert(mvpDocumentVersions).values({
    ...input,
    status: "مسودة بانتظار الاعتماد",
    accessLevel: "admin",
    publicationState: "draft",
  });
  await createRoleNotification({
    recipientRole: "admin",
    type: "draft",
    title: "مسودة مواصفات بانتظار الاعتماد",
    content: `المسودة ${input.versionTag} من وثيقة ${input.title} جاهزة للمراجعة والاعتماد.`,
    documentKey: input.documentKey,
  });
  return listDocumentHistory(input.documentKey);
}

export async function approveDocumentVersion(input: {
  id: number;
  releaseToInvestors: boolean;
  approvalNote: string;
  approvedByOpenId: string;
}) {
  const db = await requireDb();
  const version = await getDocumentVersion(input.id);
  if (!version) throw new Error("نسخة الوثيقة المطلوب اعتمادها غير موجودة.");

  await db
    .update(mvpDocumentVersions)
    .set(buildVersionApproval(input.releaseToInvestors, input.approvalNote, input.approvedByOpenId))
    .where(eq(mvpDocumentVersions.id, input.id));

  if (input.releaseToInvestors) {
    await createRoleNotification({
      recipientRole: "user",
      type: "published",
      title: "نُشر إصدار جديد من المواصفات",
      content: `أصبح الإصدار ${version.versionTag} من وثيقة ${version.title} متاحاً للمستثمرين.`,
      documentKey: version.documentKey,
    });
  }

  return listDocumentHistory(version.documentKey);
}

export async function getExportDocument(documentKey: string, role: "admin" | "user") {
  const history = await listDocumentHistory(documentKey);
  const investorVersion = history.find(
    (version) => version.accessLevel === "investor" && version.publicationState === "approved"
  );
  const selected = role === "admin" ? history[0] ?? investorVersion : investorVersion;

  if (!selected) throw new Error("لا توجد نسخة متاحة للتنزيل لهذا الدور.");

  return createRoleAwareExport(selected, role);
}
