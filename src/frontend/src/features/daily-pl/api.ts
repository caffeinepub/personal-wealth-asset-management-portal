import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/queryKeys';
import { generateDailyReport } from '@/storage/dailyPl';
import { getStorageErrorMessage, logStorageError } from '@/utils/storageErrors';
import type { DailyReport } from '@/backend';

export function useGenerateDailyReport() {
  return useQuery<DailyReport>({
    queryKey: queryKeys.dailyPL.report(),
    queryFn: async () => {
      try {
        return await generateDailyReport();
      } catch (error) {
        logStorageError('generateDailyReport', error);
        throw new Error(getStorageErrorMessage(error));
      }
    },
  });
}
