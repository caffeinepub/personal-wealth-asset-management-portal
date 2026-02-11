import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/queryKeys';
import { invalidateLoans } from '@/queryInvalidation';
import { listLoans, addOrUpdateLoan, deleteLoan } from '@/storage/loansRepo';
import type { Loan, LoanInput } from '@/backend';

export function useListLoans() {
  return useQuery<Loan[]>({
    queryKey: queryKeys.loans.list(),
    queryFn: async () => {
      return listLoans();
    },
  });
}

export function useAddOrUpdateLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (loanInput: LoanInput) => {
      return addOrUpdateLoan(loanInput);
    },
    onSuccess: () => {
      invalidateLoans(queryClient);
    },
  });
}

export function useDeleteLoan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      await deleteLoan(id);
    },
    onSuccess: () => {
      invalidateLoans(queryClient);
    },
  });
}
