import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/queryKeys';
import { invalidateMpl } from '@/queryInvalidation';
import { listMatches, getMatch, createMatch, listEntries, addEntry, settleMatch } from '@/storage/mplRepo';
import { getTeamPLSummary } from '@/storage/mplPlSummary';
import { getStorageErrorMessage, logStorageError } from '@/utils/storageErrors';
import type { Match, MatchInput, Entry, EntryInput, PLSummary } from '@/backend';

export function useListMatches() {
  return useQuery<Match[]>({
    queryKey: queryKeys.mpl.matches(),
    queryFn: async () => {
      try {
        return await listMatches();
      } catch (error) {
        logStorageError('listMatches', error);
        throw new Error(getStorageErrorMessage(error));
      }
    },
  });
}

export function useGetMatch(matchId: bigint | null) {
  return useQuery<Match>({
    queryKey: queryKeys.mpl.matchDetail(matchId?.toString() ?? ''),
    queryFn: async () => {
      if (!matchId) throw new Error('matchId not available');
      try {
        const match = await getMatch(matchId);
        if (!match) throw new Error('Match not found');
        return match;
      } catch (error) {
        logStorageError('getMatch', error, { matchId });
        throw new Error(getStorageErrorMessage(error));
      }
    },
    enabled: matchId !== null,
  });
}

export function useCreateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: MatchInput) => {
      try {
        return await createMatch(input);
      } catch (error) {
        logStorageError('createMatch', error, input);
        throw new Error(getStorageErrorMessage(error));
      }
    },
    onSuccess: () => {
      invalidateMpl(queryClient);
    },
  });
}

export function useListEntries(matchId: bigint | null) {
  return useQuery<Entry[]>({
    queryKey: queryKeys.mpl.entries(matchId?.toString() ?? ''),
    queryFn: async () => {
      if (!matchId) return [];
      try {
        return await listEntries(matchId);
      } catch (error) {
        logStorageError('listEntries', error, { matchId });
        throw new Error(getStorageErrorMessage(error));
      }
    },
    enabled: matchId !== null,
  });
}

export function useAddEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: EntryInput) => {
      try {
        return await addEntry(input);
      } catch (error) {
        logStorageError('addEntry', error, input);
        throw new Error(getStorageErrorMessage(error));
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mpl.entries(variables.matchId.toString()) });
      queryClient.invalidateQueries({ queryKey: queryKeys.mpl.plSummary(variables.matchId.toString()) });
      queryClient.invalidateQueries({ queryKey: queryKeys.mpl.matchDetail(variables.matchId.toString()) });
    },
  });
}

export function useGetPLSummary(matchId: bigint | null) {
  return useQuery<PLSummary>({
    queryKey: queryKeys.mpl.plSummary(matchId?.toString() ?? ''),
    queryFn: async () => {
      if (!matchId) throw new Error('matchId not available');
      try {
        return await getTeamPLSummary(matchId);
      } catch (error) {
        logStorageError('getTeamPLSummary', error, { matchId });
        throw new Error(getStorageErrorMessage(error));
      }
    },
    enabled: matchId !== null,
  });
}

export function useSettleMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ matchId, winner }: { matchId: bigint; winner: string }) => {
      try {
        return await settleMatch(matchId, winner);
      } catch (error) {
        logStorageError('settleMatch', error, { matchId, winner });
        throw new Error(getStorageErrorMessage(error));
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mpl.matchDetail(variables.matchId.toString()) });
      queryClient.invalidateQueries({ queryKey: queryKeys.mpl.plSummary(variables.matchId.toString()) });
      queryClient.invalidateQueries({ queryKey: queryKeys.mpl.matches() });
    },
  });
}
