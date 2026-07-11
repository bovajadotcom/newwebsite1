import { Router, type IRouter } from "express";
import { db, vehiclesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/vehicles", async (_req, res): Promise<void> => {
  const vehicles = await db.select().from(vehiclesTable).orderBy(asc(vehiclesTable.sortOrder), asc(vehiclesTable.id));
  res.json(vehicles);
});

router.get("/vehicles/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [v] = await db.select().from(vehiclesTable).where(eq(vehiclesTable.id, id));
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.json(v);
});

router.post("/vehicles", requireAuth, async (req, res): Promise<void> => {
  const [v] = await db.insert(vehiclesTable).values(req.body).returning();
  res.status(201).json(v);
});

router.put("/vehicles/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [v] = await db.update(vehiclesTable).set(req.body).where(eq(vehiclesTable.id, id)).returning();
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.json(v);
});

router.delete("/vehicles/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [v] = await db.delete(vehiclesTable).where(eq(vehiclesTable.id, id)).returning();
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
