import nodemailer from "nodemailer";
import type { SubmitLead } from "@workspace/db";

const TO = "bovaja.auctions@gmail.com";

function createTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) throw new Error("GMAIL_USER or GMAIL_APP_PASSWORD not set");
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

function formatDateTime(): string {
  return new Date().toLocaleString("en-GB", {
    timeZone: "Europe/Warsaw",
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function row(label: string, value: string | undefined | null): string {
  if (!value) return "";
  return `  • ${label}: ${value}\n`;
}

export async function sendLeadEmail(data: SubmitLead): Promise<void> {
  const subject = `New Website Lead — ${data.formName}`;

  const vehicle = data.vehicleInfo as Record<string, unknown> | undefined;

  const vehicleSection = vehicle
    ? `VEHICLE DETAILS:\n${
        row("Vehicle", vehicle.label as string)
      }${
        row("Brand", vehicle.make as string)
      }${
        row("Model", vehicle.model as string)
      }${
        row("Year", vehicle.year ? String(vehicle.year) : undefined)
      }${
        row("Price", vehicle.price ? `€${vehicle.price}` : (vehicle.priceRange as string))
      }${
        row("Stock / ID", vehicle.id ? String(vehicle.id) : undefined)
      }${
        row("Status", vehicle.status as string)
      }\n`
    : "";

  const body = `
FORM SOURCE:
  ${data.formName}

SUBMITTED:
  ${formatDateTime()} (CET)

CUSTOMER DETAILS:
${row("Name", data.name)}${row("Phone", data.phone)}${row("Email", data.email)}${row("WhatsApp", data.whatsapp)}${row("Telegram", data.telegram)}${row("Viber", data.viber)}${row("Preferred Contact", data.preferredContact)}${row("Company", data.companyName)}${row("Business Type", data.businessType)}${row("Annual Volume", data.annualVolume)}${row("Country", data.country)}
MESSAGE:
  ${data.message || "(no message)"}

${vehicleSection}PAGE URL:
  ${data.pageUrl || "(unknown)"}

---
This email was sent automatically by BOVAJA website.
`.trim();

  const transport = createTransport();
  await transport.sendMail({
    from: `"BOVAJA Website" <${process.env.GMAIL_USER}>`,
    to: TO,
    subject,
    text: body,
    ...(data.email ? { replyTo: data.email } : {}),
  });
}
