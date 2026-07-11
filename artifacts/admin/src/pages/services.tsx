import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  getGetServicesQueryKey,
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

const serviceSchema = z.object({
  iconName: z.string().min(1, "Icon name is required"),
  titleEn: z.string().min(1, "Title EN is required"),
  titlePl: z.string().min(1, "Title PL is required"),
  titleRu: z.string().min(1, "Title RU is required"),
  descriptionEn: z.string().min(1, "Description EN is required"),
  descriptionPl: z.string().min(1, "Description PL is required"),
  descriptionRu: z.string().min(1, "Description RU is required"),
  sortOrder: z.coerce.number().default(0),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function ServicesPage() {
  const { data: services, isLoading } = useGetServices();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingService, setEditingService] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      iconName: "",
      titleEn: "",
      titlePl: "",
      titleRu: "",
      descriptionEn: "",
      descriptionPl: "",
      descriptionRu: "",
      sortOrder: 0,
    },
  });

  const onSubmit = async (values: ServiceFormValues) => {
    try {
      if (editingService) {
        await updateMutation.mutateAsync({
          id: editingService.id,
          data: values,
        });
        toast({ title: "Service updated" });
      } else {
        await createMutation.mutateAsync({ data: values });
        toast({ title: "Service created" });
      }
      queryClient.invalidateQueries({ queryKey: getGetServicesQueryKey() });
      setIsDialogOpen(false);
      setEditingService(null);
      form.reset();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: "Operation failed" });
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    form.reset(service);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast({ title: "Service deleted" });
        queryClient.invalidateQueries({ queryKey: getGetServicesQueryKey() });
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Delete failed" });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Services</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) { setEditingService(null); form.reset(); }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Service</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingService ? "Edit Service" : "Add Service"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="iconName" render={({ field }) => (
                  <FormItem><FormLabel>Icon Name (Lucide)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-3 gap-4">
                  <FormField control={form.control} name="titleEn" render={({ field }) => (
                    <FormItem><FormLabel>Title EN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="titlePl" render={({ field }) => (
                    <FormItem><FormLabel>Title PL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="titleRu" render={({ field }) => (
                    <FormItem><FormLabel>Title RU</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <FormField control={form.control} name="descriptionEn" render={({ field }) => (
                    <FormItem><FormLabel>Description EN</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="descriptionPl" render={({ field }) => (
                    <FormItem><FormLabel>Description PL</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="descriptionRu" render={({ field }) => (
                    <FormItem><FormLabel>Description RU</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
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
              <TableHead>Icon</TableHead>
              <TableHead>Title EN</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow>
            ) : services?.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.iconName}</TableCell>
                <TableCell>{s.titleEn}</TableCell>
                <TableCell>{s.sortOrder}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(s)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
