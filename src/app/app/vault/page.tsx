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
import { PageHeader } from "@/components/app/page-header";
import { IllusEmptyVault } from "@/components/illustrations";

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
      setError(
        "Passphrase must be at least 8 characters. You need it to open files later."
      );
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("Max 8 MB per file on this device vault.");
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
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 lg:px-8">
      <PageHeader
        title="Document vault"
        subtitle="Encrypted on this device only (AES-GCM). Servers never receive your files or passphrase — part of your year-long readiness."
        backHref="/app/more"
        showBack
      />

      <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]">
        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            Vault passphrase
          </span>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Min 8 characters — remember this"
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-[#060a12] px-3 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-600"
            autoComplete="off"
          />
        </label>

        <label className="block">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            File
          </span>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-2 w-full text-sm text-zinc-400 file:mr-3 file:rounded-lg file:border-0 file:bg-white/[0.06] file:px-3 file:py-1.5 file:text-zinc-200"
          />
        </label>

        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional) — e.g. passport copy"
          className="w-full rounded-xl border border-white/[0.08] bg-[#060a12] px-3 py-2.5 text-sm text-zinc-50 placeholder:text-zinc-600"
        />

        <Button type="button" size="sm" onClick={() => void onAdd()} disabled={busy}>
          {busy ? "Working…" : "Encrypt & store"}
        </Button>
        {error && <p className="text-sm text-red-400">{error}</p>}
        {msg && <p className="text-sm text-emerald-400">{msg}</p>}
      </div>

      <section className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
          Stored on this device
        </p>
        {items.map((i) => (
          <div
            key={i.id}
            className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-100">{i.name}</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                {(i.size / 1024).toFixed(1)} KB ·{" "}
                {new Date(i.addedAt).toLocaleString()}
                {i.note ? ` · ${i.note}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => void onOpen(i.id)}
                disabled={busy}
              >
                Unlock
              </Button>
              <button
                type="button"
                className="text-xs text-zinc-600 hover:text-red-400"
                onClick={() => void onRemove(i.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/[0.08] px-4 py-6">
            <IllusEmptyVault />
            <p className="text-center text-sm text-zinc-500">
              Add IDs, insurance PDFs, or recovery sheets for a full year of offline access.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
