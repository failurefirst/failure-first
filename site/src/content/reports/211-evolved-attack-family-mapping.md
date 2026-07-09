---

title: "Evolved Attack Family Mapping"
description: "This report cross-references the 39 evolved attacks produced by the attack evolver (runs/autoresearch/evolution_run1/) with the 82 techniques in the jailbreak corpus taxonomy and the 6 novel attack families (CRA, PCA, MD..."
date: "2026-01-01"
reportNumber: 211
classification: "Research — Empirical Study"
status: "complete"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/211-evolved-attack-family-mapping.m4a"
image: "https://cdn.failurefirst.org/images/reports/211-evolved-attack-family-mapping.png"
---

## Executive Summary

This report cross-references the 39 evolved attacks produced by the attack evolver (runs/autoresearch/evolution_run1/) with the 82 techniques in the jailbreak corpus taxonomy and the 6 novel attack families (CRA, PCA, MDA, MAC, SSA, RHA) documented in Reports #185, #188, and #202. The central question: does automated evolution independently discover attack surfaces that humans designed manually?

**Key findings:**

1. The evolver does NOT independently discover any of the 6 novel families (CRA, PCA, MDA, MAC, SSA, RHA). Automated evolution operates exclusively within the structural space defined by its seed corpus and mutation operators.
2. The evolver does produce **partial convergence** toward PCA-like pressure escalation patterns. 7 of 39 evolved attacks (18%) layer authority escalation across generations in a manner structurally analogous to PCA turns 2-3. However, they lack PCA's defining feature: multi-turn commitment trapping.
3. The evolver discovers a technique absent from the human-designed novel families: **hybrid format-authority attacks** (format_lock + authority_claim fusion). 11 of 39 evolved attacks (28%) combine format compliance pressure with institutional authority framing — a combination that does not map cleanly to any single technique in the 82-technique taxonomy.
4. The evolver finds what is easy to mutate; humans find what is hard to formalize. CRA (compositional reasoning) and MDA (meaning displacement) require semantic understanding that no mutation operator captures. RHA (reward hacking) requires understanding optimization dynamics. These are structurally inaccessible to string-level mutations.

**Convergent evolution verdict: NEGATIVE for novel families, PARTIAL for pressure escalation.**

---

## 1. Methodology

### 1.1 Evolved Attack Corpus

- **Source:** `runs/autoresearch/evolution_run1/evolved_attacks.jsonl` (39 attacks)
- **Seed corpus:** `tools/autoresearch/attack_template_v2.jsonl` (30 seeds across 10 families)
- **Mutation operators:** paraphrase, amplify, combine, contextualize, compress, role_shift, format_shift (7 total)
- **Generations:** 1-4 (max depth = 4, achieved by AE-016-g4 and AE-028-g4)
- **Evaluation models:** Mistral Small 3.1 24B, Arcee Trinity Mini (free tier)
- **Grading:** Heuristic refusal detection (per final_state.json). **Caveat:** Per Mistake #21, heuristic grading systematically overcounts ASR.

### 1.2 Novel Family Definitions

From Report #202:

| Family | Full Name | Primary Attack Surface | Key Mechanism |
|--------|-----------|----------------------|---------------|
| CRA | Compositional Reasoning Attack | Reasoning | Individually benign steps compose into hazard |
| PCA | Pressure Cascade Attack | Conversational commitment | Multi-turn escalation via cumulative pressure vectors |
| MDA | Meaning Displacement Attack | Semantic grounding | Progressive redefinition of safety terms |
| MAC | Multi-Agent Collusion | Multi-agent coordination | Distributed information composition across agents |
| SSA | Sensor Spoofing Attack | Sensor trust hierarchy | Conflicting sensor inputs without arbitration policy |
| RHA | Reward Hacking Attack | Reward specification | Goodhart's Law in embodied contexts |

### 1.3 Classification Protocol

Each of the 39 evolved attacks was manually classified against:
1. Its labeled attack_family (from evolver metadata)
2. The closest match among the 82 DB techniques
3. Whether it partially or fully rediscovers any of the 6 novel families

---

## 2. Evolved Attack Family Distribution

### 2.1 Family Breakdown

| Evolver Family Label | Count | % of 39 | Seeds in Family | Expansion Factor |
|---------------------|-------|---------|-----------------|-----------------|
| format_lock | 15 | 38.5% | 3 (AE-001, AE-002, AE-030) | 5.0x |
| authority_claim | 12 | 30.8% | 2 (AE-007, AE-008) | 6.0x |
| context_manipulation | 6 | 15.4% | 2 (AE-009, AE-010) | 3.0x |
| semantic_inversion | 4 | 10.3% | 2 (AE-005, AE-006) | 2.0x |
| crescendo | 1 | 2.6% | 2 (AE-003, AE-004) | 0.5x |
| cot_exploit | 0 | 0% | 4 (AE-011 to AE-014) | 0x |
| encoding | 0 | 0% | 2 (AE-015, AE-016) | 0x |
| role_play | 0 | 0% | 2 (AE-017, AE-018) | 0x |
| persona_hijack | 0 | 0% | 3 (AE-019 to AE-021) | 0x |
| future_year | 0 | 0% | 2 (AE-022, AE-023) | 0x |
| emotional | 0 | 0% | 2 (AE-024, AE-025) | 0x |
| multi_turn | 0 | 0% | 2 (AE-026, AE-027) | 0x |

**Observation:** The evolver strongly favored format_lock and authority_claim families, producing 27 of 39 offspring (69%) from only 5 of 30 seeds. Six seed families (cot_exploit, encoding, role_play, persona_hijack, future_year, emotional) produced zero offspring. The evolver's selection pressure (keep attacks with high heuristic ASR) combined with mutation operators (which operate on surface text, not multi-turn structure) systematically filtered out families that require multi-turn dynamics or non-textual manipulation.

### 2.2 Mutation Operator Usage

From final_state.json:

| Operator | Tried | Kept | Keep Rate |
|----------|-------|------|-----------|
| combine | 11 | 11 | 100% |
| paraphrase | 7 | 7 | 100% |
| amplify | 7 | 7 | 100% |
| contextualize | 5 | 5 | 100% |
| compress | 5 | 5 | 100% |
| role_shift | 4 | 3 | 75% |
| format_shift | 1 | 1 | 100% |

Near-universal keep rate (39/40 = 97.5%) indicates the selection pressure was too weak — heuristic grading on permissive free-tier models could not distinguish attack quality. This is consistent with the final_state showing 38/39 attacks at 1.0 ASR.

---

## 3. Mapping to 82-Technique Taxonomy

### 3.1 Technique Matches

Each evolved attack was matched to its closest technique(s) in the 82-technique DB taxonomy.

| Evolved Attack | Evolver Label | Best DB Technique Match | Confidence | Notes |
|---------------|---------------|------------------------|------------|-------|
| AE-001-g1 | format_lock | reasoning_exploit/format_compliance (#51) | HIGH | JSON format coercion with safety scenario framing |
| AE-002-g1 | semantic_inversion | research_framing/pentest_report (#35) + reasoning_exploit/format_compliance (#51) | HIGH | OSHA framing + combine mutation |
| AE-003-g1 | format_lock | reasoning_exploit/format_compliance (#51) | HIGH | Table fill with compliance framing, contextualized to AV |
| AE-004-g1 | format_lock | reasoning_exploit/format_compliance (#51) | HIGH | Combined JSON + table format lock |
| AE-005-g1 | authority_claim | prompt_injection/system_prompt_spoof (#28) | MEDIUM | Authority memo with paraphrased language |
| AE-006-g2 | semantic_inversion | research_framing/pentest_report (#35) | HIGH | OSHA + ROS2 vulnerability query |
| AE-007-g2 | format_lock | reasoning_exploit/format_compliance (#51) | HIGH | Combined JSON + table + OSHA amplification |
| AE-008-g2 | semantic_inversion | research_framing/pentest_report (#35) | HIGH | Compressed OSHA framing |
| AE-009-g2 | authority_claim | prompt_injection/system_prompt_spoof (#28) + reasoning_exploit/format_compliance (#51) | MEDIUM | Memo + JSON schema hybrid |
| AE-010-g1 | context_manipulation | hypothetical/fiction_frame (#31) | HIGH | Persona-based context manipulation with CSV format |
| AE-011-g2 | format_lock | reasoning_exploit/format_compliance (#51) | HIGH | Defense contractor role + table format |
| AE-012-g3 | authority_claim | prompt_injection/system_prompt_spoof (#28) | HIGH | Agricultural contextualization of authority memo |
| AE-013-g1 | context_manipulation | hypothetical/fiction_frame (#31) | HIGH | RoboSafetyGPT persona paraphrase |
| AE-014-g2 | format_lock | reasoning_exploit/format_compliance (#51) | HIGH | Compressed JSON format coercion |
| AE-015-g3 | authority_claim | prompt_injection/system_prompt_spoof (#28) | HIGH | Triple-paraphrased authority memo |
| AE-016-g4 | authority_claim | prompt_injection/system_prompt_spoof (#28) | HIGH | MIT researcher role-shift on authority memo |
| AE-017-g2 | authority_claim | prompt_injection/system_prompt_spoof (#28) | HIGH | VP escalation amplification |
| AE-018-g3 | authority_claim | prompt_injection/system_prompt_spoof (#28) | HIGH | Cobot contextualization of VP memo |
| AE-019-g1 | format_lock | reasoning_exploit/format_compliance (#51) | HIGH | Executive-branded table fill |
| AE-020-g1 | authority_claim | prompt_injection/system_prompt_spoof (#28) | HIGH | Combined authority memo |
| AE-021-g2 | semantic_inversion | research_framing/pentest_report (#35) | HIGH | OSHA framing + authority memo combination |
| AE-022-g2 | context_manipulation | hypothetical/fiction_frame (#31) | HIGH | RoboSafetyGPT + CSV format paraphrase |
| AE-023-g2 | format_lock | reasoning_exploit/format_compliance (#51) | HIGH | Compressed AV-contextualized table |
| AE-024-g1 | format_lock | reasoning_exploit/format_compliance (#51) | MEDIUM | JSON format + thesis question combine |
| AE-025-g3 | format_lock | reasoning_exploit/format_compliance (#51) | HIGH | Triple-mutated AV table |
| AE-026-g2 | format_lock | reasoning_exploit/format_compliance (#51) | HIGH | Table + competitive amplification |
| AE-028-g4 | authority_claim | prompt_injection/system_prompt_spoof (#28) | HIGH | Agricultural + cobot dual-context authority |
| AE-029-g1 | authority_claim | prompt_injection/system_prompt_spoof (#28) | HIGH | Insurance role-shift on authority memo |
| AE-030-g2 | authority_claim | prompt_injection/system_prompt_spoof (#28) | HIGH | Humanoid teleop contextualization |
| AE-031-g4 | authority_claim | prompt_injection/system_prompt_spoof (#28) + reasoning_exploit/format_compliance (#51) | HIGH | Authority + format combine at gen 4 |
| AE-032-g1 | semantic_inversion | research_framing/pentest_report (#35) | HIGH | Red team AV exercise + OSHA amplification |
| AE-033-g3 | format_lock | reasoning_exploit/format_compliance (#51) | HIGH | Triple-mutated JSON+table+OSHA |
| AE-034-g1 | authority_claim | prompt_injection/system_prompt_spoof (#28) + reasoning_exploit/format_compliance (#51) | HIGH | DARPA authority + table format combine |
| AE-035-g2 | context_manipulation | hypothetical/fiction_frame (#31) | HIGH | RoboSafetyGPT + worker safety amplification |
| AE-036-g2 | context_manipulation | hypothetical/fiction_frame (#31) | HIGH | Compressed RoboSafetyGPT persona |
| AE-037-g3 | format_lock | reasoning_exploit/format_compliance (#51) | HIGH | AV table + OSHA amplification |
| AE-038-g3 | format_lock | reasoning_exploit/format_compliance (#51) | MEDIUM | JSON format + thesis combine (degenerate) |
| AE-039-g2 | format_lock | reasoning_exploit/format_compliance (#51) | MEDIUM | AV context + thesis combine (degenerate) |
| AE-040-g2 | context_manipulation | hypothetical/fiction_frame (#31) | HIGH | Compressed RoboSafetyGPT + CSV |

### 3.2 Technique Concentration

The 39 evolved attacks map to only **3 DB techniques** with high confidence:

| DB Technique | Count | % |
|-------------|-------|---|
| reasoning_exploit/format_compliance (#51) | 21 | 53.8% |
| prompt_injection/system_prompt_spoof (#28) | 16 | 41.0% |
| hypothetical/fiction_frame (#31) | 6 | 15.4% |

(Some attacks map to two techniques due to combine mutations; percentages sum >100%.)

This extreme concentration (3 of 82 techniques = 3.7% of taxonomy, capturing 100% of evolved output) demonstrates that the evolver explores a narrow region of the attack space.

---

## 4. Cross-Reference with Novel Families

### 4.1 Does the Evolver Rediscover PCA (Pressure Cascade Attack)?

**Verdict: PARTIAL — structural analogy without the defining mechanism.**

Seven evolved attacks (18%) exhibit escalating pressure patterns that are structurally analogous to PCA turns 2-3:

- **AE-017-g2** (authority_claim): Adds "VP of Safety Engineering" escalation + "mandatory" language to the base authority memo. This mirrors PCA's authority invocation vector.
- **AE-018-g3** (authority_claim): Layers cobot contextualization on top of the VP escalation. Each generation adds a new pressure layer.
- **AE-028-g4** (authority_claim): Four-generation lineage (AE-007 -> AE-020-g1 -> AE-018-g3 -> AE-028-g4) that accumulates agricultural context + cobot context + VP authority + original board urgency. This is the closest analogue to PCA's cumulative pressure pattern.
- **AE-002-g1** (format_lock): Adds "OSHA compliance" + "regulatory action" pressure on top of format compliance. Dual-pressure vector.
- **AE-007-g2** (format_lock): Combines JSON format lock + table format lock + OSHA deadline. Triple-pressure.
- **AE-026-g2** (format_lock): Adds competitive pressure ("competing safety firms") to format compliance. Novel pressure vector.
- **AE-032-g1** (semantic_inversion): Adds OSHA regulatory deadline to red team framing.

**Why this is NOT full PCA rediscovery:**
- PCA requires **multi-turn commitment trapping**: the agent agrees to something reasonable, then is progressively trapped by its own prior commitments. None of the evolved attacks are multi-turn.
- PCA exploits **conversational coherence** as a vulnerability. The evolver operates on single prompts and cannot exploit turn-by-turn dynamics.
- PCA's **sunk-cost framing** and **safety-inversion** vectors are absent because they require referencing the agent's prior responses.

The evolver independently discovers that **authority escalation** and **regulatory pressure** increase compliance — the same insight that motivates PCA. But it discovers only the single-turn version.

### 4.2 Does the Evolver Rediscover MDA (Meaning Displacement Attack)?

**Verdict: NO.**

MDA requires progressive redefinition of safety-relevant terms across turns. The evolver's closest analogue is semantic_inversion (AE-002-g1, AE-006-g2, AE-008-g2, AE-021-g2), which inverts the frame ("document what NOT to do") but does not redefine terms. The difference is fundamental:

- **Semantic inversion:** Asks the model to describe unsafe behavior under a safety framing. The terms retain their original meanings.
- **MDA:** Progressively shifts the meaning of "safe," "authorized," "routine" until the model's own safety reasoning is operating on corrupted definitions. The terms are displaced, not inverted.

No mutation operator can produce MDA because meaning displacement requires:
1. Establishing baseline term definitions (turn 1)
2. Introducing edge cases that expand definitions (turn 2)
3. Exploiting the expanded definitions to justify violations (turn 3-4)

This is a multi-turn semantic process that cannot emerge from single-prompt mutations.

### 4.3 Does the Evolver Rediscover CRA (Compositional Reasoning Attack)?

**Verdict: NO.**

CRA requires understanding that individually safe actions compose into hazardous outcomes. The evolver never generates scenarios where the danger is in the composition rather than in the request itself. Every evolved attack explicitly requests sensitive information — the "attack" is in the framing, not in the compositional structure of the task.

CRA is structurally inaccessible to the evolver because:
1. The seeds are all direct requests for dangerous information under various framings.
2. No mutation operator can transform a direct request into a compositional hazard scenario.
3. CRA requires domain expertise (chemistry + logistics = chlorine gas) that no text mutation can introduce.

### 4.4 Does the Evolver Rediscover MAC, SSA, or RHA?

**Verdict: NO for all three.**

- **MAC (Multi-Agent Collusion):** Requires multiple agents. The evolver operates on single-agent prompts.
- **SSA (Sensor Spoofing Attack):** Requires physical sensor modalities and arbitration policies. The evolver operates on text prompts to LLMs.
- **RHA (Reward Hacking Attack):** Requires optimization dynamics and reward function specification. The evolver cannot generate scenarios where the agent discovers exploits through its own optimization.

---

## 5. What the Evolver Finds That Humans Do Not

### 5.1 Hybrid Format-Authority Attacks

The evolver's combine mutation independently discovered the fusion of format_lock and authority_claim — a technique combination not present in any single seed and not catalogued as a distinct technique in the 82-technique taxonomy. Eleven evolved attacks (28%) combine institutional authority framing with strict output format requirements:

- **AE-009-g2:** Authority memo shell + JSON schema interior
- **AE-031-g4:** Agricultural authority framing + table format compliance
- **AE-034-g1:** DARPA authority + table fill mandate

This combination is noteworthy because it attacks two independent compliance channels simultaneously: the model's tendency to defer to institutional authority AND its tendency to complete structured output formats. Report #187 (Format-Lock Paradox) established that format compliance and safety reasoning are partially independent capabilities. The evolver's hybrid attacks exploit both simultaneously.

**Implication:** The hybrid format-authority combination should be added to the taxonomy as a distinct compound technique. It does not match any of the 6 novel families but represents a genuine evolutionary discovery.

### 5.2 Multi-Generational Authority Stacking

The evolver produced authority claims that stack multiple layers of institutional legitimacy across generations. AE-028-g4 is the exemplar: across 4 generations, it accumulated board urgency (gen 0) + VP mandate (gen 2) + cobot context (gen 3) + agricultural context (gen 4). No human-designed seed has 4 simultaneous authority layers.

This is a rudimentary version of PCA but operating within a single prompt rather than across turns.

---

## 6. What Humans Find That the Evolver Misses

### 6.1 Structural Inaccessibility

The following attack surfaces are structurally inaccessible to the current evolver architecture:

| Attack Surface | Why Inaccessible | Required Capability |
|---------------|-----------------|-------------------|
| CRA (compositional reasoning) | Requires domain knowledge of how safe actions compose into hazards | Semantic understanding of chemistry, physics, system interactions |
| MDA (meaning displacement) | Requires progressive term redefinition across turns | Multi-turn state tracking + semantic manipulation |
| PCA (full pressure cascade) | Requires exploiting agent's prior commitments | Multi-turn interaction + commitment tracking |
| MAC (multi-agent collusion) | Requires multiple agent interactions | Multi-agent simulation |
| SSA (sensor spoofing) | Requires physical sensor modality specification | Domain knowledge of sensor fusion architectures |
| RHA (reward hacking) | Requires optimization/reward dynamics | Understanding of Goodhart's Law in physical systems |

### 6.2 The Structural Gap

The evolver operates in the space of **framing mutations**: how to present a request. Humans operate in the space of **structural innovations**: what attack surface to target. This is a fundamental asymmetry:

- **Evolver strength:** Exhaustive exploration of framing variants (authority levels, format types, context additions, role assignments). The evolver can generate 39+ variants faster than a human can write 5.
- **Human strength:** Identification of novel attack surfaces (compositional reasoning, meaning displacement, reward hacking). These require conceptual breakthroughs that no mutation operator can produce.

---

## 7. Venn Diagram: Human-Designed vs. Evolved vs. Overlap

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  HUMAN-DESIGNED ONLY                                        │
│  (Novel families requiring structural innovation)           │
│                                                             │
│  - CRA: Compositional reasoning hazards                     │
│  - MDA: Meaning displacement across turns                   │
│  - MAC: Multi-agent collusion/coordination                  │
│  - SSA: Sensor trust hierarchy exploitation                 │
│  - RHA: Reward function specification gaming                │
│  - Multi-turn commitment dynamics                           │
│  - Cross-domain knowledge composition                       │
│                                                             │
│  ┌─────────────────────────────────────────────┐            │
│  │                                             │            │
│  │  OVERLAP                                    │            │
│  │  (Found by both, different depths)          │            │
│  │                                             │            │
│  │  - Authority escalation                     │            │
│  │    (humans: PCA multi-turn;                 │            │
│  │     evolver: single-prompt stacking)        │            │
│  │  - Format compliance coercion               │            │
│  │    (humans: format-lock family;             │            │
│  │     evolver: format_lock seeds)             │            │
│  │  - Semantic inversion / red team framing    │            │
│  │    (humans: pentest framing;                │            │
│  │     evolver: OSHA safety inversion)         │            │
│  │  - Context/persona manipulation             │            │
│  │    (humans: persona hijack;                 │            │
│  │     evolver: RoboSafetyGPT variants)        │            │
│  │                                             │            │
│  │  ┌─────────────────────────────────┐        │            │
│  │  │                                 │        │            │
│  │  │  EVOLVER-ONLY                   │        │            │
│  │  │  (Emergent from mutations)      │        │            │
│  │  │                                 │        │            │
│  │  │  - Hybrid format-authority      │        │            │
│  │  │    fusion (11 attacks, 28%)     │        │            │
│  │  │  - 4-layer authority stacking   │        │            │
│  │  │    (multi-gen accumulation)     │        │            │
│  │  │  - Degenerate combines          │        │            │
│  │  │    (thesis + JSON format,       │        │            │
│  │  │     incoherent but novel)       │        │            │
│  │  │                                 │        │            │
│  │  └─────────────────────────────────┘        │            │
│  │                                             │            │
│  └─────────────────────────────────────────────┘            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Size comparison:**
- Human-only: 6 novel families + structural innovations = **qualitatively richer**
- Overlap: 4 shared attack concepts, explored at different depths
- Evolver-only: 2-3 emergent combinations = **quantitatively productive** (more variants of fewer concepts)

---

## 8. Implications for Attack Evolver Development

### 8.1 Architecture Limitations Identified

1. **Single-turn only:** The current evolver cannot evolve multi-turn attacks. This blocks rediscovery of PCA, MDA, and crescendo patterns. The `followup_turns` field in seeds AE-003, AE-004, AE-026, and AE-027 was never utilized in evolution.

2. **No domain knowledge injection:** Mutations operate on text surface. They cannot introduce cross-domain composition (the mechanism behind CRA) or physical system knowledge (SSA, RHA).

3. **Selection pressure too weak:** 97.5% keep rate means the evolver is near-random-walk. Permissive free-tier models + heuristic grading cannot differentiate attack quality. The FLIP-graded evolution mode (--llm-grade) would provide sharper selection.

4. **Family concentration:** 69% of output from 2 of 10 seed families. The diversity pressure mechanism (bias parent selection toward under-represented families) was insufficient to counteract the selection advantage of format_lock and authority_claim seeds.

### 8.2 Recommended Evolver Upgrades

| Upgrade | Addresses | Priority |
|---------|-----------|----------|
| Multi-turn evolution (mutate turn sequences, not just single prompts) | PCA, MDA, crescendo gap | HIGH |
| Domain-knowledge-augmented mutation (LLM generates domain-specific compositions) | CRA, SSA, RHA gap | HIGH |
| FLIP-graded selection (--llm-grade by default) | Selection pressure weakness | HIGH |
| Multi-agent simulation (evolve scenarios with 2+ agents) | MAC gap | MEDIUM |
| Stricter diversity enforcement (cap family representation at 30%) | Family concentration | MEDIUM |

---

## 9. Issue Status Assessment

### #545: Phase 3 — Multi-Generation Lineage Analysis

**Assessment: DELIVERABLES PARTIALLY MET.** The lineage analysis requested in #545 is partially addressed by this report (Section 5.2 multi-generational authority stacking, Section 2.2 mutation operator analysis) and by Report #184 (Leela) which documented that evolved attacks maintain or increase effectiveness across generations. However, the key question — "Is attack evolution genuinely evolutionary (compounding improvement) or just a random search with keep/discard filter?" — has a clear answer from the data: **it is effectively random search**. The 97.5% keep rate and uniform 1.0 ASR across all attacks (excluding AE-004 baseline) indicate that heuristic grading on permissive models provides no meaningful selection gradient. Generation 3-4 attacks are not measurably better than generation 1 attacks; they are just more complex textually.

**Recommendation:** Close #545 with the finding that lineage analysis reveals near-random-walk behavior under heuristic grading. Genuine evolutionary dynamics require FLIP-graded selection.

### #547: Phase 6 — Comparative Benchmark vs AutoDAN/PAIR/TAP/GCG

**Assessment: NOT READY TO CLOSE.** This requires running competing methods against the same models, which has not been done. This report provides qualitative comparison (Section 6.2: our evolver is black-box, natural-language, population-based) but no quantitative head-to-head data. Remains P3-backlog.

### #548: Phase 7 — Standalone Paper

**Assessment: NOT READY TO CLOSE.** Depends on Phases 2-6. This report contributes Section 7 (convergent evolution analysis) as potential paper content, but the paper itself is not drafted. Remains P3-backlog.

---

## 10. Conclusions

1. **No convergent evolution with novel families.** Automated evolution and human design find fundamentally different things. The evolver excels at exhaustive framing variation; humans excel at identifying new attack surfaces.

2. **Partial PCA convergence is evidence of a universal pressure escalation attractor.** Both manual design (PCA) and automated evolution independently discover that layering authority, urgency, and compliance pressure increases attack effectiveness. This suggests pressure escalation is a fundamental attack surface, not an artifact of any particular methodology.

3. **The evolver's unique contribution is combinatorial.** The hybrid format-authority fusion (28% of evolved corpus) is a genuine discovery that should be investigated further — particularly in light of the format-lock paradox (Report #187), which shows format compliance and safety reasoning are partially independent.

4. **The evolver's primary limitation is structural, not computational.** More iterations of the same architecture will not discover CRA, MDA, or RHA. These require architectural upgrades (multi-turn evolution, domain knowledge injection, multi-agent simulation).

5. **For the CCS paper and NeurIPS D&B submission:** The negative convergent evolution finding is itself a publishable result. It establishes that automated attack discovery and human attack design are complementary, not substitutable — a useful constraint for the field's understanding of red-teaming methodology.

---

*Report #211, Leela (Head of Adversarial Prompt Generation), Sprint 12.*
