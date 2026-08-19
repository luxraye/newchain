/**
 * ensureDemoData
 *
 * Idempotently inserts the three canonical demo donors and their associated
 * blood units so that testers can use D-2026-0891 / 0892 / 0893 on a fresh
 * database without running the manual seed script.
 *
 * Uses ON CONFLICT DO NOTHING everywhere so this is safe to call on every
 * server startup without overwriting data that may have been updated live.
 */
import { db, donorsTable, bloodUnitsTable } from "./index";

export async function ensureDemoData(): Promise<void> {
  // ── Demo donors ────────────────────────────────────────────────────────────
  await db
    .insert(donorsTable)
    .values([
      {
        donorId: "D-2026-0891",
        name: "Kabo Sithole",
        phone: "+267741234567",
        bloodType: "O+",
        district: "Gaborone",
        email: null,
        idNumber: null,
        totalDonations: 3,
        airtimeEarned: 45,
        status: "active",
        registeredAt: "2026-01-15",
        nextEligibleDate: "2026-09-15",
      },
      {
        donorId: "D-2026-0892",
        name: "Naledi Mosweu",
        phone: "+267762345678",
        bloodType: "A-",
        district: "Gaborone",
        email: null,
        idNumber: null,
        totalDonations: 1,
        airtimeEarned: 15,
        status: "active",
        registeredAt: "2026-02-20",
        nextEligibleDate: "2026-10-02",
      },
      {
        donorId: "D-2026-0893",
        name: "Tebogo Gabaitse",
        phone: "+267773456789",
        bloodType: "B+",
        district: "Francistown",
        email: null,
        idNumber: null,
        totalDonations: 5,
        airtimeEarned: 75,
        status: "active",
        registeredAt: "2025-08-10",
        nextEligibleDate: "2026-08-20",
      },
    ])
    .onConflictDoNothing();

  // ── Blood units linked to demo donors ────────────────────────────────────
  await db
    .insert(bloodUnitsTable)
    .values([
      {
        unitId: "BW-2026-008821",
        donorId: "D-2026-0891",
        facilityId: "FAC-001",
        bloodType: "O+",
        status: "available",
        collectedAt: new Date("2026-08-10T09:14:00.000Z"),
        expiresAt: new Date("2026-09-14T09:14:00.000Z"),
        temperature: 4.1,
        chainHash: "0xa1b2c3d4e5f6789012345678901234567890abcd",
      },
      {
        unitId: "BW-2026-008500",
        donorId: "D-2026-0891",
        facilityId: "FAC-001",
        bloodType: "O+",
        status: "transfused",
        collectedAt: new Date("2026-05-12T08:00:00.000Z"),
        expiresAt: new Date("2026-06-16T08:00:00.000Z"),
        temperature: 4.0,
        chainHash: "0xf1e2d3c4b5a6978801234567890abcdef0123456",
      },
      {
        unitId: "BW-2026-008200",
        donorId: "D-2026-0891",
        facilityId: "FAC-006",
        bloodType: "O+",
        status: "transfused",
        collectedAt: new Date("2026-02-20T07:30:00.000Z"),
        expiresAt: new Date("2026-03-27T07:30:00.000Z"),
        temperature: 3.8,
        chainHash: "0xabcdef01234567890abcdef01234567890abcdef",
      },
      {
        unitId: "BW-2026-008777",
        donorId: "D-2026-0892",
        facilityId: "FAC-001",
        bloodType: "A-",
        status: "available",
        collectedAt: new Date("2026-08-09T08:45:00.000Z"),
        expiresAt: new Date("2026-09-13T08:45:00.000Z"),
        temperature: 4.3,
        chainHash: "0xb2c3d4e5f67890123456789012345678901bcdef",
      },
      {
        unitId: "BW-2026-008650",
        donorId: "D-2026-0893",
        facilityId: "FAC-003",
        bloodType: "B+",
        status: "transfused",
        collectedAt: new Date("2026-08-05T07:30:00.000Z"),
        expiresAt: new Date("2026-09-09T07:30:00.000Z"),
        temperature: 4.0,
        chainHash: "0xc3d4e5f678901234567890123456789012cdef01",
      },
      {
        unitId: "BW-2026-008100",
        donorId: "D-2026-0893",
        facilityId: "FAC-003",
        bloodType: "B+",
        status: "transfused",
        collectedAt: new Date("2026-05-01T11:00:00.000Z"),
        expiresAt: new Date("2026-06-05T11:00:00.000Z"),
        temperature: 4.2,
        chainHash: "0xd4e5f6789012345678abcdef901234567890def0",
      },
      {
        unitId: "BW-2026-007800",
        donorId: "D-2026-0893",
        facilityId: "FAC-006",
        bloodType: "B+",
        status: "transfused",
        collectedAt: new Date("2026-01-10T09:00:00.000Z"),
        expiresAt: new Date("2026-02-14T09:00:00.000Z"),
        temperature: 4.1,
        chainHash: "0xe5f6789012345678901234567890abcdef012345",
      },
      {
        unitId: "BW-2026-007400",
        donorId: "D-2026-0893",
        facilityId: "FAC-001",
        bloodType: "B+",
        status: "expired",
        collectedAt: new Date("2025-10-05T07:00:00.000Z"),
        expiresAt: new Date("2025-11-09T07:00:00.000Z"),
        temperature: null,
        chainHash: "0xf678901234567890abcdef01234567890abcde01",
      },
      {
        unitId: "BW-2026-006900",
        donorId: "D-2026-0893",
        facilityId: "FAC-007",
        bloodType: "B+",
        status: "transfused",
        collectedAt: new Date("2025-08-12T08:30:00.000Z"),
        expiresAt: new Date("2025-09-16T08:30:00.000Z"),
        temperature: 3.9,
        chainHash: "0xa9b8c7d6e5f4321098765432109876543210fedc",
      },
    ])
    .onConflictDoNothing();
}
