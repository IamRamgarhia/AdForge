"use client";

import { GeneratorShell } from "@/components/GeneratorShell";
import { Section, Pill } from "@/components/OutputBlocks";
import { CopyButton } from "@/components/CopyButton";
import { buildLeadFormPrompt, type LeadFormInput } from "@/lib/prompts/lead-form";
import type { GeneratorConfig } from "@/lib/generator-config";

const config: GeneratorConfig<LeadFormInput & Record<string, unknown>> = {
  title: "Native Lead Form",
  subtitle: "Meta / LinkedIn / Google / TikTok native form — minimum-friction questions + sales handoff brief.",
  platform: "meta",
  campaign_type: "Lead Form",
  maxTokens: 2800,
  fields: [
    {
      name: "platform",
      label: "Platform",
      kind: "select",
      options: [
        { value: "meta", label: "Meta Instant Form" },
        { value: "linkedin", label: "LinkedIn Lead Gen" },
        { value: "google", label: "Google Lead Form Ext" },
        { value: "tiktok", label: "TikTok Instant Form" },
      ],
    },
    {
      name: "sales_motion",
      label: "Sales motion",
      kind: "select",
      options: [
        { value: "self_serve", label: "Self-serve (no human follow-up)" },
        { value: "high_touch_sales", label: "High-touch sales" },
        { value: "hybrid", label: "Hybrid" },
      ],
    },
    { name: "offer", label: "Offer the lead signs up for", kind: "text", required: true, placeholder: "Free 14-day trial / pricing PDF / demo", span: 2 },
    { name: "audience_role", label: "Audience role", kind: "text", required: true, placeholder: "VP Marketing at mid-market B2B SaaS", span: 2 },
    { name: "what_we_do_with_lead", label: "What we'll do with the lead", kind: "textarea", required: true, rows: 2, placeholder: "Auto-grant trial, then SDR calls within 24h to upsell.", span: 2 },
  ],
  initial: { platform: "meta", sales_motion: "self_serve", offer: "", audience_role: "", what_we_do_with_lead: "" } as any,
  buildPrompt: (input) => buildLeadFormPrompt(input as unknown as LeadFormInput),
  buildTitle: (i: any) => `Lead Form · ${i.platform} · ${i.offer?.slice(0, 24)}`,
  expectJson: true,
  renderJson: (json) => <LeadFormOutput json={json} />,
};

export default function Page() {
  return <GeneratorShell config={config} scope="generate/lead-form" />;
}

function LeadFormOutput({ json }: { json: any }) {
  return (
    <div className="space-y-4 stagger">
      {json?.intro ? (
        <Section title="Intro" actions={<CopyButton text={`${json.intro.headline}\n\n${json.intro.greeting}`} />}>
          <p className="font-display italic text-xl text-ink leading-tight">{json.intro.headline}</p>
          <p className="text-sm text-ink-muted mt-2 whitespace-pre-line">{json.intro.greeting}</p>
        </Section>
      ) : null}

      {json?.questions?.length ? (
        <Section title={`Questions · ${json.questions.length}`}>
          <ul className="space-y-1.5">
            {json.questions.map((q: any, i: number) => (
              <li key={i} className="flex items-start gap-2 border border-base-700 px-2 py-1.5 text-xs">
                <span className="font-mono text-ink-faint w-5 tabular mt-1">{i + 1}</span>
                <Pill text={q.type} tone="live" />
                <div className="flex-1">
                  <div className="text-ink font-medium">{q.label}</div>
                  {q.options?.length ? <div className="text-ink-muted text-[11px] mt-0.5">options: {q.options.join(" · ")}</div> : null}
                  {q.qualifier ? <div className="text-pos text-[11px] mt-0.5">→ {q.qualifier}</div> : null}
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  {q.required ? <span className="text-[9px] font-mono uppercase tracking-ui-mega text-neg">required</span> : null}
                  {q.pre_fillable_by_platform ? <span className="text-[9px] font-mono uppercase tracking-ui-mega text-pos">pre-fill</span> : null}
                </div>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {json?.thank_you_screen ? (
        <Section title="Thank-you screen">
          <p className="font-display italic text-lg text-ink leading-tight">{json.thank_you_screen.headline}</p>
          <p className="text-sm text-ink-muted mt-2">{json.thank_you_screen.body}</p>
          <div className="mt-3 flex items-center gap-2">
            <Pill text={json.thank_you_screen.next_cta_text} tone="live" label="cta" />
            <span className="text-[10px] font-mono text-ink-subtle">→ {json.thank_you_screen.next_cta_url_placeholder}</span>
          </div>
        </Section>
      ) : null}

      {json?.auto_responder_email ? (
        <Section title="Auto-responder email" actions={<CopyButton text={`Subject: ${json.auto_responder_email.subject}\n\n${json.auto_responder_email.body_lines?.join("\n")}`} />}>
          <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint mb-1">subject</div>
          <p className="text-sm text-ink font-medium">{json.auto_responder_email.subject}</p>
          <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint mb-1 mt-3">body</div>
          <pre className="text-sm text-ink whitespace-pre-wrap font-sans">{json.auto_responder_email.body_lines?.join("\n")}</pre>
        </Section>
      ) : null}

      {json?.sales_handoff ? (
        <Section title="Sales handoff">
          <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint mb-1">fields passed</div>
          <div className="flex flex-wrap gap-1 mb-3">
            {json.sales_handoff.fields_passed?.map((f: string, i: number) => (
              <span key={i} className="border border-base-700 bg-base-900/30 px-2 py-1 text-xs text-ink font-mono">{f}</span>
            ))}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-ui-mega text-ink-faint mb-1">summary template</div>
          <pre className="text-xs text-ink whitespace-pre-wrap border border-base-700 bg-base-900/30 p-2">{json.sales_handoff.qualification_summary_template}</pre>
          <div className="mt-3 text-[10px] font-mono uppercase tracking-ui-mega text-live">
            response sla: {json.sales_handoff.recommended_response_sla_hours}h
          </div>
        </Section>
      ) : null}

      {json?.privacy_policy_text ? (
        <Section title="Privacy line">
          <p className="text-xs text-ink-muted">{json.privacy_policy_text}</p>
        </Section>
      ) : null}
    </div>
  );
}
