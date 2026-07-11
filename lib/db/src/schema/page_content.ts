import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pageContentTable = pgTable("page_content", {
  id: serial("id").primaryKey(),
  page: text("page").notNull(),
  sectionKey: text("section_key").notNull(),
  valueEn: text("value_en").notNull().default(""),
  valuePl: text("value_pl").notNull().default(""),
  valueRu: text("value_ru").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertPageContentSchema = createInsertSchema(pageContentTable).omit({ id: true, updatedAt: true });
export type InsertPageContent = z.infer<typeof insertPageContentSchema>;
export type PageContent = typeof pageContentTable.$inferSelect;
