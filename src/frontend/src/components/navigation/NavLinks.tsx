import { Link, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, Wallet, Building2, PiggyBank, ArrowLeftRight, TrendingUp, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavLinksProps {
  onNavigate?: () => void;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/lending', label: 'Lending', icon: Wallet },
  { path: '/properties', label: 'Properties', icon: Building2 },
  { path: '/net-worth', label: 'Net Worth', icon: PiggyBank },
  { path: '/cashflow', label: 'Cashflow', icon: ArrowLeftRight },
  { path: '/daily-profit-loss', label: 'Daily P/L', icon: TrendingUp },
  { path: '/match-pl', label: 'M(P/L)', icon: Trophy },
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
