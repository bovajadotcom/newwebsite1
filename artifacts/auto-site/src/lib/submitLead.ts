export interface LeadPayload {
  formName: string;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  preferredContact?: string;
  preferredLanguage?: "Russian" | "Polish";
  whatsapp?: string;
  telegram?: string;
  viber?: string;
  vehicleInfo?: Record<string, unknown>;
  pageUrl?: string;
  subject?: string;
  companyName?: string;
  businessType?: string;
  annualVolume?: string;
  country?: string;
}

export async function submitLead(data: LeadPayload): Promise<{ ok: boolean; emailError?: boolean }> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      ...data,
      pageUrl: data.pageUrl ?? (typeof window !== "undefined" ? window.location.href : ""),
    }),
  });
  if (!res.ok) throw new Error("Server error");
  const json = await res.json() as { ok?: boolean; emailError?: boolean };
  return { ok: true, emailError: json.emailError };
}
