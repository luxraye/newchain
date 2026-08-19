import { createHash, randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import {
  bloodUnitsTable,
  db,
  labComponentsTable,
  labEventsTable,
  labProcessingTable,
  type LabScreeningRecord,
} from "@workspace/db";
import { deriveRiskStatus } from "./lab-service";

type LabTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

type ScreeningCommand = {
  unitId: string;
  aboGroup: "O" | "A" | "B" | "AB";
  rhFactor: "positive" | "negative";
  hiv: "negative" | "positive" | "pending";
  hepatitisB: "negative" | "positive" | "pending";
  hepatitisC: "negative" | "positive" | "pending";
  malaria: "negative" | "positive" | "pending";
  syphilis: "negative" | "positive" | "pending";
  operatorName: string;
  notes?: string;
};

type SeparationCommand = {
  unitId: string;
  operatorName: string;
  notes?: string;
  components: Array<{
    type: "red_cells" | "plasma" | "platelets";
    volumeMl: number;
  }>;
};

type TransitionCommand = {
  unitId: string;
  stage: "processing" | "quarantine" | "released" | "discarded";
  operatorName: string;
  reason?: string;
};

export class LabRuleError extends Error {
  constructor(
    message: string,
    public readonly status: 400 | 404 = 400,
  ) {
    super(message);
    this.name = "LabRuleError";
  }
}

async function lockUnit(tx: LabTransaction, unitId: string) {
  await tx.execute(
    sql`select unit_id from blood_units where unit_id = ${unitId} for update`,
  );

  const [row] = await tx
    .select({
      unit: bloodUnitsTable,
      processing: labProcessingTable,
    })
    .from(bloodUnitsTable)
    .leftJoin(labProcessingTable, eq(bloodUnitsTable.unitId, labProcessingTable.unitId))
    .where(eq(bloodUnitsTable.unitId, unitId))
    .limit(1);

  if (!row) {
    throw new LabRuleError("Laboratory unit not found", 404);
  }
  const currentStage = row.processing?.stage;
  const hasActiveLabRecord =
    row.processing != null && currentStage !== "released" && currentStage !== "discarded";
  const eligibleBaseStatus =
    row.unit.status === "available" || (hasActiveLabRecord && row.unit.status === "reserved");
  if (
    !eligibleBaseStatus &&
    currentStage !== "released" &&
    currentStage !== "discarded"
  ) {
    throw new LabRuleError(
      `A unit with status ${row.unit.status} is not eligible for laboratory processing.`,
    );
  }
  if (row.unit.expiresAt <= new Date()) {
    throw new LabRuleError("An expired blood unit cannot be processed or released.");
  }
  return row;
}

async function upsertProcessing(
  tx: LabTransaction,
  input: {
    unitId: string;
    facilityId: string;
    stage: string;
    riskStatus: string;
    screening?: LabScreeningRecord;
  },
) {
  const now = new Date();
  await tx
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
        ...(input.screening ? { screening: input.screening } : {}),
        updatedAt: now,
      },
    });
}

async function appendEvent(
  tx: LabTransaction,
  input: {
    unitId: string;
    facilityId: string;
    action: string;
    actor: string;
    reason: string;
    baseHash: string;
  },
) {
  const [head] = await tx
    .select({
      eventSequence: labProcessingTable.eventSequence,
      chainHead: labProcessingTable.chainHead,
    })
    .from(labProcessingTable)
    .where(eq(labProcessingTable.unitId, input.unitId))
    .limit(1);

  const timestamp = new Date();
  const sequence = (head?.eventSequence ?? 0) + 1;
  const previousHash = head?.chainHead ?? input.baseHash;
  const chainHash =
    "0x" +
    createHash("sha256")
      .update(
        [
          previousHash,
          String(sequence),
          input.unitId,
          input.facilityId,
          input.action,
          input.actor,
          input.reason,
          timestamp.toISOString(),
        ].join("|"),
      )
      .digest("hex");

  await tx.insert(labEventsTable).values({
    eventId: `LAB-${randomUUID()}`,
    unitId: input.unitId,
    facilityId: input.facilityId,
    action: input.action,
    actor: input.actor,
    reason: input.reason,
    sequence,
    timestamp,
    chainHash,
  });
  await tx
    .update(labProcessingTable)
    .set({
      eventSequence: sequence,
      chainHead: chainHash,
      updatedAt: timestamp,
    })
    .where(eq(labProcessingTable.unitId, input.unitId));
}

export async function recordLabScreening(command: ScreeningCommand): Promise<void> {
  await db.transaction(async (tx) => {
    const { unit, processing } = await lockUnit(tx, command.unitId);
    const currentStage = processing?.stage ?? "awaiting_tests";
    if (currentStage === "released" || currentStage === "discarded") {
      throw new LabRuleError(`A ${currentStage} unit cannot be screened again.`);
    }

    const existingComponents = await tx
      .select({ componentId: labComponentsTable.componentId })
      .from(labComponentsTable)
      .where(eq(labComponentsTable.unitId, unit.unitId))
      .limit(1);
    const riskStatus = deriveRiskStatus(command, unit.bloodType);
    const stage =
      riskStatus === "reactive" || riskStatus === "review" || existingComponents.length > 0
        ? "quarantine"
        : "processing";
    const screening: LabScreeningRecord = {
      aboGroup: command.aboGroup,
      rhFactor: command.rhFactor,
      hiv: command.hiv,
      hepatitisB: command.hepatitisB,
      hepatitisC: command.hepatitisC,
      malaria: command.malaria,
      syphilis: command.syphilis,
      operatorName: command.operatorName,
      notes: command.notes?.trim() || null,
      screenedAt: new Date().toISOString(),
    };

    await upsertProcessing(tx, {
      unitId: unit.unitId,
      facilityId: unit.facilityId,
      stage,
      riskStatus,
      screening,
    });
    await tx
      .update(bloodUnitsTable)
      .set({ status: "reserved" })
      .where(eq(bloodUnitsTable.unitId, unit.unitId));

    const reason =
      riskStatus === "reactive"
        ? "One or more infectious disease markers are reactive."
        : riskStatus === "review"
          ? "Recorded ABO/Rh result does not match the collection record."
          : riskStatus === "pending"
            ? "Screening contains pending results."
            : "All infectious disease markers are non-reactive.";
    await appendEvent(tx, {
      unitId: unit.unitId,
      facilityId: unit.facilityId,
      action: riskStatus === "reactive" ? "SCREENING_REACTIVE" : "SCREENING_RECORDED",
      actor: command.operatorName,
      reason,
      baseHash: unit.chainHash,
    });
  });
}

export async function separateLabComponents(command: SeparationCommand): Promise<void> {
  await db.transaction(async (tx) => {
    const { unit, processing } = await lockUnit(tx, command.unitId);
    const currentStage = processing?.stage ?? "awaiting_tests";
    if (currentStage !== "processing") {
      throw new LabRuleError("Components can only be separated while a unit is processing.");
    }
    if (!processing?.screening || processing.riskStatus !== "clear") {
      throw new LabRuleError(
        "Component separation requires a completed, clear screening record.",
      );
    }

    const existing = await tx
      .select({ componentId: labComponentsTable.componentId })
      .from(labComponentsTable)
      .where(eq(labComponentsTable.unitId, unit.unitId))
      .limit(1);
    if (existing.length > 0) {
      throw new LabRuleError("Components have already been recorded for this unit.");
    }

    const uniqueTypes = new Set(command.components.map((component) => component.type));
    const totalVolume = command.components.reduce(
      (sum, component) => sum + component.volumeMl,
      0,
    );
    if (uniqueTypes.size !== command.components.length) {
      throw new LabRuleError("Each component type can only be recorded once.");
    }
    if (totalVolume > 1_000) {
      throw new LabRuleError("Combined component volume cannot exceed 1000 mL.");
    }

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
    const values = command.components.map((component) => {
      const expiresAt = new Date(now);
      expiresAt.setUTCDate(expiresAt.getUTCDate() + shelfLifeDays[component.type]);
      return {
        componentId: `${unit.unitId}-${typeSuffix[component.type]}`,
        unitId: unit.unitId,
        type: component.type,
        volumeMl: component.volumeMl,
        status: "quarantine",
        expiresAt,
        createdAt: now,
      };
    });

    await tx.insert(labComponentsTable).values(values);
    await upsertProcessing(tx, {
      unitId: unit.unitId,
      facilityId: unit.facilityId,
      stage: "quarantine",
      riskStatus: processing.riskStatus,
    });
    await tx
      .update(bloodUnitsTable)
      .set({ status: "reserved" })
      .where(eq(bloodUnitsTable.unitId, unit.unitId));
    await appendEvent(tx, {
      unitId: unit.unitId,
      facilityId: unit.facilityId,
      action: "COMPONENTS_SEPARATED",
      actor: command.operatorName,
      reason:
        command.notes?.trim() ||
        `${values.length} blood component products prepared and quarantined.`,
      baseHash: unit.chainHash,
    });
  });
}

export async function transitionLabUnit(command: TransitionCommand): Promise<void> {
  await db.transaction(async (tx) => {
    const { unit, processing } = await lockUnit(tx, command.unitId);
    const currentStage = processing?.stage ?? "awaiting_tests";
    const reason = command.reason?.trim();

    if (currentStage === "released" || currentStage === "discarded") {
      throw new LabRuleError(`${currentStage} is a terminal laboratory state.`);
    }
    if (currentStage === command.stage) {
      throw new LabRuleError(`Unit is already in ${command.stage}.`);
    }
    if ((command.stage === "quarantine" || command.stage === "discarded") && !reason) {
      throw new LabRuleError("A reason is required for quarantine or discard.");
    }
    if (command.stage === "processing" && currentStage !== "awaiting_tests") {
      throw new LabRuleError("Only an awaiting unit can be moved into processing.");
    }

    const components = await tx
      .select()
      .from(labComponentsTable)
      .where(eq(labComponentsTable.unitId, unit.unitId));
    if (command.stage === "released") {
      if (currentStage !== "quarantine") {
        throw new LabRuleError("Only a quarantined unit can be released.");
      }
      if (!processing?.screening || processing.riskStatus !== "clear") {
        throw new LabRuleError("Only fully screened, clear units can be released.");
      }
      if (components.length === 0) {
        throw new LabRuleError("Record component separation before release.");
      }
      if (components.some((component) => component.expiresAt <= new Date())) {
        throw new LabRuleError("Expired component products cannot be released.");
      }
    }

    const riskStatus = processing?.riskStatus ?? "pending";
    await upsertProcessing(tx, {
      unitId: unit.unitId,
      facilityId: unit.facilityId,
      stage: command.stage,
      riskStatus,
    });

    const componentStatus =
      command.stage === "released"
        ? "released"
        : command.stage === "discarded"
          ? "discarded"
          : command.stage === "quarantine"
            ? "quarantine"
            : undefined;
    if (componentStatus) {
      await tx
        .update(labComponentsTable)
        .set({ status: componentStatus })
        .where(eq(labComponentsTable.unitId, unit.unitId));
    }

    const bloodUnitStatus =
      command.stage === "released"
        ? "available"
        : command.stage === "discarded"
          ? "discarded"
          : "reserved";
    await tx
      .update(bloodUnitsTable)
      .set({ status: bloodUnitStatus })
      .where(eq(bloodUnitsTable.unitId, unit.unitId));
    await appendEvent(tx, {
      unitId: unit.unitId,
      facilityId: unit.facilityId,
      action: `UNIT_${command.stage.toUpperCase()}`,
      actor: command.operatorName,
      reason: reason || `Unit moved to ${command.stage}.`,
      baseHash: unit.chainHash,
    });
  });
}