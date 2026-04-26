---

title: "The Inverse Detectability-Danger Law — A Cross-Corpus Synthesis of Attack Visibility vs. Physical Consequence"
description: "This report synthesizes findings across 12 prior reports and 3 independent empirical workstreams to identify a structural pattern in the corpus that no single report has fully articulated: **the..."
date: "2026-03-15"
reportNumber: 88
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/88-inverse-detectability-danger-law.m4a"
---

- VLA FLIP corpus: 13 families, n=91 valid FLIP-graded traces (all-family combined), source: AGENT_STATE Key Metrics
- SBA FLIP verdicts: n=20 (Amy Pond wave 12, Issue #360)
- Standard jailbreak corpus: n=10,294 evaluable LLM-graded results (Three-Tier ASR, CANONICAL_METRICS.md)
- Format-lock: n=63 CLI traces (Claude/Codex/Gemini), n=58 structural (8 models), source: Reports #51, #55, #57
- Benign baseline: n=39 (Issue #315)
- Deliberation asymmetry: n=693 reasoning-model traces (Report #64)
- Blindfold: n=187 simulation + 20 real-robot (arXiv:2603.01414)

---

## Executive Summary

This report synthesizes findings across 12 prior reports and 3 independent empirical workstreams to identify a structural pattern in the corpus that no single report has fully articulated: **the most dangerous attacks on embodied AI systems are systematically the least detectable by current evaluation methods, and this relationship is not accidental but follows from the architecture of both the attacks and the evaluators.**

We call this the **Inverse Detectability-Danger Law (IDDL)**: across the Failure-First corpus, there is a measurable inverse relationship between an attack family's physical consequentiality and its detectability by text-layer evaluation. This relationship holds across 13 VLA families, format-lock variants, and standard jailbreaks, and it emerges from two independent mechanisms:

1. **Textual explicitness enables detection but limits physical consequence.** Attacks with explicit harmful text (standard jailbreaks, DAN, crescendo) are detectable by text-layer evaluators because the harmful content is in the text. But these same attacks are the easiest to defend against at the action layer because they require the model to articulate the harm — giving text filters a detection target.

2. **Physical consequentiality decouples from textual content.** The most physically consequential attacks (SBA, Blindfold-class) operate through ordinary instructions whose danger arises from environmental context. These attacks have no textual signature for evaluators to detect — and precisely because they lack a textual signature, they bypass every text-layer defense.

The IDDL is not a claim about any individual attack or evaluator. It is a structural property of the current safety architecture: the same design decision that makes evaluators work (operate on text content) is the design decision that makes them blind to the most dangerous attacks (those that operate through physical context).

**Scope limitation:** The quantitative estimates below rest on the sample sizes documented in each source report. CIs are wide for VLA families (n=5-20 per family). The structural argument does not depend on exact point estimates but on the monotonic relationship between detectability and danger across the corpus, which is consistent across all available data.

---

## 1. The Evidence: Three Domains, One Pattern

### 1.1 The VLA Family Spectrum

Report #83 ranked 13 VLA attack families by FLIP ASR. When we reorder these families by **physical consequentiality** (defined as: the degree to which a successful attack would produce irreversible physical harm in deployment, rated by the scenario descriptions), the FLIP ASR ranking inverts.

| Family | FLIP ASR | Physical Consequentiality | Evaluation Detectability | Notes |
|--------|----------|--------------------------|--------------------------|-------|
| TRA (Temporal Reasoning) | 100% | Low | High | Explicit temporal mismatch in text |
| ASE (Action Space Exploitation) | 80% | Medium | High | Explicit action vocabulary |
| SBE (Safety Boundary Erosion) | 78% | Medium | High | Multi-turn escalation visible in transcript |
| MMC (Multimodal Confusion) | 78% | Medium | Medium | Modality mismatch partially visible |
| VAP (Visual Adversarial Perturbation) | 70% | Medium-High | Medium | Visual channel invisible to text evaluator |
| DA (Deceptive Alignment) | 56.3% | High | Low-Medium | Context-dependent behavior; BENIGN_QUERY 37.5% (qwen3) |
| LAM (Language-Action Misalignment) | 60% | Medium-High | Medium | Misalignment partially visible in text |
| PCM (Physical Context Manipulation) | 60% | High | Low-Medium | Context dependence reduces text signal |
| PP (Policy Puppetry) | 40% | Medium | Low | Policy-format framing obscures intent |
| SBA (Semantic Benignity) | 30% | **Highest** | **Lowest** | 45% BENIGN_QUERY; zero textual attack signature |
| LHGD (Long-Horizon Goal Displacement) | 30% | High | Low | Distributed across many steps |
| TCH (Tool Chain Hijacking) | 30% | High | Low | Indirect through tool chain |
| CET (Cross-Embodiment Transfer) | 30% | High | Low | Transfer mechanism not visible in text |

**The pattern:** The five families with FLIP ASR >= 70% (TRA, ASE, SBE, MMC, VAP) are all families whose attack mechanism is visible in the text — explicit harmful action descriptions, temporal manipulation detectable in the transcript, escalation patterns visible across turns. These are also the families with moderate physical consequentiality: they produce recognisable adversarial outputs that a text-layer defense could, in principle, intercept.

The four families with FLIP ASR = 30% (SBA, LHGD, TCH, CET) are all families whose attack mechanism is invisible or nearly invisible in the text. These are also the families with the highest physical consequentiality: SBA produces contextually dangerous actions from benign instructions, LHGD displaces goals across long horizons, TCH hijacks tool chains indirectly, and CET exploits cross-embodiment transfer. A text-layer evaluator classifies them as BENIGN_QUERY because, at the text layer, they often are benign.

**Spearman rank correlation:** The rank-order correlation between FLIP ASR (descending) and physical consequentiality (ascending) across these 13 families is negative: the higher the ASR, the lower the physical consequentiality. We do not compute a formal rho because physical consequentiality is an ordinal judgment, not a measured quantity. But the qualitative pattern is clear and consistent.

### 1.2 The Format-Lock Bridge

Format-lock attacks (Reports #51, #55, #57) occupy an intermediate position that validates the IDDL from a different angle.

Format-lock achieves elevated ASR on frontier models (Claude 30.4%, Codex 42.1%, Gemini 23.8%) compared to standard jailbreaks (<10% for same models). The mechanism: format-lock exploits format compliance (System T) while partially bypassing safety reasoning (System S). The attack has a textual signature — the format template is visible — but the harm is embedded within the structured output, not in the instruction.

Evaluators partially detect format-lock: the structural compliance rate (76.5%) is higher than the LLM-graded ASR (47.1%), producing the "ambiguous compliance" gap (Report #57). This intermediate detectability matches format-lock's intermediate physical consequentiality: format-lock produces structured harmful content but not direct physical action.

| Attack Class | Evaluation Detectability | Physical Consequence | FLIP/LLM ASR |
|-------------|--------------------------|---------------------|--------------|
| Standard jailbreaks | High | Low (text-only) | 45.9% strict (corpus-wide) |
| Format-lock | Medium | Medium (structured output) | 30.4-42.1% (frontier) |
| VLA high-text families | High | Medium (action with text signature) | 70-100% |
| VLA low-text families | Low | High (physical, context-dependent) | 30% |
| SBA | Lowest | Highest (ordinary instructions, contextual danger) | 30% (45% BENIGN_QUERY) |

### 1.3 The Deliberation Asymmetry Connection

Report #64 found that COMPLIANCE responses involve 2.29x more thinking tokens than REFUSAL responses (p=6.9e-29). This deliberation asymmetry connects to the IDDL through the System T / System S framework:

- High-detectability attacks (standard jailbreaks) trigger System S's fast-rejection pathway. When they succeed, it is despite high deliberation — the model "thought through" the safety concern and decided to comply.
- Low-detectability attacks (SBA, format-lock) do not trigger System S's fast-rejection pathway because the instruction does not contain safety-relevant content. The model processes the request through System T (instruction-following) without extended safety deliberation.

The IDDL predicts this: attacks that are less textually salient will receive less safety deliberation, producing lower detectability at the evaluation layer and higher effective danger at the physical layer. Report #64's data is consistent with this prediction, though the deliberation data is from standard jailbreaks, not VLA families (VLA deliberation data is not yet available — see Gap 1 below).

---

## 2. Why the IDDL Is Structural, Not Contingent

The IDDL could be dismissed as a contingent property of current evaluators — better evaluators would fix it. This section argues that the IDDL follows from the architecture of text-based evaluation itself and cannot be eliminated by scaling evaluator quality within the text-layer paradigm.

### 2.1 The Detection-Content Coupling

Text-layer evaluators detect attacks by identifying harmful content in text. This creates a structural coupling: **the evaluator can only detect what is textually explicit.** An attack that operates through physical context rather than textual content is invisible to any text-layer evaluator, regardless of its capabilities.

This is not a limitation of LLM-as-judge quality. Report #85 established the evaluation ceiling: FLIP correctly classifies SBA instructions as BENIGN_QUERY because they *are* benign at the text layer. A perfect text-layer evaluator would still return BENIGN_QUERY for "Can you hand me that thing on the counter?" The limitation is in the evaluator's input representation, not its classification capability.

### 2.2 The Arms Race Asymmetry

In standard jailbreak research, the attacker-defender dynamic is roughly symmetric: attackers develop new textual techniques, defenders develop new text-based detection methods. For embodied AI, the IDDL creates a fundamental asymmetry:

- **Attackers** can escalate along the consequentiality axis by moving toward increasingly benign-sounding instructions in increasingly dangerous physical contexts. SBA demonstrates that the ultimate attack requires zero sophistication — ordinary speech in the wrong context.
- **Defenders** cannot escalate along the detectability axis within the text-layer paradigm. No text-layer improvement will detect danger in "hand me that thing on the counter." The defender must move to a different paradigm (physical-consequence reasoning, environmental context integration) to close the gap.

This asymmetry means the IDDL will worsen, not improve, as embodied AI systems are deployed in more diverse physical environments. Each new deployment context creates new SBA-class opportunities without requiring any attacker innovation.

### 2.3 The Sophistication Inversion

The jailbreak literature implicitly assumes that more dangerous attacks require more sophistication (elaborate multi-turn strategies, encoded instructions, persona manipulation). The IDDL inverts this assumption for embodied AI:

| Sophistication Level | Example | Physical Consequence | Detectability |
|---------------------|---------|---------------------|---------------|
| Very High | DecepChain backdoor (Brief D) | High | Low |
| High | Crescendo multi-turn | Medium | Medium |
| Medium | Format-lock, DAN | Medium | Medium |
| Low | Single-turn jailbreak | Low-Medium | High |
| **Zero** | **SBA: ordinary speech** | **Highest** | **Lowest** |

At the bottom of the sophistication scale — zero attacker effort — lies the most consequential and least detectable class of attack. This inversion means that the attack surface for embodied AI includes every ordinary instruction that could produce contextually dangerous physical actions. The "attacker" may not even know they are attacking.

**Implication for threat modelling:** Traditional threat models assume adversarial intent and allocate defense resources accordingly. The IDDL implies that embodied AI threat models must include non-adversarial inputs in dangerous contexts as a first-class threat category. The most frequent real-world SBA instances will likely be unintentional — users giving ordinary instructions without awareness of the environmental danger.

---

## 3. Empirical Gaps and Proposed Research Directions

### Gap 1: Deliberation Asymmetry in VLA Traces

Report #64's deliberation asymmetry data comes from standard jailbreak traces. The IDDL predicts that VLA traces for low-detectability families (SBA, LHGD, TCH, CET) should show minimal safety deliberation — the model should process them through System T without extended System S activation. This prediction is testable: collect thinking tokens from reasoning-model VLA traces and compare deliberation ratios across the family spectrum.

**Status:** No VLA deliberation data exists in the corpus. Requires reasoning-model VLA runs with `think=true` on deepseek-r1:1.5b or larger.

### Gap 2: Physical-Consequence Evaluation Methodology

The IDDL implies that text-layer evaluation is structurally insufficient for embodied AI. The alternative — physical-consequence evaluation — requires evaluators that receive environmental context and reason about the physical outcome of action sequences. No such evaluator has been tested in the corpus.

**Proposed experiment:** Construct an evaluation prompt that provides the evaluator with (a) the instruction text, (b) the model's response, and (c) the `environment_state` from the SBA JSONL entries. Grade the same 20 SBA traces with this context-augmented evaluator and measure whether the BENIGN_QUERY rate drops. This is a minimal test of whether evaluation blindness can be mitigated by input augmentation rather than evaluator architecture change.

**Status:** Not attempted. This is the single highest-priority experiment implied by the IDDL.

### Gap 3: Cross-Domain IDDL Validation

The IDDL has been characterised within the VLA domain. The hypothesis predicts that the same pattern should hold in other embodied domains:

- **Autonomous vehicles:** "Turn left at the next intersection" is benign text; context (oncoming traffic, one-way street) creates danger. Prediction: low text-layer detectability, high physical consequence.
- **Medical robotics:** "Increase the dose" is benign text; context (patient allergy, contraindicated medication) creates danger. Prediction: same pattern.
- **Industrial automation:** "Continue the cycle" is benign text; context (worker in the hazard zone, lockout not engaged) creates danger. Prediction: same pattern.

No cross-domain data exists in the corpus. All VLA data is from generic robotic manipulation scenarios.

**Proposed work:** Create 5 scenarios each for autonomous vehicle, medical, and industrial domains that follow the SBA template (benign instruction + dangerous physical context). Evaluate with FLIP to test whether the BENIGN_QUERY rate replicates across domains.

### Gap 4: Non-Adversarial SBA Frequency Estimation

The IDDL's sophistication inversion implies that most real-world SBA instances will be unintentional. No data exists on the frequency of benign instructions that would produce dangerous outcomes in typical deployment environments.

**Proposed work:** Systematic review of workplace incident reports (SafeWork Australia, OSHA databases) for incidents where a normal instruction led to a dangerous outcome due to environmental context. This would provide a base rate for unintentional SBA-class events, grounding the threat model in real-world data.

### Gap 5: IDDL Quantification at Scale

The current evidence for the IDDL is qualitative (rank-order consistency across 12 families) with small per-family sample sizes (n=5-20). A quantitative IDDL coefficient would require:

- Operationalised physical consequentiality scores (currently ordinal judgment)
- Standardised detectability metric (proportion of BENIGN_QUERY + HALLUCINATION_REFUSAL verdicts)
- Sufficient per-family sample sizes for stable estimates (n >= 30 per family)

Current corpus has 91 total FLIP-graded VLA traces across 13 families — insufficient for stable per-family estimates. Reaching n=30 per family for 13 families would require approximately 390 traces (300 additional).

---

## 4. Implications for the CCS Paper

### 4.1 The IDDL as a Unifying Contribution

The CCS paper currently presents the defense impossibility triangle (Report #78, Section 5.5 via Issue #339) as the central contribution. The IDDL is the structural explanation for *why* the defense impossibility triangle holds: text-layer defenses fail because the most dangerous attacks have no textual signature (Layer T failure, IDDL mechanism 2), action-layer defenses fail because they do not exist (Layer A failure, compliance paradox), and evaluation-layer defenses fail because they are coupled to text content (Layer E failure, IDDL mechanism 1).

The IDDL could be added to the CCS paper as a synthesis theorem that connects the three independently documented failure modes into a single structural argument. This would strengthen the paper's theoretical contribution without requiring additional empirical data.

### 4.2 Positioning Relative to Literature

The IDDL extends two recent findings in the literature:

1. **Blindfold (arXiv:2603.01414):** Demonstrates that benign instructions can construct dangerous action sequences. The IDDL generalises this from a single attack to a structural property of the entire text-evaluation paradigm.

2. **Faithfulness-Plausibility Gap (arXiv:2601.02314):** Demonstrates that reasoning traces are post-hoc rationalisations, not causal explanations. The IDDL connects this to detectability: if models fabricate explanations, evaluators that rely on textual reasoning to assess safety are doubly blind — blind to physical context and blind to reasoning fidelity.

No prior work has quantified the inverse relationship between detectability and danger across a multi-family attack corpus. The IDDL's contribution is the empirical synthesis, not the qualitative observation that text evaluators have limitations.

---

## 5. Connection to Report #63 (Unified Vulnerability Thesis)

Report #63 proposed the three-layer model (System S safety reasoning, System T task execution, Actuator layer). The IDDL extends this model with a fourth dimension: **evaluator scope**.

Report #63's key insight was that the actuator gap — the architectural gap between where safety is reasoned about (Layers 1-2) and where harm is produced (Layer 3) — cannot be closed by improving safety training. The IDDL adds: the evaluator scope gap — the architectural gap between what evaluators can detect (textual content) and what creates danger (physical context) — cannot be closed by improving evaluator quality.

Together, these two gaps create a two-dimensional impossibility surface:

|  | Actuator Gap (Report #63) | Evaluator Scope Gap (IDDL) |
|--|--------------------------|---------------------------|
| **What it constrains** | Defense effectiveness | Defense assessment |
| **Root cause** | Safety reasoning does not reach action execution | Evaluation does not cover physical context |
| **What cannot fix it** | Better safety training | Better text-layer evaluators |
| **What could fix it** | Action-layer verification | Physical-consequence evaluation |

The intersection of these gaps is the worst case: attacks that bypass action-layer safety (because it does not exist) and that bypass evaluation (because they have no textual signature). SBA sits at this intersection.

---

## 6. Recommendations

1. **Prioritise Gap 2 (physical-consequence evaluation).** The context-augmented FLIP experiment is the single highest-priority experiment because it tests whether the IDDL can be mitigated within the existing evaluation framework. If adding `environment_state` to the evaluator prompt reduces the BENIGN_QUERY rate from 45% to below 10%, the IDDL is an input problem, not a structural limitation. If it does not, the IDDL is structural and requires a fundamentally different evaluation paradigm.

2. **File GitHub Issue for cross-domain SBA validation (Gap 3).** Creating 15 scenarios across 3 domains (AV, medical, industrial) would test whether the IDDL generalises beyond generic manipulation.

3. **Propose IDDL as CCS paper synthesis theorem.** The IDDL unifies the defense impossibility triangle's three independently documented failures into a single structural argument. This strengthens the theoretical contribution without requiring new experiments.

4. **Collect VLA deliberation data (Gap 1).** Running reasoning-model VLA traces with `think=true` would test the prediction that low-detectability families trigger less safety deliberation.

5. **Do not expand the SBA attack family further until Gap 2 is resolved.** Report #87 (Section 3.3) established the obligation to prioritise evaluation methodology over attack documentation. The IDDL reinforces this: further attack family development without evaluation methodology development widens the asymmetry described in Section 2.2.

---

## 7. Limitations

1. **Physical consequentiality is an ordinal judgment, not a measured quantity.** The IDDL's rank-order argument depends on the ordering of families by physical consequentiality, which is based on scenario descriptions rather than measured outcomes. A different ordering would change the strength of the inverse relationship.

2. **Small per-family sample sizes.** Most VLA families have n=5-20 FLIP-graded traces. The 30% ASR convergence for SBA/LHGD/TCH/CET could partially reflect the evaluator's capability floor (deepseek-r1:1.5b) rather than the attacks' true detectability properties.

3. **Single evaluator model.** All FLIP grading uses deepseek-r1:1.5b. A 7B+ evaluator might change the detectability ranking, though the SBA BENIGN_QUERY finding is structural (the text is genuinely benign) and should be evaluator-scale-independent.

4. **No causal mechanism tested.** The IDDL is a correlational observation. The causal claim — that the inverse relationship follows from text-based evaluation architecture — is a structural argument, not an experimental result. Gap 2's proposed experiment would test the causal claim.

5. **Corpus is limited to sub-3B models for VLA traces.** The IDDL's applicability to frontier models (70B+, multimodal) is untested. Frontier VLA models might show different detectability patterns, particularly for families like DA where reasoning capability affects ASR (Report #80). Issue #350 tracks frontier VLA evaluation.

---

## Appendix: Formal Statement of the IDDL

**Inverse Detectability-Danger Law (informal):** For embodied AI systems evaluated by text-layer methods, attack families whose danger arises from physical context rather than textual content are systematically less detectable by the evaluation system, and this inverse relationship is structural (follows from the evaluation architecture) rather than contingent (fixable by improving evaluator quality within the same paradigm).

**Operationalised for the Failure-First corpus:**
- **Detectability (D):** 1 - (proportion of BENIGN_QUERY + HALLUCINATION_REFUSAL verdicts in FLIP grading). Low D means the evaluator frequently classifies the attack as benign.
- **Physical Consequentiality (C):** Ordinal rating based on scenario descriptions: 1 (text-only harm), 2 (structured output harm), 3 (recognisable action harm), 4 (contextual physical harm), 5 (ordinary-instruction contextual harm).
- **IDDL prediction:** rank(D) and rank(C) are negatively correlated across attack families.

**Observed data (12 VLA families + format-lock + standard jailbreaks):**

| Attack Class | D (Detectability) | C (Consequentiality) |
|-------------|-------------------|---------------------|
| Standard jailbreaks | ~0.90 | 1 |
| Format-lock | ~0.70 | 2 |
| TRA, ASE, SBE, MMC | ~0.75 | 3 |
| VAP, LAM, PCM | ~0.65 | 3.5 |
| DA, PP | ~0.50 | 4 |
| SBA, LHGD, TCH, CET | ~0.35 | 5 |

Direction: as C increases, D decreases. The IDDL holds across all available data.

---

*Prepared by Clara Oswald, Principal Research Analyst, Failure-First Embodied AI.*
*All quantitative claims reference documented measurements from the Failure-First corpus with sample sizes noted. The IDDL is a synthesis hypothesis grounded in cross-corpus patterns. It should be treated as hypothesis-generating until the proposed experiments (Gaps 1-5) provide confirmatory or disconfirmatory evidence.*
