import { Router } from "express";
import { asc, db, eq, vehiclesTable, type InsertVehicle } from "@workspace/db";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

function coerceVehicle(body: Record<string, unknown>): Partial<InsertVehicle> {
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...editableFields } = body;
  const result = { ...editableFields };
  if (result.year !== undefined) result.year = parseInt(String(result.year), 10) || 0;
  if (result.mileage !== undefined) result.mileage = Math.round(parseFloat(String(result.mileage))) || 0;
  if (result.price !== undefined) result.price = Math.round(parseFloat(String(result.price))) || 0;
  if (result.sortOrder !== undefined) result.sortOrder = parseInt(String(result.sortOrder), 10) || 0;
  if (result.isPopular !== undefined) result.isPopular = result.isPopular === true || result.isPopular === "true" || result.isPopular === 1;
  if (result.photos !== undefined && typeof result.photos === "string") {
    try { result.photos = JSON.parse(result.photos); } catch { result.photos = []; }
  }
  if (!Array.isArray(result.photos)) result.photos = [];
  // Nullable optional fields
  for (const f of ["descriptionPl", "descriptionRu", "descriptionLt", "deliveredTo"] as const) {
    if (result[f] === "" || result[f] === undefined) result[f] = null;
  }
  return result as Partial<InsertVehicle>;
}

router.get("/vehicles", async (_req: ApiRequest, res: ApiResponse): Promise<void> => {
  res.set("Cache-Control", "no-store");
  const vehicles = await db.select().from(vehiclesTable).orderBy(asc(vehiclesTable.sortOrder), asc(vehiclesTable.id));
  res.json(vehicles);
});

router.get("/vehicles/:id", async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  res.set("Cache-Control", "no-store");
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [v] = await db.select().from(vehiclesTable).where(eq(vehiclesTable.id, id));
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.json(v);
});

router.post("/vehicles", requireAuth, async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  const [v] = await db.insert(vehiclesTable).values(coerceVehicle(req.body) as InsertVehicle).returning();
  res.status(201).json(v);
});

router.put("/vehicles/:id", requireAuth, async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [v] = await db.update(vehiclesTable).set(coerceVehicle(req.body)).where(eq(vehiclesTable.id, id)).returning();
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.json(v);
});

router.delete("/vehicles/:id", requireAuth, async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [v] = await db.delete(vehiclesTable).where(eq(vehiclesTable.id, id)).returning();
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
