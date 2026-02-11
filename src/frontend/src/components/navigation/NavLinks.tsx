import { Link, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, Wallet, Building2, PiggyBank, ArrowLeftRight, TrendingUp, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/routes/paths';

interface NavLinksProps {
  onNavigate?: () => void;
}

const navItems = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { path: ROUTES.LENDING, label: 'Lending', icon: Wallet },
  { path: ROUTES.PROPERTIES, label: 'Properties', icon: Building2 },
  { path: ROUTES.NET_WORTH, label: 'Net Worth', icon: PiggyBank },
  { path: ROUTES.CASHFLOW, label: 'Cashflow', icon: ArrowLeftRight },
  { path: ROUTES.DAILY_PL, label: 'Daily P/L', icon: TrendingUp },
  { path: ROUTES.MPL, label: 'M(P/L)', icon: Trophy },
];

export default function NavLinks({ onNavigate }: NavLinksProps) {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        
        return (
          <Link key={item.path} to={item.path} onClick={onNavigate}>
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-2"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </>
  );
}
