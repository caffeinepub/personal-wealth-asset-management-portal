import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Building2, Wallet, PiggyBank } from 'lucide-react';
import { formatInr } from '@/utils/currency';

interface NetWorthSummaryCardsProps {
  netWorth: number;
  propertyValue: number;
  lendingPortfolio: number;
  wealthInputsTotal: number;
}

export default function NetWorthSummaryCards({
  netWorth,
  propertyValue,
  lendingPortfolio,
  wealthInputsTotal,
}: NetWorthSummaryCardsProps) {
  const summaryItems = [
    {
      title: 'Total Net Worth',
      value: netWorth,
      icon: TrendingUp,
      gradient: 'from-primary/20 to-accent/20',
      iconColor: 'text-primary',
    },
    {
      title: 'Property Value',
      value: propertyValue,
      icon: Building2,
      gradient: 'from-chart-3/20 to-chart-4/20',
      iconColor: 'text-chart-3',
    },
    {
      title: 'Lending Portfolio',
      value: lendingPortfolio,
      icon: Wallet,
      gradient: 'from-accent/20 to-chart-2/20',
      iconColor: 'text-accent',
    },
    {
      title: 'Wealth Inputs',
      value: wealthInputsTotal,
      icon: PiggyBank,
      gradient: 'from-chart-4/20 to-chart-5/20',
      iconColor: 'text-chart-4',
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {summaryItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className={`bg-gradient-to-br ${item.gradient}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <Icon className={`h-4 w-4 ${item.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatInr(item.value)}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
