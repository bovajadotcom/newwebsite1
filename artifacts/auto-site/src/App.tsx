import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { Layout } from "@/components/layout/Layout";
import { LanguageProvider } from "@/lib/i18n";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";
import { FavoritesProvider } from "@/lib/FavoritesContext";
import Favorites from "@/pages/favorites";
import Home from "@/pages/home";
import Inventory from "@/pages/inventory";
import Popular from "@/pages/popular";
import Services from "@/pages/services";
import Calculator from "@/pages/calculator";
import Business from "@/pages/business";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Articles from "@/pages/articles";
import Article from "@/pages/article";
import Careers from "@/pages/careers";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

const MODAL_PAGES: Record<string, string> = {
  "/": "home",
  "/inventory": "inventory",
  "/popular": "popular",
};

function PageModal() {
  const [location] = useLocation();
  const source = MODAL_PAGES[location];
  if (!source) return null;
  return <LeadCaptureModal source={source} />;
}

function Router() {
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/inventory" component={Inventory} />
        <Route path="/popular" component={Popular} />
        <Route path="/services" component={Services} />
        <Route path="/calculator" component={Calculator} />
        <Route path="/business" component={Business} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/articles" component={Articles} />
        <Route path="/articles/:slug" component={Article} />
        <Route path="/careers" component={Careers} />
        <Route path="/favorites" component={Favorites} />
        <Route component={NotFound} />
      </Switch>
      <PageModal />
    </>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <FavoritesProvider>
              <Layout>
                <Router />
              </Layout>
            </FavoritesProvider>
          </WouterRouter>
        </LanguageProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
