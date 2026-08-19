/**
 * Deterministic Crucible demo records for a processing, quarantined, and
 * released unit. All inserts are idempotent so startup never overwrites live
 * laboratory work.
 */
import {
  bloodUnitsTable,
  db,
  labComponentsTable,
  labEventsTable,
  labProcessingTable,
} from "./index";
import { eq, inArray } from "drizzle-orm";

export async function ensureLabDemoData(): Promise<void> {
  await db
    .insert(labProcessingTable)
    .values([
      {
        unitId: "BW-2026-008821",
        facilityId: "FAC-001",
        stage: "processing",
        riskStatus: "clear",
        eventSequence: 1,
        chainHead: "0x6f316ef976ad902b5e12e75997f8f11209cc9d08b24eb20867fe7e262a1a7543",
        screening: {
          aboGroup: "O",
          rhFactor: "positive",
          hiv: "negative",
          hepatitisB: "negative",
          hepatitisC: "negative",
          malaria: "negative",
          syphilis: "negative",
          operatorName: "Dr. Neo Kgosietsile",
          notes: "Dual-run screen verified against control panel.",
          screenedAt: "2026-08-18T08:24:00.000Z",
        },
        createdAt: new Date("2026-08-18T07:50:00.000Z"),
        updatedAt: new Date("2026-08-18T08:24:00.000Z"),
      },
      {
        unitId: "BW-2026-008777",
        facilityId: "FAC-001",
        stage: "quarantine",
        riskStatus: "reactive",
        eventSequence: 2,
        chainHead: "0xc29a193cd7af4aa05bc05eb7f35620af95dca451005104301d7cb8978986ca17",
        screening: {
          aboGroup: "A",
          rhFactor: "negative",
          hiv: "negative",
          hepatitisB: "positive",
          hepatitisC: "negative",
          malaria: "negative",
          syphilis: "negative",
          operatorName: "Dr. Neo Kgosietsile",
          notes: "Reactive Hepatitis B result. Confirmatory assay requested.",
          screenedAt: "2026-08-18T09:41:00.000Z",
        },
        createdAt: new Date("2026-08-18T09:10:00.000Z"),
        updatedAt: new Date("2026-08-18T09:42:00.000Z"),
      },
      {
        unitId: "BW-2026-008650",
        facilityId: "FAC-003",
        stage: "released",
        riskStatus: "clear",
        eventSequence: 2,
        chainHead: "0x43a76382c0f522b73bb380d8e6986f05b15f16eae0522b573cb8dc64f03c4331",
        screening: {
          aboGroup: "B",
          rhFactor: "positive",
          hiv: "negative",
          hepatitisB: "negative",
          hepatitisC: "negative",
          malaria: "negative",
          syphilis: "negative",
          operatorName: "Kabelo Mothusi",
          notes: null,
          screenedAt: "2026-08-17T10:18:00.000Z",
        },
        createdAt: new Date("2026-08-17T09:30:00.000Z"),
        updatedAt: new Date("2026-08-17T12:04:00.000Z"),
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(labComponentsTable)
    .values([
      {
        componentId: "BW-2026-008650-RBC",
        unitId: "BW-2026-008650",
        type: "red_cells",
        volumeMl: 280,
        status: "released",
        expiresAt: new Date("2026-09-20T12:00:00.000Z"),
        createdAt: new Date("2026-08-17T11:12:00.000Z"),
      },
      {
        componentId: "BW-2026-008650-PLS",
        unitId: "BW-2026-008650",
        type: "plasma",
        volumeMl: 220,
        status: "released",
        expiresAt: new Date("2027-08-17T11:12:00.000Z"),
        createdAt: new Date("2026-08-17T11:12:00.000Z"),
      },
      {
        componentId: "BW-2026-008650-PLT",
        unitId: "BW-2026-008650",
        type: "platelets",
        volumeMl: 55,
        status: "released",
        expiresAt: new Date("2026-08-22T11:12:00.000Z"),
        createdAt: new Date("2026-08-17T11:12:00.000Z"),
      },
    ])
    .onConflictDoNothing();

  await db
    .insert(labEventsTable)
    .values([
      {
        eventId: "LAB-EVT-008821-01",
        unitId: "BW-2026-008821",
        facilityId: "FAC-001",
        action: "SCREENING_RECORDED",
        actor: "Dr. Neo Kgosietsile",
        reason: "All infectious disease markers non-reactive.",
        sequence: 1,
        timestamp: new Date("2026-08-18T08:24:00.000Z"),
        chainHash: "0x6f316ef976ad902b5e12e75997f8f11209cc9d08b24eb20867fe7e262a1a7543",
      },
      {
        eventId: "LAB-EVT-008777-01",
        unitId: "BW-2026-008777",
        facilityId: "FAC-001",
        action: "SCREENING_REACTIVE",
        actor: "Dr. Neo Kgosietsile",
        reason: "Reactive Hepatitis B result.",
        sequence: 1,
        timestamp: new Date("2026-08-18T09:41:00.000Z"),
        chainHash: "0x1e5e92f0cb8c4d6a64ef31c12d3e61b45928d9130574b5d2653c6aedce4149a1",
      },
      {
        eventId: "LAB-EVT-008777-02",
        unitId: "BW-2026-008777",
        facilityId: "FAC-001",
        action: "UNIT_QUARANTINED",
        actor: "Dr. Neo Kgosietsile",
        reason: "Confirmatory assay required before disposition.",
        sequence: 2,
        timestamp: new Date("2026-08-18T09:42:00.000Z"),
        chainHash: "0xc29a193cd7af4aa05bc05eb7f35620af95dca451005104301d7cb8978986ca17",
      },
      {
        eventId: "LAB-EVT-008650-01",
        unitId: "BW-2026-008650",
        facilityId: "FAC-003",
        action: "COMPONENTS_SEPARATED",
        actor: "Kabelo Mothusi",
        reason: "Red cells, plasma, and platelets prepared.",
        sequence: 1,
        timestamp: new Date("2026-08-17T11:12:00.000Z"),
        chainHash: "0xd5c8c410a8bd58de983a111ff10a316282630aeb336adad575c77e0f878eab24",
      },
      {
        eventId: "LAB-EVT-008650-02",
        unitId: "BW-2026-008650",
        facilityId: "FAC-003",
        action: "UNIT_RELEASED",
        actor: "Kabelo Mothusi",
        reason: "Screening clear and component QC complete.",
        sequence: 2,
        timestamp: new Date("2026-08-17T12:04:00.000Z"),
        chainHash: "0x43a76382c0f522b73bb380d8e6986f05b15f16eae0522b573cb8dc64f03c4331",
      },
    ])
    .onConflictDoNothing();

  const demoUnitIds = ["BW-2026-008821", "BW-2026-008777", "BW-2026-008650"];
  const facilitySources = await db
    .select({
      unitId: bloodUnitsTable.unitId,
      facilityId: bloodUnitsTable.facilityId,
    })
    .from(bloodUnitsTable)
    .where(inArray(bloodUnitsTable.unitId, demoUnitIds));

  for (const unit of facilitySources) {
    await db
      .update(labProcessingTable)
      .set({ facilityId: unit.facilityId })
      .where(eq(labProcessingTable.unitId, unit.unitId));
    await db
      .update(labEventsTable)
      .set({ facilityId: unit.facilityId })
      .where(eq(labEventsTable.unitId, unit.unitId));
  }
}