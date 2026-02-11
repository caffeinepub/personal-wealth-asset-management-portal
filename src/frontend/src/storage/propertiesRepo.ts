import { getAll, put, deleteById, deserializeFromStorage } from './indexedDb';
import { generateId } from './ids';
import { now } from './timestamps';
import type { Property, PropertyInput } from '@/backend';

const BIGINT_FIELDS = ['id', 'acquisitionDate', 'createdAt', 'updatedAt'];

export async function listProperties(): Promise<Property[]> {
  try {
    const raw = await getAll<any>('properties');
    return raw.map(item => deserializeFromStorage<Property>(item, BIGINT_FIELDS));
  } catch (error) {
    console.error('listProperties error:', error);
    throw new Error('Failed to load properties. Please try again.');
  }
}

export async function addOrUpdateProperty(input: PropertyInput): Promise<bigint> {
  try {
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
  } catch (error) {
    console.error('addOrUpdateProperty error:', error);
    throw new Error('Failed to save property. Please check your data and try again.');
  }
}

export async function deleteProperty(id: bigint): Promise<void> {
  try {
    await deleteById('properties', id);
  } catch (error) {
    console.error('deleteProperty error:', error);
    throw new Error('Failed to delete property. Please try again.');
  }
}
