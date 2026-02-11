import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/queryKeys';
import { invalidateProperties } from '@/queryInvalidation';
import { listProperties, addOrUpdateProperty, deleteProperty } from '@/storage/propertiesRepo';
import { getStorageErrorMessage, logStorageError } from '@/utils/storageErrors';
import type { Property, PropertyInput } from '@/backend';

export function useListProperties() {
  return useQuery<Property[]>({
    queryKey: queryKeys.properties.list(),
    queryFn: async () => {
      try {
        return await listProperties();
      } catch (error) {
        logStorageError('listProperties', error);
        throw new Error(getStorageErrorMessage(error));
      }
    },
  });
}

export function useAddOrUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyInput: PropertyInput) => {
      try {
        return await addOrUpdateProperty(propertyInput);
      } catch (error) {
        logStorageError('addOrUpdateProperty', error, propertyInput);
        throw new Error(getStorageErrorMessage(error));
      }
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
      try {
        await deleteProperty(id);
      } catch (error) {
        logStorageError('deleteProperty', error, { id });
        throw new Error(getStorageErrorMessage(error));
      }
    },
    onSuccess: () => {
      invalidateProperties(queryClient);
    },
  });
}
