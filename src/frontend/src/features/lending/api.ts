import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import { queryKeys } from '@/queryKeys';
import { invalidateLoans } from '@/queryInvalidation';
import type { Loan, LoanInput } from '@/backend';

export function useListLoans() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Loan[]>({
    queryKey: queryKeys.loans.list(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listLoans();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddOrUpdateLoan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loanInput: LoanInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addOrUpdateLoan(loanInput);
    },
    onSuccess: () => {
      invalidateLoans(queryClient);
    },
  });
}

export function useDeleteLoan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteLoan(id);
    },
    onSuccess: () => {
      invalidateLoans(queryClient);
    },
  });
}
