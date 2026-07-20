import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetAllArticles,
  useCreateArticle,
  useUpdateArticle,
  useDeleteArticle,
  getGetAllArticlesQueryKey,
  type Article,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Eye, EyeOff, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const TOOLBAR_ACTIONS = [
  { label: "H2", tag: "## ", wrap: false },
  { label: "H3", tag: "### ", wrap: false },
  { label: "B", tag: "**", wrap: true },
  { label: "I", tag: "_", wrap: true },
  { label: "• List", tag: "- ", wrap: false },
  { label: "1. List", tag: "1. ", wrap: false },
  { label: "Link", tag: "[text](url)", wrap: false },
];

function MarkdownEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (tag: string, wrap: boolean) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    let newText: string;
    if (wrap) {
      newText = value.slice(0, start) + tag + selected + tag + value.slice(end);
    } else {
      newText = value.slice(0, start) + tag + selected + value.slice(end);
    }
    onChange(newText);
    setTimeout(() => {
      el.focus();
      const cursor = wrap ? start + tag.length + selected.length + tag.length : start + tag.length + selected.length;
      el.setSelectionRange(cursor, cursor);
    }, 0);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 p-2 bg-muted rounded-md border border-border">
        {TOOLBAR_ACTIONS.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => insertMarkdown(a.tag, a.wrap)}
            className="px-2 py-1 text-xs font-medium bg-background rounded border border-border hover:bg-accent transition-colors"
          >
            {a.label}
          </button>
        ))}
      </div>
      <Textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={14}
        placeholder="Write article content in Markdown...&#10;&#10;## Heading&#10;&#10;**Bold** and _italic_ text&#10;&#10;- Bullet list&#10;&#10;1. Numbered list"
        className="font-mono text-sm resize-y"
      />
    </div>
  );
}

interface ArticleForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  titlePl: string;
  excerptPl: string;
  contentPl: string;
  titleRu: string;
  excerptRu: string;
  contentRu: string;
  titleLt: string;
  excerptLt: string;
  contentLt: string;
  coverImage: string;
  publishedAt: string;
  status: string;
}

const EMPTY_FORM: ArticleForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  titlePl: "",
  excerptPl: "",
  contentPl: "",
  titleRu: "",
  excerptRu: "",
  contentRu: "",
  titleLt: "",
  excerptLt: "",
  contentLt: "",
  coverImage: "",
  publishedAt: new Date().toISOString().split("T")[0],
  status: "draft",
};

const LANGS = [
  { key: "en", label: "🇬🇧 EN" },
  { key: "pl", label: "🇵🇱 PL" },
  { key: "ru", label: "🇷🇺 RU" },
  { key: "lt", label: "🇱🇹 LT" },
] as const;

type LangKey = "en" | "pl" | "ru" | "lt";

function langFields(lang: LangKey): { title: keyof ArticleForm; excerpt: keyof ArticleForm; content: keyof ArticleForm } {
  if (lang === "en") return { title: "title", excerpt: "excerpt", content: "content" };
  return {
    title: `title${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof ArticleForm,
    excerpt: `excerpt${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof ArticleForm,
    content: `content${lang.charAt(0).toUpperCase() + lang.slice(1)}` as keyof ArticleForm,
  };
}

export default function ArticlesPage() {
  const { data: articles = [], isLoading } = useGetAllArticles();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [form, setForm] = useState<ArticleForm>(EMPTY_FORM);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeLang, setActiveLang] = useState<LangKey>("en");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: getGetAllArticlesQueryKey() });

  const openCreate = () => {
    setEditingArticle(null);
    setForm(EMPTY_FORM);
    setPreviewMode(false);
    setActiveLang("en");
    setDialogOpen(true);
  };

  const openEdit = (a: Article) => {
    setEditingArticle(a);
    setForm({
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      content: a.content,
      titlePl: (a as unknown as Record<string, string>).titlePl ?? "",
      excerptPl: (a as unknown as Record<string, string>).excerptPl ?? "",
      contentPl: (a as unknown as Record<string, string>).contentPl ?? "",
      titleRu: (a as unknown as Record<string, string>).titleRu ?? "",
      excerptRu: (a as unknown as Record<string, string>).excerptRu ?? "",
      contentRu: (a as unknown as Record<string, string>).contentRu ?? "",
      titleLt: (a as unknown as Record<string, string>).titleLt ?? "",
      excerptLt: (a as unknown as Record<string, string>).excerptLt ?? "",
      contentLt: (a as unknown as Record<string, string>).contentLt ?? "",
      coverImage: a.coverImage,
      publishedAt: a.publishedAt ? a.publishedAt.split("T")[0] : new Date().toISOString().split("T")[0],
      status: a.status,
    });
    setPreviewMode(false);
    setActiveLang("en");
    setDialogOpen(true);
  };

  const update = (key: keyof ArticleForm, val: string) => {
    setForm((f) => {
      const next = { ...f, [key]: val };
      if (key === "title" && !editingArticle) {
        next.slug = slugify(val);
      }
      return next;
    });
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      toast({ title: "Title (EN) and Slug are required", variant: "destructive" });
      return;
    }
    const payload = {
      ...form,
      publishedAt: form.status === "published" && form.publishedAt
        ? new Date(form.publishedAt).toISOString()
        : null,
    };
    try {
      if (editingArticle) {
        await updateArticle.mutateAsync({ id: editingArticle.id, data: payload });
        toast({ title: "Article updated" });
      } else {
        await createArticle.mutateAsync({ data: payload });
        toast({ title: "Article created" });
      }
      invalidate();
      setDialogOpen(false);
    } catch {
      toast({ title: "Error saving article", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteArticle.mutateAsync({ id: deleteTarget.id });
      toast({ title: "Article deleted" });
      invalidate();
    } catch {
      toast({ title: "Error deleting article", variant: "destructive" });
    }
    setDeleteTarget(null);
  };

  const handleTogglePublish = async (a: Article) => {
    const newStatus = a.status === "published" ? "draft" : "published";
    const payload: Record<string, unknown> = { status: newStatus };
    if (newStatus === "published" && !a.publishedAt) {
      payload.publishedAt = new Date().toISOString();
    }
    try {
      await updateArticle.mutateAsync({ id: a.id, data: payload });
      toast({ title: newStatus === "published" ? "Article published" : "Article set to draft" });
      invalidate();
    } catch {
      toast({ title: "Error updating article", variant: "destructive" });
    }
  };

  const fields = langFields(activeLang);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Articles</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage news & guides for the website</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="w-4 h-4" /> New Article
        </Button>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground py-12 text-center">Loading articles…</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <p className="text-muted-foreground">No articles yet. Create your first one.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((a) => (
            <div key={a.id} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card">
              {a.coverImage && (
                <img
                  src={a.coverImage}
                  alt={a.title}
                  className="w-20 h-14 object-cover rounded-md shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-card-foreground truncate">{a.title}</span>
                  <Badge variant={a.status === "published" ? "default" : "secondary"}>
                    {a.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {["pl", "ru", "lt"].map((l) => {
                      const hasTitle = !!((a as unknown as Record<string, string>)[`title${l.charAt(0).toUpperCase() + l.slice(1)}`]);
                      return (
                        <span key={l} className={hasTitle ? "text-green-500 mr-1" : "text-muted-foreground/40 mr-1"}>
                          {l.toUpperCase()}
                        </span>
                      );
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{a.excerpt}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Slug: /{a.slug} {a.publishedAt && `· Published: ${new Date(a.publishedAt).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  title={a.status === "published" ? "Set to Draft" : "Publish"}
                  onClick={() => handleTogglePublish(a)}
                >
                  {a.status === "published" ? <EyeOff className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEdit(a)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(a)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingArticle ? "Edit Article" : "New Article"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Slug, Cover, Date, Status — shared across all langs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Slug *</label>
                <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} placeholder="how-to-choose-a-car-from-europe" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Cover Image URL</label>
                <Input value={form.coverImage} onChange={(e) => update("coverImage", e.target.value)} placeholder="https://… or /uploads/articles/…" />
              </div>
            </div>
            {form.coverImage && (
              <img src={form.coverImage} alt="preview" className="h-28 object-cover rounded-md border border-border" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Publication Date</label>
                <Input type="date" value={form.publishedAt} onChange={(e) => update("publishedAt", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => update("status", e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2 bg-background text-foreground text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Language tabs */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="flex border-b border-border bg-muted">
                {LANGS.map((l) => (
                  <button
                    key={l.key}
                    type="button"
                    onClick={() => setActiveLang(l.key)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeLang === l.key
                        ? "bg-background text-foreground border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l.label}
                    {l.key !== "en" && form[langFields(l.key).title] && (
                      <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Title {activeLang === "en" ? "*" : <span className="text-muted-foreground font-normal">(optional — falls back to EN)</span>}
                  </label>
                  <Input
                    value={form[fields.title] as string}
                    onChange={(e) => update(fields.title, e.target.value)}
                    placeholder={activeLang === "en" ? "How to Choose a Car from Europe" : `Title in ${activeLang.toUpperCase()}…`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Excerpt</label>
                  <Textarea
                    value={form[fields.excerpt] as string}
                    onChange={(e) => update(fields.excerpt, e.target.value)}
                    placeholder={activeLang === "en" ? "Short article preview…" : `Excerpt in ${activeLang.toUpperCase()}…`}
                    rows={2}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Content (Markdown)</label>
                    <Button type="button" variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => setPreviewMode((p) => !p)}>
                      {previewMode ? <><Pencil className="w-3 h-3" /> Edit</> : <><Eye className="w-3 h-3" /> Preview</>}
                    </Button>
                  </div>
                  {previewMode ? (
                    <div
                      className="min-h-[200px] p-4 rounded-md border border-border bg-muted prose prose-invert prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: (form[fields.content] as string).replace(/\n/g, "<br/>") }}
                    />
                  ) : (
                    <MarkdownEditor value={form[fields.content] as string} onChange={(v) => update(fields.content, v)} />
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">Cancel</Button>
              <Button onClick={() => { update("status", "draft"); setTimeout(handleSave, 0); }} variant="secondary" className="flex-1">Save as Draft</Button>
              <Button onClick={() => { update("status", "published"); setTimeout(handleSave, 0); }} className="flex-1">Publish</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteTarget?.title}". This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
