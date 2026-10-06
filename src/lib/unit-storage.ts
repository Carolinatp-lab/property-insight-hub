import type { UnitRecord } from "@/data/rental-units";

let connection: Promise<IDBDatabase> | null = null;
function openDatabase(): Promise<IDBDatabase> {
  if (!connection) {
    connection = new Promise((resolve, reject) => {
      if (typeof indexedDB === "undefined") {
        reject(new Error("Lokal lagring saknas"));
        return;
      }
      const request = indexedDB.open("property-insight-unit-journals", 1);
      request.onupgradeneeded = () => request.result.createObjectStore("units");
      request.onsuccess = () => {
        request.result.onversionchange = () => {
          request.result.close();
          connection = null;
        };
        resolve(request.result);
      };
      request.onerror = () => {
        connection = null;
        reject(request.error);
      };
      request.onblocked = () => {
        connection = null;
        reject(new Error("Lagringen är upptagen i en annan flik"));
      };
    });
  }
  return connection;
}
export async function loadUnitRecord(unitId: string): Promise<UnitRecord | undefined> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction("units", "readonly").objectStore("units").get(unitId);
    request.onsuccess = () => resolve(request.result as UnitRecord | undefined);
    request.onerror = () => reject(request.error);
  });
}
export async function saveUnitRecord(unitId: string, record: UnitRecord): Promise<void> {
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction("units", "readwrite");
    transaction.objectStore("units").put(record, unitId);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error ?? new Error("Sparandet avbröts"));
  });
}
export function readPhoto(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return Promise.reject(new Error("Välj en bild i JPEG-, PNG- eller WebP-format."));
  if (file.size > 5 * 1024 * 1024)
    return Promise.reject(new Error("Varje bild får vara högst 5 MB."));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result);
      const image = new Image();
      image.onload = () => resolve(src);
      image.onerror = () => reject(new Error("Bilden kunde inte läsas. Välj en annan fil."));
      image.src = src;
    };
    reader.onerror = () => reject(new Error("Bilden kunde inte läsas."));
    reader.readAsDataURL(file);
  });
}
