import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import vehiclesRouter from "./vehicles";
import soldVehiclesRouter from "./sold-vehicles";
import popularVehiclesRouter from "./popular-vehicles";
import servicesRouter from "./services";
import pricingRouter from "./pricing";
import testimonialsRouter from "./testimonials";
import pageContentRouter from "./page-content";
import siteSettingsRouter from "./site-settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(vehiclesRouter);
router.use(soldVehiclesRouter);
router.use(popularVehiclesRouter);
router.use(servicesRouter);
router.use(pricingRouter);
router.use(testimonialsRouter);
router.use(pageContentRouter);
router.use(siteSettingsRouter);

export default router;
