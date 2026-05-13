// Backward-compatibility shim. Old call sites import from "@/lib/claude" — keep working.
// All real logic lives in @/lib/llm + @/lib/providers.
export {
  callClaude,
  streamClaude,
  testApiKey,
  estimateCostUsd,
  tryParseJson,
  ClaudeError,
  type ClaudeMessage,
  type ClaudeUsage,
  type ClaudeResult,
} from "./llm";
