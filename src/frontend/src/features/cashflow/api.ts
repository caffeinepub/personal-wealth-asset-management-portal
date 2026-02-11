import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/queryKeys';
import { invalidateCashflow } from '@/queryInvalidation';
import { listCashflowEntries, addOrUpdateCashflowEntry, deleteCashflowEntry, getCashflowSummary } from '@/storage/cashflowRepo';
import type { CashflowEntry, CashflowInput, CashflowSummary } from '@/backend';

export function useListCashflowEntries() {
  return useQuery<CashflowEntry[]>({
    queryKey: queryKeys.cashflow.list(),
    queryFn: async () => {
      return listCashflowEntries();
    },
  });
}

export function useGetCashflowSummary() {
  return useQuery<CashflowSummary>({
    queryKey: queryKeys.cashflow.summary(),
    queryFn: async () => {
      return getCashflowSummary();
    },
  });
}

export function useAddOrUpdateCashflowEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CashflowInput) => {
      return addOrUpdateCashflowEntry(input);
    },
    onSuccess: () => {
      invalidateCashflow(queryClient);
    },
  });
}

export function useDeleteCashflowEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      await deleteCashflowEntry(id);
    },
    onSuccess: () => {
      invalidateCashflow(queryClient);
    },
  });
}
