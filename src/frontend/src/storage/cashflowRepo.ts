import { getAll, put, deleteById, deserializeFromStorage } from './indexedDb';
import { generateId } from './ids';
import { now } from './timestamps';
import type { CashflowEntry, CashflowInput, CashflowSummary } from '@/backend';

const BIGINT_FIELDS = ['id', 'createdAt', 'updatedAt'];

export async function listCashflowEntries(): Promise<CashflowEntry[]> {
  const raw = await getAll<any>('cashflowEntries');
  return raw.map(item => deserializeFromStorage<CashflowEntry>(item, BIGINT_FIELDS));
}

export async function addOrUpdateCashflowEntry(input: CashflowInput): Promise<bigint> {
  const id = input.id ?? await generateId('cashflowEntry');
  const timestamp = now();

  const entry: CashflowEntry = {
    id,
    description: input.description,
    amount: input.amount,
    entryType: input.entryType,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await put('cashflowEntries', entry);
  return id;
}

export async function deleteCashflowEntry(id: bigint): Promise<void> {
  await deleteById('cashflowEntries', id);
}

export async function getCashflowSummary(): Promise<CashflowSummary> {
  const entries = await listCashflowEntries();
  
  let totalCredit = 0;
  let totalDebit = 0;

  for (const entry of entries) {
    if (entry.entryType === 'credit') {
      totalCredit += entry.amount;
    } else {
      totalDebit += entry.amount;
    }
  }

  return {
    totalCredit,
    totalDebit,
    netBalance: totalCredit - totalDebit,
  };
}
