"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="min-h-[60vh] grid place-items-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold mb-2">Something broke.</h1>
        <p className="text-sm text-zinc-400 mb-4">{error?.message ?? "Unknown error"}</p>
        <button onClick={reset} className="btn-primary">
          Try again
        </button>
      </div>
    </div>
  );
}
