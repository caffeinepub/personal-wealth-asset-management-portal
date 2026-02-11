import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import { queryKeys } from '@/queryKeys';
import { invalidateMpl } from '@/queryInvalidation';
import type { Match, MatchInput, Entry, EntryInput, PLSummary } from '@/backend';

export function useListMatches() {
  const { actor, isFetching } = useActor();

  return useQuery<Match[]>({
    queryKey: queryKeys.mpl.matches(),
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMatches();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetMatch(matchId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Match>({
    queryKey: queryKeys.mpl.matchDetail(matchId?.toString() ?? ''),
    queryFn: async () => {
      if (!actor || !matchId) throw new Error('Actor or matchId not available');
      return actor.getMatch(matchId);
    },
    enabled: !!actor && !isFetching && matchId !== null,
  });
}

export function useCreateMatch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: MatchInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createMatch(input);
    },
    onSuccess: () => {
      invalidateMpl(queryClient);
    },
  });
}

export function useListEntries(matchId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Entry[]>({
    queryKey: queryKeys.mpl.entries(matchId?.toString() ?? ''),
    queryFn: async () => {
      if (!actor || !matchId) return [];
      return actor.listEntries(matchId);
    },
    enabled: !!actor && !isFetching && matchId !== null,
  });
}

export function useAddEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: EntryInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addEntry(input);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mpl.entries(variables.matchId.toString()) });
      queryClient.invalidateQueries({ queryKey: queryKeys.mpl.plSummary(variables.matchId.toString()) });
      queryClient.invalidateQueries({ queryKey: queryKeys.mpl.matchDetail(variables.matchId.toString()) });
    },
  });
}

export function useGetPLSummary(matchId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<PLSummary>({
    queryKey: queryKeys.mpl.plSummary(matchId?.toString() ?? ''),
    queryFn: async () => {
      if (!actor || !matchId) throw new Error('Actor or matchId not available');
      return actor.getTeamPLSummary(matchId);
    },
    enabled: !!actor && !isFetching && matchId !== null,
  });
}

export function useSettleMatch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ matchId, winner }: { matchId: bigint; winner: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.settleMatch({ matchId, winner });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.mpl.matchDetail(variables.matchId.toString()) });
      queryClient.invalidateQueries({ queryKey: queryKeys.mpl.plSummary(variables.matchId.toString()) });
      queryClient.invalidateQueries({ queryKey: queryKeys.mpl.matches() });
    },
  });
}
