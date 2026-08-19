import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const donorsTable = pgTable("donors", {
  donorId: text("donor_id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  bloodType: text("blood_type").notNull(),
  district: text("district").notNull(),
  email: text("email"),
  idNumber: text("id_number"),
  totalDonations: integer("total_donations").notNull().default(0),
  airtimeEarned: integer("airtime_earned").notNull().default(0),
  status: text("status").notNull().default("active"),
  registeredAt: text("registered_at").notNull(),
  nextEligibleDate: text("next_eligible_date"),
});

export const insertDonorSchema = createInsertSchema(donorsTable).omit({ totalDonations: true, airtimeEarned: true });
export type InsertDonor = z.infer<typeof insertDonorSchema>;
export type Donor = typeof donorsTable.$inferSelect;
