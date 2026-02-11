import { useNetWorthSummary } from '@/features/networth/api';
import WealthInputsFormCard from '@/features/networth/components/WealthInputsFormCard';
import NetWorthSummaryCards from '@/features/networth/components/NetWorthSummaryCards';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function NetWorthPage() {
  const { data: summary, isLoading } = useNetWorthSummary();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">Unable to load net worth data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Total Wealth & Net Worth</h1>
        <p className="text-muted-foreground mt-1">
          Aggregate view of your complete financial portfolio
        </p>
      </div>

      <NetWorthSummaryCards
        netWorth={summary.netWorth}
        propertyValue={summary.propertyValue}
        lendingPortfolio={summary.lendingPortfolio}
        wealthInputsTotal={summary.wealthInputsTotal}
      />

      <WealthInputsFormCard />
    </div>
  );
}
