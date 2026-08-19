import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/health", (_req, res) => {
  res.json({ service: "bloodchain-api", version: "0.1.0", status: "ok", timestamp: new Date().toISOString() });
});

export default router;
