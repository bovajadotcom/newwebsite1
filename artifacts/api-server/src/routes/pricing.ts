import { Router } from "express";
import { db, pricingPackagesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/pricing", async (_req, res): Promise<void> => {
  const items = await db.select().from(pricingPackagesTable).orderBy(asc(pricingPackagesTable.sortOrder));
  res.json(items);
});

router.post("/pricing", requireAuth, async (req, res): Promise<void> => {
  const [v] = await db.insert(pricingPackagesTable).values(req.body).returning();
  res.status(201).json(v);
});

router.put("/pricing/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { id: _id, createdAt: _c, updatedAt: _u, ...data } = req.body;
  const [v] = await db.update(pricingPackagesTable).set(data).where(eq(pricingPackagesTable.id, id)).returning();
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.json(v);
});

router.delete("/pricing/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [v] = await db.delete(pricingPackagesTable).where(eq(pricingPackagesTable.id, id)).returning();
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
