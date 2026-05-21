const DB_NAME = 'IntegratedPortfolioTrackerDB';
const DB_VERSION = 1;

let db = null;

export function openDB() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains('accounts'))
        d.createObjectStore('accounts', { keyPath: 'id' });
      if (!d.objectStoreNames.contains('statements'))
        d.createObjectStore('statements', { keyPath: 'id', autoIncrement: true });
      if (!d.objectStoreNames.contains('savings'))
        d.createObjectStore('savings', { keyPath: 'id', autoIncrement: true });
    };
    request.onsuccess = (e) => { db = e.target.result; resolve(db); };
    request.onerror = (e) => reject(e.target.error);
  });
}

export function getAll(storeName) {
  return openDB().then(d => new Promise((resolve, reject) => {
    const tx = d.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}

export function putRecord(storeName, record) {
  return openDB().then(d => new Promise((resolve, reject) => {
    const tx = d.transaction(storeName, 'readwrite');
    const req = tx.objectStore(storeName).put(record);
    tx.oncomplete = () => resolve(req.result);
    tx.onerror = () => reject(tx.error);
  }));
}

export function addRecord(storeName, record) {
  return openDB().then(d => new Promise((resolve, reject) => {
    const tx = d.transaction(storeName, 'readwrite');
    const req = tx.objectStore(storeName).add(record);
    tx.oncomplete = () => resolve(req.result);
    tx.onerror = () => reject(tx.error);
  }));
}

export function getRecord(storeName, key) {
  return openDB().then(d => new Promise((resolve, reject) => {
    const tx = d.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  }));
}

export function deleteRecord(storeName, key) {
  return openDB().then(d => new Promise((resolve, reject) => {
    const tx = d.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(key);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  }));
}

export function clearStore(storeName) {
  return openDB().then(d => new Promise((resolve, reject) => {
    const tx = d.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).clear();
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  }));
}

export function getAllFromDB() {
  return openDB().then(d => new Promise((resolve, reject) => {
    const stores = ['accounts', 'statements', 'savings'];
    const tx = d.transaction(stores, 'readonly');
    const result = {};
    let done = 0;
    stores.forEach(s => {
      tx.objectStore(s).getAll().onsuccess = e => {
        result[s] = e.target.result;
        if (++done === stores.length) resolve(result);
      };
    });
    tx.onerror = () => reject(tx.error);
  }));
}

export async function bulkImport(data) {
  const d = await openDB();
  return new Promise((resolve, reject) => {
    const stores = ['accounts', 'statements', 'savings'];
    const tx = d.transaction(stores, 'readwrite');
    stores.forEach(s => tx.objectStore(s).clear());
    if (data.accounts) data.accounts.forEach(a => tx.objectStore('accounts').put(a));
    if (data.statements) data.statements.forEach(s => tx.objectStore('statements').add(s));
    if (data.savings) data.savings.forEach(s => tx.objectStore('savings').add(s));
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}
