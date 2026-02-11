import { getAll, put, deleteById } from './indexedDb';
import { generateId } from './ids';
import { now } from './timestamps';
import type { Loan, LoanInput } from '@/backend';

export async function listLoans(): Promise<Loan[]> {
  return getAll<Loan>('loans');
}

export async function addOrUpdateLoan(input: LoanInput): Promise<bigint> {
  const id = input.id ?? await generateId('loan');
  const timestamp = now();

  const loan: Loan = {
    id,
    borrowerName: input.borrowerName,
    collateral: input.collateral,
    termMonthly: input.termMonthly,
    loanTenure: input.loanTenure,
    interestRate: input.interestRate,
    principal: input.principal,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await put('loans', loan);
  return id;
}

export async function deleteLoan(id: bigint): Promise<void> {
  await deleteById('loans', id);
}
