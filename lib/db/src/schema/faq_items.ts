import { pgTable, text, serial, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const faqItemsTable = pgTable("faq_items", {
  id: serial("id").primaryKey(),
  questionEn: text("question_en").notNull().default(""),
  questionPl: text("question_pl").notNull().default(""),
  questionRu: text("question_ru").notNull().default(""),
  questionLt: text("question_lt").notNull().default(""),
  answerEn: text("answer_en").notNull().default(""),
  answerPl: text("answer_pl").notNull().default(""),
  answerRu: text("answer_ru").notNull().default(""),
  answerLt: text("answer_lt").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertFaqItemSchema = createInsertSchema(faqItemsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertFaqItem = z.infer<typeof insertFaqItemSchema>;
export type FaqItem = typeof faqItemsTable.$inferSelect;
