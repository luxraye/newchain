/**
 * ensureFacilities
 *
 * Idempotently inserts the full set of Botswana facilities so a fresh
 * production database has the blood bank network pre-seeded.
 * Uses ON CONFLICT DO NOTHING so it is safe to call on every startup.
 */
import { db, facilitiesTable } from "./index";

export async function ensureFacilities(): Promise<void> {
  await db
    .insert(facilitiesTable)
    .values([
      {
        facilityId: "FAC-001",
        name: "Princess Marina Hospital",
        district: "Gaborone",
        type: "public",
        status: "online",
        lat: -24.6518,
        lng: 25.9084,
        inventory: { "O+": 18, "O-": 4, "A+": 12, "A-": 3, "B+": 9, "B-": 2, "AB+": 5, "AB-": 1 },
        thresholds: { "O+": 10, "O-": 8, "A+": 8, "A-": 5, "B+": 6, "B-": 4, "AB+": 4, "AB-": 3 },
      },
      {
        facilityId: "FAC-002",
        name: "Bokamoso Private Hospital",
        district: "Gaborone",
        type: "private",
        status: "online",
        lat: -24.654,
        lng: 25.912,
        inventory: { "O+": 22, "O-": 6, "A+": 14, "A-": 4, "B+": 11, "B-": 3, "AB+": 6, "AB-": 2 },
        thresholds: { "O+": 10, "O-": 6, "A+": 8, "A-": 4, "B+": 6, "B-": 3, "AB+": 4, "AB-": 2 },
      },
      {
        facilityId: "FAC-003",
        name: "Nyangabgwe Referral Hospital",
        district: "Francistown",
        type: "public",
        status: "online",
        lat: -21.1611,
        lng: 27.504,
        inventory: { "O+": 15, "O-": 2, "A+": 8, "A-": 1, "B+": 7, "B-": 0, "AB+": 3, "AB-": 0 },
        thresholds: { "O+": 10, "O-": 8, "A+": 8, "A-": 5, "B+": 6, "B-": 4, "AB+": 4, "AB-": 3 },
      },
      {
        facilityId: "FAC-004",
        name: "Scottish Livingstone Hospital",
        district: "Molepolole",
        type: "mission",
        status: "online",
        lat: -24.4067,
        lng: 25.4952,
        inventory: { "O+": 10, "O-": 3, "A+": 6, "A-": 2, "B+": 4, "B-": 1, "AB+": 2, "AB-": 1 },
        thresholds: { "O+": 8, "O-": 5, "A+": 6, "A-": 3, "B+": 5, "B-": 3, "AB+": 3, "AB-": 2 },
      },
      {
        facilityId: "FAC-005",
        name: "Maun General Hospital",
        district: "Maun",
        type: "public",
        status: "warning",
        lat: -19.9833,
        lng: 23.4167,
        inventory: { "O+": 6, "O-": 1, "A+": 4, "A-": 0, "B+": 2, "B-": 0, "AB+": 1, "AB-": 0 },
        thresholds: { "O+": 8, "O-": 5, "A+": 6, "A-": 3, "B+": 5, "B-": 3, "AB+": 3, "AB-": 2 },
      },
      {
        facilityId: "FAC-006",
        name: "NBTS Central Depository",
        district: "Gaborone",
        type: "nbts",
        status: "online",
        lat: -24.656,
        lng: 25.906,
        inventory: { "O+": 180, "O-": 32, "A+": 140, "A-": 28, "B+": 110, "B-": 18, "AB+": 55, "AB-": 12 },
        thresholds: { "O+": 50, "O-": 20, "A+": 40, "A-": 15, "B+": 30, "B-": 10, "AB+": 15, "AB-": 8 },
      },
      {
        facilityId: "FAC-007",
        name: "Sekgoma Memorial Hospital",
        district: "Serowe",
        type: "public",
        status: "online",
        lat: -22.393,
        lng: 26.71,
        inventory: { "O+": 9, "O-": 2, "A+": 5, "A-": 1, "B+": 3, "B-": 0, "AB+": 2, "AB-": 0 },
        thresholds: { "O+": 8, "O-": 5, "A+": 6, "A-": 3, "B+": 5, "B-": 3, "AB+": 3, "AB-": 2 },
      },
    ])
    .onConflictDoNothing();
}
