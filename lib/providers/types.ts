export type ProviderId =
  | "anthropic"
  | "openai"
  | "google"
  | "groq"
  | "cerebras"
  | "openrouter"
  | "together"
  | "deepseek"
  | "mistral";

export type ProviderCategory = "free" | "freemium" | "paid";

export interface LLMMessage {
  role: "user" | "assistant";
  content: string;
}

export interface LLMUsage {
  input_tokens: number;
  output_tokens: number;
  cache_read_input_tokens?: number;
  cache_creation_input_tokens?: number;
}

export interface LLMCallOptions {
  apiKey: string;
  model: string;
  system?: string;
  messages: LLMMessage[];
  maxTokens?: number;
  temperature?: number;
  signal?: AbortSignal;
}

export interface LLMResult {
  text: string;
  usage: LLMUsage | null;
  modelId: string;
}

export interface StreamHandlers {
  onDelta?: (delta: string) => void;
  onUsage?: (usage: LLMUsage) => void;
  onDone?: (full: string) => void;
}

export interface ModelDef {
  id: string;
  label: string;
  pricing: {
    input_per_million_usd: number;
    output_per_million_usd: number;
  };
  context_k?: number;
  best_for?: string;
}

export interface Provider {
  id: ProviderId;
  name: string;
  category: ProviderCategory;
  description: string;
  free_note?: string;
  get_key_url: string;
  default_model: string;
  models: ModelDef[];
  testKey: (apiKey: string) => Promise<boolean>;
  call: (opts: LLMCallOptions) => Promise<LLMResult>;
  stream: (opts: LLMCallOptions, handlers: StreamHandlers) => Promise<LLMResult>;
}

export class LLMError extends Error {
  constructor(message: string, public status?: number, public providerId?: string) {
    super(message);
    this.name = "LLMError";
  }
}
