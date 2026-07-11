import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const servicesTable = pgTable("services", {
  id: serial("id").primaryKey(),
  iconName: text("icon_name").notNull().default("Star"),
  titleEn: text("title_en").notNull(),
  titlePl: text("title_pl").notNull().default(""),
  titleRu: text("title_ru").notNull().default(""),
  descriptionEn: text("description_en").notNull(),
  descriptionPl: text("description_pl").notNull().default(""),
  descriptionRu: text("description_ru").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertServiceSchema = createInsertSchema(servicesTable).omit({ id: true, createdAt: true });
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof servicesTable.$inferSelect;
