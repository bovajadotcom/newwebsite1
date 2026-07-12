import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetVehicles,
  useCreateVehicle,
  useUpdateVehicle,
  useDeleteVehicle,
  getGetVehiclesQueryKey,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Pencil, Trash2, Search, X, ImagePlus, GripVertical, Images } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  engine: z.string().min(1, "Engine is required"),
  fuel: z.string().min(1, "Fuel type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  mileage: z.coerce.number().min(0),
  location: z.string().min(1, "Location is required"),
  deliveredTo: z.string().nullable().optional(),
  price: z.coerce.number().min(0),
  description: z.string().min(1, "Description (EN) is required"),
  descriptionPl: z.string().nullable().optional(),
  descriptionRu: z.string().nullable().optional(),
  descriptionLt: z.string().nullable().optional(),
  status: z.string().min(1, "Status is required"),
  imageUrl: z.string().url("Valid image URL is required"),
  badge: z.string().nullable().optional(),
  isPopular: z.boolean().default(false),
  sortOrder: z.coerce.number().default(0),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

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
    try {
      new URL(url);
    } catch {
      setInputError("Please enter a valid URL");
      return;
    }
    if (photos.includes(url)) {
      setInputError("This URL is already added");
      return;
    }
    onChange([...photos, url]);
    setInputValue("");
    setInputError("");
  };

  const removePhoto = (idx: number) => {
    onChange(photos.filter((_, i) => i !== idx));
  };

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
                <button
                  type="button"
                  onClick={() => moveUp(idx)}
                  disabled={idx === 0}
                  className="p-0.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <GripVertical className="h-3 w-3 rotate-90" />
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(idx)}
                  disabled={idx === photos.length - 1}
                  className="p-0.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <GripVertical className="h-3 w-3 -rotate-90" />
                </button>
              </div>
              <img
                src={url}
                alt={`Photo ${idx + 1}`}
                className="h-14 w-20 object-cover rounded border bg-muted flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='56' viewBox='0 0 80 56'%3E%3Crect width='80' height='56' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='10'%3ENo image%3C/text%3E%3C/svg%3E";
                }}
              />
              <p className="flex-1 text-xs text-muted-foreground truncate font-mono">{url}</p>
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">#{idx + 1}</span>
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="p-1 rounded hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors flex-shrink-0"
                title="Remove photo"
              >
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
            onChange={(e) => {
              setInputValue(e.target.value);
              setInputError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addPhoto();
              }
            }}
            className={inputError ? "border-destructive" : ""}
          />
          {inputError && <p className="text-xs text-destructive">{inputError}</p>}
        </div>
        <Button type="button" variant="outline" onClick={addPhoto} className="gap-1.5 flex-shrink-0">
          <ImagePlus className="h-4 w-4" />
          Add Photo
        </Button>
      </div>
    </div>
  );
}

export default function VehiclesPage() {
  const { data: vehicles, isLoading } = useGetVehicles();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [extraPhotos, setExtraPhotos] = useState<string[]>([]);

  const createMutation = useCreateVehicle();
  const updateMutation = useUpdateVehicle();
  const deleteMutation = useDeleteVehicle();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      engine: "",
      fuel: "Petrol",
      transmission: "Automatic",
      mileage: 0,
      location: "",
      deliveredTo: null,
      price: 0,
      description: "",
      descriptionPl: "",
      descriptionRu: "",
      descriptionLt: "",
      status: "available",
      imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
      badge: null,
      isPopular: false,
      sortOrder: 0,
    },
  });

  const onSubmit = async (values: VehicleFormValues) => {
    try {
      const payload = { ...values, photos: extraPhotos };
      if (editingVehicle) {
        await updateMutation.mutateAsync({
          id: editingVehicle.id,
          data: payload as any,
        });
        toast({ title: "Vehicle updated successfully" });
      } else {
        await createMutation.mutateAsync({ data: payload as any });
        toast({ title: "Vehicle created successfully" });
      }
      queryClient.invalidateQueries({ queryKey: getGetVehiclesQueryKey() });
      setIsDialogOpen(false);
      setEditingVehicle(null);
      setExtraPhotos([]);
      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Operation failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setExtraPhotos(Array.isArray(vehicle.photos) ? vehicle.photos : []);
    form.reset({
      ...vehicle,
      badge: vehicle.badge || null,
      descriptionPl: vehicle.descriptionPl || "",
      descriptionRu: vehicle.descriptionRu || "",
      descriptionLt: vehicle.descriptionLt || "",
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingVehicle(null);
    setExtraPhotos([]);
    form.reset({
      make: "", model: "", year: new Date().getFullYear(),
      engine: "", fuel: "Petrol", transmission: "Automatic",
      mileage: 0, location: "", deliveredTo: null, price: 0,
      description: "", descriptionPl: "", descriptionRu: "", descriptionLt: "",
      status: "available",
      imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
      badge: null, isPopular: false, sortOrder: 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast({ title: "Vehicle deleted successfully" });
        queryClient.invalidateQueries({ queryKey: getGetVehiclesQueryKey() });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: error.response?.data?.message || "Something went wrong",
        });
      }
    }
  };

  const filteredVehicles = vehicles?.filter((v) =>
    `${v.make} ${v.model}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-500 hover:bg-green-600">Available</Badge>;
      case "reserved":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Reserved</Badge>;
      case "sold":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Sold</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vehicles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingVehicle(null);
            setExtraPhotos([]);
            form.reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={handleAdd}>
              <Plus className="h-4 w-4" /> Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="make"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Make</FormLabel>
                        <FormControl><Input placeholder="BMW" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl><Input placeholder="X5" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (€)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mileage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mileage (km)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fuel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuel</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Petrol">Petrol</SelectItem>
                            <SelectItem value="Diesel">Diesel</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                            <SelectItem value="Electric">Electric</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="transmission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transmission</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select transmission" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Automatic">Automatic</SelectItem>
                            <SelectItem value="Manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="engine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engine</FormLabel>
                        <FormControl><Input placeholder="3.0L V6" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl><Input placeholder="Berlin, Germany" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="deliveredTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivered To <span className="text-muted-foreground font-normal">(optional)</span></FormLabel>
                      <FormControl><Input placeholder="e.g. Warsaw, Poland" {...field} value={field.value ?? ""} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="reserved">Reserved</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Main image */}
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main Image URL</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input {...field} placeholder="https://..." />
                          {field.value && (
                            <img
                              src={field.value}
                              alt="Preview"
                              className="h-28 w-full object-cover rounded border bg-muted"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Extra photos gallery manager */}
                <div className="rounded-lg border p-4 bg-muted/20">
                  <PhotoGalleryManager
                    photos={extraPhotos}
                    onChange={setExtraPhotos}
                  />
                </div>

                {/* Multilingual Descriptions */}
                <div className="rounded-lg border p-4 bg-muted/20 space-y-3">
                  <p className="text-sm font-medium">Descriptions</p>
                  <Tabs defaultValue="en">
                    <TabsList className="mb-3">
                      <TabsTrigger value="en">🇬🇧 EN</TabsTrigger>
                      <TabsTrigger value="pl">🇵🇱 PL</TabsTrigger>
                      <TabsTrigger value="ru">🇷🇺 RU</TabsTrigger>
                      <TabsTrigger value="lt">🇱🇹 LT</TabsTrigger>
                    </TabsList>
                    <TabsContent value="en">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (English) <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Textarea rows={4} placeholder="Vehicle description in English..." {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="pl">
                      <FormField
                        control={form.control}
                        name="descriptionPl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Polish)</FormLabel>
                            <FormControl><Textarea rows={4} placeholder="Opis pojazdu po polsku..." {...field} value={field.value || ""} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="ru">
                      <FormField
                        control={form.control}
                        name="descriptionRu"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Russian)</FormLabel>
                            <FormControl><Textarea rows={4} placeholder="Описание автомобиля на русском..." {...field} value={field.value || ""} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="lt">
                      <FormField
                        control={form.control}
                        name="descriptionLt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Lithuanian)</FormLabel>
                            <FormControl><Textarea rows={4} placeholder="Transporto priemonės aprašymas lietuvių kalba..." {...field} value={field.value || ""} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="badge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Badge (Optional)</FormLabel>
                        <FormControl><Input placeholder="Special Offer" {...field} value={field.value || ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sortOrder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Order</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="isPopular"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Mark as Popular</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingVehicle ? "Update Vehicle" : "Create Vehicle"}
                  </Button>
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
              <TableHead>Price</TableHead>
              <TableHead>Fuel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Photos</TableHead>
              <TableHead>Popular</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8">Loading vehicles...</TableCell></TableRow>
            ) : filteredVehicles?.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8">No vehicles found.</TableCell></TableRow>
            ) : (
              filteredVehicles?.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {vehicle.imageUrl && (
                        <img
                          src={vehicle.imageUrl}
                          alt=""
                          className="h-10 w-14 object-cover rounded border bg-muted flex-shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      )}
                      <div>
                        <div>{vehicle.make} {vehicle.model}</div>
                        <div className="text-xs text-muted-foreground">{vehicle.engine}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>€{vehicle.price.toLocaleString()}</TableCell>
                  <TableCell>{vehicle.fuel}</TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  <TableCell>
                    {Array.isArray((vehicle as any).photos) && (vehicle as any).photos.length > 0 ? (
                      <Badge variant="secondary" className="gap-1">
                        <Images className="h-3 w-3" />
                        {(vehicle as any).photos.length}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {vehicle.isPopular && <Badge variant="secondary">Popular</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(vehicle)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(vehicle.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
