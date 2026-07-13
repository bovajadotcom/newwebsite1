import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const articlesTable = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content").notNull().default(""),
  coverImage: text("cover_image").notNull().default(""),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  // Multilingual fields
  titlePl: text("title_pl").notNull().default(""),
  titleRu: text("title_ru").notNull().default(""),
  titleLt: text("title_lt").notNull().default(""),
  excerptPl: text("excerpt_pl").notNull().default(""),
  excerptRu: text("excerpt_ru").notNull().default(""),
  excerptLt: text("excerpt_lt").notNull().default(""),
  contentPl: text("content_pl").notNull().default(""),
  contentRu: text("content_ru").notNull().default(""),
  contentLt: text("content_lt").notNull().default(""),
});

export const insertArticleSchema = createInsertSchema(articlesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articlesTable.$inferSelect;
