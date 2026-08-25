import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { leadsTable, insertLeadSchema, submitLeadSchema } from "@workspace/db";
import { desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth.js";
import { sendLeadEmail } from "../lib/email.js";

const router: IRouter = Router();

router.post("/leads", async (req, res): Promise<void> => {
  const body = req.body as Record<string, unknown>;
  const isRichSubmission = Boolean(body.formName);

  if (isRichSubmission) {
    const parsed = submitLeadSchema.safeParse(body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
      return;
    }
    const data = parsed.data;
    const contact = data.email || data.phone || data.whatsapp || data.telegram || data.viber || "";
    const channel = data.preferredContact || data.telegram ? "telegram" : data.whatsapp ? "whatsapp" : "form";

    const [lead] = await db.insert(leadsTable).values({
      contact,
      channel: typeof channel === "string" ? channel : "form",
      source: data.formName,
      formName: data.formName,
      name: data.name,
      phone: data.phone,
      email: data.email,
      message: data.message,
      preferredContact: data.preferredContact,
      preferredLanguage: data.preferredLanguage,
      vehicleInfo: data.vehicleInfo ?? null,
      pageUrl: data.pageUrl,
    }).returning();

    try {
      await sendLeadEmail(data);
      res.status(201).json({ ok: true, id: lead.id });
    } catch (err) {
      req.log.error({ err }, "Failed to send lead email");
      res.status(201).json({ ok: true, id: lead.id, emailError: true });
    }
    return;
  }

  const parsed = insertLeadSchema.safeParse(body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
    return;
  }
  const [lead] = await db.insert(leadsTable).values(parsed.data).returning();

  try {
    await sendLeadEmail({
      formName: "Callback Request",
      phone: parsed.data.contact,
      preferredContact: parsed.data.channel,
      pageUrl: parsed.data.source,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to send lead email for legacy submission");
  }

  res.status(201).json(lead);
});

router.get("/leads", requireAuth, async (_req, res): Promise<void> => {
  const leads = await db.select().from(leadsTable).orderBy(desc(leadsTable.createdAt));
  res.json(leads);
});

export default router;
