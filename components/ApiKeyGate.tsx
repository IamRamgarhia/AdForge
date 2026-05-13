"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasAnyKeyConfigured } from "@/lib/settings";

export function ApiKeyGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasAnyKeyConfigured()) {
      router.replace("/setup");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-zinc-500 text-sm">
        Loading…
      </div>
    );
  }
  return <>{children}</>;
}
