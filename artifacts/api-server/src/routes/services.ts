import { Router, type IRouter } from "express";
import { db, servicesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/services", async (_req, res): Promise<void> => {
  const items = await db.select().from(servicesTable).orderBy(asc(servicesTable.sortOrder));
  res.json(items);
});

router.post("/services", requireAuth, async (req, res): Promise<void> => {
  const [v] = await db.insert(servicesTable).values(req.body).returning();
  res.status(201).json(v);
});

router.put("/services/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [v] = await db.update(servicesTable).set(req.body).where(eq(servicesTable.id, id)).returning();
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.json(v);
});

router.delete("/services/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [v] = await db.delete(servicesTable).where(eq(servicesTable.id, id)).returning();
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
