import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiFetch } from "@/api";
import { Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";

interface FaqItem {
  id: number;
  questionEn: string;
  questionPl: string;
  questionRu: string;
  questionLt: string;
  answerEn: string;
  answerPl: string;
  answerRu: string;
  answerLt: string;
  sortOrder: number;
  isActive: boolean;
}

const EMPTY: Omit<FaqItem, "id"> = {
  questionEn: "", questionPl: "", questionRu: "", questionLt: "",
  answerEn: "", answerPl: "", answerRu: "", answerLt: "",
  sortOrder: 0, isActive: true,
};

export default function FaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [form, setForm] = useState<Omit<FaqItem, "id">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    try {
      const data = await apiFetch<FaqItem[]>("/api/faq/all");
      setItems(data ?? []);
    } catch {
      toast({ variant: "destructive", title: "Failed to load FAQ items" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY, sortOrder: items.length + 1 });
    setDialogOpen(true);
  };

  const openEdit = (item: FaqItem) => {
    setEditing(item);
    const { id, ...rest } = item;
    setForm(rest);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await apiFetch<FaqItem>(`/api/faq/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        toast({ title: "FAQ item updated" });
      } else {
        await apiFetch<FaqItem>("/api/faq", {
          method: "POST",
          body: JSON.stringify(form),
        });
        toast({ title: "FAQ item created" });
      }
      setDialogOpen(false);
      load();
    } catch {
      toast({ variant: "destructive", title: "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this FAQ item?")) return;
    try {
      await apiFetch<null>(`/api/faq/${id}`, { method: "DELETE" });
      toast({ title: "FAQ item deleted" });
      load();
    } catch {
      toast({ variant: "destructive", title: "Delete failed" });
    }
  };

  const toggleActive = async (item: FaqItem) => {
    try {
      await apiFetch<FaqItem>(`/api/faq/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...item, isActive: !item.isActive }),
      });
      load();
    } catch {
      toast({ variant: "destructive", title: "Update failed" });
    }
  };

  const set = (field: keyof typeof form, value: any) =>
    setForm(f => ({ ...f, [field]: value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">FAQ</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage frequently asked questions displayed on the homepage. Supports EN / PL / RU / LT.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="w-4 h-4 mr-2" /> Add Question</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit FAQ Item" : "New FAQ Item"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <Tabs defaultValue="en">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="en">EN</TabsTrigger>
                  <TabsTrigger value="pl">PL</TabsTrigger>
                  <TabsTrigger value="ru">RU</TabsTrigger>
                  <TabsTrigger value="lt">LT</TabsTrigger>
                </TabsList>

                {(["en", "pl", "ru", "lt"] as const).map(lang => (
                  <TabsContent key={lang} value={lang} className="space-y-3 pt-3">
                    <div>
                      <Label>Question ({lang.toUpperCase()})</Label>
                      <Input
                        value={(form as any)[`question${lang.charAt(0).toUpperCase() + lang.slice(1)}`]}
                        onChange={e => set(`question${lang.charAt(0).toUpperCase() + lang.slice(1)}` as any, e.target.value)}
                        placeholder="Question in this language..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Answer ({lang.toUpperCase()})</Label>
                      <Textarea
                        value={(form as any)[`answer${lang.charAt(0).toUpperCase() + lang.slice(1)}`]}
                        onChange={e => set(`answer${lang.charAt(0).toUpperCase() + lang.slice(1)}` as any, e.target.value)}
                        placeholder="Answer in this language..."
                        rows={5}
                        className="mt-1"
                      />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sort Order</Label>
                  <Input
                    type="number"
                    value={form.sortOrder}
                    onChange={e => set("sortOrder", parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={form.isActive}
                      onCheckedChange={v => set("isActive", v)}
                    />
                    <Label>{form.isActive ? "Active" : "Hidden"}</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving…" : editing ? "Save Changes" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>FAQ Items</CardTitle>
          <CardDescription>{items.length} question{items.length !== 1 ? "s" : ""} total</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No FAQ items yet. Add your first question.
            </p>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div
                  key={item.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                    item.isActive ? "border-border bg-card" : "border-border/50 bg-muted/30 opacity-60"
                  }`}
                >
                  <GripVertical className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">
                      {item.questionEn || <span className="text-muted-foreground italic">No English question</span>}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {item.answerEn || <span className="italic">No English answer</span>}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {item.questionPl && <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">PL</span>}
                      {item.questionRu && <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">RU</span>}
                      {item.questionLt && <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">LT</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs text-muted-foreground mr-2">#{item.sortOrder}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      title={item.isActive ? "Hide" : "Show"}
                      onClick={() => toggleActive(item)}
                    >
                      {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8"
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
