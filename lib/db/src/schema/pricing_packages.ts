import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pricingPackagesTable = pgTable("pricing_packages", {
  id: serial("id").primaryKey(),
  nameEn: text("name_en").notNull(),
  namePl: text("name_pl").notNull().default(""),
  nameRu: text("name_ru").notNull().default(""),
  price: integer("price").notNull(),
  currency: text("currency").notNull().default("EUR"),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  isPopular: boolean("is_popular").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertPricingPackageSchema = createInsertSchema(pricingPackagesTable).omit({ id: true });
export type InsertPricingPackage = z.infer<typeof insertPricingPackageSchema>;
export type PricingPackage = typeof pricingPackagesTable.$inferSelect;
