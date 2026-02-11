const DB_NAME = 'WealthPortalDB';
const DB_VERSION = 1;

export interface DBSchema {
  loans: Loan;
  properties: Property;
  wealthInputs: WealthInput;
  cashflowEntries: CashflowEntry;
  matches: Match;
  entries: Entry;
  profile: { id: string; name: string };
  counters: { entity: string; value: number };
}

import type { Loan, Property, WealthInput, CashflowEntry, Match, Entry } from '@/backend';

let dbInstance: IDBDatabase | null = null;

export async function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object stores
      if (!db.objectStoreNames.contains('loans')) {
        db.createObjectStore('loans', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('properties')) {
        db.createObjectStore('properties', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('wealthInputs')) {
        db.createObjectStore('wealthInputs', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('cashflowEntries')) {
        db.createObjectStore('cashflowEntries', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('matches')) {
        db.createObjectStore('matches', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('entries')) {
        const entryStore = db.createObjectStore('entries', { keyPath: 'id' });
        entryStore.createIndex('matchId', 'matchId', { unique: false });
      }
      if (!db.objectStoreNames.contains('profile')) {
        db.createObjectStore('profile', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('counters')) {
        db.createObjectStore('counters', { keyPath: 'entity' });
      }
    };
  });
}

export async function getAll<T>(storeName: string): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
}

export async function getById<T>(storeName: string, id: bigint | number): Promise<T | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(Number(id));

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function put<T>(storeName: string, value: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(value);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteById(storeName: string, id: bigint | number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(Number(id));

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getByIndex<T>(
  storeName: string,
  indexName: string,
  value: any
): Promise<T[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);

    request.onsuccess = () => resolve(request.result as T[]);
    request.onerror = () => reject(request.error);
  });
}
