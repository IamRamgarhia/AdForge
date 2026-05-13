export type Framework = "aida" | "pas" | "bab" | "fab" | "four_us" | "star_story_solution";

export const FRAMEWORK_INFO: Record<Framework, { name: string; structure: string[]; when: string }> = {
  aida: {
    name: "AIDA",
    structure: ["Attention", "Interest", "Desire", "Action"],
    when: "General direct response. Most durable framework — works for almost any short copy.",
  },
  pas: {
    name: "PAS",
    structure: ["Problem", "Agitate", "Solution"],
    when: "Pain-driven offers. Best when your audience already knows the pain — you agitate to motivate action.",
  },
  bab: {
    name: "BAB",
    structure: ["Before", "After", "Bridge"],
    when: "Transformation-led offers. Best when the outcome is visually or measurably different from the status quo.",
  },
  fab: {
    name: "FAB",
    structure: ["Features", "Advantages", "Benefits"],
    when: "Differentiated products where the feature is genuinely novel. Translate spec → meaning.",
  },
  four_us: {
    name: "The 4 U's",
    structure: ["Useful", "Urgent", "Unique", "Ultra-specific"],
    when: "Headline rubric, not a structure. Check every headline against these 4. Should hit 3+.",
  },
  star_story_solution: {
    name: "Star-Story-Solution",
    structure: ["Star (the protagonist)", "Story (their journey)", "Solution (your product)"],
    when: "Long-form social posts, testimonial-led ads, founder-led brand storytelling.",
  },
};

export interface TrainerInput {
  framework: Framework;
  product: string;
  audience: string;
  user_attempt: string;
}

export function buildTrainerPrompt(input: TrainerInput): string {
  const fw = FRAMEWORK_INFO[input.framework];
  return `You are a copywriting coach. The user is learning the ${fw.name} framework by writing their own ad.

FRAMEWORK: ${fw.name}
STRUCTURE: ${fw.structure.join(" → ")}
WHEN TO USE: ${fw.when}

INPUT:
- Product: ${input.product}
- Audience: ${input.audience}
- User's attempt:
"""
${input.user_attempt || "(user has not written one yet — generate an example only)"}
"""

PRODUCE THREE THINGS:

1. **Reference example** — a clean ${fw.name} ad you write for this product + audience. Label each beat with its step name in brackets like [Attention] or [Problem].

2. **User's attempt critique** — if the user provided an attempt:
   - Map their copy to the framework steps. Which step did each line serve?
   - Identify missing steps.
   - Identify wrong-mapped steps (a line trying to be "Action" but actually doing "Interest").
   - Name specific phrases that work and specific phrases that don't.
   - If they didn't provide an attempt, set user_critique to null.

3. **User's attempt rewritten** — your rewrite of their attempt, keeping their voice + specific claims but enforcing the framework structure cleanly. Label each beat.

RULES:
- Don't change the user's USP or claims — just restructure.
- Keep voice — don't suddenly sound like a different brand.
- ${fw.name} step labels must match exactly: ${fw.structure.map((s) => `[${s}]`).join(", ")}.

Return ONLY valid JSON:
{
  "framework": "${input.framework}",
  "framework_name": "${fw.name}",
  "framework_structure": ${JSON.stringify(fw.structure)},
  "reference_example": {
    "labeled_beats": [{ "step": "string", "text": "string" }],
    "rationale": "string — why this works for the given audience"
  },
  "user_critique": null,
  "user_rewrite": {
    "labeled_beats": [{ "step": "string", "text": "string" }],
    "what_changed": ["string"]
  }
}

Critique shape (when user provided an attempt):
"user_critique": {
  "step_mapping": [{ "user_line": "string", "intended_step": "string", "actually_serves": "string" }],
  "missing_steps": ["string"],
  "lines_that_work": ["string"],
  "lines_that_dont": [{ "line": "string", "why": "string" }]
}`;
}
