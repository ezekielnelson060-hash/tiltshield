"use client";

import { useEffect, useState } from "react";
import {
  loadVaultMeta,
  encryptAndStore,
  decryptAndDownload,
  deleteVaultItem,
  type VaultMeta,
} from "@/lib/vault";
import { Button } from "@/components/ui/button";

export default function VaultPage() {
  const [items, setItems] = useState<VaultMeta[]>([]);
  const [pass, setPass] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    setItems(loadVaultMeta());
  }, []);

  async function onAdd() {
    setError(null);
    setMsg(null);
    if (!file) {
      setError("Choose a file (PDF, image, or document).");
      return;
    }
    if (pass.length < 8) {
      setError("Passphrase must be at least 8 characters.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Max 8 MB per file.");
      return;
    }
    setBusy(true);
    try {
      await encryptAndStore(file, pass, note);
      setItems(loadVaultMeta());
      setFile(null);
      setNote("");
      setMsg("Encrypted and stored on this device only.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Encrypt failed");
    } finally {
      setBusy(false);
    }
  }

  async function onOpen(id: string) {
    setError(null);
    setMsg(null);
    if (pass.length < 8) {
      setError("Enter the same passphrase used when you stored the file.");
      return;
    }
    setBusy(true);
    try {
      await decryptAndDownload(id, pass);
      setMsg("Decrypted — download started.");
    } catch {
      setError("Wrong passphrase or corrupted data.");
    } finally {
      setBusy(false);
    }
  }

  async function onRemove(id: string) {
    if (!confirm("Delete this encrypted file from this device?")) return;
    await deleteVaultItem(id);
    setItems(loadVaultMeta());
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-50">Document vault</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Files are encrypted with your passphrase (AES-GCM) and stored only on this
          device. Servers never receive the file or passphrase.
        </p>
      </div>

      <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <label className="block text-xs text-zinc-500">
          Vault passphrase
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Min 8 characters — remember this"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
            autoComplete="off"
          />
        </label>
        <label className="block text-xs text-zinc-500">
          File
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1 w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-zinc-200"
          />
        </label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional)"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-50"
        />
        <Button type="button" size="sm" onClick={onAdd} disabled={busy}>
          {busy ? "Working…" : "Encrypt & store"}
        </Button>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {msg && <p className="text-sm text-emerald-400">{msg}</p>}
      </div>

      <ul className="space-y-2">
        {items.map((i) => (
          <li
            key={i.id}
            className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-zinc-800 px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-zinc-100">{i.name}</p>
              <p className="text-xs text-zinc-500">
                {(i.size / 1024).toFixed(1)} KB · {new Date(i.addedAt).toLocaleString()}
                {i.note ? ` · ${i.note}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onOpen(i.id)} disabled={busy}>
                Unlock
              </Button>
              <button
                type="button"
                className="text-xs text-zinc-600 hover:text-red-400"
                onClick={() => onRemove(i.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-zinc-500">
            No encrypted documents yet. Add IDs, insurance PDFs, or recovery sheets.
          </p>
        )}
      </ul>
    </div>
  );
}
