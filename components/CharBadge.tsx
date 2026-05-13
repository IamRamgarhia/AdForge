import { cn } from "@/lib/utils";

export function CharBadge({ count, max }: { count: number; max: number }) {
  const ratio = count / max;
  const color =
    count > max
      ? "bg-neg/10 text-neg border-neg/40"
      : ratio > 0.92
      ? "bg-live/10 text-live border-live/40"
      : "bg-base-900 text-ink-muted border-base-600";
  return (
    <span className={cn("border px-1.5 py-0.5 text-[9px] tabular font-mono uppercase tracking-ui-wide", color)}>
      {count}/{max}
    </span>
  );
}
