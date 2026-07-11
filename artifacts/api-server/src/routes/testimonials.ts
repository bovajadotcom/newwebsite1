import { Router, type IRouter } from "express";
import { db, testimonialsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/testimonials", async (_req, res): Promise<void> => {
  const items = await db.select().from(testimonialsTable)
    .where(eq(testimonialsTable.isActive, true))
    .orderBy(desc(testimonialsTable.createdAt));
  res.json(items);
});

router.get("/testimonials/all", requireAuth, async (_req, res): Promise<void> => {
  const items = await db.select().from(testimonialsTable).orderBy(desc(testimonialsTable.createdAt));
  res.json(items);
});

router.post("/testimonials", requireAuth, async (req, res): Promise<void> => {
  const [v] = await db.insert(testimonialsTable).values(req.body).returning();
  res.status(201).json(v);
});

router.put("/testimonials/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [v] = await db.update(testimonialsTable).set(req.body).where(eq(testimonialsTable.id, id)).returning();
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.json(v);
});

router.delete("/testimonials/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [v] = await db.delete(testimonialsTable).where(eq(testimonialsTable.id, id)).returning();
  if (!v) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
