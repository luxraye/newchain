import { Router, type IRouter } from "express";
import { eq, and, SQL } from "drizzle-orm";
import { db, facilitiesTable, type Facility } from "@workspace/db";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// GET /facilities
router.get("/facilities", async (req, res): Promise<void> => {
  const { district, type } = req.query as Record<string, string | undefined>;

  const conditions: SQL[] = [];
  if (district) conditions.push(eq(facilitiesTable.district, district));
  if (type) conditions.push(eq(facilitiesTable.type, type));

  const facilities =
    conditions.length > 0
      ? await db.select().from(facilitiesTable).where(and(...conditions))
      : await db.select().from(facilitiesTable);

  res.json({ count: facilities.length, facilities });
});

// GET /facilities/:facilityId
router.get("/facilities/:facilityId", async (req, res): Promise<void> => {
  const facilityId = Array.isArray(req.params.facilityId)
    ? req.params.facilityId[0]
    : req.params.facilityId;

  const rows = await db.select().from(facilitiesTable).where(eq(facilitiesTable.facilityId, facilityId));
  if (rows.length === 0) {
    res.status(404).json({ error: "Facility not found" });
    return;
  }
  res.json(rows[0]);
});

// GET /facilities/:facilityId/inventory
router.get("/facilities/:facilityId/inventory", async (req, res): Promise<void> => {
  const facilityId = Array.isArray(req.params.facilityId)
    ? req.params.facilityId[0]
    : req.params.facilityId;

  const rows = await db.select().from(facilitiesTable).where(eq(facilitiesTable.facilityId, facilityId));
  if (rows.length === 0) {
    res.status(404).json({ error: "Facility not found" });
    return;
  }
  const fac = rows[0];
  const inventory = fac.inventory as Record<string, number>;
  const thresholds = fac.thresholds as Record<string, number>;
  const criticals = Object.entries(inventory)
    .filter(([bt, units]) => units < (thresholds[bt] ?? 0))
    .map(([bt, units]) => ({ type: bt, units, threshold: thresholds[bt] }));

  res.json({ facilityId: fac.facilityId, name: fac.name, inventory, criticals });
});

logger.info("Facilities router loaded");
export default router;
