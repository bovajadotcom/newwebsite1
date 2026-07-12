import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Car,
  CheckCircle,
  Star,
  Settings2,
  CreditCard,
  MessageSquare,
  Languages,
  Sliders,
  LogOut,
  User,
  Newspaper,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface SidebarItemProps {
  href: string;
  icon: any;
  title: string;
  active: boolean;
}

function SidebarItem({ href, icon: Icon, title, active }: SidebarItemProps) {
  return (
    <Link href={href}>
      <a
        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
          active
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{title}</span>
      </a>
    </Link>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/", icon: LayoutDashboard, title: "Dashboard" },
    { href: "/vehicles", icon: Car, title: "Vehicles" },
    { href: "/sold-vehicles", icon: CheckCircle, title: "Sold Vehicles" },
    { href: "/popular-vehicles", icon: Star, title: "Popular Vehicles" },
    { href: "/services", icon: Settings2, title: "Services" },
    { href: "/pricing", icon: CreditCard, title: "Pricing" },
    { href: "/testimonials", icon: MessageSquare, title: "Testimonials" },
    { href: "/articles", icon: Newspaper, title: "Articles" },
    { href: "/careers", icon: Briefcase, title: "Careers" },
    { href: "/translations", icon: Languages, title: "Translations" },
    { href: "/settings", icon: Sliders, title: "Site Settings" },
  ];

  const getPageTitle = () => {
    const current = navItems.find((item) => item.href === location);
    return current ? current.title : "AutoImport CMS";
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden dark">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-sidebar-foreground">AutoImport CMS</h1>
        </div>
        <Separator className="bg-sidebar-border" />
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <SidebarItem
                key={item.href}
                {...item}
                active={location === item.href}
              />
            ))}
          </nav>
        </ScrollArea>
        <Separator className="bg-sidebar-border" />
        <div className="p-4 bg-sidebar-accent/50">
          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.username || "Admin"}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate uppercase">
                {user?.role || "Administrator"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive gap-3"
            onClick={logout}
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border flex items-center px-8 bg-card">
          <h2 className="text-xl font-semibold text-card-foreground">
            {getPageTitle()}
          </h2>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
