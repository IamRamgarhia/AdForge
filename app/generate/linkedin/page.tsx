"use client";

import { GeneratorShell } from "@/components/GeneratorShell";
import { Section, Pill } from "@/components/OutputBlocks";
import { CopyButton } from "@/components/CopyButton";
import { CharBadge } from "@/components/CharBadge";
import { buildLinkedInPrompt, LINKEDIN_LIMITS, type LinkedInInput } from "@/lib/prompts/linkedin-ads";
import type { GeneratorConfig } from "@/lib/generator-config";

const config: GeneratorConfig<LinkedInInput & Record<string, unknown>> = {
  title: "LinkedIn — B2B",
  subtitle: "Decision-maker tone. Industry-specific outcomes, peer proof, contrarian POV.",
  platform: "linkedin",
  campaign_type: "Sponsored",
  maxTokens: 3500,
  temperature: 0.7,
  fields: [
    {
      name: "format",
      label: "Format",
      kind: "select",
      options: [
        { value: "sponsored_content", label: "Sponsored Content" },
        { value: "message_ad", label: "Message Ad" },
        { value: "dynamic_ad", label: "Dynamic Ad" },
        { value: "text_ad", label: "Text Ad" },
        { value: "lead_gen_form", label: "Lead Gen Form" },
      ],
    },
    {
      name: "objective",
      label: "Objective",
      kind: "select",
      options: [
        { value: "brand awareness", label: "Brand awareness" },
        { value: "website visits", label: "Website visits" },
        { value: "engagement", label: "Engagement" },
        { value: "lead generation", label: "Lead generation" },
        { value: "talent leads", label: "Talent leads" },
      ],
    },
    { name: "product", label: "Product", kind: "text", required: true, placeholder: "e.g. fraud-detection API", span: 2 },
    { name: "audience", label: "Audience (role/industry/seniority)", kind: "text", required: true, placeholder: "VP Engineering, fintech, 50-500 employees", span: 2 },
    { name: "cta", label: "CTA", kind: "text", placeholder: "Request Demo" },
  ],
  initial: { format: "sponsored_content", objective: "lead generation", product: "", audience: "", cta: "" } as any,
  buildPrompt: (input) => buildLinkedInPrompt(input as unknown as LinkedInInput),
  buildTitle: (i: any) => `LinkedIn · ${i.format} · ${i.product}`,
  expectJson: true,
  renderJson: (json) => <LinkedInOutput json={json} />,
};

export default function Page() {
  return <GeneratorShell config={config} scope="generate/linkedin" />;
}

function LinkedInOutput({ json }: { json: any }) {
  return (
    <div className="space-y-4 stagger">
      {(json?.variants ?? []).map((v: any, i: number) => (
        <Section key={i} title={`Variant ${v.label} · ${v.angle}`} actions={<CopyButton text={`${v.intro_text}\n\n${v.headline}\n${v.description}`} label="copy variant" />}>
          <div className="space-y-3 text-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-mono uppercase tracking-ui-mega text-ink-faint">intro</span>
                <CharBadge count={v.char_counts?.intro ?? v.intro_text?.length ?? 0} max={LINKEDIN_LIMITS.intro_recommended} />
              </div>
              <p className="text-ink whitespace-pre-line">{v.intro_text}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-mono uppercase tracking-ui-mega text-ink-faint">headline</span>
                <CharBadge count={v.char_counts?.headline ?? v.headline?.length ?? 0} max={LINKEDIN_LIMITS.headline_recommended} />
              </div>
              <p className="text-ink font-medium">{v.headline}</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-mono uppercase tracking-ui-mega text-ink-faint">desc</span>
                <CharBadge count={v.char_counts?.description ?? v.description?.length ?? 0} max={LINKEDIN_LIMITS.description_recommended} />
              </div>
              <p className="text-ink-muted">{v.description}</p>
            </div>
            <Pill text={v.cta_button} tone="live" label="cta" />
          </div>
        </Section>
      ))}

      {json?.lead_form ? (
        <Section title="Lead Gen Form">
          <p className="text-sm text-ink mb-3">{json.lead_form.form_intro}</p>
          <ul className="space-y-1.5 text-xs">
            {json.lead_form.questions?.map((q: any, i: number) => (
              <li key={i} className="flex gap-2 border border-base-700 px-2 py-1.5">
                <span className="font-mono text-ink-faint w-6 tabular">{i + 1}</span>
                <span className="text-[9px] font-mono uppercase tracking-ui-mega text-live w-14 mt-0.5">{q.type}</span>
                <span className="flex-1 text-ink">{q.question}</span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {json?.audience_targeting ? (
        <Section title="Targeting">
          <div className="grid md:grid-cols-2 gap-2 text-xs">
            <Field k="Titles" v={json.audience_targeting.job_titles?.join(", ")} />
            <Field k="Seniority" v={json.audience_targeting.seniority?.join(", ")} />
            <Field k="Industries" v={json.audience_targeting.industries?.join(", ")} />
            <Field k="Skills" v={json.audience_targeting.skills?.join(", ")} />
            <Field k="Company size" v={json.audience_targeting.company_size} />
            <Field k="Exclude" v={json.audience_targeting.exclusions?.join(", ")} />
          </div>
        </Section>
      ) : null}
    </div>
  );
}

function Field({ k, v }: { k: string; v?: string }) {
  if (!v) return null;
  return (
    <div className="border border-base-700 p-2">
      <div className="text-[9px] font-mono uppercase tracking-ui-mega text-ink-faint">{k}</div>
      <div className="text-ink mt-0.5">{v}</div>
    </div>
  );
}
