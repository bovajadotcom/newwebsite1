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
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Pencil, Trash2 } from "lucide-react";

const popularVehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  priceRange: z.string().min(1, "Price range is required"),
  estimatedDelivery: z.string().min(1, "Estimated delivery is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Valid image URL is required"),
  sortOrder: z.coerce.number().default(0),
});

type PopularVehicleFormValues = z.infer<typeof popularVehicleSchema>;

export default function PopularVehiclesPage() {
  const { data: popularVehicles, isLoading } = useGetPopularVehicles();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const createMutation = useCreatePopularVehicle();
  const updateMutation = useUpdatePopularVehicle();
  const deleteMutation = useDeletePopularVehicle();

  const form = useForm<PopularVehicleFormValues>({
    resolver: zodResolver(popularVehicleSchema),
    defaultValues: {
      make: "",
      model: "",
      priceRange: "",
      estimatedDelivery: "",
      description: "",
      imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800",
      sortOrder: 0,
    },
  });

  const onSubmit = async (values: PopularVehicleFormValues) => {
    try {
      if (editingVehicle) {
        await updateMutation.mutateAsync({
          id: editingVehicle.id,
          data: values,
        });
        toast({ title: "Popular vehicle updated" });
      } else {
        await createMutation.mutateAsync({ data: values });
        toast({ title: "Popular vehicle added" });
      }
      queryClient.invalidateQueries({ queryKey: getGetPopularVehiclesQueryKey() });
      setIsDialogOpen(false);
      setEditingVehicle(null);
      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Operation failed",
      });
    }
  };

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    form.reset(vehicle);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast({ title: "Deleted successfully" });
        queryClient.invalidateQueries({ queryKey: getGetPopularVehiclesQueryKey() });
      } catch (error: any) {
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
          if (!open) { setEditingVehicle(null); form.reset(); }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Vehicle</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingVehicle ? "Edit Popular Vehicle" : "Add Popular Vehicle"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="make" render={({ field }) => (
                    <FormItem><FormLabel>Make</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="model" render={({ field }) => (
                    <FormItem><FormLabel>Model</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="priceRange" render={({ field }) => (
                  <FormItem><FormLabel>Price Range</FormLabel><FormControl><Input placeholder="e.g. €25,000 - €35,000" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="estimatedDelivery" render={({ field }) => (
                  <FormItem><FormLabel>Estimated Delivery</FormLabel><FormControl><Input placeholder="e.g. 2-3 weeks" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sortOrder" render={({ field }) => (
                  <FormItem><FormLabel>Sort Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
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
              <TableHead>Price Range</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : popularVehicles?.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.make} {v.model}</TableCell>
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
