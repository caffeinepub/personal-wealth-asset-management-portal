import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import { queryKeys } from '@/queryKeys';
import { invalidateCashflow } from '@/queryInvalidation';
import type { CashflowEntry, CashflowInput, CashflowSummary } from '@/backend';

export function useListCashflowEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<CashflowEntry[]>({
    queryKey: queryKeys.cashflow.list(),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listCashflowEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCashflowSummary() {
  const { actor, isFetching } = useActor();

  return useQuery<CashflowSummary>({
    queryKey: queryKeys.cashflow.summary(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCashflowSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddOrUpdateCashflowEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CashflowInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addOrUpdateCashflowEntry(input);
    },
    onSuccess: () => {
      invalidateCashflow(queryClient);
    },
  });
}

export function useDeleteCashflowEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCashflowEntry(id);
    },
    onSuccess: () => {
      invalidateCashflow(queryClient);
    },
  });
}
