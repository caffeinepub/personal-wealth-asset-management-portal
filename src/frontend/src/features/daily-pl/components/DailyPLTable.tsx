import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatInr } from '@/utils/currency';
import type { DaywiseSummary } from '@/backend';

interface DailyPLTableProps {
  dailySummaries: DaywiseSummary[];
}

export default function DailyPLTable({ dailySummaries }: DailyPLTableProps) {
  const formatDate = (dayTimestamp: bigint) => {
    // dayTimestamp is in days since epoch, convert to milliseconds
    const date = new Date(Number(dayTimestamp) * 24 * 60 * 60 * 1000);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  if (dailySummaries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Profit/Loss Report</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No cashflow data available. Add cashflow entries to see daily reports.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort by date descending (most recent first)
  const sortedSummaries = [...dailySummaries].sort((a, b) => 
    Number(b.date) - Number(a.date)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Profit/Loss Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Collected</TableHead>
                <TableHead className="text-right">Given</TableHead>
                <TableHead className="text-right">Net P/L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSummaries.map((summary, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {formatDate(summary.date)}
                  </TableCell>
                  <TableCell className="text-right text-green-500">
                    {formatInr(summary.totalCredit)}
                  </TableCell>
                  <TableCell className="text-right text-red-500">
                    {formatInr(summary.totalDebit)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${
                      summary.netProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {formatInr(summary.netProfitLoss)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
