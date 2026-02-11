import { listCashflowEntries } from './cashflowRepo';
import type { DailyReport, DaywiseSummary } from '@/backend';

// Microseconds per day (not nanoseconds)
const MICROSECONDS_PER_DAY = BigInt(24 * 60 * 60 * 1000000);

export async function generateDailyReport(): Promise<DailyReport> {
  const entries = await listCashflowEntries();

  // Group entries by day
  const dayMap = new Map<string, typeof entries>();

  for (const entry of entries) {
    // Convert microsecond timestamp to day number
    const dayTimestamp = entry.createdAt / MICROSECONDS_PER_DAY;
    const dayKey = dayTimestamp.toString();
    
    if (!dayMap.has(dayKey)) {
      dayMap.set(dayKey, []);
    }
    dayMap.get(dayKey)!.push(entry);
  }

  // Calculate daily summaries
  const dailySummaries: DaywiseSummary[] = [];
  
  for (const [dayKey, dayEntries] of dayMap.entries()) {
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
      date: BigInt(dayKey),
      totalCredit,
      totalDebit,
      netProfitLoss: totalCredit - totalDebit,
    });
  }

  // Sort by date descending
  dailySummaries.sort((a, b) => Number(b.date - a.date));

  return { dailySummaries };
}
