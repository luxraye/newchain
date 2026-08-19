import { Router, type IRouter } from "express";
import healthRouter from "./health";
import donorsRouter from "./donors";
import facilitiesRouter from "./facilities";
import unitsRouter from "./units";
import routingRouter from "./routing";
import statsRouter from "./stats";
import laboratoryRouter from "./laboratory";

const router: IRouter = Router();

router.use(healthRouter);
router.use(donorsRouter);
router.use(facilitiesRouter);
router.use(unitsRouter);
router.use(routingRouter);
router.use(statsRouter);
router.use(laboratoryRouter);

export default router;
