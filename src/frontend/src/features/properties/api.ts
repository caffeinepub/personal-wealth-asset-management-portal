import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/queryKeys';
import { invalidateProperties } from '@/queryInvalidation';
import { listProperties, addOrUpdateProperty, deleteProperty } from '@/storage/propertiesRepo';
import type { Property, PropertyInput } from '@/backend';

export function useListProperties() {
  return useQuery<Property[]>({
    queryKey: queryKeys.properties.list(),
    queryFn: async () => {
      return listProperties();
    },
  });
}

export function useAddOrUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyInput: PropertyInput) => {
      return addOrUpdateProperty(propertyInput);
    },
    onSuccess: () => {
      invalidateProperties(queryClient);
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      await deleteProperty(id);
    },
    onSuccess: () => {
      invalidateProperties(queryClient);
    },
  });
}
