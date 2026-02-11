const DB_NAME = 'WealthPortalDB';
const DB_VERSION = 2;

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
let dbError: Error | null = null;

export async function openDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;
  if (dbError) throw dbError;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      const error = request.error || new Error('Failed to open IndexedDB');
      dbError = error;
      console.error('IndexedDB open error:', error);
      reject(error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onblocked = () => {
      const error = new Error('IndexedDB blocked - please close other tabs');
      dbError = error;
      console.error('IndexedDB blocked:', error);
      reject(error);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const oldVersion = event.oldVersion;

      console.log(`Upgrading IndexedDB from version ${oldVersion} to ${DB_VERSION}`);

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

      console.log('IndexedDB upgrade complete');
    };
  });
}

export async function isIndexedDBAvailable(): Promise<boolean> {
  try {
    await openDB();
    return true;
  } catch (error) {
    console.error('IndexedDB not available:', error);
    return false;
  }
}

export async function getAll<T>(storeName: string): Promise<T[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => {
        const error = request.error || new Error(`Failed to get all from ${storeName}`);
        console.error(`getAll error for ${storeName}:`, error);
        reject(error);
      };
    });
  } catch (error) {
    console.error(`getAll failed for ${storeName}:`, error);
    throw error;
  }
}

export async function getById<T>(storeName: string, id: bigint | number): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const numericId = typeof id === 'bigint' ? Number(id) : id;
      const request = store.get(numericId);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => {
        const error = request.error || new Error(`Failed to get ${storeName} by id ${numericId}`);
        console.error(`getById error for ${storeName}:`, error);
        reject(error);
      };
    });
  } catch (error) {
    console.error(`getById failed for ${storeName}:`, error);
    throw error;
  }
}

export async function put<T>(storeName: string, value: T): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      // Convert BigInt fields to Number for IndexedDB storage
      const serializedValue = serializeForStorage(value);
      const request = store.put(serializedValue);

      request.onsuccess = () => resolve();
      request.onerror = () => {
        const error = request.error || new Error(`Failed to put into ${storeName}`);
        console.error(`put error for ${storeName}:`, error, 'value:', serializedValue);
        reject(error);
      };
      
      transaction.onerror = () => {
        const error = transaction.error || new Error(`Transaction failed for ${storeName}`);
        console.error(`transaction error for ${storeName}:`, error);
        reject(error);
      };
    });
  } catch (error) {
    console.error(`put failed for ${storeName}:`, error);
    throw error;
  }
}

export async function deleteById(storeName: string, id: bigint | number): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const numericId = typeof id === 'bigint' ? Number(id) : id;
      const request = store.delete(numericId);

      request.onsuccess = () => resolve();
      request.onerror = () => {
        const error = request.error || new Error(`Failed to delete from ${storeName}`);
        console.error(`deleteById error for ${storeName}:`, error);
        reject(error);
      };
    });
  } catch (error) {
    console.error(`deleteById failed for ${storeName}:`, error);
    throw error;
  }
}

export async function getByIndex<T>(
  storeName: string,
  indexName: string,
  value: any
): Promise<T[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      
      // Convert BigInt to Number for index lookup
      const numericValue = typeof value === 'bigint' ? Number(value) : value;
      const request = index.getAll(numericValue);

      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = () => {
        const error = request.error || new Error(`Failed to get by index ${indexName} from ${storeName}`);
        console.error(`getByIndex error for ${storeName}:`, error);
        reject(error);
      };
    });
  } catch (error) {
    console.error(`getByIndex failed for ${storeName}:`, error);
    throw error;
  }
}

// Helper to convert BigInt to Number for storage
function serializeForStorage(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'bigint') {
    return Number(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeForStorage);
  }
  
  if (typeof obj === 'object') {
    const serialized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        serialized[key] = serializeForStorage(obj[key]);
      }
    }
    return serialized;
  }
  
  return obj;
}

// Helper to convert Number back to BigInt for runtime
export function deserializeFromStorage<T>(obj: any, bigintFields: string[]): T {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => deserializeFromStorage(item, bigintFields)) as any;
  }
  
  if (typeof obj === 'object') {
    const deserialized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (bigintFields.includes(key) && typeof obj[key] === 'number') {
          deserialized[key] = BigInt(obj[key]);
        } else {
          deserialized[key] = obj[key];
        }
      }
    }
    return deserialized as T;
  }
  
  return obj;
}
