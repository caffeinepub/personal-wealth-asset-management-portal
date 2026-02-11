import { getAll, put, deleteById } from './indexedDb';
import { generateId } from './ids';
import { now } from './timestamps';
import type { WealthInput, WealthInputInput } from '@/backend';

export async function listWealthInputs(): Promise<WealthInput[]> {
  return getAll<WealthInput>('wealthInputs');
}

export async function addOrUpdateWealthInput(input: WealthInputInput): Promise<bigint> {
  const id = input.id ?? await generateId('wealthInput');
  const timestamp = now();

  const wealthInput: WealthInput = {
    id,
    goldWeight: input.goldWeight,
    goldValue: input.goldValue,
    stocksValue: input.stocksValue,
    cashLiquid: input.cashLiquid,
    otherAssets: input.otherAssets,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await put('wealthInputs', wealthInput);
  return id;
}

export async function deleteWealthInput(id: bigint): Promise<void> {
  await deleteById('wealthInputs', id);
}
