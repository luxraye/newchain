import { Router, type IRouter } from "express";
import { eq, and, SQL, sql } from "drizzle-orm";
import { db, donorsTable } from "@workspace/db";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// GET /donors
router.get("/donors", async (req, res): Promise<void> => {
  const { district, bloodType, phone, idNumber, donorId } = req.query as Record<string, string | undefined>;

  const conditions: SQL[] = [];
  if (district) conditions.push(eq(donorsTable.district, district));
  if (bloodType) conditions.push(eq(donorsTable.bloodType, bloodType));
  if (phone) conditions.push(eq(donorsTable.phone, phone));
  if (idNumber) conditions.push(eq(donorsTable.idNumber, idNumber));
  if (donorId) conditions.push(eq(donorsTable.donorId, donorId));

  const donors =
    conditions.length > 0
      ? await db.select().from(donorsTable).where(and(...conditions))
      : await db.select().from(donorsTable);

  res.json({ count: donors.length, donors });
});

// POST /donors
router.post("/donors", async (req, res): Promise<void> => {
  const { name, phone, bloodType, district, email, idNumber } = req.body as Record<string, string | undefined>;
  if (!name || !phone || !bloodType || !district) {
    res.status(400).json({ error: "Missing required fields: name, phone, bloodType, district" });
    return;
  }

  // Use a database sequence — nextval() is atomic so concurrent inserts never collide
  const seqResult = await db.execute(sql`SELECT nextval('donors_id_seq') AS val`);
  const nextNum = Number(seqResult.rows[0].val);
  const donorId = `D-2026-${String(nextNum).padStart(4, "0")}`;

  const newDonor = {
    donorId,
    name,
    phone,
    bloodType,
    district,
    email: email ?? null,
    idNumber: idNumber ?? null,
    totalDonations: 0,
    airtimeEarned: 0,
    status: "active",
    registeredAt: new Date().toISOString().split("T")[0],
    nextEligibleDate: null,
  };

  await db.insert(donorsTable).values(newDonor);
  req.log.info({ donorId }, "New donor registered");
  res.status(201).json(newDonor);
});

// GET /donors/:donorId
router.get("/donors/:donorId", async (req, res): Promise<void> => {
  const donorId = Array.isArray(req.params.donorId)
    ? req.params.donorId[0]
    : req.params.donorId;

  const rows = await db.select().from(donorsTable).where(eq(donorsTable.donorId, donorId));
  if (rows.length === 0) {
    res.status(404).json({ error: "Donor not found" });
    return;
  }
  res.json(rows[0]);
});

logger.info("Donors router loaded");
export default router;
