import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const regions = mysqlTable("regions", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  governorate: varchar("governorate", { length: 128 }).notNull(),
  areaSize: varchar("areaSize", { length: 64 }).notNull(),
  crops: text("crops").notNull(),
  waterSolution: text("waterSolution").notNull(),
  description: text("description").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Region = typeof regions.$inferSelect;

export const waterSolutions = mysqlTable("water_solutions", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 128 }).notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  description: text("description").notNull(),
  impact: text("impact").notNull(),
});

export type WaterSolution = typeof waterSolutions.$inferSelect;

export const seedSources = mysqlTable("seed_sources", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  origin: varchar("origin", { length: 128 }).notNull(),
  description: text("description").notNull(),
  isNonGmo: int("isNonGmo").default(1).notNull(),
});

export type SeedSource = typeof seedSources.$inferSelect;

export const visitorInquiries = mysqlTable("visitor_inquiries", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VisitorInquiry = typeof visitorInquiries.$inferSelect;
export type InsertVisitorInquiry = typeof visitorInquiries.$inferInsert;


export const financialFeasibility = mysqlTable("financial_feasibility", {
  id: int("id").autoincrement().primaryKey(),
  regionCode: varchar("regionCode", { length: 32 }).notNull(),
  regionName: varchar("regionName", { length: 128 }).notNull(),
  capexMillionOMR: varchar("capexMillionOMR", { length: 64 }).notNull(),
  irrPercent: varchar("irrPercent", { length: 32 }).notNull(),
  paybackYears: varchar("paybackYears", { length: 32 }).notNull(),
  annualRevenueOMR: varchar("annualRevenueOMR", { length: 64 }).notNull(),
  riskLevel: varchar("riskLevel", { length: 32 }).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FinancialFeasibility = typeof financialFeasibility.$inferSelect;
export type InsertFinancialFeasibility = typeof financialFeasibility.$inferInsert;

export const emailAlertLogs = mysqlTable("email_alert_logs", {
  id: int("id").autoincrement().primaryKey(),
  recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  status: varchar("status", { length: 32 }).default("sent").notNull(),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
});

export type EmailAlertLog = typeof emailAlertLogs.$inferSelect;


export const investorBookmarks = mysqlTable("investor_bookmarks", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 64 }).notNull(),
  regionCode: varchar("regionCode", { length: 32 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InvestorBookmark = typeof investorBookmarks.$inferSelect;
export type InsertInvestorBookmark = typeof investorBookmarks.$inferInsert;


export const partnershipContracts = mysqlTable("partnership_contracts", {
  id: int("id").autoincrement().primaryKey(),
  userOpenId: varchar("userOpenId", { length: 64 }).notNull(),
  investorName: varchar("investorName", { length: 128 }).notNull(),
  regionCode: varchar("regionCode", { length: 32 }).notNull(),
  investmentAmountOMR: varchar("investmentAmountOMR", { length: 64 }).notNull(),
  sharePercent: varchar("sharePercent", { length: 32 }).notNull(),
  signatureHash: text("signatureHash").notNull(),
  status: varchar("status", { length: 32 }).default("signed").notNull(),
  signedAt: timestamp("signedAt").defaultNow().notNull(),
});

export type PartnershipContract = typeof partnershipContracts.$inferSelect;
export type InsertPartnershipContract = typeof partnershipContracts.$inferInsert;
