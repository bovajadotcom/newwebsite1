import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetSoldVehicles,
  useCreateSoldVehicle,
  useUpdateSoldVehicle,
  useDeleteSoldVehicle,
  getGetSoldVehiclesQueryKey,
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
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Pencil, Trash2 } from "lucide-react";

const soldVehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1900),
  finalPrice: z.coerce.number().nullable().optional(),
  purchaseCountry: z.string().min(1, "Purchase country is required"),
  deliveryStatus: z.string().min(1, "Delivery status is required"),
  deliveryDate: z.string().nullable().optional(),
  imageUrl: z.string().url("Valid image URL is required"),
});

type SoldVehicleFormValues = z.infer<typeof soldVehicleSchema>;

export default function SoldVehiclesPage() {
  const { data: soldVehicles, isLoading } = useGetSoldVehicles();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const createMutation = useCreateSoldVehicle();
  const updateMutation = useUpdateSoldVehicle();
  const deleteMutation = useDeleteSoldVehicle();

  const form = useForm<SoldVehicleFormValues>({
    resolver: zodResolver(soldVehicleSchema),
    defaultValues: {
      make: "",
      model: "",
      year: new Date().getFullYear(),
      finalPrice: null,
      purchaseCountry: "",
      deliveryStatus: "Delivered",
      deliveryDate: null,
      imageUrl: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=800",
    },
  });

  const onSubmit = async (values: SoldVehicleFormValues) => {
    try {
      if (editingVehicle) {
        await updateMutation.mutateAsync({
          id: editingVehicle.id,
          data: values,
        });
        toast({ title: "Sold vehicle updated successfully" });
      } else {
        await createMutation.mutateAsync({ data: values });
        toast({ title: "Sold vehicle record created" });
      }
      queryClient.invalidateQueries({ queryKey: getGetSoldVehiclesQueryKey() });
      setIsDialogOpen(false);
      setEditingVehicle(null);
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
    form.reset({
      ...vehicle,
      finalPrice: vehicle.finalPrice ?? null,
      deliveryDate: vehicle.deliveryDate ?? null,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast({ title: "Record deleted" });
        queryClient.invalidateQueries({ queryKey: getGetSoldVehiclesQueryKey() });
      } catch (error: any) {
        toast({ variant: "destructive", title: "Error", description: "Delete failed" });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sold Vehicles</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) { setEditingVehicle(null); form.reset(); }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Record</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingVehicle ? "Edit Record" : "Add Sold Vehicle"}</DialogTitle>
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="year" render={({ field }) => (
                    <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="finalPrice" render={({ field }) => (
                    <FormItem><FormLabel>Final Price (€)</FormLabel><FormControl><Input type="number" {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="purchaseCountry" render={({ field }) => (
                  <FormItem><FormLabel>Purchase Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="deliveryStatus" render={({ field }) => (
                  <FormItem><FormLabel>Delivery Status</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="deliveryDate" render={({ field }) => (
                  <FormItem><FormLabel>Delivery Date (Optional)</FormLabel><FormControl><Input {...field} value={field.value || ""} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="imageUrl" render={({ field }) => (
                  <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
              <TableHead>Year</TableHead>
              <TableHead>Final Price</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : soldVehicles?.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">{v.make} {v.model}</TableCell>
                <TableCell>{v.year}</TableCell>
                <TableCell>{v.finalPrice ? `€${v.finalPrice.toLocaleString()}` : "-"}</TableCell>
                <TableCell>{v.purchaseCountry}</TableCell>
                <TableCell>{v.deliveryStatus}</TableCell>
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
