import { Router } from "express";
import { db } from "@workspace/db";
import { leadsTable } from "@workspace/db";
import { sendLeadEmail } from "../lib/email.js";

const router = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const body = req.body as {
    name?: string;
    phone?: string;
    email?: string;
    message?: string;
    service?: string;
    subject?: string;
    country?: string;
  };

  const formName = body.service === "calculator-quote"
    ? "Calculator Quote Request"
    : body.service === "vehicle-inquiry"
    ? "Get More Information"
    : body.subject || "Contact Form";

  const contact = body.email || body.phone || "";
  const channel = body.email ? "email" : body.phone ? "phone" : "form";

  try {
    await db.insert(leadsTable).values({
      contact,
      channel,
      source: body.service || "contact",
      formName,
      name: body.name,
      phone: body.phone,
      email: body.email,
      message: body.message,
    });
  } catch (_) {}

  try {
    await sendLeadEmail({
      formName,
      name: body.name,
      phone: body.phone,
      email: body.email,
      message: body.message,
      country: body.country,
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to send contact email");
    res.status(500).json({ ok: false, error: "Email delivery failed" });
  }
});

export default router;
