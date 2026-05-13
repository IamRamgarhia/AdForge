"use client";

import { useEffect, useState, useRef } from "react";
import { Undo2, X } from "lucide-react";

interface UndoEvent {
  message: string;
  undo: () => void | Promise<void>;
  timeoutMs?: number;
}

declare global {
  interface WindowEventMap {
    "ados:undo": CustomEvent<UndoEvent>;
  }
}

export function showUndoToast(detail: UndoEvent) {
  window.dispatchEvent(new CustomEvent("ados:undo", { detail }));
}

export function UndoToast() {
  const [evt, setEvt] = useState<UndoEvent | null>(null);
  const [remaining, setRemaining] = useState(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const onUndo = (e: CustomEvent<UndoEvent>) => {
      setEvt(e.detail);
      setRemaining(e.detail.timeoutMs ?? 7000);
    };
    window.addEventListener("ados:undo", onUndo);
    return () => window.removeEventListener("ados:undo", onUndo);
  }, []);

  useEffect(() => {
    if (!evt) return;
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      setRemaining((r) => {
        const next = r - 100;
        if (next <= 0) {
          if (tickRef.current) clearInterval(tickRef.current);
          setEvt(null);
          return 0;
        }
        return next;
      });
    }, 100);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [evt]);

  if (!evt) return null;

  const pct = (remaining / (evt.timeoutMs ?? 7000)) * 100;

  return (
    <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-50 min-w-[320px] max-w-md">
      <div className="border border-base-600 bg-base-900 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="text-sm text-ink flex-1">{evt.message}</span>
          <button
            onClick={async () => {
              await evt.undo();
              setEvt(null);
            }}
            className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-live hover:bg-live/10 px-2 py-1"
          >
            <Undo2 size={12} /> Undo
          </button>
          <button onClick={() => setEvt(null)} className="text-ink-faint hover:text-ink" aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
        <div className="h-0.5 bg-live transition-all duration-100" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
