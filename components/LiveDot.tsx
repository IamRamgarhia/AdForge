export function LiveDot({ label = "live" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-ui-mega text-live">
      <span className="relative inline-flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-live opacity-60 animate-ping" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
      </span>
      {label}
    </span>
  );
}
