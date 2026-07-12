import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const soldVehiclesTable = pgTable("sold_vehicles", {
  id: serial("id").primaryKey(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  mileage: integer("mileage"),
  engine: text("engine"),
  fuel: text("fuel"),
  transmission: text("transmission"),
  description: text("description"),
  finalPrice: integer("final_price"),
  purchaseCountry: text("purchase_country").notNull(),
  deliveredTo: text("delivered_to"),
  deliveryStatus: text("delivery_status").notNull().default("Delivered"),
  deliveryDate: text("delivery_date"),
  imageUrl: text("image_url").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSoldVehicleSchema = createInsertSchema(soldVehiclesTable).omit({ id: true, createdAt: true });
export type InsertSoldVehicle = z.infer<typeof insertSoldVehicleSchema>;
export type SoldVehicle = typeof soldVehiclesTable.$inferSelect;
