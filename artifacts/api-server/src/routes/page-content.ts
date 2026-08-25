import { Router, type IRouter } from "express";
import { db, pageContentTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth.js";

const router: IRouter = Router();

router.get("/page-content", async (_req, res): Promise<void> => {
  const items = await db.select().from(pageContentTable);
  res.json(items);
});

router.get("/page-content/:page", async (req, res): Promise<void> => {
  const page = Array.isArray(req.params.page) ? req.params.page[0] : req.params.page;
  const items = await db.select().from(pageContentTable).where(eq(pageContentTable.page, page));
  res.json(items);
});

router.put("/page-content/:page/:key", requireAuth, async (req, res): Promise<void> => {
  const page = Array.isArray(req.params.page) ? req.params.page[0] : req.params.page;
  const key = Array.isArray(req.params.key) ? req.params.key[0] : req.params.key;
  const { valueEn, valuePl, valueRu } = req.body;
  const existing = await db.select().from(pageContentTable)
    .where(and(eq(pageContentTable.page, page), eq(pageContentTable.sectionKey, key)));
  if (existing.length > 0) {
    const [item] = await db.update(pageContentTable)
      .set({ valueEn: valueEn ?? "", valuePl: valuePl ?? "", valueRu: valueRu ?? "" })
      .where(and(eq(pageContentTable.page, page), eq(pageContentTable.sectionKey, key)))
      .returning();
    res.json(item);
  } else {
    const [item] = await db.insert(pageContentTable)
      .values({ page, sectionKey: key, valueEn: valueEn ?? "", valuePl: valuePl ?? "", valueRu: valueRu ?? "" })
      .returning();
    res.status(201).json(item);
  }
});

export default router;
