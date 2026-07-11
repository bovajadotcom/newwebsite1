import { useQueryClient } from "@tanstack/react-query";
import {
  useGetPageContent,
  useUpdatePageContent,
  getGetPageContentQueryKey,
} from "@workspace/api-client-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function TranslationsPage() {
  const { data: content, isLoading } = useGetPageContent();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const updateMutation = useUpdatePageContent();

  const handleBlur = async (page: string, key: string, values: { en: string; pl: string; ru: string }) => {
    try {
      await updateMutation.mutateAsync({
        page,
        key,
        data: {
          valueEn: values.en,
          valuePl: values.pl,
          valueRu: values.ru,
        },
      });
      // Silent update toast or no toast for better UX
      queryClient.invalidateQueries({ queryKey: getGetPageContentQueryKey() });
    } catch (error) {
      toast({ variant: "destructive", title: "Save failed", description: `Failed to save ${key}` });
    }
  };

  if (isLoading) return <div>Loading content...</div>;
  if (!content || content.length === 0) return <div>No page content found.</div>;

  const groupedContent = content.reduce((acc: any, item) => {
    if (!acc[item.page]) acc[item.page] = [];
    acc[item.page].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Accordion type="multiple" className="w-full space-y-4">
        {Object.entries(groupedContent).map(([page, items]: [string, any]) => (
          <AccordionItem key={page} value={page} className="border rounded-lg bg-card px-4">
            <AccordionTrigger className="hover:no-underline py-4">
              <span className="text-lg font-semibold uppercase">{page}</span>
            </AccordionTrigger>
            <AccordionContent className="pb-6 space-y-8">
              {items.map((item: any) => (
                <div key={item.sectionKey} className="space-y-3">
                  <div className="font-medium text-sm text-primary">{item.sectionKey}</div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase text-muted-foreground">English</Label>
                      <Textarea
                        defaultValue={item.valueEn}
                        onBlur={(e) => handleBlur(page, item.sectionKey, { en: e.target.value, pl: item.valuePl, ru: item.valueRu })}
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase text-muted-foreground">Polish</Label>
                      <Textarea
                        defaultValue={item.valuePl}
                        onBlur={(e) => handleBlur(page, item.sectionKey, { en: item.valueEn, pl: e.target.value, ru: item.valueRu })}
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs uppercase text-muted-foreground">Russian</Label>
                      <Textarea
                        defaultValue={item.valueRu}
                        onBlur={(e) => handleBlur(page, item.sectionKey, { en: item.valueEn, pl: item.valuePl, ru: e.target.value })}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
