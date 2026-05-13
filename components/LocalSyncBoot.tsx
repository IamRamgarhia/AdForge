"use client";

import { useEffect } from "react";
import { bootLocalSync } from "@/lib/local-sync";

export function LocalSyncBoot() {
  useEffect(() => {
    bootLocalSync().then((r) => {
      if (r.enabled) {
        console.log("[adOS] local-sync enabled · pulled snapshot:", r.pulled);
      } else {
        console.log("[adOS] local-sync sidecar not detected — running in browser-only mode");
      }
    });
  }, []);
  return null;
}
