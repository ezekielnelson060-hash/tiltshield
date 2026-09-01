/** Client-side encrypted document vault (AES-GCM). Files never leave the device. */

const DB_NAME = "tiltshield_vault";
const STORE = "docs";
const META_KEY = "tiltshield_vault_meta_v2";
const SALT_KEY = "tiltshield_vault_salt";

export type VaultMeta = {
  id: string;
  name: string;
  mime: string;
  size: number;
  addedAt: string;
  note: string;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(id: string, data: ArrayBuffer) {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(data, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGet(id: string): Promise<ArrayBuffer | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result as ArrayBuffer | undefined);
    req.onerror = () => reject(req.error);
  });
}

async function idbDelete(id: string) {
  const db = await openDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function getSalt(): Uint8Array {
  const existing = localStorage.getItem(SALT_KEY);
  if (existing) {
    return Uint8Array.from(atob(existing), (c) => c.charCodeAt(0));
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  localStorage.setItem(SALT_KEY, btoa(String.fromCharCode(...Array.from(salt))));
  return salt;
}

export async function deriveKey(passphrase: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const base = await crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: getSalt() as BufferSource,
      iterations: 120000,
      hash: "SHA-256",
    },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export function loadVaultMeta(): VaultMeta[] {
  try {
    return JSON.parse(localStorage.getItem(META_KEY) || "[]") as VaultMeta[];
  } catch {
    return [];
  }
}

function saveVaultMeta(items: VaultMeta[]) {
  localStorage.setItem(META_KEY, JSON.stringify(items));
}

export async function encryptAndStore(
  file: File,
  passphrase: string,
  note: string
): Promise<VaultMeta> {
  const key = await deriveKey(passphrase);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plain = await file.arrayBuffer();
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, plain);
  const packed = new Uint8Array(iv.length + cipher.byteLength);
  packed.set(iv, 0);
  packed.set(new Uint8Array(cipher), iv.length);
  const id = crypto.randomUUID();
  await idbPut(id, packed.buffer);
  const meta: VaultMeta = {
    id,
    name: file.name,
    mime: file.type || "application/octet-stream",
    size: file.size,
    addedAt: new Date().toISOString(),
    note: note.trim(),
  };
  saveVaultMeta([meta, ...loadVaultMeta()]);
  return meta;
}

export async function decryptAndDownload(id: string, passphrase: string): Promise<void> {
  const meta = loadVaultMeta().find((m) => m.id === id);
  if (!meta) throw new Error("Document not found");
  const packed = await idbGet(id);
  if (!packed) throw new Error("Encrypted blob missing");
  const bytes = new Uint8Array(packed);
  const iv = bytes.slice(0, 12);
  const data = bytes.slice(12);
  const key = await deriveKey(passphrase);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  const blob = new Blob([plain], { type: meta.mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = meta.name;
  a.click();
  URL.revokeObjectURL(url);
}

export async function deleteVaultItem(id: string) {
  await idbDelete(id);
  saveVaultMeta(loadVaultMeta().filter((m) => m.id !== id));
}
