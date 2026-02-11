import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import { queryKeys } from '@/queryKeys';
import { invalidateWealthInputs } from '@/queryInvalidation';
import type { WealthInput, WealthInputInput } from '@/backend';

export function useListWealthInputs() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WealthInput[]>({
    queryKey: queryKeys.wealthInputs.list(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listWealthInputs();
    },
    enabled: !!actor && !actorFetching,
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
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wealthInput: WealthInputInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addOrUpdateWealthInput(wealthInput);
    },
    onSuccess: () => {
      invalidateWealthInputs(queryClient);
    },
  });
}

export function useNetWorthSummary() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: queryKeys.aggregates.netWorth(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      const [netWorth, propertyValue, lendingPortfolio, wealthInputsTotal] = await Promise.all([
        actor.netWorth(),
        actor.totalPropertyValue(),
        actor.totalLendingPortfolio(),
        actor.totalWealthInputs(),
      ]);

      return {
        netWorth,
        propertyValue,
        lendingPortfolio,
        wealthInputsTotal,
      };
    },
    enabled: !!actor && !actorFetching,
  });
}
