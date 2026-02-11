import { getAll, put, deleteById } from './indexedDb';
import { generateId } from './ids';
import { now } from './timestamps';
import type { Property, PropertyInput } from '@/backend';

export async function listProperties(): Promise<Property[]> {
  return getAll<Property>('properties');
}

export async function addOrUpdateProperty(input: PropertyInput): Promise<bigint> {
  const id = input.id ?? await generateId('property');
  const timestamp = now();

  const property: Property = {
    id,
    location: input.location,
    landArea: input.landArea,
    purchasePrice: input.purchasePrice,
    acquisitionDate: input.acquisitionDate,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await put('properties', property);
  return id;
}

export async function deleteProperty(id: bigint): Promise<void> {
  await deleteById('properties', id);
}
