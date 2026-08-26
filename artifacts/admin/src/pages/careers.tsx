import { useState } from "react";
import { Briefcase, Mail, Phone, MessageCircle, Send, Calendar, User, FileText, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/api";
import { useToast } from "@/hooks/use-toast";

interface Application {
  id: number;
  name: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  telegram: string | null;
  position: string | null;
  employmentPreference: string | null;
  lang: string | null;
  cvFilename: string | null;
  createdAt: string;
}

function LangBadge({ lang }: { lang: string | null }) {
  const map: Record<string, string> = { en: "EN", pl: "PL", ru: "RU", lt: "LT" };
  return (
    <Badge variant="outline" className="text-xs">
      {map[lang ?? "en"] ?? "EN"}
    </Badge>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl">
      <Inbox size={40} className="mb-4 text-muted-foreground/30" />
      <p className="text-muted-foreground font-medium mb-1">No applications yet</p>
      <p className="text-muted-foreground text-sm">Applications submitted via the Careers page will appear here.</p>
    </div>
  );
}

export default function CareersPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);
  const { toast } = useToast();

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await apiFetch<Application[]>("/api/admin/careers");
      setApplications(data);
    } catch {
      toast({
        variant: "destructive",
        title: "Failed to load career applications",
      });
    } finally {
      setIsLoading(false);
      setLoaded(true);
    }
  };

  if (!loaded) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Careers</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage career applications and the Careers page</p>
        </div>

        {/* Info Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-card border border-border/50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Briefcase size={18} className="text-primary" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm mb-1">Careers Page</div>
              <div className="text-muted-foreground text-xs">Live at <code className="bg-muted px-1 rounded">/careers</code> on the website.</div>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border/50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
              <Mail size={18} className="text-green-400" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm mb-1">Email Delivery</div>
              <div className="text-muted-foreground text-xs">Applications sent to <span className="text-white">info@bovaja.com</span> with CV attached.</div>
            </div>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border/50 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-blue-400" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm mb-1">CV Upload</div>
              <div className="text-muted-foreground text-xs">Accepts PDF, DOC, DOCX up to 5 MB. Optional — applicants may apply without a CV.</div>
            </div>
          </div>
        </div>

        {/* Content settings note */}
        <div className="p-5 rounded-xl bg-card border border-border/50">
          <h2 className="text-white font-semibold mb-2">Page Content</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Careers page copy and translations can be edited in the Translations section. The form fields and structure are defined in the frontend template.
          </p>
          <div className="flex gap-3">
            <a
              href={`${import.meta.env.BASE_URL}translations`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Edit Translations
            </a>
            <a
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-muted-foreground text-sm font-medium hover:text-white hover:border-white/20 transition-colors"
            >
              Preview Website
            </a>
          </div>
        </div>

        {/* Load applications button */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Recent Applications</h2>
          <Button onClick={loadApplications} disabled={isLoading} size="sm">
            {isLoading ? "Loading…" : "Load Applications"}
          </Button>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Careers</h1>
          <p className="text-muted-foreground text-sm mt-1">{applications.length} application{applications.length !== 1 ? "s" : ""} received</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadApplications} disabled={isLoading}>
          {isLoading ? "Refreshing…" : "Refresh"}
        </Button>
      </div>

      {applications.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="rounded-xl border border-border/50 bg-card overflow-hidden">
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-secondary/20 transition-colors"
                onClick={() => setExpanded(expanded === app.id ? null : app.id)}
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User size={16} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white">{app.name || "Anonymous"}</span>
                    <LangBadge lang={app.lang} />
                    {app.cvFilename && <Badge variant="secondary" className="text-xs">CV attached</Badge>}
                    {app.employmentPreference && (
                      <Badge variant="outline" className="text-xs">{app.employmentPreference}</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">{app.position || "No position specified"}</div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                  <Calendar size={11} />
                  {new Date(app.createdAt).toLocaleDateString()}
                </div>
              </div>

              {expanded === app.id && (
                <div className="px-4 pb-4 border-t border-border/30 pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    {app.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone size={12} /> <a href={`tel:${app.phone}`} className="hover:text-white">{app.phone}</a>
                      </div>
                    )}
                    {app.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail size={12} /> <a href={`mailto:${app.email}`} className="hover:text-white">{app.email}</a>
                      </div>
                    )}
                    {app.whatsapp && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MessageCircle size={12} /> WhatsApp: {app.whatsapp}
                      </div>
                    )}
                    {app.telegram && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Send size={12} /> Telegram: {app.telegram}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
