import { Router, type IRouter } from "express";
import { db, siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth.js";

const router: IRouter = Router();

router.get("/site-settings", async (_req, res): Promise<void> => {
  const settings = await db.select().from(siteSettingsTable);
  res.json(settings);
});

router.put("/site-settings/:key", requireAuth, async (req, res): Promise<void> => {
  const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
  const { value } = req.body;
  const existing = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key));
  if (existing.length > 0) {
    const [s] = await db.update(siteSettingsTable).set({ value: value ?? "" }).where(eq(siteSettingsTable.key, key)).returning();
    res.json(s);
  } else {
    const [s] = await db.insert(siteSettingsTable).values({ key, value: value ?? "" }).returning();
    res.status(201).json(s);
  }
});

export default router;
