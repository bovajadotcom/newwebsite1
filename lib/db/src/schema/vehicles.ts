import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const vehiclesTable = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  engine: text("engine").notNull(),
  fuel: text("fuel").notNull(),
  transmission: text("transmission").notNull(),
  mileage: integer("mileage").notNull(),
  location: text("location").notNull(),
  price: integer("price").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("available"),
  imageUrl: text("image_url").notNull().default(""),
  photos: json("photos").$type<string[]>().notNull().default([]),
  badge: text("badge"),
  isPopular: boolean("is_popular").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertVehicleSchema = createInsertSchema(vehiclesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehiclesTable.$inferSelect;
