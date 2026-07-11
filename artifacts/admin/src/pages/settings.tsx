import { useQueryClient } from "@tanstack/react-query";
import {
  useGetSiteSettings,
  useUpdateSiteSetting,
  getGetSiteSettingsQueryKey,
} from "@workspace/api-client-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { data: settings, isLoading } = useGetSiteSettings();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const updateMutation = useUpdateSiteSetting();

  const handleBlur = async (key: string, value: string) => {
    try {
      await updateMutation.mutateAsync({
        key,
        data: { value: String(value) },
      });
      queryClient.invalidateQueries({ queryKey: getGetSiteSettingsQueryKey() });
    } catch (error) {
      toast({ variant: "destructive", title: "Save failed" });
    }
  };

  const getSuffix = (key: string) => {
    if (key.endsWith("_rate") || key.endsWith("vat")) return "%";
    if (key.startsWith("calculator.")) return "EUR";
    return "";
  };

  if (isLoading) return <div>Loading settings...</div>;

  const groupedSettings = settings?.reduce((acc: Record<string, any[]>, s: any) => {
    const group = s.group || "general";
    if (!acc[group]) acc[group] = [];
    acc[group].push(s);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-8">
      {groupedSettings && Object.entries(groupedSettings).map(([group, items]: [string, any]) => (
        <Card key={group}>
          <CardHeader>
            <CardTitle className="capitalize">{group} Settings</CardTitle>
            <CardDescription>Manage your site's {group} configuration</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            {items.map((setting: any) => (
              <div key={setting.key} className="grid gap-2">
                <Label htmlFor={setting.key}>{setting.label || setting.key}</Label>
                <div className="relative">
                  <Input
                    id={setting.key}
                    type={setting.group === "calculator" ? "number" : "text"}
                    defaultValue={setting.value}
                    onBlur={(e) => handleBlur(setting.key, e.target.value)}
                  />
                  {getSuffix(setting.key) && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground pointer-events-none">
                      {getSuffix(setting.key)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
