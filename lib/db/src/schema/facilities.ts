import { pgTable, text, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const facilitiesTable = pgTable("facilities", {
  facilityId: text("facility_id").primaryKey(),
  name: text("name").notNull(),
  district: text("district").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("online"),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  inventory: jsonb("inventory").notNull().$type<Record<string, number>>(),
  thresholds: jsonb("thresholds").notNull().$type<Record<string, number>>(),
});

export const insertFacilitySchema = createInsertSchema(facilitiesTable);
export type InsertFacility = z.infer<typeof insertFacilitySchema>;
export type Facility = typeof facilitiesTable.$inferSelect;
