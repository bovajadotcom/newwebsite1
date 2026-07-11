import { Router, type IRouter } from "express";
import { db, popularVehiclesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/popular-vehicles", async (_req, res): Promise<void> => {
  const items = await db.select().from(popularVehiclesTable).orderBy(asc(popularVehiclesTable.sortOrder));
  res.json(items);
});

router.post("/popular-vehicles", requireAuth, async (req, res): Promise<void> => {
  const [v] = await db.insert(popularVehiclesTable).values(req.body).returning();
  res.status(201).json(v);
});

router.put("/popular-vehicles/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [v] = await db.update(popularVehiclesTable).set(req.body).where(eq(popularVehiclesTable.id, id)).returning();
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.json(v);
});

router.delete("/popular-vehicles/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [v] = await db.delete(popularVehiclesTable).where(eq(popularVehiclesTable.id, id)).returning();
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
