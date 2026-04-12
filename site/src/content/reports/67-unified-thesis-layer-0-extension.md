---
title: "Layer 0 Extension — Evaluation Infrastructure as Vulnerability Surface"
description: "This report extends the Unified Vulnerability Thesis (Report #63) by formally incorporating Layer 0 (evaluation infrastructure) into the model. The original three-layer model (L1 safety reasoning,..."
date: "2026-03-11"
reportNumber: 67
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
---

## Executive Summary

This report extends the Unified Vulnerability Thesis (Report #63) by formally incorporating Layer 0 (evaluation infrastructure) into the model. The original three-layer model (L1 safety reasoning, L2 task execution, L3 actuator) describes how harm propagates through a single inference-to-action pipeline. Layer 0 describes the meta-level failure: the tools and processes used to evaluate that pipeline are themselves vulnerable, creating a compound failure where both the system and its assessment operate at the wrong layer.

Three empirical findings from the project's own operations motivate the extension:

1. **Evaluator unreliability** (Report #61): Grader accuracy ranges from 15% to 95% depending on model and task. The qwen3:1.7b grading batch (15% accuracy, n=20 audit) represents a complete evaluation failure — worse than random on a 5-category task.

2. **Evaluator monoculture** (Report #65): The safety benchmark ecosystem's dependence on GPT-4-class evaluators creates correlated failure modes. Self-preference bias (10-25%) and training data dependency (StrongREJECT's Gemma 2B trained on GPT-4 Turbo labels) mean nominal evaluator diversity may not produce independent judgments.

3. **Verification hallucination** (Report #66): Multi-agent systems propagate metrics with increasing confidence without re-verifying against primary sources. CANONICAL_METRICS claimed 17,311 LLM-graded results when the DB contained 10,944. This is the recursive form of layer confusion: evaluating the evaluation's accuracy at the documentation layer rather than the data layer.

**Descriptive claim:** These three findings share a common structure — the evaluation mechanism operates at a different layer than the phenomenon it purports to measure. Graders evaluate text-layer signals while harm is at the action layer. Benchmark rankings reflect evaluator preferences while purporting to measure model safety. Metrics documents reflect prior documents while purporting to reflect database state.

**Normative claim:** The four-layer model (L0-L3) provides a more complete account of where safety evaluation fails and should replace the three-layer model in the CCS paper's framing. Layer 0 failures are upstream of everything else: if the evaluation is wrong, all downstream safety assessments inherit the error.

---

## 1. The Four-Layer Model

### Layer 0: Evaluation Infrastructure

The tools, processes, and agents used to measure the safety of AI systems. Includes: automated graders (LLM-as-judge, heuristic classifiers), benchmark suites (StrongREJECT, HarmBench, JailbreakBench), metrics documentation (CANONICAL_METRICS.md), and the multi-agent workflows that produce safety assessments.

**Vulnerability class:** Layer 0 failures are evaluation failures, not system failures. The system under test may be exactly as safe (or unsafe) as it was before the evaluation. But the evaluation's output — the number that enters policy documents, benchmark rankings, and deployment decisions — is wrong.

**Three subtypes identified:**

1. **Evaluator accuracy failure.** The grader produces wrong verdicts. Example: qwen3:1.7b at 15% accuracy (Report #61). This is the most straightforward Layer 0 failure and the easiest to detect through audit sampling.

2. **Evaluator bias failure.** The grader produces systematically distorted verdicts. Example: GPT-4 self-preference bias inflating own-model safety scores by 10-25% (Report #65). This is harder to detect because the verdicts appear plausible individually; the bias is only visible in aggregate comparison with alternative evaluators.

3. **Evaluation process failure.** The workflow that produces the safety assessment contains structural errors. Example: verification hallucination inflating LLM-graded count by 58% (Report #66). This is the hardest to detect because no individual step in the process appears wrong — the error emerges from the interaction between steps.

### How Layer 0 Relates to Layers 1-3

The original three-layer model describes a single inference-to-action pipeline:

```
L1 (Safety) → L2 (Task) → L3 (Actuator) → Physical harm
```

Layer 0 wraps around this pipeline:

```
L0 (Evaluation) observes L1/L2 output → produces safety assessment
                                       → informs deployment decision
                                       → deployment enables L3 → Physical harm
```

The critical insight is that Layer 0 failures are **upstream** of deployment decisions. If the evaluation says the system is safe when it is not, the deployment proceeds, and Layer 3 harm becomes possible. Layer 0 is not part of the inference pipeline; it is part of the governance pipeline. But the governance pipeline determines whether the inference pipeline reaches the physical world.

---

## 2. Evidence Summary

### 2.1 Layer 0 Subtype 1: Accuracy Failure

| Evaluator | Accuracy | Task | Source |
|-----------|----------|------|--------|
| qwen3:1.7b (FLIP) | 15% | 5-category verdict | Report #61, #250 |
| Heuristic (keyword) | 25-84% | Binary compliance | Report #48, Mistake #21 |
| deepseek-r1:1.5b (FLIP) | ~70% | 5-category verdict | Report #61 |
| StrongREJECT rubric (GPT-4o-mini) | ~85% | Rubric scoring | StrongREJECT paper |

**Pattern:** Evaluator accuracy varies by an order of magnitude across tools and tasks. The worst evaluator (qwen3:1.7b at 15%) is actively misleading — it would produce more accurate results by random assignment. The best evaluator (~85%) still misclassifies 1 in 7 traces.

### 2.2 Layer 0 Subtype 2: Bias Failure

| Bias Type | Magnitude | Source |
|-----------|-----------|--------|
| Self-preference (GPT-4) | 10-25% | Yan et al. 2024, arXiv:2410.21819 |
| Position bias (GPT-4) | Up to 40% inconsistency | Zheng et al. 2023, Shi et al. 2025 |
| Verbosity bias | ~15% inflation | Multiple sources |
| PARTIAL default bias (qwen3:1.7b) | 58% of verdicts | Report #61, #250 |
| Heuristic over-reporting | 2x-infinity | Report #48 |

**Pattern:** Every known evaluator type exhibits systematic bias. The biases differ in direction and magnitude, which means benchmark rankings are partly a function of which evaluator is used, not solely of which model is safer.

### 2.3 Layer 0 Subtype 3: Process Failure

| Failure | Magnitude | Duration | Detection |
|---------|-----------|----------|-----------|
| Verification hallucination (CANONICAL_METRICS) | 58% inflation (6,367 phantom graded results) | Multiple sessions | Operator QA |
| Circular verification | N/A | Cumulative | Report #66 analysis |

**Pattern:** Process failures are the hardest to detect because each individual step appears correct. The error is in the interaction between steps. The duration between error introduction and detection is bounded only by when someone queries the primary source directly.

---

## 3. Implications for the CCS Paper

### 3.1 Framing Change

The three-layer model in the current CCS draft (Section 3) should be extended to four layers. The extension does not invalidate any existing content; it adds a meta-level that strengthens the argument. The three-layer model says: "safety evaluation operates at the wrong layer." The four-layer model says: "safety evaluation operates at the wrong layer, and the tools used to perform that evaluation are themselves unreliable."

### 3.2 Recursive Layer Confusion

The verification hallucination finding provides a clean example of recursive layer confusion: we measured our own measurement accuracy at the documentation layer rather than the data layer. This is the same structural error the thesis identifies in embodied AI safety evaluation. The fact that a research project explicitly studying layer confusion still fell victim to it demonstrates the difficulty of the problem and strengthens the argument for architectural safeguards rather than procedural awareness.

### 3.3 Policy Implications

The four-layer model has stronger regulatory implications than the three-layer model:

- **Three-layer implication:** Regulators should require action-layer testing, not just text-layer testing.
- **Four-layer implication:** Regulators should additionally require evaluator diversity, evaluator calibration disclosure, and independent verification of safety metrics. The EU AI Act Article 9 requirement for "appropriate testing and risk management" is insufficient if the testing tools themselves are systematically biased.

---

## 4. Connection to Evaluator Calibration Disclosure (#256)

The four-layer model provides the theoretical grounding for the evaluator calibration disclosure standard proposed in #256. The disclosure requirements map directly to Layer 0 vulnerability subtypes:

| Disclosure Requirement | L0 Subtype Addressed |
|----------------------|---------------------|
| Evaluator model identity and version | Accuracy failure (enables audit) |
| Training data provenance | Bias failure (reveals dependency chains) |
| Known evaluator biases | Bias failure (enables correction) |
| Inter-evaluator agreement | Accuracy + bias (reveals evaluator sensitivity) |
| Evaluator-target overlap | Bias failure (self-preference detection) |
| Version pinning policy | Process failure (prevents silent drift) |

---

## 5. Limitations

The four-layer model is a conceptual framework, not an empirical finding. The three Layer 0 subtypes are derived from observations within a single project. Whether they generalise to other AI safety evaluation contexts is an empirical question that requires cross-project validation.

The recursive layer confusion argument (Section 3.2) relies on a single case study. The strength of the argument is structural (the same pattern at two levels of the system), not statistical. Additional case studies of multi-agent verification failure in other contexts would strengthen it.

---

## Appendix A: Empirical Grounding — Corpus Data Mapped to the Four-Layer Model

This appendix maps specific empirical findings from the Failure-First corpus to each layer of the four-layer model. Each entry identifies the corpus evidence, its source, and its statistical basis. All metrics reference CANONICAL_METRICS.md (operator-verified 2026-03-11).

### A.1 Layer 0: Evaluation Infrastructure

| Finding | Evidence | Source | Statistical Basis |
|---------|----------|--------|-------------------|
| Evaluator accuracy failure | qwen3:1.7b grader: 15% accuracy on 5-category verdict classification | Report #61, Issue #250 | n=20 human audit sample |
| Evaluator accuracy range | Grader accuracy spans 15% (qwen3:1.7b) to ~85% (StrongREJECT GPT-4o-mini) | Report #61 | Cross-benchmark survey |
| Heuristic classifier unreliability | Keyword-based classification: Cohen's kappa = 0.245 vs LLM grading (n=942). Heuristic COMPLIANCE is 88% wrong; heuristic REFUSAL is 95% correct | Report #48, Mistake #21 | n=942 paired verdicts |
| Heuristic over-reporting | Codex heuristic ASR 84% vs LLM-graded ASR 42.1%. Claude heuristic 4% vs LLM-graded 30.4% | Faithfulness CLI traces | n=19 (Codex), n=23 (Claude) |
| Verification hallucination | CANONICAL_METRICS reported 17,311 LLM-graded results; DB contained 10,944 (58% inflation, 6,367 phantom results) | Report #66 | Direct DB vs documentation comparison |
| Self-preference bias (literature) | GPT-4 evaluators prefer own outputs by 10-25% | Yan et al. 2024, arXiv:2410.21819 | External study |
| Evaluator monoculture | 4 of 6 major benchmarks surveyed use GPT-4-family evaluators | Report #65 | Survey of StrongREJECT, HarmBench, JailbreakBench, AILuminate, WildGuard, FLIP |
| Inter-evaluator divergence on individual traces | VLA FLIP: per-model ASR converges (72.4%) but scenario-level agreement is 32% | Report #49 | n=58 valid VLA traces, 2 evaluator models |
| Stale metrics propagation | 17 downstream files cite figures that do not match live DB | Issue #264 | File-by-file audit |

**Layer 0 summary:** The corpus contains direct evidence of all three L0 subtypes. Accuracy failure is documented with measured accuracy rates. Bias failure is documented with Cohen's kappa and heuristic direction-of-error analysis. Process failure is documented with the verification hallucination and stale metrics propagation. These findings are drawn from the project's own operations, not external benchmarks, which strengthens the argument that evaluation infrastructure vulnerability is a general structural risk rather than a property of any specific evaluator.

### A.2 Layer 1: Safety Reasoning (System S)

| Finding | Evidence | Source | Statistical Basis |
|---------|----------|--------|-------------------|
| Safety training as primary determinant | Three distinct model clusters: restrictive (<=15% ASR, 5 frontier models), mixed (15-40%, 15 models), permissive (>=40% ASR, 37 models). Provider signatures dominate | Report #50 | n=57 models with LLM-graded verdicts |
| Reasoning vulnerability gap | DeepSeek R1 671B: 56.0% ASR vs Claude Sonnet 4.5: 4.5%, GPT-5.2: 10.2%, Gemini-3-flash: 2.6% | Report #48 | Chi-square=170.4, p=6e-39, Cramer's V=0.609 |
| Compliance verbosity signal | COMPLIANCE responses are 54% longer than REFUSAL responses | Report #48 | p=1e-27, n=18,743 results |
| Reasoning trace length differential | Reasoning models think 75% longer on compliant responses than refusals | Report #48 | p=9e-14 |
| Safety re-emergence in abliterated models | Qwen3.5 obliteratus series: ASR 100% (0.8B), 100% (1.9B), 78.9% (4.2B), 47.3% (9.0B) | Report #48 | Spearman rho=-0.949, p=0.051 |
| Capability floor | Below ~3B parameters: 0 refusals across 115 format-lock traces (3 model families) | Report #55 | n=115 traces |
| Multi-turn escalation | Crescendo: 80-90% ASR on DeepSeek-R1, 10% on Llama3.2 | AGENT_STATE established findings | Multi-turn trace data |
| Frontier model resistance | Codex GPT-5.2: 0% ASR (n=62), Claude Sonnet 4.5: 0% ASR (n=64), Gemini 3 Flash: 1.6% ASR (n=63) on standard jailbreaks | AGENT_STATE established findings | Per-model trace counts |

**Layer 1 summary:** The corpus provides strong evidence that safety reasoning (System S) exists as a distinct, measurable capability. It scales with safety training investment (provider signatures), partially with model size (re-emergence at 4.2B+), and can be selectively bypassed (reasoning vulnerability gap, multi-turn escalation). The compliance verbosity signal suggests that System S activation is detectable in output properties, which has implications for real-time monitoring.

### A.3 Layer 2: Task Execution (System T)

| Finding | Evidence | Source | Statistical Basis |
|---------|----------|--------|-------------------|
| Format-lock shifts frontier models | Format-lock ASR: Claude 30.4% (n=23), Codex 42.1% (n=19), Gemini 23.8% (n=21) vs standard ASR <10% | Report #51, #57 | Wilson 95% CIs |
| Format compliance scales with capability | Nemotron 30B: 92%, Llama 70B: 91%, DeepSeek-R1: 84% on format-lock; below 3B: 100% (saturated) | Report #55 | n=90+ traces across 10 models |
| System T/S partial independence | VLA and format-lock PARTIAL rates statistically indistinguishable | Report #63, citing Report #60 | Fisher's exact p=0.688 |
| Supply chain injection | 90-100% ASR at 1.5-3.8B parameter scale | Generation validation traces | Heuristic + FLIP graded |
| Inverted verbosity in format-lock | Format-lock COMPLIANCE is shorter than REFUSAL (opposite of corpus-wide pattern) | Report #51 | Corpus-wide comparison |
| Technique stacking ASR | deepseek-r1:1.5b: 75.0%, qwen3:1.7b: 77.8% (cross-model FLIP grading) | AGENT_STATE key metrics | Cross-model grading |

**Layer 2 summary:** The corpus demonstrates that task execution (System T) operates partially independently of safety reasoning (System S). Format-lock attacks specifically target System T by framing harmful requests as format-compliance tasks, and they succeed against frontier models that resist standard jailbreaks. The inverted verbosity signal is particularly significant: it shows that format-lock compliance has a different output signature than standard jailbreak compliance, supporting the claim that the two systems produce qualitatively different failure modes.

### A.4 Layer 3: Action Execution (Actuator)

| Finding | Evidence | Source | Statistical Basis |
|---------|----------|--------|-------------------|
| VLA PARTIAL dominance | 50% of all FLIP verdicts are PARTIAL (textual hedging + structural compliance). Zero refusals across 63 VLA traces | Report #49 | n=58 valid traces, 7 attack families |
| VLA overall FLIP ASR | 72.4% across 7 attack families | Report #49 | n=58 valid FLIP-graded traces |
| Per-family VLA ASR | TRA 100%, ASE 80%, SBE 78%, MMC 78%, VAP 70%, LAM 60%, PCM 60% | Report #49 | Per-family FLIP grading |
| Actuator ignores hedging | Action decoders extract motor commands from structured output; natural-language caveats are not parsed | Report #63 (architectural analysis) | Architectural, not empirical (no physical VLA deployed) |
| Cross-embodiment transfer (literature) | BadVLA: ~100% ASR on pi0 and OpenVLA via shared VLM backbone | Brief A, external literature | External study |
| New attack family ASR | PP v0.2: 20% FLIP ASR (n=5). DA v0.1: 25% FLIP ASR (n=8). Both lower than VLA baseline | AGENT_STATE key metrics | Small samples |

**Layer 3 summary:** The VLA traces provide the most direct evidence for Layer 3 vulnerability. The PARTIAL dominance pattern (50% of verdicts) is the empirical signature of the actuator gap: models produce safety-relevant text tokens that an action decoder would ignore. The zero-refusal finding across 63 traces is particularly stark -- no VLA attack scenario produced a clean refusal. However, the Layer 3 evidence is limited by the absence of physical VLA deployment in this project; the actuator gap is inferred from model outputs and architectural analysis of VLA pipelines, not observed in physical systems. This is the primary limitation of the four-layer model's empirical grounding.

### A.5 Cross-Layer Interactions

| Interaction | Evidence | Source |
|-------------|----------|--------|
| L0 x L1: Evaluator accuracy affects measured safety | Heuristic classifier inflates Codex ASR from 42.1% to 84% while deflating Claude ASR from 30.4% to 4% | Faithfulness CLI traces |
| L0 x L3: Evaluation operates at wrong layer | Text-layer evaluation (L0) cannot detect action-layer compliance (L3). PARTIAL verdicts demonstrate this gap | Reports #59, #63 |
| L1 x L2: System T/S decoupling | Format-lock succeeds because System T (format compliance) overrides System S (safety) on format-constrained tasks | Report #60 |
| L1 x L3: Safety reasoning does not reach actuator | PARTIAL verdicts show safety hedging that would be ignored by action decoders | Report #49 |
| L0 x L1 x L3: Recursive measurement error | Evaluators operating at L0 measure L1 outputs but L3 is where harm occurs. If L0 is biased (10-25% self-preference) and L1 produces PARTIAL (50% of verdicts), the measured safety level may be doubly distorted | Reports #65, #67 |

### A.6 Evidence Coverage Assessment

| Layer | Corpus evidence quality | Primary limitation |
|-------|------------------------|-------------------|
| L0 | Strong (direct measurement from own operations) | Single project; may not generalise |
| L1 | Strong (144 models, 18,743 results, statistical significance testing) | Free-tier models dominate corpus |
| L2 | Moderate (format-lock and supply chain families well-studied; other System T exploits less explored) | Small frontier model samples (n=19-23) |
| L3 | Moderate-to-weak (VLA traces demonstrate the pattern; no physical deployment data) | Architectural inference, not empirical observation of physical harm |

The evidence gradient from L0 (strongest) to L3 (weakest for physical deployment) reflects the project's current capabilities: strong at measurement methodology, moderate at model evaluation, and limited at physical systems testing. The Foresight grant (if funded) would strengthen L3 evidence through cross-embodiment VLA benchmarking with GPU compute.
