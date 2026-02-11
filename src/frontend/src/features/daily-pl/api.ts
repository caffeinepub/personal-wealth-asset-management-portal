import { useQuery } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import { queryKeys } from '@/queryKeys';
import type { DailyReport } from '@/backend';

export function useGenerateDailyReport() {
  const { actor, isFetching } = useActor();

  return useQuery<DailyReport>({
    queryKey: queryKeys.dailyPL.report(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateDailyReport();
    },
    enabled: !!actor && !isFetching,
  });
}
