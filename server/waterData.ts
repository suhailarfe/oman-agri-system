import { and, asc, desc, eq } from "drizzle-orm";
import { waterMeasurements } from "../drizzle/schema";
import { getDb } from "./db";

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("قاعدة البيانات غير متاحة حالياً.");
  return db;
}

export async function listLatestApprovedWaterMeasurements() {
  const db = await requireDb();
  const readings = await db
    .select()
    .from(waterMeasurements)
    .where(eq(waterMeasurements.approvalStatus, "approved"))
    .orderBy(desc(waterMeasurements.sampledAt), desc(waterMeasurements.id));

  const latestByRegion = new Set<string>();
  return readings.filter((reading) => {
    if (latestByRegion.has(reading.regionCode)) return false;
    latestByRegion.add(reading.regionCode);
    return true;
  });
}

export async function listApprovedWaterHistory(regionCode?: string) {
  const db = await requireDb();
  return db
    .select()
    .from(waterMeasurements)
    .where(regionCode ? and(eq(waterMeasurements.approvalStatus, "approved"), eq(waterMeasurements.regionCode, regionCode)) : eq(waterMeasurements.approvalStatus, "approved"))
    .orderBy(asc(waterMeasurements.sampledAt), asc(waterMeasurements.id));
}

export async function listWaterMeasurementsForReview() {
  const db = await requireDb();
  return db.select().from(waterMeasurements).orderBy(desc(waterMeasurements.createdAt), desc(waterMeasurements.id));
}

export async function createWaterMeasurementDraft(input: {
  regionCode: string;
  sourceName: string;
  sourceType: string;
  ph: number;
  salinityPpm: number;
  flowRate: string;
  operationalStatus: string;
  sampledAt: Date;
  submittedByOpenId: string;
}) {
  const db = await requireDb();
  await db.insert(waterMeasurements).values({
    ...input,
    ph: input.ph.toFixed(1),
    approvalStatus: "draft",
  });
  return listWaterMeasurementsForReview();
}

export async function approveWaterMeasurement(input: { id: number; approvalNote: string; approvedByOpenId: string }) {
  const db = await requireDb();
  const rows = await db.select({ id: waterMeasurements.id }).from(waterMeasurements).where(eq(waterMeasurements.id, input.id)).limit(1);
  if (!rows[0]) throw new Error("قراءة المياه المطلوب اعتمادها غير موجودة.");

  await db
    .update(waterMeasurements)
    .set({
      approvalStatus: "approved",
      approvedByOpenId: input.approvedByOpenId,
      approvalNote: input.approvalNote,
      approvedAt: new Date(),
    })
    .where(eq(waterMeasurements.id, input.id));

  return listWaterMeasurementsForReview();
}
