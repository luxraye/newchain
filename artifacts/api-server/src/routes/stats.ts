import { Router, type IRouter } from "express";
import { db, facilitiesTable, donorsTable, bloodUnitsTable } from "@workspace/db";
import { count, gte, desc, eq } from "drizzle-orm";

const router: IRouter = Router();

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"] as const;

function statusToAction(status: string): string {
  switch (status) {
    case "transfused":
      return "Transfused";
    case "transferred":
      return "Transferred Out";
    case "expired":
      return "Expired";
    case "available":
    default:
      return "Unit Logged";
  }
}

// GET /stats/national — aggregate national stats
router.get("/stats/national", async (_req, res): Promise<void> => {
  const [facilities, donorCountResult, todayCountResult] = await Promise.all([
    db.select().from(facilitiesTable),
    db.select({ count: count() }).from(donorsTable),
    db
      .select({ count: count() })
      .from(bloodUnitsTable)
      .where(
        gte(
          bloodUnitsTable.collectedAt,
          new Date(new Date().toISOString().slice(0, 10) + "T00:00:00.000Z"),
        ),
      ),
  ]);

  const inventoryByBloodType: Record<string, number> = {};
  for (const bt of BLOOD_TYPES) {
    inventoryByBloodType[bt] = facilities.reduce(
      (s, f) => s + ((f.inventory as Record<string, number>)[bt] ?? 0),
      0,
    );
  }

  const totalUnitsInStock = Object.values(inventoryByBloodType).reduce((a, b) => a + b, 0);
  const facilitiesOnline = facilities.filter((f) => f.status === "online").length;

  let activeAlerts = 0;
  for (const f of facilities) {
    const inv = f.inventory as Record<string, number>;
    const thr = f.thresholds as Record<string, number>;
    for (const bt of BLOOD_TYPES) {
      if ((inv[bt] ?? 0) < (thr[bt] ?? 0)) activeAlerts++;
    }
  }

  res.json({
    totalUnitsInStock,
    unitsCollectedToday: todayCountResult[0]?.count ?? 0,
    facilitiesOnline,
    activeAlerts,
    totalDonors: donorCountResult[0]?.count ?? 0,
    inventoryByBloodType,
  });
});

// GET /stats/ledger — recent on-chain events
router.get("/stats/ledger", async (_req, res): Promise<void> => {
  const recentUnits = await db
    .select({
      unitId: bloodUnitsTable.unitId,
      facilityId: bloodUnitsTable.facilityId,
      bloodType: bloodUnitsTable.bloodType,
      status: bloodUnitsTable.status,
      collectedAt: bloodUnitsTable.collectedAt,
      chainHash: bloodUnitsTable.chainHash,
      facilityName: facilitiesTable.name,
    })
    .from(bloodUnitsTable)
    .leftJoin(facilitiesTable, eq(bloodUnitsTable.facilityId, facilitiesTable.facilityId))
    .orderBy(desc(bloodUnitsTable.collectedAt))
    .limit(5);

  const recentEvents = recentUnits.map((unit, idx) => ({
    eventId: `EVT-${unit.unitId}`,
    unitId: unit.unitId,
    action: statusToAction(unit.status),
    facilityId: unit.facilityId,
    facilityName: unit.facilityName ?? unit.facilityId,
    bloodType: unit.bloodType,
    timestamp: unit.collectedAt.toISOString(),
    chainHash: unit.chainHash,
  }));

  res.json({
    blockHeight: 4821,
    recentEvents,
  });
});

export default router;
