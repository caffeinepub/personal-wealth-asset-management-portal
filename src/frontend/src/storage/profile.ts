import { openDB } from './indexedDb';

export interface LocalProfile {
  id: string;
  name: string;
}

const PROFILE_ID = 'current-user';

export async function getProfile(): Promise<LocalProfile | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('profile', 'readonly');
    const store = transaction.objectStore('profile');
    const request = store.get(PROFILE_ID);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function saveProfile(name: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('profile', 'readwrite');
    const store = transaction.objectStore('profile');
    const request = store.put({ id: PROFILE_ID, name });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}
