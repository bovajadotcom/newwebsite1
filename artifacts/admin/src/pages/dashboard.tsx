import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  useGetVehicles, 
  useGetSoldVehicles, 
  useGetServices, 
  useGetAllTestimonials 
} from "@workspace/api-client-react";
import { 
  Car, 
  CheckCircle, 
  Settings2, 
  MessageSquare,
  Star,
  CreditCard,
  Languages,
  Sliders
} from "lucide-react";
import { Link } from "wouter";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: any;
  description: string;
  color: string;
}

function StatCard({ title, value, icon: Icon, description, color }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: vehicles } = useGetVehicles();
  const { data: soldVehicles } = useGetSoldVehicles();
  const { data: services } = useGetServices();
  const { data: testimonials } = useGetAllTestimonials();

  const quickLinks = [
    { name: "Vehicles", href: "/vehicles", icon: Car },
    { name: "Sold Vehicles", href: "/sold-vehicles", icon: CheckCircle },
    { name: "Popular", href: "/popular-vehicles", icon: Star },
    { name: "Services", href: "/services", icon: Settings2 },
    { name: "Pricing", href: "/pricing", icon: CreditCard },
    { name: "Testimonials", href: "/testimonials", icon: MessageSquare },
    { name: "Translations", href: "/translations", icon: Languages },
    { name: "Settings", href: "/settings", icon: Sliders },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Vehicles"
          value={vehicles?.length || 0}
          icon={Car}
          description="Active inventory"
          color="text-blue-500"
        />
        <StatCard
          title="Sold Vehicles"
          value={soldVehicles?.length || 0}
          icon={CheckCircle}
          description="Successfully delivered"
          color="text-green-500"
        />
        <StatCard
          title="Services"
          value={services?.length || 0}
          icon={Settings2}
          description="Service offerings"
          color="text-purple-500"
        />
        <StatCard
          title="Testimonials"
          value={testimonials?.length || 0}
          icon={MessageSquare}
          description="Customer reviews"
          color="text-orange-500"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Quick Access</h3>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a className="flex flex-col items-center justify-center p-4 bg-card hover:bg-accent border border-border rounded-lg transition-colors text-center gap-2 group">
                <link.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium">{link.name}</span>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
