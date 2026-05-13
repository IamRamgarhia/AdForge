// Compatibility shim — legacy callers (StatusBar, setup wizard, settings) referenced these.
// Real model registry now lives in lib/providers/. Use those directly for new code.
import { PROVIDERS, getProvider, type Provider } from "./providers";

export const CLAUDE_MODELS = (() => {
  const a = getProvider("anthropic") as Provider;
  const map: Record<string, { id: string; label: string }> = {};
  for (const m of a?.models ?? []) {
    const k = m.id.includes("opus") ? "opus" : m.id.includes("haiku") ? "haiku" : "sonnet";
    map[k] = { id: m.id, label: m.label };
  }
  return map;
})();

export type ModelKey = keyof typeof CLAUDE_MODELS;
export const DEFAULT_MODEL: ModelKey = "sonnet";

export { PROVIDERS };
