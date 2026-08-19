import { pgTable, text, real, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bloodUnitsTable = pgTable(
  "blood_units",
  {
    unitId: text("unit_id").primaryKey(),
    donorId: text("donor_id").notNull(),
    facilityId: text("facility_id").notNull(),
    bloodType: text("blood_type").notNull(),
    status: text("status").notNull().default("available"),
    collectedAt: timestamp("collected_at", { withTimezone: true }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    temperature: real("temperature"),
    chainHash: text("chain_hash").notNull(),
  },
  (t) => [index("blood_units_donor_id_idx").on(t.donorId)],
);

export const insertBloodUnitSchema = createInsertSchema(bloodUnitsTable).omit({ status: true });
export type InsertBloodUnit = z.infer<typeof insertBloodUnitSchema>;
export type BloodUnit = typeof bloodUnitsTable.$inferSelect;
