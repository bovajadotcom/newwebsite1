import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { leadsTable, insertLeadSchema } from "@workspace/db";
import { desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.post("/leads", async (req, res): Promise<void> => {
  const parsed = insertLeadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
    return;
  }
  const [lead] = await db.insert(leadsTable).values(parsed.data).returning();
  res.status(201).json(lead);
});

router.get("/leads", requireAuth, async (_req, res): Promise<void> => {
  const leads = await db.select().from(leadsTable).orderBy(desc(leadsTable.createdAt));
  res.json(leads);
});

export default router;
