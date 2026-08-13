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
