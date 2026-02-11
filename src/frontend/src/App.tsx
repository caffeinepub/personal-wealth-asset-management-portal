import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import AppShell from '@/components/layout/AppShell';
import AuthGate from '@/components/auth/AuthGate';
import ProfileSetupDialog from '@/components/auth/ProfileSetupDialog';
import IndexedDbGuard from '@/components/storage/IndexedDbGuard';
import ExecutiveDashboardPage from '@/pages/ExecutiveDashboardPage';
import MoneyLendingPage from '@/pages/MoneyLendingPage';
import PropertyLedgerPage from '@/pages/PropertyLedgerPage';
import NetWorthPage from '@/pages/NetWorthPage';
import CashflowPage from '@/pages/CashflowPage';
import DailyProfitLossPage from '@/pages/DailyProfitLossPage';
import MatchProfitLossPage from '@/pages/MatchProfitLossPage';
import { registerServiceWorker } from '@/pwa/registerServiceWorker';
import { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const rootRoute = createRootRoute({
  component: AppShell,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ExecutiveDashboardPage,
});

const lendingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lending',
  component: MoneyLendingPage,
});

const propertyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/property',
  component: PropertyLedgerPage,
});

const networthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/networth',
  component: NetWorthPage,
});

const cashflowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cashflow',
  component: CashflowPage,
});

const dailyPlRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/daily-pl',
  component: DailyProfitLossPage,
});

const mplRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mpl',
  component: MatchProfitLossPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  lendingRoute,
  propertyRoute,
  networthRoute,
  cashflowRoute,
  dailyPlRoute,
  mplRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <IndexedDbGuard>
          <AuthGate>
            <ProfileSetupDialog />
            <RouterProvider router={router} />
            <Toaster />
          </AuthGate>
        </IndexedDbGuard>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
