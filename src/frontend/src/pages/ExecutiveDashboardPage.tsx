import { useDashboardOverview } from '@/features/dashboard/api';
import WealthOverviewDonut from '@/features/dashboard/components/WealthOverviewDonut';
import QuickActions from '@/features/dashboard/components/QuickActions';
import MonthlyCashFlowKpiCard from '@/features/dashboard/components/MonthlyCashFlowKpiCard';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function ExecutiveDashboardPage() {
  const { data: overview, isLoading } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!overview) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-center text-muted-foreground">Unable to load dashboard data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Your comprehensive wealth overview at a glance
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MonthlyCashFlowKpiCard monthlyCashFlow={overview.monthlyCashFlow} />
        </div>
        <QuickActions />
      </div>

      <WealthOverviewDonut
        propertyValue={overview.propertyValue}
        lendingPortfolio={overview.lendingPortfolio}
        wealthInputsTotal={overview.wealthInputsTotal}
      />
    </div>
  );
}
