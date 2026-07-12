import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetPopularVehicles,
  useCreatePopularVehicle,
  useUpdatePopularVehicle,
  useDeletePopularVehicle,
  getGetPopularVehiclesQueryKey,
} from "@workspace/api-client-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Pencil, Trash2, Images, X, GripVertical } from "lucide-react";

const popularVehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().nullable().optional(),
  engine: z.string().nullable().optional(),
  fuel: z.string().nullable().optional(),
  transmission: z.string().nullable().optional(),
  mileage: z.coerce.number().nullable().optional(),
  priceRange: z.string().min(1, "Price range is required"),
  estimatedDelivery: z.string().min(1, "Estimated delivery is required"),
  description: z.string().min(1, "Description (EN) is required"),
  descriptionPl: z.string().nullable().optional(),
  descriptionRu: z.string().nullable().optional(),
  descriptionLt: z.string().nullable().optional(),
  imageUrl: z.string().url("Valid image URL is required"),
  sortOrder: z.coerce.number().default(0),
});

type PopularVehicleFormValues = z.infer<typeof popularVehicleSchema>;

function PhotoGalleryManager({
  photos,
  onChange,
}: {
  photos: string[];
  onChange: (photos: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");

  const addPhoto = () => {
    const url = inputValue.trim();
    if (!url) return;
    try { new URL(url); } catch { setInputError("Please enter a valid URL"); return; }
    if (photos.includes(url)) { setInputError("URL already added"); return; }
    onChange([...photos, url]);
    setInputValue("");
    setInputError("");
  };

  const removePhoto = (idx: number) => onChange(photos.filter((_, i) => i !== idx));

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const next = [...photos];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    onChange(next);
  };

  const moveDown = (idx: number) => {
    if (idx === photos.length - 1) return;
    const next = [...photos];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Images className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Additional Photos Gallery</span>
        <span className="ml-auto text-xs text-muted-foreground">{photos.length} photo{photos.length !== 1 ? "s" : ""}</span>
      </div>
      {photos.length > 0 && (
        <div className="rounded-md border divide-y bg-muted/30">
          {photos.map((url, idx) => (
            <div key={idx} className="flex items-center gap-3 p-2">
              <div className="flex flex-col gap-0.5">
                <button type="button" onClick={() => moveUp(idx)} disabled={idx === 0} className="p-0.5 rounded hover:bg-muted disabled:opacity-30">
                  <GripVertical className="h-3 w-3 rotate-90" />
                </button>
                <button type="button" onClick={() => moveDown(idx)} disabled={idx === photos.length - 1} className="p-0.5 rounded hover:bg-muted disabled:opacity-30">
                  <GripVertical className="h-3 w-3 -rotate-90" />
                </button>
              </div>
              <img src={url} alt={`Photo ${idx + 1}`} className="h-14 w-20 object-cover rounded border bg-muted flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='56'%3E%3Crect width='80' height='56' fill='%23374151'/%3E%3C/svg%3E"; }} />
              <p className="flex-1 text-xs text-muted-foreground truncate font-mono">{url}</p>
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">#{idx + 1}</span>
              <button type="button" onClick={() => removePhoto(idx)} className="p-1 rounded hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <div className="flex-1 space-y-1">
          <Input
            placeholder="https://example.com/photo.jpg"
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); setInputError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPhoto(); } }}
            className={inputError ? "border-destructive" : ""}
          />
          {inputError && <p className="text-xs text-destructive">{inputError}</p>}
        </div>
        <Button type="button" variant="outline" onClick={addPhoto}>Add Photo</Button>
      </div>
    </div>
  );
}

export default function PopularVehiclesPage() {
  const { data: popularVehicles, isLoading } = useGetPopularVehicles();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const createMutation = useCreatePopularVehicle();
  const updateMutation = useUpdatePopularVehicle();
  const deleteMutation = useDeletePopularVehicle();

  const form = useForm<PopularVehicleFormValues>({
    resolver: zodResolver(popularVehicleSchema),
    defaultValues: {
      make: "",
      model: "",
      year: null,
      engine: null,
      fuel: null,
      transmission: null,
      mileage: null,
      priceRange: "",
      estimatedDelivery: "",
      description: "",
      descriptionPl: null,
      descriptionRu: null,
      descriptionLt: null,
      imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800",
      sortOrder: 0,
    },
  });

  const onSubmit = async (values: PopularVehicleFormValues) => {
    try {
      const payload = { ...values, photos };
      if (editingVehicle) {
        await updateMutation.mutateAsync({ id: editingVehicle.id, data: payload });
        toast({ title: "Popular vehicle updated" });
      } else {
        await createMutation.mutateAsync({ data: payload });
        toast({ title: "Popular vehicle added" });
      }
      queryClient.invalidateQueries({ queryKey: getGetPopularVehiclesQueryKey() });
      setIsDialogOpen(false);
      setEditingVehicle(null);
      setPhotos([]);
      form.reset();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.response?.data?.message || "Operation failed" });
    }
  };

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setPhotos(vehicle.photos ?? []);
    form.reset({
      ...vehicle,
      year: vehicle.year ?? null,
      engine: vehicle.engine ?? null,
      fuel: vehicle.fuel ?? null,
      transmission: vehicle.transmission ?? null,
      mileage: vehicle.mileage ?? null,
      descriptionPl: vehicle.descriptionPl ?? null,
      descriptionRu: vehicle.descriptionRu ?? null,
      descriptionLt: vehicle.descriptionLt ?? null,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast({ title: "Deleted successfully" });
        queryClient.invalidateQueries({ queryKey: getGetPopularVehiclesQueryKey() });
      } catch {
        toast({ variant: "destructive", title: "Error", description: "Delete failed" });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Popular Vehicles</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) { setEditingVehicle(null); setPhotos([]); form.reset(); }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Vehicle</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingVehicle ? "Edit Popular Vehicle" : "Add Popular Vehicle"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                {/* Identity */}
                <div className="grid grid-cols-3 gap-4">
                  <FormField control={form.control} name="make" render={({ field }) => (
                    <FormItem><FormLabel>Make</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="model" render={({ field }) => (
                    <FormItem><FormLabel>Model</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="year" render={({ field }) => (
                    <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ""} placeholder="e.g. 2022" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                {/* Specs */}
                <div className="grid grid-cols-3 gap-4">
                  <FormField control={form.control} name="engine" render={({ field }) => (
                    <FormItem><FormLabel>Engine</FormLabel><FormControl><Input {...field} value={field.value ?? ""} placeholder="e.g. 3.0L V6" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="fuel" render={({ field }) => (
                    <FormItem><FormLabel>Fuel Type</FormLabel><FormControl><Input {...field} value={field.value ?? ""} placeholder="e.g. Diesel" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="transmission" render={({ field }) => (
                    <FormItem><FormLabel>Transmission</FormLabel><FormControl><Input {...field} value={field.value ?? ""} placeholder="e.g. Automatic" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="mileage" render={({ field }) => (
                    <FormItem><FormLabel>Typical Mileage (km)</FormLabel><FormControl><Input type="number" {...field} value={field.value ?? ""} placeholder="e.g. 50000" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="sortOrder" render={({ field }) => (
                    <FormItem><FormLabel>Sort Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="priceRange" render={({ field }) => (
                    <FormItem><FormLabel>Price Range</FormLabel><FormControl><Input placeholder="e.g. €25,000 – €35,000" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="estimatedDelivery" render={({ field }) => (
                    <FormItem><FormLabel>Estimated Delivery</FormLabel><FormControl><Input placeholder="e.g. 3–4 weeks" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>

                {/* Media */}
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem><FormLabel>Main Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <PhotoGalleryManager photos={photos} onChange={setPhotos} />

                {/* Multilingual descriptions */}
                <div>
                  <p className="text-sm font-medium mb-2">Descriptions</p>
                  <Tabs defaultValue="en">
                    <TabsList className="mb-3">
                      <TabsTrigger value="en">🇬🇧 EN</TabsTrigger>
                      <TabsTrigger value="pl">🇵🇱 PL</TabsTrigger>
                      <TabsTrigger value="ru">🇷🇺 RU</TabsTrigger>
                      <TabsTrigger value="lt">🇱🇹 LT</TabsTrigger>
                    </TabsList>
                    <TabsContent value="en">
                      <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormControl><Textarea {...field} rows={4} placeholder="English description (required)" /></FormControl><FormMessage /></FormItem>
                      )} />
                    </TabsContent>
                    <TabsContent value="pl">
                      <FormField control={form.control} name="descriptionPl" render={({ field }) => (
                        <FormItem><FormControl><Textarea {...field} value={field.value ?? ""} rows={4} placeholder="Polish description (optional)" /></FormControl><FormMessage /></FormItem>
                      )} />
                    </TabsContent>
                    <TabsContent value="ru">
                      <FormField control={form.control} name="descriptionRu" render={({ field }) => (
                        <FormItem><FormControl><Textarea {...field} value={field.value ?? ""} rows={4} placeholder="Russian description (optional)" /></FormControl><FormMessage /></FormItem>
                      )} />
                    </TabsContent>
                    <TabsContent value="lt">
                      <FormField control={form.control} name="descriptionLt" render={({ field }) => (
                        <FormItem><FormControl><Textarea {...field} value={field.value ?? ""} rows={4} placeholder="Lithuanian description (optional)" /></FormControl><FormMessage /></FormItem>
                      )} />
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Make/Model</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Specs</TableHead>
              <TableHead>Price Range</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Sort</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : popularVehicles?.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.make} {v.model}</TableCell>
                <TableCell>{(v as any).year ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{[(v as any).fuel, (v as any).transmission].filter(Boolean).join(" / ") || "—"}</TableCell>
                <TableCell>{v.priceRange}</TableCell>
                <TableCell>{v.estimatedDelivery}</TableCell>
                <TableCell>{v.sortOrder}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(v)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(v.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
