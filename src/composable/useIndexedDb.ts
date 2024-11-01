// useIndexedDB.ts
import { ref, onUnmounted } from 'vue';
import { DBEnum } from '../types';

interface DBRecord {
  id?: number;
  [key: string]: any;
}

export function useIndexedDB(dbName:DBEnum, version: number = 1) {
  const db = ref<IDBDatabase | null>(null);
  const isOpen = ref(false);

  // Open IndexedDB
  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, version);

      request.onupgradeneeded = (event) => {
        const dbInstance = (event.target as IDBOpenDBRequest).result;
        if (!dbInstance.objectStoreNames.contains(dbName)) {
          dbInstance.createObjectStore(dbName, { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (event) => {
        const dbInstance = (event.target as IDBOpenDBRequest).result;
        db.value = dbInstance;
        if(!dbInstance.objectStoreNames.contains(dbName)){
          dbInstance.createObjectStore(dbName, { keyPath: 'id', autoIncrement: true });
        }
        isOpen.value = true;
        resolve(db.value);
      };

      request.onerror = (event) => {
        console.error("Error opening IndexedDB:", (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  };

  // Add record
  const addRecord = (record: DBRecord): Promise<number> => {
    return new Promise((resolve, reject) => {
      const transaction = db.value!.transaction(dbName, 'readwrite');
      const store = transaction.objectStore(dbName);
      const request = store.add(record);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  };

  // Get record by ID
  const getRecord = (id: number): Promise<DBRecord | undefined> => {
    return new Promise((resolve, reject) => {
      const transaction = db.value!.transaction(dbName, 'readonly');
      const store = transaction.objectStore(dbName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  // Update record by ID
  const updateRecord = (record: DBRecord): Promise<number> => {
    return new Promise((resolve, reject) => {
      const transaction = db.value!.transaction(dbName, 'readwrite');
      const store = transaction.objectStore(dbName);
      const request = store.put(record);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  };

  // Delete record by ID
  const deleteRecord = (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const transaction = db.value!.transaction(dbName, 'readwrite');
      const store = transaction.objectStore(dbName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  };

  // Get all records
  const getAllRecords = (): Promise<DBRecord[]> => {
    return new Promise((resolve, reject) => {
      const transaction = db.value!.transaction(dbName, 'readonly');
      const store = transaction.objectStore(dbName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result as DBRecord[]);
      request.onerror = () => reject(request.error);
    });
  };

  // Close DB on component unmount
  onUnmounted(() => {
    if (isOpen.value && db.value) {
      db.value.close();
      isOpen.value = false;
    }
  });

  return {
    openDB,
    addRecord,
    getRecord,
    updateRecord,
    deleteRecord,
    getAllRecords,
    isOpen
  };
}
