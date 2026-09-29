import type { StoredDocument } from "@/types/document";

const databaseName = "ranjan-sir-study-documents";
const storeName = "documents";

function isStoredDocument(value: unknown): value is StoredDocument {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Partial<StoredDocument>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.addedAt === "string" &&
    item.file instanceof Blob
  );
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!("indexedDB" in window)) {
      reject(new Error("Documents could not be saved in this browser."));
      return;
    }
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(storeName)) {
        request.result.createObjectStore(storeName, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Could not open document storage."));
  });
}

function readRequest(request: IDBRequest): Promise<unknown> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as unknown);
    request.onerror = () =>
      reject(request.error ?? new Error("Could not read saved documents."));
  });
}

export async function listDocuments(): Promise<StoredDocument[]> {
  const database = await openDatabase();
  try {
    const transaction = database.transaction(storeName, "readonly");
    const result = await readRequest(
      transaction.objectStore(storeName).getAll(),
    );
    if (!Array.isArray(result)) return [];
    return result
      .filter(isStoredDocument)
      .sort((first, second) => second.addedAt.localeCompare(first.addedAt));
  } finally {
    database.close();
  }
}

export async function getDocument(id: string): Promise<StoredDocument | null> {
  const database = await openDatabase();
  try {
    const transaction = database.transaction(storeName, "readonly");
    const result = await readRequest(
      transaction.objectStore(storeName).get(id),
    );
    return isStoredDocument(result) ? result : null;
  } finally {
    database.close();
  }
}

export async function saveDocument(document: StoredDocument): Promise<void> {
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(storeName, "readwrite");
      transaction.objectStore(storeName).put(document);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(transaction.error ?? new Error("Could not save the document."));
      transaction.onabort = () =>
        reject(transaction.error ?? new Error("Document save was cancelled."));
    });
  } finally {
    database.close();
  }
}

export async function deleteDocument(id: string): Promise<void> {
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(storeName, "readwrite");
      transaction.objectStore(storeName).delete(id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () =>
        reject(
          transaction.error ?? new Error("Could not remove the document."),
        );
      transaction.onabort = () =>
        reject(
          transaction.error ?? new Error("Document removal was cancelled."),
        );
    });
  } finally {
    database.close();
  }
}
