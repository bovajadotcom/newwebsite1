import { pgTable, text, serial, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const popularVehiclesTable = pgTable("popular_vehicles", {
  id: serial("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year"),
  engine: text("engine"),
  fuel: text("fuel"),
  transmission: text("transmission"),
  mileage: integer("mileage"),
  imageUrl: text("image_url").notNull().default(""),
  photos: json("photos").$type<string[]>().notNull().default([]),
  priceRange: text("price_range").notNull(),
  estimatedDelivery: text("estimated_delivery").notNull(),
  description: text("description").notNull(),
  descriptionPl: text("description_pl"),
  descriptionRu: text("description_ru"),
  descriptionLt: text("description_lt"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const insertPopularVehicleSchema = createInsertSchema(popularVehiclesTable).omit({ id: true });
export type InsertPopularVehicle = z.infer<typeof insertPopularVehicleSchema>;
export type PopularVehicle = typeof popularVehiclesTable.$inferSelect;
