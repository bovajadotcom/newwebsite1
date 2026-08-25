import { Router } from "express";
import { db, articlesTable, desc, eq, type InsertArticle } from "@workspace/db";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.get("/articles", async (_req: ApiRequest, res: ApiResponse): Promise<void> => {
  res.set("Cache-Control", "no-store");
  const articles = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.status, "published"))
    .orderBy(desc(articlesTable.publishedAt));
  res.json(articles);
});

router.get("/articles/all", requireAuth, async (_req: ApiRequest, res: ApiResponse): Promise<void> => {
  const articles = await db
    .select()
    .from(articlesTable)
    .orderBy(desc(articlesTable.createdAt));
  res.json(articles);
});

router.get("/articles/:slug", async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  res.set("Cache-Control", "no-store");
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const [article] = await db
    .select()
    .from(articlesTable)
    .where(eq(articlesTable.slug, slug));
  if (!article) { res.status(404).json({ error: "Not found" }); return; }
  if (article.status !== "published") { res.status(404).json({ error: "Not found" }); return; }
  res.json(article);
});

function parseDates(body: Record<string, unknown>): Partial<InsertArticle> {
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...editableFields } = body;
  const result = { ...editableFields };
  if (typeof result.publishedAt === "string") {
    result.publishedAt = result.publishedAt ? new Date(result.publishedAt) : null;
  }
  return result as Partial<InsertArticle>;
}

router.post("/articles", requireAuth, async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  const [article] = await db.insert(articlesTable).values(parseDates(req.body) as InsertArticle).returning();
  res.status(201).json(article);
});

router.put("/articles/:id", requireAuth, async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [article] = await db.update(articlesTable).set(parseDates(req.body)).where(eq(articlesTable.id, id)).returning();
  if (!article) { res.status(404).json({ error: "Not found" }); return; }
  res.json(article);
});

router.delete("/articles/:id", requireAuth, async (req: ApiRequest, res: ApiResponse): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const [article] = await db.delete(articlesTable).where(eq(articlesTable.id, id)).returning();
  if (!article) { res.status(404).json({ error: "Not found" }); return; }
  res.sendStatus(204);
});

export default router;
