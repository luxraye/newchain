import { Router, type IRouter } from "express";
import { db, facilitiesTable } from "@workspace/db";

const router: IRouter = Router();

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"] as const;

// POST /route — find best source for a blood request
router.post("/route", async (req, res): Promise<void> => {
  const { bloodType, units: requested, requestingFacilityId, urgency } = req.body as {
    bloodType?: string;
    units?: number;
    requestingFacilityId?: string;
    urgency?: string;
  };

  if (!bloodType || !requestingFacilityId) {
    res.status(400).json({ error: "Missing required fields: bloodType, requestingFacilityId" });
    return;
  }

  const facilities = await db.select().from(facilitiesTable);
  const requestingFac = facilities.find((f) => f.facilityId === requestingFacilityId);
  if (!requestingFac) {
    res.status(404).json({ error: "Requesting facility not found" });
    return;
  }

  const requestedUnits = requested ?? 1;

  const candidates = facilities
    .filter((f) => f.facilityId !== requestingFacilityId && f.status !== "offline")
    .map((f) => {
      const inventory = f.inventory as Record<string, number>;
      const thresholds = f.thresholds as Record<string, number>;
      const available = inventory[bloodType] ?? 0;
      if (available < requestedUnits) return null;

      const distanceKm = haversineKm(requestingFac.lat, requestingFac.lng, f.lat, f.lng);
      const surplus = Math.max(0, available - (thresholds[bloodType] ?? 0));
      const eta = etaMinutes(distanceKm);

      const normalizedDistance = Math.max(0, 1 - distanceKm / 600);
      const normalizedSurplus = Math.min(1, surplus / 20);
      const score = 0.4 * normalizedSurplus + 0.4 * normalizedDistance + 0.2 * (available > 0 ? 1 : 0);

      return {
        facilityId: f.facilityId,
        name: f.name,
        district: f.district,
        availableUnits: available,
        distanceKm: Math.round(distanceKm * 10) / 10,
        etaMinutes: eta,
        score: Math.round(score * 100) / 100,
      };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  res.json({
    bloodType,
    requested: requestedUnits,
    urgency: urgency ?? "routine",
    candidates,
    alternatives: suggestAlternatives(bloodType),
    generatedAt: new Date().toISOString(),
  });
});

// GET /route/national-shortage — system-wide shortage types
router.get("/route/national-shortage", async (_req, res): Promise<void> => {
  const facilities = await db.select().from(facilitiesTable);

  const shortage = BLOOD_TYPES.map((bt) => {
    const totalStock = facilities.reduce((s, f) => s + ((f.inventory as Record<string, number>)[bt] ?? 0), 0);
    const totalThreshold = facilities.reduce((s, f) => s + ((f.thresholds as Record<string, number>)[bt] ?? 0), 0);
    const criticalFacilities = facilities.filter(
      (f) => ((f.inventory as Record<string, number>)[bt] ?? 0) < ((f.thresholds as Record<string, number>)[bt] ?? 0),
    ).length;
    return { bloodType: bt, totalStock, totalThreshold, criticalFacilities, shortage: totalStock < totalThreshold };
  }).filter((r) => r.shortage);

  res.json({ shortages: shortage, generatedAt: new Date().toISOString() });
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function etaMinutes(km: number): number {
  const speed = km < 20 ? 30 : 80;
  return Math.ceil((km / speed) * 60);
}

function suggestAlternatives(bloodType: string): string[] {
  const compatibility: Record<string, string[]> = {
    "O+": ["O-"],
    "O-": [],
    "A+": ["A-", "O+", "O-"],
    "A-": ["O-"],
    "B+": ["B-", "O+", "O-"],
    "B-": ["O-"],
    "AB+": ["A+", "A-", "B+", "B-", "O+", "O-", "AB-"],
    "AB-": ["A-", "B-", "O-"],
  };
  return compatibility[bloodType] ?? [];
}

export default router;
