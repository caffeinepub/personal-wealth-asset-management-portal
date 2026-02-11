import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppShell from './components/layout/AppShell';
import AuthGate from './components/auth/AuthGate';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import ExecutiveDashboardPage from './pages/ExecutiveDashboardPage';
import MoneyLendingPage from './pages/MoneyLendingPage';
import PropertyLedgerPage from './pages/PropertyLedgerPage';
import NetWorthPage from './pages/NetWorthPage';
import CashflowPage from './pages/CashflowPage';
import DailyProfitLossPage from './pages/DailyProfitLossPage';
import MatchProfitLossPage from './pages/MatchProfitLossPage';

const rootRoute = createRootRoute({
  component: () => (
    <AuthGate>
      <ProfileSetupDialog />
      <AppShell />
    </AuthGate>
  ),
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

const propertiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/properties',
  component: PropertyLedgerPage,
});

const netWorthRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/net-worth',
  component: NetWorthPage,
});

const cashflowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cashflow',
  component: CashflowPage,
});

const dailyPLRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/daily-profit-loss',
  component: DailyProfitLossPage,
});

const matchPLRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/match-pl',
  component: MatchProfitLossPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  lendingRoute,
  propertiesRoute,
  netWorthRoute,
  cashflowRoute,
  dailyPLRoute,
  matchPLRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
