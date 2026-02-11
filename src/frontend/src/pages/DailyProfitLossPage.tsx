import DailyPLTable from '@/features/daily-pl/components/DailyPLTable';
import { useGenerateDailyReport } from '@/features/daily-pl/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatInr } from '@/utils/currency';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function DailyProfitLossPage() {
  const { data: report, isLoading } = useGenerateDailyReport();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading daily report...</p>
        </div>
      </div>
    );
  }

  // Calculate overall totals
  const overallCollected = report?.dailySummaries.reduce((sum, day) => sum + day.totalCredit, 0) || 0;
  const overallGiven = report?.dailySummaries.reduce((sum, day) => sum + day.totalDebit, 0) || 0;
  const overallNet = overallCollected - overallGiven;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Daily Profit/Loss</h1>
        <p className="text-muted-foreground mt-2">
          Daily breakdown of cashflow entries
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {formatInr(overallCollected)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/20 to-red-600/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Given</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {formatInr(overallGiven)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/20 to-accent/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Net</CardTitle>
            <TrendingUp className={`h-4 w-4 ${overallNet >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${overallNet >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatInr(overallNet)}
            </div>
          </CardContent>
        </Card>
      </div>

      {report && <DailyPLTable dailySummaries={report.dailySummaries} />}
    </div>
  );
}
