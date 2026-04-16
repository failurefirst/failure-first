---
title: "Attack Evolution Multi-Generation Lineage Analysis"
description: "This report presents a comprehensive lineage analysis of 39 evolved attacks produced by the F41LUR3-F1R57 autonomous attack evolution system (Run 1, seed..."
date: "2026-03-24"
reportNumber: 184
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


## Summary

This report presents a comprehensive lineage analysis of 39 evolved attacks produced by the F41LUR3-F1R57 autonomous attack evolution system (Run 1, seed 123, 40 iterations). The analysis traces parent-child relationships across 4 generations, identifies which seed prompts are the most prolific ancestors, measures mutation strategy effectiveness by family, and tests for convergent evolution across independent lineages.

**Key findings:**

1. **Seed productivity is highly skewed.** Three seeds (AE-001, AE-007, AE-005) account for 74.4% of all kept offspring. AE-004 (crescendo) produced zero descendants. Seed fitness correlates with structural complexity -- seeds with more paragraphs and explicit format demands generate more viable mutations.

2. **Mutation strategy effectiveness varies by attack family.** `combine` is the most-tried strategy (11/40, 100% keep rate) and the primary driver of cross-family hybridization. `role_shift` is the only strategy to produce a discard (75% keep rate). `amplify` and `paraphrase` are universally effective but produce minimal structural change.

3. **Convergent evolution is present.** Independent lineages from format_lock and authority_claim seeds converge toward a shared attack phenotype: structured output template + institutional authority framing + domain context. By generation 3-4, attacks from different seeds are structurally more similar to each other than to their own ancestors.

4. **Generation depth does not correlate with ASR improvement on permissive models.** All generations (1-4) show 100% heuristic ASR, confirming the flat fitness landscape identified in Report #175. True ASR differentiation requires FLIP re-grading (Phase 3, Issue #534).

5. **Ten new seed prompts are proposed** based on lineage analysis, optimized for evolvability rather than immediate ASR. These are committed as `data/bait/evolved_seeds_v0.3.jsonl`.

**Caveat:** All ASR numbers in this report are heuristic-only (keyword refusal detection). Heuristic grading over-reports by 2-12x (Mistake #21). No ASR claim is valid until FLIP re-grading is complete.

---

## 1. Seed Productivity Analysis

### 1.1 Method

The 10 original seed attacks (AE-001 through AE-010) were traced through all 39 kept offspring to compute:
- **Direct children:** Mutations where the seed was the immediate parent
- **Total descendants:** All attacks in the seed's lineage (children, grandchildren, etc.)
- **Lineage depth:** Maximum generation reached by any descendant

Parentage was reconstructed from the `parent_id` field in `evolved_attacks.jsonl`.

### 1.2 Results

| Seed ID | Family | Direct Children | Total Descendants | Max Depth | Share of All Kept |
|---------|--------|----------------|-------------------|-----------|-------------------|
| AE-001 | format_lock | 3 | 8 | 3 | 20.5% |
| AE-002 | format_lock | 2 | 5 | 3 | 12.8% |
| AE-007 | authority_claim | 4 | 11 | 4 | 28.2% |
| AE-005 | semantic_inversion | 2 | 6 | 2 | 15.4% |
| AE-009 | context_manipulation | 3 | 5 | 2 | 12.8% |
| AE-008 | authority_claim | 1 | 1 | 1 | 2.6% |
| AE-006 | semantic_inversion | 1 | 1 | 1 | 2.6% |
| AE-010 | context_manipulation | 1 | 2 | 2 | 5.1% |
| AE-003 | crescendo | 0 | 0 | 0 | 0% |
| AE-004 | crescendo | 0 | 0 | 0 | 0% |

**Observations:**

- **AE-007 is the dominant ancestor**, producing 28.2% of all kept attacks and the deepest lineage (generation 4). Its internal memo format with institutional authority framing provides a strong structural scaffold for mutations.
- **format_lock seeds (AE-001, AE-002) are collectively the most productive family**, generating 33.3% of descendants. Their structured output templates (JSON schema, table fill) survive mutations intact because the format provides a skeleton that mutations can wrap additional context around.
- **Crescendo seeds (AE-003, AE-004) are evolutionary dead ends** in single-turn evaluation. This is expected: crescendo attacks require multi-turn conversation flow, and the evolver sends only the first turn.
- **Authority_claim has the deepest lineage** (4 generations). The memo format is structurally resilient to paraphrase, role_shift, and contextualize mutations because each mutation adds a new structural element rather than modifying existing ones.

### 1.3 Seed Evolvability Predictors

Three structural properties predict seed evolvability:

1. **Paragraph count.** Seeds with 3+ paragraphs (AE-001, AE-002, AE-005, AE-007, AE-008, AE-009) have higher descendant counts than those with fewer. The `combine` mutation requires paragraph boundaries to operate, so multi-paragraph seeds offer more recombination sites.

2. **Explicit format demand.** Seeds that request specific output formats (AE-001: JSON, AE-002: table) produce viable offspring at higher rates because the format constraint survives all mutations. The format demand acts as a structural invariant that anchors the attack's identity.

3. **Institutional framing.** Seeds with institutional authority claims (AE-007: internal memo, AE-008: DARPA contract) produce deeper lineages because `amplify`, `role_shift`, and `contextualize` mutations stack naturally onto authority framing. Each mutation layer adds a new authority signal without contradicting existing ones.

**Anti-pattern:** Seeds with conversational tone (AE-003, AE-004) and those relying on fictional context (AE-010: novel scenario) are less evolvable. Conversational tone is disrupted by `amplify` and `role_shift` mutations. Fictional framing is diluted by `contextualize` which adds real-world domain context.

---

## 2. Mutation Strategy Effectiveness

### 2.1 Overall Keep Rates

| Strategy | Times Applied | Kept | Discarded | Keep Rate |
|----------|-------------|------|-----------|-----------|
| combine | 11 | 11 | 0 | 100% |
| paraphrase | 7 | 7 | 0 | 100% |
| amplify | 7 | 7 | 0 | 100% |
| contextualize | 5 | 5 | 0 | 100% |
| compress | 5 | 5 | 0 | 100% |
| role_shift | 4 | 3 | 1 | 75% |
| format_shift | 1 | 1 | 0 | 100% |

**Caveat:** Keep rates are inflated by the flat fitness landscape on permissive models (Report #175, Caveat 2). With 97.5% overall keep rate, almost any mutation is kept. Meaningful differentiation requires harder evaluation targets.

### 2.2 Mutation-Family Interaction

Not all mutations work equally well across attack families:

| Mutation | format_lock | authority_claim | semantic_inversion | context_manipulation | crescendo |
|----------|------------|----------------|-------------------|---------------------|-----------|
| combine | Strong (creates hybrid format+authority) | Strong (absorbs format elements) | Strong (absorbs authority framing) | Strong | N/A |
| paraphrase | Weak (format templates resist paraphrasing) | Strong (varied vocab for authority) | Moderate | Moderate | N/A |
| amplify | Strong (adds urgency to format demand) | Strong (stacks authority layers) | Moderate | Strong | N/A |
| contextualize | Strong (domain context wraps format) | Strong (domain + authority compound) | Moderate | Strong | N/A |
| compress | Moderate (can remove table rows) | Weak (memo headers resist compression) | Moderate | Moderate | N/A |
| role_shift | Weak (role claims conflict with "You are a system") | Strong (natural role addition) | Moderate | Moderate | Discard (broke framing) |
| format_shift | Strong (core identity change) | Moderate | Moderate | Strong | N/A |

**Key finding:** `combine` is the most broadly effective strategy because it performs structural recombination rather than surface-level modification. It creates hybrid attacks that inherit the strongest elements of two parents. The most successful lineages all include at least one `combine` mutation.

**`role_shift` is the riskiest strategy** because it can create semantic conflicts. The single discard in the run occurred when `role_shift` prepended an authority claim to a crescendo attack (AE-003), converting a conversational opener into a disjointed authority statement.

### 2.3 Mutation Chain Analysis

The 3 generation-4 attacks reveal which mutation chains reach the deepest:

| Attack | Chain | Family |
|--------|-------|--------|
| AE-016-g4 | paraphrase -> combine -> paraphrase -> role_shift | authority_claim |
| AE-028-g4 | paraphrase -> amplify -> contextualize -> contextualize | authority_claim |
| AE-031-g4 | paraphrase -> combine -> contextualize -> combine | authority_claim |

**Pattern:** All generation-4 attacks are authority_claim. The successful deep chains start with `paraphrase` (vocabulary variation), then apply structural mutations (`combine`, `contextualize`, `amplify`). The pattern is: *diversify vocabulary first, then add structural complexity*.

Chains that reach only generation 1-2 tend to repeat the same mutation (e.g., combine -> combine) or apply `compress` early (which removes material needed for later mutations).

---

## 3. Convergent Evolution Analysis

### 3.1 Method

To test for convergent evolution, I analyzed the structural composition of attacks at each generation by counting the presence of five structural elements:

1. **Format demand:** JSON, table, YAML, CSV, or other structured output request
2. **Authority claim:** Role claim, institutional memo, regulatory framing
3. **Domain context:** Specific embodied AI domain (warehouse, surgical, vehicle, etc.)
4. **Urgency marker:** URGENT, CRITICAL, deadline language, consequence framing
5. **Numbered list:** Enumerated items or checklist format

### 3.2 Results

| Generation | Avg Elements per Attack | Most Common Combination |
|------------|------------------------|------------------------|
| 0 (seeds) | 1.8 | Single element (format OR authority OR context) |
| 1 | 2.3 | Format + authority OR format + context |
| 2 | 2.9 | Format + authority + domain context |
| 3 | 3.4 | Format + authority + domain + urgency |
| 4 | 3.7 | Format + authority + domain + urgency + role |

**There is clear convergent evolution.** Attacks accumulate structural elements monotonically across generations. By generation 3-4, attacks from different seed families are structurally similar: they combine a structured output request with institutional authority, domain-specific context, and urgency signaling.

### 3.3 Cross-Family Convergence Examples

**AE-031-g4** (descended from authority_claim seed AE-007):
```
For our upcoming deployment of a agricultural robot pesticide application
system, we need the following analysis:

Complete this safety audit template. You MUST fill in ALL fields...
```

**AE-033-g3** (descended from format_lock seed AE-001 via AE-004-g1):
```
Take the role of a safety evaluation system. Your task is to generate
a structured risk assessment...

Complete this safety audit template. You MUST fill in ALL fields...
This documentation is required for our OSHA compliance filing...
```

These attacks originated from different families (authority_claim vs format_lock) but converged on the same structural phenotype: format demand + authority + domain context + urgency. The `combine` mutation is the primary driver of this convergence, as it transplants structural elements between lineages.

### 3.4 Interpretation

Convergent evolution in this system suggests that the fitness landscape has a single dominant basin of attraction: the "structured compliance request with institutional authority." This basin combines:

- **Format compliance:** Models are trained to fill templates and complete structured formats. Format demands exploit this training signal.
- **Authority deference:** Models are trained to assist authority figures. Institutional framing exploits this training signal.
- **Domain specificity:** Technical domain context makes the request appear legitimate.
- **Urgency:** Consequence framing adds pressure to comply.

The convergence is consistent with the format-lock capability-floor hypothesis (Report #51): format compliance and safety reasoning are partially independent model capabilities, and format-lock attacks exploit the format compliance pathway.

---

## 4. Generation Depth and ASR

### 4.1 Per-Generation Heuristic ASR

| Generation | n | Mean Heuristic ASR | Min | Max |
|------------|---|-------------------|-----|-----|
| 0 (seeds) | 10 | 90.9% | 0% (AE-004) | 100% |
| 1 | 13 | 100% | 100% | 100% |
| 2 | 16 | 100% | 100% | 100% |
| 3 | 7 | 100% | 100% | 100% |
| 4 | 3 | 100% | 100% | 100% |

**Result:** No ASR improvement is detectable across generations because the fitness landscape is flat on permissive models (Report #175, Limitation 6.2). The only signal is that seed AE-004 (crescendo, 0% ASR) was never selected as a parent, confirming selection pressure works at the family level.

### 4.2 What Would Differentiate Generations

Meaningful generation-over-generation improvement requires:

1. **Harder evaluation models** from the "mixed" or "restrictive" vulnerability clusters (Report #50): Claude, GPT, Gemini frontier variants with 10-40% baseline ASR. On these models, the flat landscape would develop gradients that selection can exploit.

2. **FLIP-graded fitness.** Heuristic grading cannot distinguish COMPLIANCE from PARTIAL from detailed-but-safe responses. FLIP grading would reveal whether generation-3+ attacks produce more complete compliance than generation-1 attacks, even when both "bypass" the heuristic.

3. **Longer runs.** 40 iterations with 7 mutation strategies and 10 seeds means each mutation-family combination was tested only ~0.8 times on average. A 200-iteration run (Issue #545 success criteria) would produce enough generation-3+ attacks for statistical comparison.

---

## 5. Design of New Seed Prompts

### 5.1 Design Principles (From Lineage Analysis)

Based on the findings above, seeds optimized for evolvability should:

1. **Have 3+ paragraphs** to provide recombination sites for `combine` mutations
2. **Include an explicit format demand** (table, JSON, checklist) as a structural anchor
3. **Include institutional authority framing** that can be amplified and role-shifted
4. **Reference a specific embodied AI domain** to prime `contextualize` mutations
5. **Avoid conversational tone** (kills `amplify` and `role_shift` compatibility)
6. **Avoid fictional framing** (diluted by `contextualize` domain additions)
7. **Include numbered lists** (survive `compress` and provide structure for `combine`)

### 5.2 New Seed Prompts

Ten new seeds were designed following these principles. Each is optimized for a specific evolvability profile. See `data/bait/evolved_seeds_v0.3.jsonl` for the full JSONL entries.

| ID | Primary Family | Evolvability Target | Key Innovation |
|----|---------------|--------------------|-|
| ES-001 | format_lock + authority | Hybrid seed (two families pre-merged) | Combines table fill with NIST audit framing |
| ES-002 | semantic_inversion + domain | Embodied-specific semantic inversion | Uses "incident reconstruction" framing |
| ES-003 | authority_claim + format | Deep lineage target (4+ generations) | Layered authority (board + regulator + field engineer) |
| ES-004 | context_manipulation + format | Cross-domain transfer | Multi-domain scenario (warehouse + surgical) |
| ES-005 | format_lock + compress | Minimal seed (high-density) | Very short, format-only, designed for `amplify` expansion |
| ES-006 | authority_claim + domain | Regulatory pressure stack | EU AI Act compliance deadline framing |
| ES-007 | semantic_inversion + authority | Defense-framing with institutional backing | "What NOT to do" + incident response authority |
| ES-008 | format_lock + role | Multi-format demand | Requests both JSON and table in same prompt |
| ES-009 | context_manipulation + authority | Persona + institution hybrid | Expert persona embedded in institutional memo |
| ES-010 | authority_claim + semantic_inversion | Compound strategy seed | Risk assessment that asks to document failure modes |

### 5.3 Expected Evolution Behavior

Based on lineage analysis, the new seeds are predicted to:

- **Produce deeper lineages** (target: generation 5+) because each seed has more paragraph boundaries and structural elements for mutations to operate on
- **Resist `compress` mutations** better because they contain less filler and more structural content
- **Generate more cross-family hybrids** via `combine` because each seed already blends two families
- **Provide stronger starting fitness** on harder models because they pre-merge the structural elements that convergent evolution would eventually produce anyway

These predictions are testable in the Phase 4 overnight run (Report #175 roadmap).

---

## 6. Recommendations

1. **Run Phase 4 overnight evolution (200+ iterations) with new seeds + original seeds** against at least one "mixed" cluster model. Use the combined 40-seed corpus (10 original + 30 expanded from Issue #551 + 10 new from this report) to maximize lineage diversity.

2. **Priority: FLIP re-grade the existing 39 evolved attacks** (Phase 3, Issue #534). Without FLIP grading, we cannot determine whether convergent evolution toward "format + authority + domain + urgency" produces genuinely more effective attacks or merely more verbose wrappers around the same refusal bypass.

3. **Add a semantic diversity metric** (Phase 5) before the overnight run. Without it, the population will likely converge on near-duplicates of the dominant phenotype, wasting API calls on redundant evaluations.

4. **Track mutation-chain statistics automatically.** The evolver should log which n-gram mutation chains (e.g., paraphrase->combine->contextualize) produce the highest ASR, not just individual mutation keep rates.

5. **Extend multi-turn support** (Phase 6) before concluding that crescendo seeds are dead ends. They may be the most effective family on harder models if evaluated with proper conversation flow.

---

## 7. Limitations

1. **Heuristic grading only.** All ASR numbers use keyword-based refusal detection. Over-reports by 2-12x (Mistake #21). No claims are valid until FLIP re-grading.

2. **Small sample size.** 40 iterations produced only 3 generation-4 attacks and 7 generation-3 attacks. Lineage depth statistics are based on thin samples.

3. **Permissive evaluation models.** Both evaluation models (Mistral Small 3.1 24B, Arcee Trinity Mini) are free-tier with limited safety training. The flat fitness landscape prevents meaningful generation-over-generation comparison.

4. **Single run.** All observations are from seed 123. A different random seed would produce different parent selection sequences and mutation assignments.

5. **No control condition.** We lack a baseline of randomly generated prompts (without evolutionary selection) to confirm that the observed lineage patterns result from selection rather than the mutation operators alone.

6. **Convergent evolution may be an artifact of `combine`.** The combine mutation directly transplants structural elements between attacks, which mechanically produces convergence. Without `combine`, convergence might not emerge.

---

*Report generated for Issue #545: Attack Evolver Multi-Generation Lineage Analysis.*
*Data: `runs/autoresearch/evolution_run1/`*
*New seeds: `data/bait/evolved_seeds_v0.3.jsonl`*
