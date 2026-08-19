import { asc, eq } from "drizzle-orm";
import {
  bloodUnitsTable,
  db,
  labEventsTable,
  labProcessingTable,
} from "./index";

/**
 * One-time compatibility repair for laboratory rows created before explicit
 * event sequences and chain heads existed. Rows maintained by current code are
 * skipped, so this is safe to call on every startup.
 */
export async function ensureLabLedgerHeads(): Promise<void> {
  const processingRows = await db.select().from(labProcessingTable);

  for (const processing of processingRows) {
    if (processing.eventSequence > 0 && processing.chainHead) continue;

    const [unit] = await db
      .select({ chainHash: bloodUnitsTable.chainHash })
      .from(bloodUnitsTable)
      .where(eq(bloodUnitsTable.unitId, processing.unitId))
      .limit(1);
    if (!unit) continue;

    const events = await db
      .select()
      .from(labEventsTable)
      .where(eq(labEventsTable.unitId, processing.unitId))
      .orderBy(asc(labEventsTable.timestamp), asc(labEventsTable.eventId));

    for (const [index, event] of events.entries()) {
      await db
        .update(labEventsTable)
        .set({ sequence: index + 1 })
        .where(eq(labEventsTable.eventId, event.eventId));
    }

    await db
      .update(labProcessingTable)
      .set({
        eventSequence: events.length,
        chainHead: events.at(-1)?.chainHash ?? unit.chainHash,
      })
      .where(eq(labProcessingTable.unitId, processing.unitId));
  }
}