import { Router } from "express";
import { db, faqItemsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/faq", async (req, res) => {
  try {
    res.setHeader("Cache-Control", "no-store");
    const items = await db
      .select()
      .from(faqItemsTable)
      .where(eq(faqItemsTable.isActive, true))
      .orderBy(asc(faqItemsTable.sortOrder));
    res.json(items);
  } catch (err) {
    req.log.error(err, "GET /faq failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/faq/all", requireAuth, async (req, res) => {
  try {
    const items = await db
      .select()
      .from(faqItemsTable)
      .orderBy(asc(faqItemsTable.sortOrder));
    res.json(items);
  } catch (err) {
    req.log.error(err, "GET /faq/all failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/faq", requireAuth, async (req, res) => {
  try {
    const [item] = await db.insert(faqItemsTable).values(req.body).returning();
    res.status(201).json(item);
  } catch (err) {
    req.log.error(err, "POST /faq failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/faq/:id", requireAuth, async (req, res): Promise<void> => {
  try {
    const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(raw, 10);
    const { id: _id, createdAt: _c, updatedAt: _u, ...data } = req.body;
    const [item] = await db
      .update(faqItemsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(faqItemsTable.id, id))
      .returning();
    if (!item) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(item);
  } catch (err) {
    req.log.error(err, "PUT /faq/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/faq/:id", requireAuth, async (req, res): Promise<void> => {
  try {
    const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await db.delete(faqItemsTable).where(eq(faqItemsTable.id, parseInt(raw, 10)));
    res.status(204).send();
  } catch (err) {
    req.log.error(err, "DELETE /faq/:id failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
