import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useGetMe } from "@workspace/api-client-react";
import AdminLayout from "@/components/layout/AdminLayout";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import VehiclesPage from "@/pages/vehicles";
import SoldVehiclesPage from "@/pages/sold-vehicles";
import PopularVehiclesPage from "@/pages/popular-vehicles";
import ServicesPage from "@/pages/services";
import PricingPage from "@/pages/pricing";
import TestimonialsPage from "@/pages/testimonials";
import TranslationsPage from "@/pages/translations";
import SettingsPage from "@/pages/settings";
import ArticlesPage from "@/pages/articles";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 30000,
    },
  },
});

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useGetMe();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="animate-pulse">Loading AutoImport CMS...</div>
      </div>
    );
  }

  if (error || !data) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route>
        <AuthGuard>
          <AdminLayout>
            <Switch>
              <Route path="/" component={DashboardPage} />
              <Route path="/vehicles" component={VehiclesPage} />
              <Route path="/sold-vehicles" component={SoldVehiclesPage} />
              <Route path="/popular-vehicles" component={PopularVehiclesPage} />
              <Route path="/services" component={ServicesPage} />
              <Route path="/pricing" component={PricingPage} />
              <Route path="/testimonials" component={TestimonialsPage} />
              <Route path="/articles" component={ArticlesPage} />
              <Route path="/translations" component={TranslationsPage} />
              <Route path="/settings" component={SettingsPage} />
              <Route component={NotFound} />
            </Switch>
          </AdminLayout>
        </AuthGuard>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
