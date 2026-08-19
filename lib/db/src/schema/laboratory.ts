import {
  index,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { bloodUnitsTable } from "./blood_units";

export type LabScreeningRecord = {
  aboGroup: "O" | "A" | "B" | "AB";
  rhFactor: "positive" | "negative";
  hiv: "negative" | "positive" | "pending";
  hepatitisB: "negative" | "positive" | "pending";
  hepatitisC: "negative" | "positive" | "pending";
  malaria: "negative" | "positive" | "pending";
  syphilis: "negative" | "positive" | "pending";
  operatorName: string;
  notes: string | null;
  screenedAt: string;
};

export const labProcessingTable = pgTable(
  "lab_processing",
  {
    unitId: text("unit_id")
      .primaryKey()
      .references(() => bloodUnitsTable.unitId, { onDelete: "cascade" }),
    facilityId: text("facility_id").notNull(),
    stage: text("stage").notNull().default("awaiting_tests"),
    riskStatus: text("risk_status").notNull().default("pending"),
    screening: jsonb("screening").$type<LabScreeningRecord | null>(),
    eventSequence: integer("event_sequence").notNull().default(0),
    chainHead: text("chain_head"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("lab_processing_facility_idx").on(table.facilityId),
    index("lab_processing_stage_idx").on(table.stage),
  ],
);

export const labComponentsTable = pgTable(
  "lab_components",
  {
    componentId: text("component_id").primaryKey(),
    unitId: text("unit_id")
      .notNull()
      .references(() => bloodUnitsTable.unitId, { onDelete: "cascade" }),
    type: text("type").notNull(),
    volumeMl: real("volume_ml").notNull(),
    status: text("status").notNull().default("quarantine"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("lab_components_unit_idx").on(table.unitId)],
);

export const labEventsTable = pgTable(
  "lab_events",
  {
    eventId: text("event_id").primaryKey(),
    unitId: text("unit_id")
      .notNull()
      .references(() => bloodUnitsTable.unitId, { onDelete: "cascade" }),
    facilityId: text("facility_id").notNull(),
    action: text("action").notNull(),
    actor: text("actor").notNull(),
    reason: text("reason"),
    sequence: integer("sequence").notNull().default(1),
    timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
    chainHash: text("chain_hash").notNull(),
  },
  (table) => [
    index("lab_events_unit_idx").on(table.unitId),
    index("lab_events_unit_sequence_idx").on(table.unitId, table.sequence),
    index("lab_events_facility_idx").on(table.facilityId),
    index("lab_events_timestamp_idx").on(table.timestamp),
  ],
);

export const insertLabProcessingSchema = createInsertSchema(labProcessingTable);
export const insertLabComponentSchema = createInsertSchema(labComponentsTable);
export const insertLabEventSchema = createInsertSchema(labEventsTable);

export type InsertLabProcessing = z.infer<typeof insertLabProcessingSchema>;
export type InsertLabComponent = z.infer<typeof insertLabComponentSchema>;
export type InsertLabEvent = z.infer<typeof insertLabEventSchema>;
export type LabProcessing = typeof labProcessingTable.$inferSelect;
export type LabComponent = typeof labComponentsTable.$inferSelect;
export type LabEvent = typeof labEventsTable.$inferSelect;