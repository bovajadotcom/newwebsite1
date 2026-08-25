import { Router } from "express";
import { asc, db, eq, popularVehiclesTable } from "@workspace/db";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/popular-vehicles", async (_req: ApiRequest, res: ApiResponse): Promise<void> => {
  res.set("Cache-Control", "no-store");
  const items = await db.select().from(popularVehiclesTable).orderBy(asc(popularVehiclesTable.sortOrder));
  res.json(items);
});

router.post("/popular-vehicles", requireAuth, async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  const [v] = await db.insert(popularVehiclesTable).values(req.body as typeof popularVehiclesTable.$inferInsert).returning();
  res.status(201).json(v);
});

router.put("/popular-vehicles/:id", requireAuth, async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { id: _id, createdAt: _c, updatedAt: _u, ...data } = req.body;
  const [v] = await db.update(popularVehiclesTable).set(data).where(eq(popularVehiclesTable.id, id)).returning();
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.json(v);
});

router.delete("/popular-vehicles/:id", requireAuth, async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [v] = await db.delete(popularVehiclesTable).where(eq(popularVehiclesTable.id, id)).returning();
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
