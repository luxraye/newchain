import { createHash, randomUUID } from "node:crypto";
import { and, asc, desc, eq, gte, lte } from "drizzle-orm";
import {
  bloodUnitsTable,
  db,
  labComponentsTable,
  labEventsTable,
  labProcessingTable,
  type LabScreeningRecord,
} from "@workspace/db";

type WorklistFilters = {
  facilityId?: string;
  bloodType?: string;
  stage?: string;
  riskStatus?: string;
  search?: string;
};

type ScreeningInput = Omit<LabScreeningRecord, "screenedAt" | "notes"> & {
  notes?: string;
};

type ComponentInput = {
  type: "red_cells" | "plasma" | "platelets";
  volumeMl: number;
};

const pendingStages = new Set(["awaiting_tests", "processing", "quarantine"]);
const testKeys = ["hiv", "hepatitisB", "hepatitisC", "malaria", "syphilis"] as const;

function iso(value: Date): string {
  return value.toISOString();
}

function serializeEvent(event: typeof labEventsTable.$inferSelect) {
  return {
    eventId: event.eventId,
    unitId: event.unitId,
    facilityId: event.facilityId,
    action: event.action,
    actor: event.actor,
    reason: event.reason,
    timestamp: iso(event.timestamp),
    chainHash: event.chainHash,
  };
}

function serializeComponent(component: typeof labComponentsTable.$inferSelect) {
  return {
    componentId: component.componentId,
    type: component.type as "red_cells" | "plasma" | "platelets",
    volumeMl: component.volumeMl,
    status: component.status as "quarantine" | "released" | "discarded",
    expiresAt: iso(component.expiresAt),
    createdAt: iso(component.createdAt),
  };
}

export function deriveRiskStatus(
  screening: ScreeningInput,
  recordedBloodType: string,
): "clear" | "review" | "reactive" | "pending" {
  if (testKeys.some((key) => screening[key] === "positive")) return "reactive";
  if (testKeys.some((key) => screening[key] === "pending")) return "pending";

  const typedBlood = `${screening.aboGroup}${screening.rhFactor === "positive" ? "+" : "-"}`;
  return typedBlood === recordedBloodType ? "clear" : "review";
}

export async function listLabWorklist(filters: WorklistFilters = {}) {
  const rows = await db
    .select({
      unit: bloodUnitsTable,
      processing: labProcessingTable,
    })
    .from(bloodUnitsTable)
    .leftJoin(labProcessingTable, eq(bloodUnitsTable.unitId, labProcessingTable.unitId))
    .orderBy(desc(bloodUnitsTable.collectedAt));

  const components = await db.select().from(labComponentsTable);
  const componentCounts = new Map<string, number>();
  for (const component of components) {
    componentCounts.set(component.unitId, (componentCounts.get(component.unitId) ?? 0) + 1);
  }

  const normalizedSearch = filters.search?.trim().toLowerCase();

  const items = rows
    .filter(({ unit, processing }) => {
      const stage = processing?.stage ?? "awaiting_tests";
      const riskStatus = processing?.riskStatus ?? "pending";
      const isLabRelevant =
        processing != null || unit.status === "available" || unit.status === "reserved";

      if (!isLabRelevant) return false;
      if (filters.facilityId && unit.facilityId !== filters.facilityId) return false;
      if (filters.bloodType && unit.bloodType !== filters.bloodType) return false;
      if (filters.stage && stage !== filters.stage) return false;
      if (filters.riskStatus && riskStatus !== filters.riskStatus) return false;
      if (
        normalizedSearch &&
        !unit.unitId.toLowerCase().includes(normalizedSearch) &&
        !unit.donorId.toLowerCase().includes(normalizedSearch)
      ) {
        return false;
      }
      return true;
    })
    .map(({ unit, processing }) => {
      const screening = processing?.screening;
      const screeningComplete =
        screening != null && testKeys.every((key) => screening[key] !== "pending");
      return {
        unitId: unit.unitId,
        donorId: unit.donorId,
        facilityId: unit.facilityId,
        bloodType: unit.bloodType,
        stage: (processing?.stage ?? "awaiting_tests") as
          | "awaiting_tests"
          | "processing"
          | "quarantine"
          | "released"
          | "discarded",
        riskStatus: (processing?.riskStatus ?? "pending") as
          | "clear"
          | "review"
          | "reactive"
          | "pending",
        screeningComplete,
        componentsCount: componentCounts.get(unit.unitId) ?? 0,
        collectedAt: iso(unit.collectedAt),
        expiresAt: iso(unit.expiresAt),
        lastUpdatedAt: iso(processing?.updatedAt ?? unit.collectedAt),
        chainHash: unit.chainHash,
      };
    });

  return { count: items.length, items };
}

export async function getLabUnitRecord(unitId: string) {
  const [row] = await db
    .select({
      unit: bloodUnitsTable,
      processing: labProcessingTable,
    })
    .from(bloodUnitsTable)
    .leftJoin(labProcessingTable, eq(bloodUnitsTable.unitId, labProcessingTable.unitId))
    .where(eq(bloodUnitsTable.unitId, unitId))
    .limit(1);

  if (!row) return null;

  const [components, events] = await Promise.all([
    db
      .select()
      .from(labComponentsTable)
      .where(eq(labComponentsTable.unitId, unitId))
      .orderBy(asc(labComponentsTable.createdAt)),
    db
      .select()
      .from(labEventsTable)
      .where(eq(labEventsTable.unitId, unitId))
      .orderBy(desc(labEventsTable.sequence)),
  ]);

  if (
    row.processing == null &&
    (row.unit.status !== "available" || row.unit.expiresAt <= new Date())
  ) {
    return null;
  }

  return {
    unitId: row.unit.unitId,
    donorId: row.unit.donorId,
    facilityId: row.unit.facilityId,
    bloodType: row.unit.bloodType,
    stage: (row.processing?.stage ?? "awaiting_tests") as
      | "awaiting_tests"
      | "processing"
      | "quarantine"
      | "released"
      | "discarded",
    riskStatus: (row.processing?.riskStatus ?? "pending") as
      | "clear"
      | "review"
      | "reactive"
      | "pending",
    collectedAt: iso(row.unit.collectedAt),
    expiresAt: iso(row.unit.expiresAt),
    temperature: row.unit.temperature,
    chainHash: row.unit.chainHash,
    screening: row.processing?.screening
      ? {
          ...row.processing.screening,
          notes: row.processing.screening.notes ?? null,
        }
      : null,
    components: components.map(serializeComponent),
    events: events.map(serializeEvent),
    createdAt: iso(row.processing?.createdAt ?? row.unit.collectedAt),
    updatedAt: iso(row.processing?.updatedAt ?? row.unit.collectedAt),
  };
}

export async function upsertLabProcessing(input: {
  unitId: string;
  facilityId: string;
  stage: string;
  riskStatus: string;
  screening?: LabScreeningRecord | null;
}) {
  const now = new Date();
  await db
    .insert(labProcessingTable)
    .values({
      unitId: input.unitId,
      facilityId: input.facilityId,
      stage: input.stage,
      riskStatus: input.riskStatus,
      screening: input.screening,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: labProcessingTable.unitId,
      set: {
        facilityId: input.facilityId,
        stage: input.stage,
        riskStatus: input.riskStatus,
        ...(input.screening !== undefined ? { screening: input.screening } : {}),
        updatedAt: now,
      },
    });
}

export async function appendLabEvent(input: {
  unitId: string;
  facilityId: string;
  action: string;
  actor: string;
  reason?: string | null;
  baseHash: string;
}) {
  const [previous] = await db
    .select()
    .from(labEventsTable)
    .where(eq(labEventsTable.unitId, input.unitId))
    .orderBy(desc(labEventsTable.timestamp))
    .limit(1);

  const timestamp = new Date();
  const previousHash = previous?.chainHash ?? input.baseHash;
  const chainHash =
    "0x" +
    createHash("sha256")
      .update(
        [
          previousHash,
          input.unitId,
          input.facilityId,
          input.action,
          input.actor,
          input.reason ?? "",
          timestamp.toISOString(),
        ].join("|"),
      )
      .digest("hex");

  const [event] = await db
    .insert(labEventsTable)
    .values({
      eventId: `LAB-${randomUUID()}`,
      unitId: input.unitId,
      facilityId: input.facilityId,
      action: input.action,
      actor: input.actor,
      reason: input.reason ?? null,
      timestamp,
      chainHash,
    })
    .returning();

  return serializeEvent(event);
}

export async function createLabComponents(
  unitId: string,
  components: ComponentInput[],
) {
  const now = new Date();
  const typeSuffix = {
    red_cells: "RBC",
    plasma: "PLS",
    platelets: "PLT",
  } as const;
  const shelfLifeDays = {
    red_cells: 42,
    plasma: 365,
    platelets: 5,
  } as const;
  const seen = new Map<string, number>();

  const values = components.map((component) => {
    const occurrence = (seen.get(component.type) ?? 0) + 1;
    seen.set(component.type, occurrence);
    const expiresAt = new Date(now);
    expiresAt.setUTCDate(expiresAt.getUTCDate() + shelfLifeDays[component.type]);
    const duplicateSuffix = occurrence > 1 ? `-${String(occurrence).padStart(2, "0")}` : "";
    return {
      componentId: `${unitId}-${typeSuffix[component.type]}${duplicateSuffix}`,
      unitId,
      type: component.type,
      volumeMl: component.volumeMl,
      status: "quarantine",
      expiresAt,
      createdAt: now,
    };
  });

  await db.insert(labComponentsTable).values(values);
  return values;
}

export async function getLabEvents(filters: {
  facilityId?: string;
  unitId?: string;
  limit?: number;
}) {
  const conditions = [];
  if (filters.facilityId) conditions.push(eq(labEventsTable.facilityId, filters.facilityId));
  if (filters.unitId) conditions.push(eq(labEventsTable.unitId, filters.unitId));

  const limit = Math.min(Math.max(Math.floor(filters.limit ?? 30), 1), 100);
  const baseQuery = db.select().from(labEventsTable);
  const events =
    conditions.length > 0
      ? await baseQuery
          .where(and(...conditions))
          .orderBy(desc(labEventsTable.timestamp))
          .limit(limit)
      : await baseQuery.orderBy(desc(labEventsTable.timestamp)).limit(limit);

  return { count: events.length, events: events.map(serializeEvent) };
}

export async function getLabDashboard(facilityId?: string) {
  const [{ items }, allComponents, recent] = await Promise.all([
    listLabWorklist({ facilityId }),
    db.select().from(labComponentsTable),
    getLabEvents({ facilityId, limit: 8 }),
  ]);

  const unitIds = new Set(items.map((item) => item.unitId));
  const components = allComponents.filter((component) => unitIds.has(component.unitId));
  const stageCounts: Record<string, number> = {
    awaiting_tests: 0,
    processing: 0,
    quarantine: 0,
    released: 0,
    discarded: 0,
  };
  for (const item of items) {
    stageCounts[item.stage] = (stageCounts[item.stage] ?? 0) + 1;
  }

  const now = new Date();
  const soon = new Date(now);
  soon.setUTCDate(soon.getUTCDate() + 3);

  return {
    awaitingTests: stageCounts.awaiting_tests ?? 0,
    quarantinedUnits: stageCounts.quarantine ?? 0,
    releasedProducts: components.filter((component) => component.status === "released").length,
    expiringSoon: components.filter(
      (component) =>
        component.status !== "discarded" &&
        component.expiresAt >= now &&
        component.expiresAt <= soon,
    ).length,
    totalInProcess: items.filter((item) => pendingStages.has(item.stage)).length,
    stageCounts,
    recentEvents: recent.events,
    generatedAt: new Date().toISOString(),
  };
}

export async function getExistingComponents(unitId: string) {
  return db
    .select()
    .from(labComponentsTable)
    .where(eq(labComponentsTable.unitId, unitId));
}

export async function updateLabStage(
  unitId: string,
  stage: "processing" | "quarantine" | "released" | "discarded",
) {
  const componentStatus =
    stage === "released"
      ? "released"
      : stage === "discarded"
        ? "discarded"
        : stage === "quarantine"
          ? "quarantine"
          : undefined;

  if (componentStatus) {
    await db
      .update(labComponentsTable)
      .set({ status: componentStatus })
      .where(eq(labComponentsTable.unitId, unitId));
  }

  const bloodUnitStatus =
    stage === "released" ? "available" : stage === "discarded" ? "discarded" : "reserved";
  await db
    .update(bloodUnitsTable)
    .set({ status: bloodUnitStatus })
    .where(eq(bloodUnitsTable.unitId, unitId));
}

export async function countExpiringComponents(from: Date, to: Date) {
  return db
    .select()
    .from(labComponentsTable)
    .where(and(gte(labComponentsTable.expiresAt, from), lte(labComponentsTable.expiresAt, to)));
}