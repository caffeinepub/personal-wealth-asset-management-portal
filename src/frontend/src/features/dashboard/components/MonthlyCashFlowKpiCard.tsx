import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { formatInr } from '@/utils/currency';

interface MonthlyCashFlowKpiCardProps {
  monthlyCashFlow: number;
}

export default function MonthlyCashFlowKpiCard({ monthlyCashFlow }: MonthlyCashFlowKpiCardProps) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Monthly Cash Flow</CardTitle>
        <TrendingUp className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-primary">
          {formatInr(monthlyCashFlow)}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          From interest income
        </p>
      </CardContent>
    </Card>
  );
}
