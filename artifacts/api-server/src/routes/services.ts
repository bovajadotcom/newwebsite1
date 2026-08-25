import { Router } from "express";
import { asc, db, eq, servicesTable } from "@workspace/db";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/services", async (_req: ApiRequest, res: ApiResponse): Promise<void> => {
  const items = await db.select().from(servicesTable).orderBy(asc(servicesTable.sortOrder));
  res.json(items);
});

router.post("/services", requireAuth, async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  const [v] = await db.insert(servicesTable).values(req.body as typeof servicesTable.$inferInsert).returning();
  res.status(201).json(v);
});

router.put("/services/:id", requireAuth, async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { id: _id, createdAt: _c, updatedAt: _u, ...data } = req.body;
  const [v] = await db.update(servicesTable).set(data).where(eq(servicesTable.id, id)).returning();
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.json(v);
});

router.delete("/services/:id", requireAuth, async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [v] = await db.delete(servicesTable).where(eq(servicesTable.id, id)).returning();
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
