import { listCashflowEntries } from './cashflowRepo';
import type { DailyReport, DaywiseSummary } from '@/backend';

export async function generateDailyReport(): Promise<DailyReport> {
  const entries = await listCashflowEntries();

  // Group by day
  const dayMap = new Map<number, { credit: number; debit: number }>();

  for (const entry of entries) {
    const dayTimestamp = Number(entry.createdAt / BigInt(24 * 60 * 60 * 1000000000));
    
    if (!dayMap.has(dayTimestamp)) {
      dayMap.set(dayTimestamp, { credit: 0, debit: 0 });
    }

    const day = dayMap.get(dayTimestamp)!;
    if (entry.entryType === 'credit') {
      day.credit += entry.amount;
    } else {
      day.debit += entry.amount;
    }
  }

  const dailySummaries: DaywiseSummary[] = Array.from(dayMap.entries())
    .map(([dayTimestamp, totals]) => ({
      date: BigInt(dayTimestamp),
      totalCredit: totals.credit,
      totalDebit: totals.debit,
      netProfitLoss: totals.credit - totals.debit,
    }))
    .sort((a, b) => Number(a.date - b.date));

  return { dailySummaries };
}
