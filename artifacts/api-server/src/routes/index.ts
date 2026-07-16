import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import vehiclesRouter from "./vehicles";
import soldVehiclesRouter from "./sold-vehicles";
import popularVehiclesRouter from "./popular-vehicles";
import servicesRouter from "./services";
import pricingRouter from "./pricing";
import testimonialsRouter from "./testimonials";
import faqRouter from "./faq";
import pageContentRouter from "./page-content";
import siteSettingsRouter from "./site-settings";
import leadsRouter from "./leads";
import contactRouter from "./contact";
import articlesRouter from "./articles";
import careersRouter from "./careers";
import seedRouter from "./seed";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(vehiclesRouter);
router.use(soldVehiclesRouter);
router.use(popularVehiclesRouter);
router.use(servicesRouter);
router.use(pricingRouter);
router.use(testimonialsRouter);
router.use(faqRouter);
router.use(pageContentRouter);
router.use(siteSettingsRouter);
router.use(leadsRouter);
router.use(contactRouter);
router.use(articlesRouter);
router.use(careersRouter);
router.use(seedRouter);

export default router;
