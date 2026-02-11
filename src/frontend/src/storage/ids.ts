import { openDB } from './indexedDb';

export async function generateId(entity: string): Promise<bigint> {
  const db = await openDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('counters', 'readwrite');
    const store = transaction.objectStore('counters');
    const getRequest = store.get(entity);

    getRequest.onsuccess = () => {
      const current = getRequest.result?.value || 0;
      const nextId = current + 1;
      
      const putRequest = store.put({ entity, value: nextId });
      putRequest.onsuccess = () => resolve(BigInt(nextId));
      putRequest.onerror = () => reject(putRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);
  });
}
