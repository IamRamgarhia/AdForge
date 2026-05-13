"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { NAV_GROUPS } from "@/components/nav-config";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-3 left-3 z-40 h-9 w-9 grid place-items-center border border-base-600 bg-base-900/90 backdrop-blur"
        aria-label="Open navigation"
      >
        <Menu size={16} />
      </button>

      {open ? (
        <div className="md:hidden fixed inset-0 z-50 bg-base-950/95 backdrop-blur overflow-y-auto">
          <div className="flex items-center justify-between border-b border-base-600 px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-7 w-7 bg-live grid place-items-center text-base-950 font-bold font-display italic">A</div>
              <div className="font-display italic text-lg text-ink">AdForge</div>
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="h-9 w-9 grid place-items-center border border-base-600"
              aria-label="Close navigation"
            >
              <X size={16} />
            </button>
          </div>
          <nav className="p-3 pb-12 space-y-4">
            {NAV_GROUPS.map((g) => (
              <div key={g.title}>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-1.5 px-2">
                  {g.title}
                </div>
                <div className="space-y-0.5">
                  {g.items.map((item) => {
                    const active = path === item.href || (item.href !== "/" && path?.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2.5 text-[15px] border-l-2",
                          active
                            ? "bg-base-800/80 text-ink border-live font-medium"
                            : "text-ink-muted border-transparent"
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
