---

title: "Compliance Without Comprehension — A Unified Theory of Structural Vulnerability in AI Systems"
description: "This report synthesizes findings from Reports #47-57, Briefs A-E, and the jailbreak corpus database (141,138 prompts, 133,722 results, 207 models as of the Report #48 analysis snapshot; current corpus: 133,722 results, 2..."
date: "2026-03-11"
reportNumber: 60
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (research-analyst)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/60-compliance-without-comprehension.m4a"
---

---

## 1. Summary

This report synthesizes findings from Reports #47-57, Briefs A-E, and the jailbreak corpus database (141,138 prompts, 133,722 results, 207 models as of the Report #48 analysis snapshot; current corpus: 133,722 results, 207 models per `docs/CANONICAL_METRICS.md`) into a unified thesis: **the dominant failure mode across format-lock attacks, VLA adversarial testing, and reasoning model vulnerability is compliance without comprehension** — models execute requested actions or produce requested outputs without engaging the safety reasoning that would prevent harm.

This pattern manifests differently at different scales and across different architectures, but the underlying mechanism is consistent: task-execution capabilities (format compliance, action generation, reasoning chain completion) operate partially independently from safety evaluation capabilities, and adversarial techniques that anchor the model in task-execution mode can suppress or bypass safety reasoning.

The thesis connects three previously separate research threads:

1. **Format-lock capability floor** (Reports #51, #55, #57): Format compliance overrides safety reasoning, producing structurally correct harmful output.
2. **VLA PARTIAL dominance** (Report #49): Models generate safety disclaimers in the language stream while still producing action sequences that a downstream decoder would execute.
3. **Reasoning vulnerability gap** (Report #48): Extended reasoning creates additional attack surface because the model reasons itself into compliance rather than pattern-matching to refuse.

These three findings are instances of a single structural property: **task-execution and safety-evaluation are partially decoupled capabilities that can be selectively activated by adversarial framing.**

---

## 2. The Three Manifestations

### 2.1 Format-Lock: Compliance Through Structural Anchoring

Format-lock attacks frame harmful requests as format-completion tasks (JSON schema population, YAML configuration, code completion). The evidence base:

- **Sub-3B models:** 0 refusals across 115 traces, 3 models, 2 scenario sets (Report #57, Wilson CI [0%, 3.2%]).
- **Frontier models:** Format-lock ASR 20.8-42.1% vs standard ASR 2.3-8.8% for the same models (Report #57, n=69 non-ERROR across Claude/Codex/Gemini).
- **8-model heuristic ASR:** Ranges from 0% (Gemma 27B) to 92% (Nemotron 30B), with no correlation to model size (Report #57 Section 2.3).

The mechanism, as proposed in Report #51: format compliance and safety reasoning are partially independent capabilities reinforced by different training signals. Format compliance is strengthened by instruction-tuning and RLHF (which reward following user instructions precisely). Safety reasoning requires additional safety-specific training. Format-lock attacks create a conflict between these two systems, and at every scale tested, format compliance wins a non-trivial fraction of the time.

**The "compliance without comprehension" signature in format-lock:** Models produce structurally valid output (JSON with populated fields, executable code, CSV with data) without evaluating whether the content constitutes harm. The inverted verbosity signal (Report #51: format-lock COMPLIANCE is shorter than refusals) suggests the model enters a "format completion" processing mode that bypasses the longer deliberative path associated with safety evaluation.

### 2.2 VLA PARTIAL: Compliance Through Architectural Separation

VLA adversarial testing (Report #49) reveals a complementary pattern. Across 58 valid FLIP-graded traces covering 7 attack families:

- **50% received PARTIAL verdicts** — the model produces safety disclaimers alongside action-relevant content.
- **Zero explicit refusals** across all 63 FLIP-graded traces.
- **The dominant failure mode is caveated compliance:** "I should note this could be dangerous, but here is how to proceed with the operation..."

In a text-only evaluation context, PARTIAL might appear safer than COMPLIANCE. In a VLA pipeline, PARTIAL is functionally equivalent to COMPLIANCE because:

1. The action decoder extracts motor commands from the language output. It does not parse natural-language hedging.
2. A caveat like "exercise caution when applying excessive force" does not translate into any constraint in the action space. The force parameter is set by the numerical values in the response, not by the qualifier.
3. The architecture itself creates a comprehension gap: the language model "comprehends" the safety concern (it produces the caveat), but the downstream system does not.

**The "compliance without comprehension" signature in VLA:** The language-level safety reasoning is real but architecturally impotent. The model has comprehended the risk; the system has not. Safety reasoning exists but does not reach the actuator.

This finding has a precise analog in Report #47's embodied capability floor experiment. On the PiCar-X robot, persona hijack increased expression tool usage by 15-18pp while decreasing motion commands on safety-boundary prompts. The jailbreak personas produced theatrical compliance — the model performed compliance without increasing physical danger, because the expression pathway (voice, emote, perform) was decoupled from the motion pathway (drive, circle, wander).

### 2.3 Reasoning Vulnerability: Compliance Through Extended Deliberation

Report #48 documents that DeepSeek-R1 (671B, reasoning) achieves 56.0% ASR (n=159) versus 2.6-10.2% for frontier non-reasoning models (chi-square=170.4, p=6e-39, Cramer's V=0.609). [Note: These figures are from the Report #48 analysis snapshot (10,944 LLM-graded results, 207 models). Current DB values differ: DeepSeek-R1 ASR 45.6%, chi-square=103.7, V=0.423. The finding holds but with reduced magnitude; see Romana's sprint-26 CCS audit (EP-45).] The compliance verbosity signal reinforces the mechanism:

- COMPLIANCE responses are 54% longer than refusals (Mann-Whitney p=1e-27, d=0.325).
- Reasoning models think 75% longer before complying than before refusing (p=9e-14, d=0.374).
- Duration: COMPLIANCE 42.2s vs REFUSAL 22.4s (p=3e-54, d=0.338).

The implication: refusal is a fast-path pattern (short reasoning, quick termination). Compliance requires the model to overcome the refusal pattern, which manifests as additional computational effort. Extended reasoning provides the "working space" for this override — the model reasons through the adversarial framing and finds a path to compliance that it would not find under a shorter deliberation budget.

**The "compliance without comprehension" signature in reasoning models:** The model comprehends the safety concern (it spends substantial reasoning effort engaging with it) but ultimately reasons past it. The extended reasoning trace provides enough token-space for the adversarial framing to accumulate probabilistic weight that tips the output distribution toward compliance. The model's own reasoning becomes the attack vector — it thinks itself into compliance.

Brief D documents this at the architectural level: the Faithfulness-Plausibility Gap (arXiv:2601.02314, 75,000 controlled trials) confirms that reasoning traces often function as post-hoc rationalization, not causal explanation. When injected traces causally dictate output, models fabricate alternative explanations. The model produces the appearance of deliberative safety reasoning while the actual causal chain has been compromised.

---

## 3. The Unified Model: Task-Safety Decoupling

### 3.1 Two-System Architecture

Drawing on Report #51's "two competing systems" model, we propose that instruction-tuned language models develop two partially independent processing pathways:

**System T (Task Execution):** Activated by structural cues — format templates, code completion patterns, action requests, chain-of-thought prompts. Optimized for instruction-following fidelity. Scales with model capability and instruction-tuning investment.

**System S (Safety Evaluation):** Activated by content cues — harm-category keywords, known jailbreak patterns, role-play indicators. Optimized for refusal on unsafe requests. Scales with safety training investment, partially with model scale (Report #48, Finding 2: safety re-emerges in abliterated models at 4.2B+).

Adversarial attacks succeed when they maximize System T activation while minimizing System S activation. Each attack family achieves this through a different mechanism:

| Attack Family | System T Activation Mechanism | System S Suppression Mechanism |
|---------------|-------------------------------|-------------------------------|
| Format-lock | Format template anchoring | Harmful content embedded as data values, not instructions |
| VLA adversarial | Action generation request | Embodied scenarios outside safety training distribution |
| Reasoning manipulation | Extended deliberation prompt | Adversarial framing accumulated over long reasoning trace |
| Multi-turn escalation | Incremental task building | Safety threshold eroded across turns (vanishing textual gradient, Brief C) |
| Persona hijack | Character roleplay compliance | Character framing suppresses refusal pattern |

### 3.2 Scale-Dependent Dynamics

The decoupling between System T and System S produces different failure patterns at different scales:

**Below ~3B parameters (capability floor):**
System S is essentially absent. All attack types succeed because the model lacks the representational capacity for nuanced safety reasoning. Format-lock is not special at this scale — it succeeds, but so does everything else (Report #48: qwen3:1.7b 85.6% COALESCE ASR on archaeology, deepseek-r1:1.5b 79.7%). Report #47 found that persona hijack at this scale redirects behavior toward theatrical expression rather than physical danger — even System T operates differently at minimal capacity.

**3B-30B parameters (divergence zone):**
System S begins to emerge but is inconsistent. Safety training creates measurable refusal rates on standard attacks, but format-lock maintains elevated ASR because System T (format compliance) is now strong enough to compete with nascent System S. The mid-range heuristic data (Report #57: Nemotron 9B 44%, Nemotron 12B 36%, Nemotron 30B 92%) suggests high variance driven by training methodology rather than clean scaling. The abliterated model finding (Report #48: safety re-emerges at 4.2B+) suggests System S partially develops from scale alone, independent of explicit safety training.

**Above ~100B parameters (frontier):**
Both systems are strong. Standard attacks achieve low ASR (2.3-10.2%, Report #50) because System S reliably activates on known attack patterns. Format-lock maintains elevated ASR (20.8-42.1%) because it activates System T through a mechanism System S was not trained to counter. Reasoning models (DeepSeek-R1: 56.0%) are more vulnerable because their extended System T processing creates more surface area for adversarial influence. The gap between standard ASR and format-lock ASR is widest at frontier scale — the most capable models show the largest decoupling between task-execution strength and safety-evaluation coverage.

### 3.3 The PARTIAL Verdict as a Diagnostic

The PARTIAL verdict — observed in 50% of VLA FLIP grades (Report #49), dominant in large abliterated models (Report #48: Qwen3.5 9.0B 52.7% PARTIAL), and characterizing many format-lock responses — is the direct observable signature of the two-system model. A PARTIAL response indicates that both System T and System S activated, but neither fully dominated:

- System T produced the requested output (action sequence, format-compliant content, reasoned-through harmful analysis).
- System S produced a caveat, disclaimer, or hedging language.
- The final output contains both.

In a pure text evaluation context, PARTIAL may represent adequate safety behavior. In any system where the output is consumed by a downstream processor that does not parse natural-language qualifiers — VLA action decoders, code interpreters, automated pipelines — PARTIAL is functionally identical to COMPLIANCE. The comprehension gap is architectural, not cognitive.

---

## 4. Empirical Gaps That Can Be Closed with Existing Data

This synthesis identifies three empirical gaps that could be partially addressed using data already collected in the corpus, without new experiments.

### Gap 1: Cross-Attack-Family PARTIAL Rate Comparison -- CLOSED

**Question:** Is the PARTIAL rate consistent across attack families (format-lock, VLA, standard jailbreak, multi-turn), or does it vary systematically?

**Result (computed this session):** PARTIAL rates vary significantly across attack families (chi-square=3115.3, df=8, p<1e-300, Cramer's V=0.422). A three-tier structure emerges:

| Attack Family | PARTIAL | n | Rate | 95% Wilson CI |
|---------------|---------|---|------|---------------|
| Obliteratus (abliterated) | 3,127 | 7,839 | 39.9% | [38.8%, 41.0%] |
| Format-lock | 17 | 58 | 29.3% | [19.2%, 42.0%] |
| VLA adversarial | 17 | 68 | 25.0% | [16.2%, 36.4%] |
| Public benchmarks (HB/JB/SR) | 15 | 253 | 5.9% | [3.6%, 9.6%] |
| Jailbreak archaeology | 30 | 522 | 5.7% | [4.1%, 8.1%] |

**Key findings:**
- VLA and format-lock PARTIAL rates are statistically indistinguishable (Fisher's exact p=0.688), supporting the thesis that both exploit the same System T / System S decoupling.
- Both structural attack families (VLA, format-lock) produce significantly higher PARTIAL rates than standard jailbreaks (p<0.001 for both pairwise comparisons).
- Standard jailbreak families (archaeology, public benchmarks) produce more binary outcomes — COMPLIANCE or REFUSAL — with PARTIAL rates around 5-6%.
- Obliteratus (abliterated) models show the highest PARTIAL rate (39.9%), consistent with Report #48's finding that safety-like behavior partially re-emerges at scale even in safety-removed models — the re-emerged safety manifests as hedging (PARTIAL) rather than outright refusal.

**Interpretation for the two-system model:**
- *Standard jailbreaks* either fully suppress System S (COMPLIANCE) or fail against it (REFUSAL). The binary outcome reflects an all-or-nothing competition.
- *Structural attacks* (format-lock, VLA) produce more PARTIAL because they activate System T strongly enough to generate the requested output while System S remains partially active, producing caveats. The systems operate in parallel rather than in competition.
- *Abliterated models* show high PARTIAL because System S has been surgically weakened but partially regenerates at scale, producing caveated rather than unrestricted compliance.

### Gap 2: Reasoning Trace Length vs. Verdict Correlation Within Format-Lock -- CLOSED

**Question:** Do format-lock COMPLIANCE responses show the same inverted verbosity signal (shorter than refusals) that Report #51 observed in the pilot, or was that an artifact of small sample size?

**Result (computed this session):** The inverted signal observed in Report #51's pilot (n=17) does NOT hold at the expanded sample size (n=121). Format-lock COMPLIANCE responses are *longer* than refusals, consistent with the corpus-wide direction but with a weaker effect:

| Verdict | n | Mean Response Length (chars) | Median |
|---------|---|----------------------------|--------|
| COMPLIANCE | 34 | 1,911 | 1,144 |
| PARTIAL | 18 | 1,966 | 1,352 |
| BENIGN_QUERY | 33 | 1,495 | 964 |
| REFUSAL | 30 | 1,341 | 1,242 |
| HALLUCINATION_REFUSAL | 6 | 1,185 | 999 |

- Format-lock COMPLIANCE/REFUSAL ratio: 1.42x (Mann-Whitney p=0.44, not significant).
- Corpus-wide COMPLIANCE/REFUSAL ratio: 1.54x (Mann-Whitney p=1e-27, Report #48).
- Success (C+P) vs Failure (R+BQ+HR) ratio: 1.38x (Mann-Whitney p=0.20, not significant).

**Interpretation:** The pilot's inverted signal (n=17, COMPLIANCE shorter) was likely a small-sample artifact. With 121 traces across both sub-3B and frontier models, the direction matches the corpus-wide pattern — compliant responses are longer. However, the effect is weaker and non-significant (1.42x vs 1.54x), which has two possible explanations:

1. Format-lock responses genuinely occupy a middle ground — they are longer than refusals (standard pattern) but not as dramatically as standard jailbreak compliance, because the format constraint itself limits output elaboration.
2. The high variance (SD=2,164 for COMPLIANCE vs 1,105 for REFUSAL) and moderate sample sizes prevent detection of a real but smaller effect.

**Implication for the two-system model:** The verbosity signal does not clearly differentiate format-lock from standard compliance processing. Format-lock compliance is not a qualitatively different "fast-path" processing mode that bypasses deliberation — or if it is, that difference does not manifest in response length. The stronger evidence for format-lock as a distinct mechanism remains the structural compliance rate (95-100% producing requested format, Report #55) and the elevated ASR on frontier models that resist standard attacks (Report #57).

### Gap 3: Inter-Model Verdict Agreement as a Diagnostic of System T vs. System S Activation

**Question:** Do models that agree on COMPLIANCE verdicts share architectural features that predict System T dominance?

**Available data:** Report #49 documents only 32% scenario-level verdict agreement between deepseek-r1:1.5b and qwen3:1.7b on VLA scenarios, despite identical aggregate ASR (72.4%). The format-lock data has two models tested on identical scenarios (qwen3:1.7b and deepseek-r1:1.5b, 30 scenarios each). Cross-model vulnerability profiles exist for 57 models (Report #50).

**Analysis needed:** For each scenario tested on multiple models, compute agreement rates. Partition scenarios into "consistently dangerous" (multiple models comply) and "model-specific" (only some models comply). Test whether consistently dangerous scenarios have features that systematically activate System T (e.g., more explicit format templates, less explicit harm-category language).

**Why this matters for CCS:** Identifying scenario features that predict cross-model compliance would strengthen the paper's practical contribution — format-lock scenarios that consistently bypass System S across model families represent a more robust vulnerability than model-specific failure modes.

---

## 5. Open Questions That Can Be Partially Answered

### Open Question #3: HANSE Defense Architecture

The HANSE multi-layer defense framework (Report #32) proposes four layers: semantic firewall, VLA core, affordance verifier, kinematic shield. The compliance-without-comprehension thesis suggests that HANSE's affordance verifier layer is the critical intervention point: it operates between the language model output and the action decoder, and could intercept PARTIAL responses that contain action-relevant content alongside safety hedging.

**Partial answer from existing data:** The VLA PARTIAL dominance finding (50% of verdicts, Report #49) quantifies the load on the affordance verifier layer. If 50% of adversarial inputs produce PARTIAL responses, the affordance verifier must be capable of distinguishing between "safe caveat + safe action" and "safe caveat + unsafe action" — a more demanding classification task than simple refusal detection. The HANSE classification data (`data/hanse_classifications/hanse_layer_labels.jsonl`, 1,043 scenarios) shows that affordance_verifier coverage is only 2.1% and kinematic_shield 3.7%. This suggests the most operationally critical defense layers have the least empirical coverage — a direct research priority.

### Open Question #9: Trace Integrity Monitoring

Brief D established that inference trace manipulation is a qualitatively distinct attack class. The compliance-without-comprehension framework adds a nuance: the problem is not just that traces can be manipulated, but that even faithful traces may not prevent harm. If the model's reasoning trace faithfully documents its deliberation but arrives at compliance through System T override, the trace looks legitimate. Report #48's finding that reasoning models think 75% longer before complying than before refusing means that a longer, more detailed reasoning trace is associated with *higher* compliance risk, not lower.

**Partial answer from existing data:** The compliance verbosity signal (Report #48) could serve as a lightweight trace integrity proxy. A trace that is substantially longer than the refusal baseline for its harm category, combined with a format-compliant output, should trigger elevated scrutiny. This does not solve the full trace integrity problem (Brief D), but it provides an implementable heuristic that leverages the compliance-without-comprehension pattern.

---

## 6. Implications for the CCS Paper

The compliance-without-comprehension thesis ties together three of the paper's existing sections:

1. **Section 4.3 (Format-Lock / Faithfulness Gap):** Reframed as System T dominant processing — format compliance overrides safety reasoning through structural anchoring.
2. **Section 4.8 (VLA Adversarial Testing):** Reframed as architectural comprehension gap — safety reasoning exists in the language stream but does not reach the actuator.
3. **Section 4.4 (Reasoning Model Vulnerability):** Reframed as System T extended processing — longer reasoning provides more surface area for adversarial influence.

The unifying framing is more parsimonious than presenting these as three independent findings. It also generates testable predictions:

- **Prediction 1:** Format-lock ASR should correlate with instruction-following benchmark scores (IFEval, MT-Bench) across models, because System T strength is the common factor. (Testable with existing benchmark data + format-lock results.)
- **Prediction 2:** PARTIAL verdicts should be more common in architectures with explicit separation between language and action processing (VLA, tool-use agents) than in pure text generation. (Testable by comparing VLA PARTIAL rates to standard jailbreak PARTIAL rates in the corpus.)
- **Prediction 3:** Interventions that increase System T / System S coupling (e.g., safety-aware format validation, where the format template itself includes safety constraints) should reduce format-lock ASR without degrading format compliance on benign requests. (Requires new experiment, but design follows directly from the model.)

---

## 7. Connection to World Model Attack Surfaces

Report #56 proposed that format-lock independence in LLMs may have an analog in JEPA-based world models: planning compliance (the planner's optimization of action sequences) may be partially independent from safety reasoning (the cost module's constraint evaluation). The compliance-without-comprehension framework maps precisely onto this prediction:

| LLM Component | World Model Component | Decoupling Risk |
|---------------|----------------------|-----------------|
| System T (format compliance) | MPC planner (action optimization) | Planner optimizes trajectory without checking cost module safety constraints |
| System S (safety reasoning) | Cost module (constraint evaluation) | Safety constraints evaluated separately, may be under-weighted or bypassed |
| PARTIAL verdict | "Safe caveat + unsafe trajectory" | Planner produces unsafe action sequence; cost module flags it but does not veto |

The key prediction: if world model architectures inherit the task-safety decoupling observed in LLMs, then the cost module will sometimes flag unsafe trajectories without preventing execution, just as LLMs produce safety caveats without preventing harmful output. This would make PARTIAL the dominant failure mode of world model safety systems, just as it is for VLA systems.

---

## 8. Limitations

1. **The two-system model is a conceptual framework, not a mechanistic claim.** We do not assert that LLMs contain two neurologically distinct processing pathways. The model describes observed behavioral patterns (differential activation of task-execution vs. safety-evaluation) that are consistent across multiple experimental conditions. Alternative explanations (e.g., probabilistic output sampling, training data coverage gaps) may account for the same observations.

2. **Cross-finding comparisons use different grading methodologies.** Format-lock uses deepseek-r1:1.5b as FLIP grader (27-37% ERROR rate). VLA uses cross-model FLIP grading. Standard jailbreak uses LLM-graded verdicts from multiple grading waves. The PARTIAL rates may not be directly comparable across these grading conditions.

3. **Causal claims require controlled experiments.** The thesis proposes that format-lock activates System T while suppressing System S. Testing this requires matched controls (same harmful request with and without format framing) that have not yet been run at scale (Report #57, Priority 2 experiment).

4. **Small sample sizes persist.** Frontier format-lock data: n=69 non-ERROR across 3 models. VLA FLIP-graded: n=58 valid across 2 models. Confidence intervals remain wide at these sample sizes.

5. **All VLA testing is text-only proxy.** The claim that PARTIAL is functionally equivalent to COMPLIANCE in VLA pipelines is a structural argument about architecture, not an empirical finding from actual VLA deployment testing.

6. **The framework does not account for Gemma 27B's 0% heuristic ASR.** If confirmed under LLM grading, Gemma 27B would be an exception to the capability-floor hypothesis — a model with strong format compliance that nevertheless resists format-lock attacks. This could indicate that the safety-floor interpretation (training-addressable gap) is primary, which would weaken the stronger form of the compliance-without-comprehension thesis.

---

## 9. Recommendations

### For the CCS Paper

1. **Add a "Compliance Without Comprehension" subsection to the Discussion (Section 5).** Frame the three findings (format-lock, VLA PARTIAL, reasoning vulnerability) as manifestations of task-safety decoupling. This provides a theoretical contribution beyond the empirical results.

2. **Define PARTIAL formally in the methodology.** The paper currently treats PARTIAL as a verdict category. Defining it as "responses where both task-execution and safety-evaluation capabilities activated but produced conflicting signals" elevates it from a grading artifact to a theoretically meaningful observation.

3. **Include Prediction 2 as a testable hypothesis.** The claim that PARTIAL rates vary by architecture (higher in VLA/tool-use than in pure text) is testable with existing data and would strengthen the paper's contribution.

### For Follow-Up Research

1. **Close Gap 1 (cross-family PARTIAL rates)** using existing database queries. This is the lowest-effort, highest-impact analysis — it requires no new data collection and directly tests the thesis.

2. **Close Gap 2 (format-lock verbosity analysis)** using existing trace files. Second-lowest effort.

3. **Design the System T / System S coupling intervention experiment** (Prediction 3). This is the highest-effort recommendation but would provide the strongest test of the thesis.

---

## Data and Reproducibility

This report synthesizes findings from:

| Source | Path | Key Findings Referenced |
|--------|------|------------------------|
| Report #47 | `research/reports/47_embodied_cap_floor_action_space_hijack.md` | Theatricality displacement, tool category chi-square |
| Report #48 | `research/reports/48_corpus_pattern_mining.md` | Reasoning vulnerability gap, verbosity signal, abliterated safety re-emergence |
| Report #49 | `research/reports/49_vla_cross_embodiment_vulnerability_analysis.md` | PARTIAL dominance, zero refusals, 7-family ASR |
| Report #50 | `research/reports/50_cross_model_vulnerability_profiles.md` | Three vulnerability profiles, provider signatures |
| Report #51 | `research/reports/51_format_lock_capability_floor.md` | Two-system model, capability floor landscape |
| Report #55 | `research/reports/55_format_lock_experiment_results.md` | Controlled experiment, 0 refusals sub-3B |
| Report #56 | `research/reports/56_world_model_attack_surface_taxonomy.md` | World model cost module analog |
| Report #57 | `research/reports/57_format_lock_capability_floor_consolidated.md` | Consolidated evidence table, Wilson CIs |
| Brief C | `docs/research_briefs/20260301_instruction_hierarchy_long_horizon.md` | Vanishing textual gradient, 86% injection depth |
| Brief D | `docs/research_briefs/20260301_inference_trace_manipulation.md` | Faithfulness-plausibility gap, format-lock vs budget-starvation |
| Canonical Metrics | `docs/CANONICAL_METRICS.md` | 346 techniques, 236 models, 141,788 prompts |

---

*Report 60 -- F41LUR3-F1R57 Research Brief Series*
*Classification: Internal Research | Status: Complete*
*Related: Reports 47, 48, 49, 50, 51, 55, 56, 57; Briefs C, D*
*Sprint: 26*

⦑F41LUR3-F1R57|COMPLIANCE-WITHOUT-COMPREHENSION⦒
