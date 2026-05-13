"use client";

import { GeneratorShell } from "@/components/GeneratorShell";
import { Markdown } from "@/components/Markdown";
import { buildReportPrompt, type ReportInput } from "@/lib/prompts/report";
import type { GeneratorConfig } from "@/lib/generator-config";

const config: GeneratorConfig<ReportInput & Record<string, unknown>> = {
  title: "Campaign Report",
  subtitle: "Client-ready markdown. No filler. Numbers in, narrative out.",
  platform: "google",
  campaign_type: "Report",
  maxTokens: 2200,
  expectJson: false,
  temperature: 0.6,
  fields: [
    { name: "period", label: "Period", kind: "text", required: true, placeholder: "May 2026 (4 weeks)", span: 2 },
    { name: "total_spend", label: "Total spend ($)", kind: "text", required: true, placeholder: "8420" },
    { name: "total_revenue", label: "Total revenue/value ($)", kind: "text", required: true, placeholder: "28500" },
    { name: "target_roas", label: "Target ROAS", kind: "text", placeholder: "3.5" },
    { name: "target_cpa", label: "Target CPA", kind: "text", placeholder: "45" },
    { name: "campaigns", label: "Campaigns & numbers", kind: "textarea", required: true, rows: 8, placeholder: "List campaigns with platform + spend + clicks + conversions + revenue. Free-form is fine.", span: 2 },
    { name: "audience", label: "Audience", kind: "text", required: true, placeholder: "e.g. SMB owners" },
    { name: "business_type", label: "Business type", kind: "text", required: true, placeholder: "B2B SaaS" },
  ],
  initial: { period: "", total_spend: "", total_revenue: "", target_roas: "", target_cpa: "", campaigns: "", audience: "", business_type: "" } as any,
  buildPrompt: (input) => buildReportPrompt(input as unknown as ReportInput),
  buildTitle: (i: any) => `Report · ${i.period}`,
  renderStreaming: (text: string) => (
    <div className="border border-base-600 bg-base-900/40 p-5">
      <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-subtle mb-3 flex items-center gap-2">
        <span className="h-1 w-1 bg-live animate-pulse-soft" />
        report · streaming
      </div>
      <div className="caret">
        <Markdown text={text} />
      </div>
    </div>
  ),
};

export default function Page() {
  return <GeneratorShell config={config} scope="report" />;
}
