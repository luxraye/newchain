import { type ReactNode, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import { Sidebar } from '@/components/layout';
import { DemoPanel } from '@/components/demo-panel';

// Pages
import Overview from '@/pages/overview';
import LogUnit from '@/pages/log-unit';
import Transfers from '@/pages/transfers';
import Ledger from '@/pages/ledger';

const queryClient = new QueryClient();

function Router({ facilityId }: { facilityId: string }) {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={() => <Overview facilityId={facilityId} />} />
        <Route path="/log" component={() => <LogUnit facilityId={facilityId} />} />
        <Route path="/transfers" component={() => <Transfers facilityId={facilityId} />} />
        <Route path="/ledger" component={() => <Ledger facilityId={facilityId} />} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  const [facilityId, setFacilityId] = useState("FAC-001");
  
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <div className="flex h-[100dvh] w-full bg-background text-foreground overflow-hidden font-sans">
            <div className="scanlines" />
            <Sidebar facilityId={facilityId} setFacilityId={setFacilityId} />
            <main className="flex-1 h-full overflow-y-auto relative bg-[#06090e]">
              <Router facilityId={facilityId} />
            </main>
            <DemoPanel />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
