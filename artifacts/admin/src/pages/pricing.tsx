import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetPricingPackages,
  useCreatePricingPackage,
  useUpdatePricingPackage,
  useDeletePricingPackage,
  getGetPricingPackagesQueryKey,
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Pencil, Trash2 } from "lucide-react";

const pricingSchema = z.object({
  nameEn: z.string().min(1, "Name EN is required"),
  namePl: z.string().min(1, "Name PL is required"),
  nameRu: z.string().min(1, "Name RU is required"),
  price: z.coerce.number().min(0),
  currency: z.string().default("EUR"),
  features: z.string().min(1, "Features are required"),
  isPopular: z.boolean().default(false),
  sortOrder: z.coerce.number().default(0),
});

type PricingFormValues = z.infer<typeof pricingSchema>;

export default function PricingPage() {
  const { data: packages, isLoading } = useGetPricingPackages();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const createMutation = useCreatePricingPackage();
  const updateMutation = useUpdatePricingPackage();
  const deleteMutation = useDeletePricingPackage();

  const form = useForm<PricingFormValues>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      nameEn: "",
      namePl: "",
      nameRu: "",
      price: 0,
      currency: "EUR",
      features: "",
      isPopular: false,
      sortOrder: 0,
    },
  });

  const onSubmit = async (values: PricingFormValues) => {
    try {
      const payload = {
        ...values,
        features: values.features.split("\n").filter(f => f.trim() !== ""),
      };
      if (editingPackage) {
        await updateMutation.mutateAsync({
          id: editingPackage.id,
          data: payload,
        });
        toast({ title: "Package updated" });
      } else {
        await createMutation.mutateAsync({ data: payload });
        toast({ title: "Package created" });
      }
      queryClient.invalidateQueries({ queryKey: getGetPricingPackagesQueryKey() });
      setIsDialogOpen(false);
      setEditingPackage(null);
      form.reset();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Operation failed" });
    }
  };

  const handleEdit = (pkg: any) => {
    setEditingPackage(pkg);
    form.reset({
      ...pkg,
      features: Array.isArray(pkg.features) ? pkg.features.join("\n") : "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast({ title: "Package deleted" });
        queryClient.invalidateQueries({ queryKey: getGetPricingPackagesQueryKey() });
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Delete failed" });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Pricing Packages</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) { setEditingPackage(null); form.reset(); }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Package</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPackage ? "Edit Package" : "Add Package"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <FormField control={form.control} name="nameEn" render={({ field }) => (
                    <FormItem><FormLabel>Name EN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="namePl" render={({ field }) => (
                    <FormItem><FormLabel>Name PL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="nameRu" render={({ field }) => (
                    <FormItem><FormLabel>Name RU</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="currency" render={({ field }) => (
                    <FormItem><FormLabel>Currency</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="features" render={({ field }) => (
                  <FormItem><FormLabel>Features (One per line)</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4 items-center">
                  <FormField control={form.control} name="isPopular" render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                      <FormLabel>Mark as Popular</FormLabel>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="sortOrder" render={({ field }) => (
                    <FormItem><FormLabel>Sort Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
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
              <TableHead>Name EN</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Popular</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : packages?.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.nameEn}</TableCell>
                <TableCell>{p.price} {p.currency}</TableCell>
                <TableCell>{p.isPopular && <Badge>Popular</Badge>}</TableCell>
                <TableCell>{p.sortOrder}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(p)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
