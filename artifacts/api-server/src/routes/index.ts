import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import vehiclesRouter from "./vehicles.js";
import soldVehiclesRouter from "./sold-vehicles.js";
import popularVehiclesRouter from "./popular-vehicles.js";
import servicesRouter from "./services.js";
import pricingRouter from "./pricing.js";
import testimonialsRouter from "./testimonials.js";
import faqRouter from "./faq.js";
import pageContentRouter from "./page-content.js";
import siteSettingsRouter from "./site-settings.js";
import leadsRouter from "./leads.js";
import contactRouter from "./contact.js";
import articlesRouter from "./articles.js";
import careersRouter from "./careers.js";
import seedRouter from "./seed.js";

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
