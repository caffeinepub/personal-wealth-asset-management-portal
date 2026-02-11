import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/queryKeys';
import { generateDailyReport } from '@/storage/dailyPl';
import type { DailyReport } from '@/backend';

export function useGenerateDailyReport() {
  return useQuery<DailyReport>({
    queryKey: queryKeys.dailyPL.report(),
    queryFn: async () => {
      return generateDailyReport();
    },
  });
}
