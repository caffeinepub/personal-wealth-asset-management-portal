import { listCashflowEntries } from './cashflowRepo';
import type { DailyReport, DaywiseSummary } from '@/backend';

export async function generateDailyReport(): Promise<DailyReport> {
  const entries = await listCashflowEntries();

  // Group entries by day
  const dayMap = new Map<number, typeof entries>();

  for (const entry of entries) {
    const dayTimestamp = Number(entry.createdAt / BigInt(24 * 60 * 60 * 1000000000));
    if (!dayMap.has(dayTimestamp)) {
      dayMap.set(dayTimestamp, []);
    }
    dayMap.get(dayTimestamp)!.push(entry);
  }

  // Calculate daily summaries
  const dailySummaries: DaywiseSummary[] = [];
  
  for (const [day, dayEntries] of dayMap.entries()) {
    let totalCredit = 0;
    let totalDebit = 0;

    for (const entry of dayEntries) {
      if (entry.entryType === 'credit') {
        totalCredit += entry.amount;
      } else {
        totalDebit += entry.amount;
      }
    }

    dailySummaries.push({
      date: BigInt(day),
      totalCredit,
      totalDebit,
      netProfitLoss: totalCredit - totalDebit,
    });
  }

  // Sort by date descending
  dailySummaries.sort((a, b) => Number(b.date - a.date));

  return { dailySummaries };
}
