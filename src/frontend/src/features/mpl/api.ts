import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/queryKeys';
import { invalidateMpl } from '@/queryInvalidation';
import { listMatches, getMatch, createMatch, listEntries, addEntry, settleMatch } from '@/storage/mplRepo';
import { getTeamPLSummary } from '@/storage/mplPlSummary';
import type { Match, MatchInput, Entry, EntryInput, PLSummary } from '@/backend';

export function useListMatches() {
  return useQuery<Match[]>({
    queryKey: queryKeys.mpl.matches(),
    queryFn: async () => {
      return listMatches();
    },
  });
}

export function useGetMatch(matchId: bigint | null) {
  return useQuery<Match>({
    queryKey: queryKeys.mpl.matchDetail(matchId?.toString() ?? ''),
    queryFn: async () => {
      if (!matchId) throw new Error('matchId not available');
      const match = await getMatch(matchId);
      if (!match) throw new Error('Match not found');
      return match;
    },
    enabled: matchId !== null,
  });
}

export function useCreateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: MatchInput) => {
      return createMatch(input);
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
      return listEntries(matchId);
    },
    enabled: matchId !== null,
  });
}

export function useAddEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: EntryInput) => {
      // Check if match is settled
      const match = await getMatch(input.matchId);
      if (match?.status === 'settled') {
        throw new Error('Cannot add entries to a settled match');
      }
      return addEntry(input);
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
      return getTeamPLSummary(matchId);
    },
    enabled: matchId !== null,
  });
}

export function useSettleMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ matchId, winner }: { matchId: bigint; winner: string }) => {
      return settleMatch(matchId, winner);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mpl.matchDetail(variables.matchId.toString()) });
      queryClient.invalidateQueries({ queryKey: queryKeys.mpl.plSummary(variables.matchId.toString()) });
      queryClient.invalidateQueries({ queryKey: queryKeys.mpl.matches() });
    },
  });
}
