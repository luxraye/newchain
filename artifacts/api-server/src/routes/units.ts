import { Router, type IRouter } from "express";
import { eq, and, SQL, sql } from "drizzle-orm";
import { db, bloodUnitsTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// GET /units
router.get("/units", async (req, res): Promise<void> => {
  const { donorId, facilityId, bloodType, status } = req.query as Record<string, string | undefined>;

  const conditions: SQL[] = [];
  if (donorId) conditions.push(eq(bloodUnitsTable.donorId, donorId));
  if (facilityId) conditions.push(eq(bloodUnitsTable.facilityId, facilityId));
  if (bloodType) conditions.push(eq(bloodUnitsTable.bloodType, bloodType));
  if (status) conditions.push(eq(bloodUnitsTable.status, status));

  const units =
    conditions.length > 0
      ? await db.select().from(bloodUnitsTable).where(and(...conditions))
      : await db.select().from(bloodUnitsTable);

  // Serialize timestamps to ISO strings for API compatibility
  const serialized = units.map(serializeUnit);
  res.json({ count: serialized.length, units: serialized });
});

// POST /units
router.post("/units", async (req, res): Promise<void> => {
  const { donorId, facilityId, bloodType, collectedAt, temperature } = req.body as Record<
    string,
    string | number | undefined
  >;
  if (!donorId || !facilityId || !bloodType) {
    res.status(400).json({ error: "Missing required fields: donorId, facilityId, bloodType" });
    return;
  }

  const collectedDate = collectedAt ? new Date(collectedAt as string) : new Date();
  const expiryDate = new Date(collectedDate);
  expiryDate.setDate(expiryDate.getDate() + 35); // 35-day shelf life

  const chainHash = "0x" + Math.random().toString(16).slice(2).padStart(40, "0");

  // Use a database sequence — nextval() is atomic so concurrent inserts never collide
  const seqResult = await db.execute(sql`SELECT nextval('blood_units_id_seq') AS val`);
  const nextNum = Number(seqResult.rows[0].val);
  const unitId = `BW-2026-${String(nextNum).padStart(6, "0")}`;

  const newUnit = {
    unitId,
    donorId: donorId as string,
    facilityId: facilityId as string,
    bloodType: bloodType as string,
    status: "available",
    collectedAt: collectedDate,
    expiresAt: expiryDate,
    temperature: temperature != null ? Number(temperature) : null,
    chainHash,
  };

  await db.insert(bloodUnitsTable).values(newUnit);
  req.log.info({ unitId }, "Blood unit logged");
  res.status(201).json(serializeUnit(newUnit));
});

// GET /units/:unitId
router.get("/units/:unitId", async (req, res): Promise<void> => {
  const unitId = Array.isArray(req.params.unitId) ? req.params.unitId[0] : req.params.unitId;

  const rows = await db.select().from(bloodUnitsTable).where(eq(bloodUnitsTable.unitId, unitId));
  if (rows.length === 0) {
    res.status(404).json({ error: "Unit not found" });
    return;
  }
  res.json(serializeUnit(rows[0]));
});

function serializeUnit(u: {
  unitId: string;
  donorId: string;
  facilityId: string;
  bloodType: string;
  status: string;
  collectedAt: Date;
  expiresAt: Date;
  temperature: number | null;
  chainHash: string;
}) {
  return {
    ...u,
    collectedAt: u.collectedAt instanceof Date ? u.collectedAt.toISOString() : u.collectedAt,
    expiresAt: u.expiresAt instanceof Date ? u.expiresAt.toISOString() : u.expiresAt,
  };
}

logger.info("Units router loaded");
export default router;
