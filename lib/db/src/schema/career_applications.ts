import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const careerApplicationsTable = pgTable("career_applications", {
  id: serial("id").primaryKey(),
  name: text("name"),
  phone: text("phone"),
  email: text("email"),
  whatsapp: text("whatsapp"),
  telegram: text("telegram"),
  viber: text("viber"),
  preferredContact: text("preferred_contact"),
  position: text("position"),
  employmentPreference: text("employment_preference"),
  experience: text("experience"),
  skills: text("skills"),
  languages: text("languages"),
  intro: text("intro"),
  message: text("message"),
  cvFilename: text("cv_filename"),
  lang: text("lang").default("en"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CareerApplication = typeof careerApplicationsTable.$inferSelect;
export type InsertCareerApplication = typeof careerApplicationsTable.$inferInsert;
