import { Router, type IRouter } from "express";
import {
  GetLabDashboardQueryParams,
  GetLabDashboardResponse,
  GetLabEventsQueryParams,
  GetLabEventsResponse,
  GetLabUnitDetailParams,
  GetLabUnitDetailResponse,
  GetLabWorklistQueryParams,
  GetLabWorklistResponse,
  SeparateLabComponentsBody,
  SeparateLabComponentsParams,
  SeparateLabComponentsResponse,
  SubmitLabScreeningBody,
  SubmitLabScreeningParams,
  SubmitLabScreeningResponse,
  TransitionLabUnitBody,
  TransitionLabUnitParams,
  TransitionLabUnitResponse,
} from "@workspace/api-zod";
import {
  getLabDashboard,
  getLabEvents,
  getLabUnitRecord,
  listLabWorklist,
} from "../lib/lab-service";
import {
  LabRuleError,
  recordLabScreening,
  separateLabComponents,
  transitionLabUnit,
} from "../lib/lab-mutations";

const router: IRouter = Router();

router.get("/lab/worklist", async (req, res): Promise<void> => {
  const parsed = GetLabWorklistQueryParams.safeParse(req.query);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid laboratory worklist query");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const result = await listLabWorklist(parsed.data);
  res.json(GetLabWorklistResponse.parse(result));
});

router.get("/lab/units/:unitId", async (req, res): Promise<void> => {
  const parsed = GetLabUnitDetailParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const unit = await getLabUnitRecord(parsed.data.unitId);
  if (!unit) {
    res.status(404).json({ error: "Laboratory unit not found" });
    return;
  }

  res.json(GetLabUnitDetailResponse.parse(unit));
});

router.post("/lab/units/:unitId/screening", async (req, res): Promise<void> => {
  const params = SubmitLabScreeningParams.safeParse(req.params);
  const body = SubmitLabScreeningBody.safeParse(req.body);
  if (!params.success || !body.success) {
    const error = !params.success
      ? params.error.message
      : !body.success
        ? body.error.message
        : "Invalid laboratory screening submission";
    req.log.warn({ errors: error }, "Invalid laboratory screening submission");
    res.status(400).json({ error });
    return;
  }

  try {
    await recordLabScreening({ unitId: params.data.unitId, ...body.data });
  } catch (error) {
    if (error instanceof LabRuleError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    throw error;
  }

  const updated = await getLabUnitRecord(params.data.unitId);
  res.json(SubmitLabScreeningResponse.parse(updated));
});

router.post("/lab/units/:unitId/components", async (req, res): Promise<void> => {
  const params = SeparateLabComponentsParams.safeParse(req.params);
  const body = SeparateLabComponentsBody.safeParse(req.body);
  if (!params.success || !body.success) {
    const error = !params.success
      ? params.error.message
      : !body.success
        ? body.error.message
        : "Invalid component separation submission";
    req.log.warn({ errors: error }, "Invalid component separation submission");
    res.status(400).json({ error });
    return;
  }

  try {
    await separateLabComponents({ unitId: params.data.unitId, ...body.data });
  } catch (error) {
    if (error instanceof LabRuleError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    throw error;
  }

  const updated = await getLabUnitRecord(params.data.unitId);
  res.json(SeparateLabComponentsResponse.parse(updated));
});

router.post("/lab/units/:unitId/transition", async (req, res): Promise<void> => {
  const params = TransitionLabUnitParams.safeParse(req.params);
  const body = TransitionLabUnitBody.safeParse(req.body);
  if (!params.success || !body.success) {
    const error = !params.success
      ? params.error.message
      : !body.success
        ? body.error.message
        : "Invalid laboratory state transition";
    req.log.warn({ errors: error }, "Invalid laboratory state transition");
    res.status(400).json({ error });
    return;
  }

  try {
    await transitionLabUnit({ unitId: params.data.unitId, ...body.data });
  } catch (error) {
    if (error instanceof LabRuleError) {
      res.status(error.status).json({ error: error.message });
      return;
    }
    throw error;
  }

  const updated = await getLabUnitRecord(params.data.unitId);
  res.json(TransitionLabUnitResponse.parse(updated));
});

router.get("/lab/dashboard", async (req, res): Promise<void> => {
  const parsed = GetLabDashboardQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const dashboard = await getLabDashboard(parsed.data.facilityId);
  res.json(GetLabDashboardResponse.parse(dashboard));
});

router.get("/lab/events", async (req, res): Promise<void> => {
  const parsed = GetLabEventsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const events = await getLabEvents(parsed.data);
  res.json(GetLabEventsResponse.parse(events));
});

export default router;