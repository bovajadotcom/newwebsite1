import { pgTable, serial, text, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leadsTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  contact: text("contact").notNull().default(""),
  channel: text("channel").notNull().default("form"),
  source: text("source").notNull().default("home"),
  formName: text("form_name"),
  name: text("name"),
  phone: text("phone"),
  email: text("email"),
  message: text("message"),
  preferredContact: text("preferred_contact"),
  preferredLanguage: text("preferred_language"),
  vehicleInfo: json("vehicle_info"),
  pageUrl: text("page_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leadsTable).omit({ id: true, createdAt: true });

export const submitLeadSchema = z.object({
  formName: z.string(),
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  message: z.string().optional(),
  preferredContact: z.string().optional(),
  preferredLanguage: z.enum(["Russian", "Polish", "Lithuanian", "English"]).optional(),
  whatsapp: z.string().optional(),
  telegram: z.string().optional(),
  viber: z.string().optional(),
  vehicleInfo: z.record(z.string(), z.unknown()).optional(),
  pageUrl: z.string().optional(),
  subject: z.string().optional(),
  companyName: z.string().optional(),
  businessType: z.string().optional(),
  annualVolume: z.string().optional(),
  country: z.string().optional(),
});

export type SubmitLead = z.infer<typeof submitLeadSchema>;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leadsTable.$inferSelect;
