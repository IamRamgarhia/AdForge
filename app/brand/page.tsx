"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Plus, Pencil, Trash2, Download, Upload, Globe, Loader2 } from "lucide-react";
import { ApiKeyGate } from "@/components/ApiKeyGate";
import { PageHeader } from "@/components/PageHeader";
import { BrandBrainForm } from "@/components/BrandBrainForm";
import { listBrains, softDeleteBrain, restoreBrain, getBrain, saveBrain, exportBrain, importBrain } from "@/lib/storage";
import { showUndoToast } from "@/components/UndoToast";
import { emptyBrandBrain, type BrandBrain } from "@/lib/brand-brain";
import { setActiveBrainId, addUsage } from "@/lib/settings";
import { ingestUrl, ingestPasted } from "@/lib/url-ingest";
import { INDUSTRY_TEMPLATES } from "@/lib/industry-templates";
import { llmCall, estimateCostUsd, tryParseJson } from "@/lib/llm";
import { buildBrandExtractionPrompt } from "@/lib/prompts/brand-extraction";

export default function BrandPage() {
  return (
    <ApiKeyGate>
      <Suspense fallback={null}>
        <BrandInner />
      </Suspense>
    </ApiKeyGate>
  );
}

function BrandInner() {
  const params = useSearchParams();
  const isFirst = params.get("first") === "1";
  const [brains, setBrains] = useState<BrandBrain[]>([]);
  const [editing, setEditing] = useState<BrandBrain | null>(null);
  const [showForm, setShowForm] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const [quickUrl, setQuickUrl] = useState("");
  const [quickBusy, setQuickBusy] = useState(false);
  const [quickStatus, setQuickStatus] = useState<string | null>(null);
  const [showPaste, setShowPaste] = useState(false);
  const [pasted, setPasted] = useState("");

  async function quickAddFromUrl() {
    if (!quickUrl.trim()) return;
    setQuickBusy(true);
    setQuickStatus("Reading the page…");
    setShowPaste(false);
    try {
      const r = await ingestUrl(quickUrl);
      if (!r.ok) {
        setQuickStatus(r.message);
        if (r.recoverable) setShowPaste(true);
        return;
      }
      setQuickStatus(r.source === "allorigins" ? "Got content via fallback reader. Extracting brand intelligence…" : "Extracting brand intelligence…");
      const res = await llmCall({
        messages: [{ role: "user", content: buildBrandExtractionPrompt({ website_content: r.content, description: `Brand at ${r.url}`, audience_notes: "", reviews: "" }) }],
        maxTokens: 3000,
        temperature: 0.4,
      });
      const cost = estimateCostUsd(res.providerId, res.modelId, res.usage);
      addUsage(cost, res.usage?.input_tokens ?? 0, res.usage?.output_tokens ?? 0);
      window.dispatchEvent(new Event("ados:usage"));
      const parsed = tryParseJson<any>(res.text);
      const brain: BrandBrain = {
        ...emptyBrandBrain(),
        ...(parsed ?? {}),
        name: parsed?.business_name || new URL(r.url).hostname.replace(/^www\./, ""),
        business_name: parsed?.business_name || new URL(r.url).hostname.replace(/^www\./, ""),
        website_url: r.url,
      };
      await saveBrain(brain);
      setActiveBrainId(brain.id);
      window.dispatchEvent(new Event("ados:brains-changed"));
      setQuickUrl("");
      setQuickStatus(null);
      setPasted("");
      setShowPaste(false);
      refresh();
    } catch (e: any) {
      setQuickStatus(e?.message ?? "Failed");
    } finally {
      setQuickBusy(false);
    }
  }

  async function quickAddFromPaste() {
    if (!pasted.trim()) return;
    setQuickBusy(true);
    setQuickStatus("Extracting brand intelligence from pasted content…");
    try {
      const r = ingestPasted(quickUrl, pasted);
      if (!r.ok) {
        setQuickStatus(r.message);
        return;
      }
      const res = await llmCall({
        messages: [{ role: "user", content: buildBrandExtractionPrompt({ website_content: r.content, description: `Brand pasted from ${quickUrl || "manual entry"}`, audience_notes: "", reviews: "" }) }],
        maxTokens: 3000,
        temperature: 0.4,
      });
      const cost = estimateCostUsd(res.providerId, res.modelId, res.usage);
      addUsage(cost, res.usage?.input_tokens ?? 0, res.usage?.output_tokens ?? 0);
      window.dispatchEvent(new Event("ados:usage"));
      const parsed = tryParseJson<any>(res.text);
      const fallbackName = quickUrl ? (() => { try { return new URL(/^https?:\/\//i.test(quickUrl) ? quickUrl : `https://${quickUrl}`).hostname.replace(/^www\./, ""); } catch { return "My Brand"; } })() : "My Brand";
      const brain: BrandBrain = {
        ...emptyBrandBrain(),
        ...(parsed ?? {}),
        name: parsed?.business_name || fallbackName,
        business_name: parsed?.business_name || fallbackName,
        website_url: quickUrl,
      };
      await saveBrain(brain);
      setActiveBrainId(brain.id);
      window.dispatchEvent(new Event("ados:brains-changed"));
      setQuickUrl("");
      setPasted("");
      setQuickStatus(null);
      setShowPaste(false);
      refresh();
    } catch (e: any) {
      setQuickStatus(e?.message ?? "Extraction failed");
    } finally {
      setQuickBusy(false);
    }
  }

  async function refresh() {
    setBrains(await listBrains());
  }

  async function downloadBrain(id: string, name: string) {
    const json = await exportBrain(id);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brain-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function uploadBrain(file: File) {
    try {
      const text = await file.text();
      await importBrain(text);
      window.dispatchEvent(new Event("ados:brains-changed"));
      refresh();
    } catch (e: any) {
      alert(`Import failed: ${e?.message ?? "invalid file"}`);
    }
  }

  useEffect(() => {
    refresh();
    if (isFirst) setShowForm(true);
  }, [isFirst]);

  if (showForm || editing) {
    return (
      <div>
        <PageHeader
          scope={editing ? `brand/${editing.id.slice(0, 8)}` : "brand/new"}
          title={editing ? "Edit Brand Brain" : "New Brand Brain"}
          subtitle="Persistent brand intelligence injected into every generation."
        />
        <BrandBrainForm initial={editing ?? undefined} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        scope="brand"
        title="Brand Brain"
        subtitle="One or more brand profiles. Each generation uses the active brain."
        actions={
          <div className="flex gap-2">
            <input
              ref={importRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadBrain(f); e.target.value = ""; }}
            />
            <button onClick={() => importRef.current?.click()} className="btn-ghost">
              <Upload size={12} /> import
            </button>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              <Plus size={12} /> new
            </button>
          </div>
        }
      />

      <div className="border border-base-600 bg-base-900/40 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-ink-muted">Quick start from industry</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {INDUSTRY_TEMPLATES.map((t) => (
            <button
              key={t.slug}
              onClick={async () => {
                const b = t.apply({ business_name: "" });
                await saveBrain(b);
                setActiveBrainId(b.id);
                window.dispatchEvent(new Event("ados:brains-changed"));
                refresh();
                setEditing(b);
              }}
              className="text-left border border-base-700 bg-base-900/30 hover:bg-base-800/60 hover:border-base-500 p-3 transition"
              title={t.description}
            >
              <div className="text-xl">{t.emoji}</div>
              <div className="text-[13px] text-ink font-medium leading-tight mt-1">{t.name}</div>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-ink-muted mt-2">
          Tap one → AdForge creates a Brand Brain pre-filled with sensible defaults for that industry. Then refine it.
        </p>
      </div>

      <div className="border border-live/30 bg-live/5 p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={14} className="text-live" />
          <span className="text-[12px] font-semibold uppercase tracking-wider text-live">Or add a client by URL</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            className="input-base flex-1 min-w-[240px]"
            placeholder="acme.com / clientwebsite.com — we extract everything"
            value={quickUrl}
            onChange={(e) => setQuickUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") quickAddFromUrl(); }}
            disabled={quickBusy}
          />
          <button onClick={quickAddFromUrl} disabled={quickBusy || !quickUrl.trim()} className="btn-primary">
            {quickBusy ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />}
            {quickBusy ? "ingesting" : "add brand"}
          </button>
        </div>
        {quickStatus ? (
          <p className="text-[10px] font-mono uppercase tracking-ui-wide text-neg mt-2">{quickStatus}</p>
        ) : (
          <p className="text-[10px] font-mono uppercase tracking-ui-wide text-ink-subtle mt-2">
            tries jina reader → allorigins fallback · facebook/instagram block scrapers (paste manually below)
          </p>
        )}

        {showPaste ? (
          <div className="mt-4 border-t border-live/30 pt-3 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-ui-mega text-live">
              ✱ paste content manually
            </div>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              Open <span className="text-ink font-mono">{quickUrl || "the website"}</span> in a new tab → select all
              (Ctrl+A or ⌘A) → copy (Ctrl+C or ⌘C) → paste below. AI extracts the brand from your paste.
            </p>
            <textarea
              rows={6}
              className="input-base font-mono text-xs"
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              placeholder="Paste hero copy, about section, features, customer reviews — anything from the site…"
              disabled={quickBusy}
            />
            <button onClick={quickAddFromPaste} disabled={quickBusy || pasted.trim().length < 50} className="btn-primary">
              {quickBusy ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />}
              {quickBusy ? "extracting" : "extract from paste"}
            </button>
          </div>
        ) : (
          <div className="mt-2">
            <button
              onClick={() => setShowPaste(true)}
              className="text-[10px] font-mono uppercase tracking-ui-wide text-info hover:underline"
            >
              ✱ or paste content manually instead
            </button>
          </div>
        )}
      </div>

      {brains.length === 0 ? (
        <div className="border border-base-600 bg-base-900/40 px-4 py-3 text-sm text-ink-muted">
          No Brand Brains yet. Paste a URL above or click <strong className="text-ink">new</strong> for manual entry.
        </div>
      ) : (
        <div className="space-y-2 stagger">
          {brains.map((b) => (
            <div key={b.id} className="border border-base-600 bg-base-900/40 p-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint">
                    {b.industry || "industry unspecified"}
                  </span>
                  <span className="text-[10px] text-ink-faint">·</span>
                  <span className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-subtle">
                    updated {new Date(b.updated_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="font-display italic text-xl text-ink">{b.name || b.business_name}</div>
                {b.usp ? (
                  <p className="text-sm text-ink-muted mt-2 line-clamp-2">{b.usp}</p>
                ) : null}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => downloadBrain(b.id, b.name || b.business_name)}
                  className="btn-ghost"
                  title="Export this brain as JSON"
                >
                  <Download size={11} />
                </button>
                <button
                  onClick={async () => setEditing((await getBrain(b.id)) ?? null)}
                  className="btn-ghost"
                >
                  <Pencil size={11} /> edit
                </button>
                <button
                  onClick={async () => {
                    const label = b.name || b.business_name;
                    await softDeleteBrain(b.id);
                    window.dispatchEvent(new Event("ados:brains-changed"));
                    refresh();
                    showUndoToast({
                      message: `Deleted "${label}"`,
                      undo: async () => {
                        await restoreBrain(b.id);
                        window.dispatchEvent(new Event("ados:brains-changed"));
                        refresh();
                      },
                    });
                  }}
                  className="btn-ghost hover:text-neg"
                  title="Delete (undo for 7 seconds)"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint">
        no brand?{" "}
        <Link href="/generate/google" className="text-live hover:underline">
          generate without one →
        </Link>{" "}
        (output will be generic)
      </div>
    </div>
  );
}
