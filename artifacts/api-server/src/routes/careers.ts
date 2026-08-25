import { Router } from "express";
import multer from "multer";
import nodemailer from "nodemailer";
import { db } from "@workspace/db";
import { careerApplicationsTable } from "@workspace/db";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Invalid file type"));
  },
});

function createTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error("GMAIL credentials not set");
  return nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
}

function formatDateTime(): string {
  return new Date().toLocaleString("en-GB", {
    timeZone: "Europe/Warsaw",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function row(label: string, value: string | undefined | null): string {
  if (!value?.trim()) return "";
  return `  • ${label}: ${value}\n`;
}

router.post("/careers", upload.single("cv"), async (req, res): Promise<void> => {
  const b = req.body as Record<string, string>;
  const langLabel = b.lang === "pl" ? "🇵🇱 PL" : b.lang === "ru" ? "🇷🇺 RU" : b.lang === "lt" ? "🇱🇹 LT" : "🇬🇧 EN";

  // Save to DB (non-blocking)
  try {
    await db.insert(careerApplicationsTable).values({
      name: b.name || null,
      phone: b.phone || null,
      email: b.email || null,
      whatsapp: b.whatsapp || null,
      telegram: b.telegram || null,
      viber: b.viber || null,
      preferredContact: b.preferredContact || null,
      position: b.position || null,
      employmentPreference: b.employmentPreference || null,
      experience: b.experience || null,
      skills: b.skills || null,
      languages: b.languages || null,
      intro: b.intro || null,
      message: b.message || null,
      cvFilename: req.file?.originalname || null,
      lang: b.lang || "en",
    });
  } catch (err) {
    req.log.warn({ err }, "Failed to save career application to DB");
  }

  const body = `
NEW WEBSITE APPLICATION — CAREERS
==================================

FORM SOURCE:
  Careers Application

LANGUAGE:
  ${langLabel}

SUBMITTED:
  ${formatDateTime()} (CET)

APPLICANT DETAILS:
${row("Full Name", b.name)}${row("Phone", b.phone)}${row("Email", b.email)}${row("WhatsApp", b.whatsapp)}${row("Telegram", b.telegram)}${row("Viber", b.viber)}${row("Preferred Contact", b.preferredContact)}
POSITION:
${row("Position / Area of Interest", b.position)}${row("Employment Preference", b.employmentPreference)}
EXPERIENCE & SKILLS:
${row("Work Experience", b.experience)}${row("Skills", b.skills)}${row("Languages Spoken", b.languages)}
INTRODUCTION:
  ${b.intro || "(not provided)"}

MESSAGE:
  ${b.message || "(no additional message)"}

CV:
  ${req.file ? `Attached: ${req.file.originalname} (${(req.file.size / 1024).toFixed(1)} KB)` : "No CV uploaded"}

---
This application was submitted automatically by BOVAJA website.
`.trim();

  try {
    const transport = createTransport();
    const attachments = req.file
      ? [{ filename: req.file.originalname, content: req.file.buffer, contentType: req.file.mimetype }]
      : [];

    await transport.sendMail({
      from: `"BOVAJA Website" <${process.env.GMAIL_USER}>`,
      to: "info@bovaja.com",
      subject: `New Website Application — Careers — ${b.name || "Anonymous"}`,
      text: body,
      attachments,
      ...(b.email ? { replyTo: b.email } : {}),
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to send careers email");
    res.status(500).json({ ok: false, error: "Email delivery failed" });
  }
});

// Admin: list career applications
router.get("/admin/careers", async (req, res): Promise<void> => {
  try {
    const { desc } = await import("drizzle-orm");
    const apps = await db
      .select()
      .from(careerApplicationsTable)
      .orderBy(desc(careerApplicationsTable.createdAt))
      .limit(100);
    res.json(apps);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch career applications");
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

export default router;
