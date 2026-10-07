import type { ManagementMode, ManagementRecord } from "@/data/management";
function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("Lokal lagring saknas"));
      return;
    }
    const request = indexedDB.open("property-insight-management", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("modules");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("Lagringen är upptagen"));
  });
}
export async function readManagement(mode: ManagementMode): Promise<ManagementRecord | undefined> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("modules", "readonly");
    const request = tx.objectStore("modules").get(mode);
    request.onsuccess = () => resolve(request.result as ManagementRecord | undefined);
    tx.oncomplete = () => db.close();
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}
export async function writeManagement(
  mode: ManagementMode,
  record: ManagementRecord,
): Promise<void> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("modules", "readwrite");
    try {
      tx.objectStore("modules").put(record, mode);
    } catch (error) {
      db.close();
      reject(error);
      return;
    }
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error);
    };
  });
}
export function readTemplateFile(file: File): Promise<string> {
  if (!/\.(pdf|docx|txt)$/i.test(file.name))
    return Promise.reject(new Error("Välj PDF, DOCX eller TXT."));
  if (file.size > 10 * 1024 * 1024)
    return Promise.reject(new Error("Mallen får vara högst 10 MB."));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Filen kunde inte läsas."));
    reader.readAsDataURL(file);
  });
}
export function downloadTemplate(fileName: string, text: string, fileData: string) {
  const blob = fileData
    ? (() => {
        const [header, body] = fileData.split(",");
        const bytes = Uint8Array.from(atob(body!), (c) => c.charCodeAt(0));
        return new Blob([bytes], {
          type: header!.split(":")[1]?.split(";")[0] || "application/octet-stream",
        });
      })()
    : new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
