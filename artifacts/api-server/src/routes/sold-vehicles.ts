import { Router } from "express";
import { db, desc, eq, soldVehiclesTable } from "@workspace/db";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/sold-vehicles", async (_req: ApiRequest, res: ApiResponse): Promise<void> => {
  res.set("Cache-Control", "no-store");
  const items = await db.select().from(soldVehiclesTable).orderBy(desc(soldVehiclesTable.createdAt));
  res.json(items);
});

router.get("/sold-vehicles/:id", async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  res.set("Cache-Control", "no-store");
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [v] = await db.select().from(soldVehiclesTable).where(eq(soldVehiclesTable.id, id));
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.json(v);
});

router.post("/sold-vehicles", requireAuth, async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  const [v] = await db.insert(soldVehiclesTable).values(req.body as typeof soldVehiclesTable.$inferInsert).returning();
  res.status(201).json(v);
});

router.put("/sold-vehicles/:id", requireAuth, async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { id: _id, createdAt: _c, updatedAt: _u, ...data } = req.body;
  const [v] = await db.update(soldVehiclesTable).set(data).where(eq(soldVehiclesTable.id, id)).returning();
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.json(v);
});

router.delete("/sold-vehicles/:id", requireAuth, async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [v] = await db.delete(soldVehiclesTable).where(eq(soldVehiclesTable.id, id)).returning();
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
