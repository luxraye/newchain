import { type ReactNode, useState } from 'react';
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

import { Layout } from '@/components/layout';
import Dashboard from '@/pages/dashboard';
import Worklist from '@/pages/worklist';
import UnitDetail from '@/pages/unit-detail';
import Ledger from '@/pages/ledger';

const queryClient = new QueryClient();

function Router({ facilityId }: { facilityId: string }) {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={() => <Dashboard facilityId={facilityId} />} />
        <Route path="/worklist" component={() => <Worklist facilityId={facilityId} />} />
        <Route path="/units/:unitId" component={() => <UnitDetail facilityId={facilityId} />} />
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

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Layout facilityId={facilityId} setFacilityId={setFacilityId}>
            <Router facilityId={facilityId} />
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
