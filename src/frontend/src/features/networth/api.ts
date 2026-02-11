import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/queryKeys';
import { invalidateWealthInputs } from '@/queryInvalidation';
import { listWealthInputs, addOrUpdateWealthInput } from '@/storage/wealthInputsRepo';
import { netWorth, totalPropertyValue, totalLendingPortfolio, totalWealthInputs } from '@/storage/aggregates';
import type { WealthInput, WealthInputInput } from '@/backend';

export function useListWealthInputs() {
  return useQuery<WealthInput[]>({
    queryKey: queryKeys.wealthInputs.list(),
    queryFn: async () => {
      return listWealthInputs();
    },
  });
}

export function useLatestWealthInput() {
  const { data: wealthInputs, ...rest } = useListWealthInputs();
  
  const latestInput = wealthInputs && wealthInputs.length > 0
    ? wealthInputs.reduce((latest, current) => 
        current.updatedAt > latest.updatedAt ? current : latest
      )
    : null;

  return { data: latestInput, ...rest };
}

export function useAddOrUpdateWealthInput() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wealthInput: WealthInputInput) => {
      return addOrUpdateWealthInput(wealthInput);
    },
    onSuccess: () => {
      invalidateWealthInputs(queryClient);
    },
  });
}

export function useNetWorthSummary() {
  return useQuery({
    queryKey: queryKeys.aggregates.netWorth(),
    queryFn: async () => {
      const [netWorthValue, propertyValue, lendingPortfolio, wealthInputsTotal] = await Promise.all([
        netWorth(),
        totalPropertyValue(),
        totalLendingPortfolio(),
        totalWealthInputs(),
      ]);

      return {
        netWorth: netWorthValue,
        propertyValue,
        lendingPortfolio,
        wealthInputsTotal,
      };
    },
  });
}
