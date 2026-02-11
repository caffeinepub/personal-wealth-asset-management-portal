import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import { queryKeys } from '@/queryKeys';
import { invalidateProperties } from '@/queryInvalidation';
import type { Property, PropertyInput } from '@/backend';

export function useListProperties() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Property[]>({
    queryKey: queryKeys.properties.list(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listProperties();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddOrUpdateProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyInput: PropertyInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addOrUpdateProperty(propertyInput);
    },
    onSuccess: () => {
      invalidateProperties(queryClient);
    },
  });
}

export function useDeleteProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteProperty(id);
    },
    onSuccess: () => {
      invalidateProperties(queryClient);
    },
  });
}
