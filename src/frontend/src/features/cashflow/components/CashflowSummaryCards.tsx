import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatInr } from '@/utils/currency';

interface CashflowSummaryCardsProps {
  totalToCollect: number;
  totalToGive: number;
  netBalance: number;
}

export default function CashflowSummaryCards({
  totalToCollect,
  totalToGive,
  netBalance,
}: CashflowSummaryCardsProps) {
  const summaryItems = [
    {
      title: 'Total to Collect',
      value: totalToCollect,
      icon: TrendingUp,
      gradient: 'from-green-500/20 to-green-600/20',
      iconColor: 'text-green-500',
      textColor: 'text-green-500',
    },
    {
      title: 'Total to Give',
      value: totalToGive,
      icon: TrendingDown,
      gradient: 'from-red-500/20 to-red-600/20',
      iconColor: 'text-red-500',
      textColor: 'text-red-500',
    },
    {
      title: 'Net Balance',
      value: netBalance,
      icon: DollarSign,
      gradient: 'from-primary/20 to-accent/20',
      iconColor: netBalance >= 0 ? 'text-green-500' : 'text-red-500',
      textColor: netBalance >= 0 ? 'text-green-500' : 'text-red-500',
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {summaryItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.title} className={`bg-gradient-to-br ${item.gradient}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <Icon className={`h-4 w-4 ${item.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${item.textColor}`}>
                {formatInr(item.value)}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
