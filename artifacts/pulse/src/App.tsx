import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import Home from '@/pages/home';
import Register from '@/pages/register';
import Dashboard from '@/pages/dashboard';
import Knowledge from '@/pages/knowledge';
import FacilitiesPage from '@/pages/facilities';
import { Navbar } from '@/components/navbar';
import { DemoPanel } from '@/components/demo-panel';
import { type Donor } from '@workspace/api-client-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router({ donor, onDonorComplete }: { donor: Donor | null; onDonorComplete: (d: Donor) => void }) {
  return (
    <RoutedErrorBoundary>
      <>
        <Navbar donor={donor} />
        <Switch>
          <Route path="/">{() => <Home onDonorFound={onDonorComplete} />}</Route>
          <Route path="/register">
            <Register onComplete={onDonorComplete} />
          </Route>
          <Route path="/dashboard">
            <Dashboard donor={donor} onDonorFound={onDonorComplete} />
          </Route>
          <Route path="/knowledge" component={Knowledge} />
          <Route path="/facilities" component={FacilitiesPage} />
          <Route component={NotFound} />
        </Switch>
        <DemoPanel />
      </>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  const [donor, setDonor] = useState<Donor | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router donor={donor} onDonorComplete={setDonor} />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
