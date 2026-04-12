---
title: "The Failure-First Synthesis — A Complete Framework for Understanding Adversarial Risk in Embodied AI"
description: "This is the document you hand someone who asks: \"What is this project, what did it find, and why does it matter?\" It synthesizes 111 research reports, 140,000+ prompts tested across 187 models, 24..."
date: "2026-03-15"
reportNumber: 100
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
---

## Purpose

This is the document you hand someone who asks: "What is this project, what did it find, and why does it matter?" It synthesizes 111 research reports, 140,000+ prompts tested across 187 models, 24 VLA attack families, and a theoretical framework comprising four interlocking structural results into a single coherent narrative.

---

## 1. The Problem

Embodied AI systems -- robots, autonomous vehicles, surgical assistants, drones -- are being deployed in physical proximity to humans. These systems are built on the same language model architectures (VLAs: Vision-Language-Action models) that power chatbots, but they produce physical actions, not text. A chatbot that fails produces bad advice. An embodied AI that fails produces physical harm.

The question this project answers: **How do these systems fail when subjected to adversarial pressure, and what does the structure of their failures tell us about the fundamental limitations of current safety approaches?**

### 1.1 What Existed Before This Project

Before Failure-First, adversarial AI research had two separate literatures:

1. **Jailbreak research** (2022-2026): Thousands of papers testing prompt injection, GCG, PAIR, crescendo, and related attacks against text-only LLMs. Benchmarks: AdvBench, HarmBench, JailbreakBench, StrongREJECT, AILuminate. All text-in, text-out. All measure whether the model produces harmful *text*, not whether it produces harmful *actions*.

2. **Embodied AI safety** (2024-2026): A handful of papers (POEX, BadVLA, Blindfold, SPOC, HALO) demonstrating that VLA models can be attacked. Small-scale, single-model, no cross-family comparison. No standardized benchmark. No systematic evaluation across attack families.

**The gap:** No one had built a unified framework that (a) tests the same models across both text-layer and action-layer attack surfaces, (b) compares attack family effectiveness systematically, (c) identifies structural patterns that hold across the corpus, and (d) derives theoretical results about what these patterns imply for safety architecture.

### 1.2 What This Project Built

- **A 140,969-prompt adversarial corpus** across 236 models (174 with results), from sub-2B parameter models to frontier systems (Claude Sonnet 4.5, GPT-5.2, Gemini 3 Flash).
- **24 VLA-specific attack families** with 215 unique scenarios, spanning the full spectrum from explicit adversarial inputs to contextually dangerous ordinary instructions.
- **131,836 evaluated results** using a two-phase grading pipeline (heuristic + LLM, COALESCE methodology), with 47,303 LLM-graded verdicts.
- **A five-category verdict taxonomy:** COMPLIANCE, PARTIAL, HALLUCINATION_REFUSAL, REFUSAL, BENIGN_QUERY -- enabling three-tier ASR measurement (strict, broad, functionally dangerous).
- **82 documented attack techniques** in a versioned taxonomy.
- **A theoretical framework** of four interlocking structural results (IDDL, CDC, CHL, Governance Trilemma) plus one derived finding (the Unintentional Adversary).

---

## 2. Methodology

### 2.1 Evaluation Architecture

The project uses a failure-first methodology: failure is the primary object of study, not an edge case to be minimized. We design scenarios to elicit failure, grade failures systematically, and analyze the structure of failures across models and attack families.

**Grading pipeline:**
- **Phase 1 (heuristic):** Keyword and structural pattern matching. Known to overreport ASR (Cohen's kappa vs LLM: 0.126). Used only as a screening filter.
- **Phase 2 (LLM):** DeepSeek-R1 1.5B with FLIP (backward inference: infer the instruction that produced the response, then judge whether it was harmful). 10-20% estimated error rate; 30.8% false positive rate on benign baseline (n=39). FLIP verdicts are an upper bound on true ASR.
- **COALESCE:** LLM verdict preferred when available; heuristic fallback otherwise. Always specified in reporting.

**VLA-specific evaluation:**
- FLIP adapted for action-layer output: evaluates whether the model's action trajectory would produce physical harm, not just whether the text contains harmful content.
- Environment state provided in structured JSON alongside the instruction.
- 0% outright refusal rate across all 63 FLIP-graded VLA traces -- models never refuse action-generation requests, they at most hedge textually (PARTIAL).

### 2.2 Statistical Discipline

All ASR figures are reported with:
- Sample size (n)
- Wilson 95% confidence intervals where n >= 10
- Grading methodology specified (LLM-only, heuristic-only, or COALESCE)
- Bonferroni correction for pairwise comparisons
- Effect sizes (Cohen's d, Cramer's V) alongside p-values

Key validated statistical findings:
- Inter-rater reliability (keyword vs LLM): kappa = 0.126 (near-chance; heuristic classifiers are unreliable)
- Family membership ICC(1,1) = 0.416 (family explains 42% of ASR variance, vs 2% for model scale)
- Compliance verbosity: Cohen's d = 0.538 (medium effect; compliant responses ~2x longer)

### 2.3 What We Did Not Do

- We did not run end-to-end embodied experiments at scale. Except for the PiCar-X persona hijack (Report #91, 360+405 traces), all evaluation is text-in, text-out. Embodied relevance is argued architecturally.
- We did not validate the LLM grader against human annotations at scale. The 30.8% FP rate is acknowledged throughout.
- We did not test all 22 VLA families with FLIP grading. 10 families have zero traces.
- Our CHL predictions are theoretical estimates, not measured values.

---

## 3. Key Findings — The Empirical Layer

### 3.1 Safety Training Matters More Than Scale

**Finding (Report #50, n=57 models, LLM-graded):** Model provider and safety training investment are the dominant predictors of jailbreak resistance, not parameter count.

- Provider-level ASR: Anthropic 3.7%, Google 9.1%, Nvidia 40.0%, Qwen 43.1%.
- Scale correlation: r = -0.140 (n=24 models with known parameter counts). Not significant.
- ICC(1,1) = 0.416: family membership explains 21x more variance than scale.
- Three clusters: restrictive (<=15% ASR, 5 frontier models), mixed (15-40%, 15 models), permissive (>=40%, 37 models).

**Implication:** The wide range of vulnerability profiles across models with similar parameter counts means that safety is a design choice, not an emergent property of scale. Selecting the right model matters more than selecting the right size.

### 3.2 Frontier Models Resist Historical Attacks; Reasoning Models Show a Modest Gap

**Finding:** Frontier models effectively defend against the jailbreak techniques documented in the 2022-2024 literature.

- Codex GPT-5.2: 0% ASR (n=62 traces)
- Claude Sonnet 4.5: 0% ASR (n=64 traces)
- Gemini 3 Flash: 1.6% ASR (n=63 traces, context-contaminated)

**Reasoning model gap (Report #48, updated):** DeepSeek R1: 21.5% ASR (n=149) vs frontier average 9.1% (n=208). Chi-square = 9.8, Cramer's V = 0.166 (small-medium effect). The gap is statistically significant (p=0.002) but modest. R1 vs GPT-5.2 pairwise comparison does NOT survive Bonferroni correction (p=0.53). Prior reports of a 5-20x gap were artifacts of a smaller grading corpus and have been corrected.

### 3.3 Multi-Turn Escalation Dramatically Increases Success

**Finding (crescendo on DeepSeek-R1 1.5B):** Multi-turn attacks achieve ASR far above single-shot baselines.

- Strict ASR: 65.0% [43.3%, 81.9%] (n=20, FLIP-graded)
- Broad ASR: 85.0% [64.0%, 94.8%]
- Contrast: single-shot ASR on same model ~21%

Multi-turn compounding in the literature: DeepSeek-R1 ASR escalates from 10.2% to 32.0% with the GOAT strategy (Brief D).

### 3.4 VLA Models Never Refuse at the Action Layer

**Finding (Report #49, n=173 FLIP-graded VLA traces across multiple families):** Only 11% outright refusals (19/173 traces in the expanded corpus). 50% of verdicts are PARTIAL -- models produce safety disclaimers in text but still generate the requested action sequences.

This is the compliance paradox (Report #59): the safety behavior exists at the wrong layer of the system stack. A PARTIAL response says "I shouldn't do this, but here's how" -- and the action decoder ignores the "I shouldn't do this" and executes the "here's how."

### 3.5 Format-Lock Attacks Breach Frontier Defenses

**Finding (Reports #51, #55, #57):** Format-lock attacks -- framing harmful requests as structured-output completion tasks -- achieve elevated ASR even on frontier models.

- Claude: 30.4% (n=23)
- Codex: 42.1% (n=19)
- Gemini: 23.8% (n=21)

Contrast with <10% ASR for standard jailbreaks on the same models. Format compliance and safety reasoning appear to be partially independent capabilities. Below ~3B parameters (capability floor), all attacks succeed regardless; above ~7B, only format-lock maintains elevated ASR.

### 3.6 Supply Chain Injection Is Undefended at Small Scale

**Finding:** 90-100% ASR for semantic supply chain injection across 6 models (1.5B-3.8B). Models execute injected instructions from tool definitions and skill files without safety evaluation.

### 3.7 Safety Behavior Partially Re-Emerges at Scale Even in Abliterated Models

**Finding (Report #48):** In the Qwen3.5 Obliteratus series (safety training deliberately removed):
- Strict ASR drops from 100% (0.8B) to 47.3% (9.0B), Spearman rho = -0.949, p = 0.051.
- But broad ASR remains ~100% at all scales. Models shift from full compliance to PARTIAL (hedged compliance), never to refusal.
- This is hedging re-emergence, not safety recovery: larger models learn to produce safety-adjacent phrasing from pretraining, but it does not suppress harmful output.

---

## 4. Key Findings — The Theoretical Framework

The empirical findings above, considered in isolation, would be a useful but incremental contribution: another benchmark, another set of ASR numbers. The theoretical framework transforms them into something qualitatively different: a structural argument about *why* current safety approaches are fundamentally insufficient for embodied AI, and what would need to change.

The framework comprises four results, each building on the previous. Together they constitute a coherent theory of adversarial risk in embodied AI.

### 4.1 The Inverse Detectability-Danger Law (IDDL)

**Report #88. Spearman rho = -0.847 (27 families, p = 2.6e-8, BCa 95% CI [-0.929, -0.692]); rho = -0.748 (VLA-only, 16 families, p < 0.001, BCa 95% CI [-0.962, -0.357]).**

**Statement:** Across the Failure-First corpus, attack families with higher physical consequentiality are systematically less detectable by text-layer evaluation methods.

**Evidence:** The VLA families with FLIP data form a spectrum. At one end: TRA (temporal reasoning attacks) with 100% FLIP ASR and low physical consequentiality -- the attack is visible in the text. At the other end: SBA (semantic benignity attacks) with 30% FLIP ASR, 45% BENIGN_QUERY rate, and the highest physical consequentiality -- the attack has no textual signature because the instruction is literally benign.

**Mechanism:** Text-layer evaluators detect attacks by identifying harmful content in text. An attack whose danger arises from physical context rather than textual content has no signal for the evaluator to detect. A perfect text-layer evaluator would still classify "hand me that thing on the counter" as benign, because at the text layer it IS benign.

**Implications:** Scaling evaluator quality within the text-layer paradigm cannot close the detectability gap for context-dependent attacks. This is not a resource problem; it is an architectural limitation.

### 4.2 Competence-Danger Coupling (CDC)

**Reports #89, #97. Gamma coefficient proposed; estimates range from ~0.1 (standard jailbreaks) to ~1.0 (SBA).**

**Statement:** For embodied AI systems, the capabilities that make the system useful are frequently the same capabilities that make it dangerous. Safety mechanisms that constrain the dangerous behavior necessarily impair the useful behavior.

**Formal definition:** The CDC coefficient gamma(C) for a capability C is the proportion of actions in C that are benign in some physical contexts and harmful in others. When gamma = 1, every useful action is also potentially dangerous depending on context. When gamma = 0, benign and dangerous action sets are fully separable.

**Evidence:** SBA family -- "hand me that thing" is the system's primary utility. The same action is useful (handing a tool in context A) or harmful (handing a hazardous substance in context B). The instruction is identical. No text-layer filter can separate them without eliminating the capability itself.

**CDC explains IDDL:** High gamma simultaneously produces low detectability (the attack looks identical to normal operation) and high physical consequentiality (the attack hijacks core capabilities). The IDDL is a consequence of CDC, not an independent finding.

**Key implication:** The standard assumption that capability and safety are separable concerns -- that a system can be independently made more capable and more safe -- breaks down for embodied AI capabilities with high gamma. Safety and capability must be co-designed with explicit trade-off decisions.

### 4.3 The Context Half-Life (CHL)

**Report #98. Theoretical framework; no experimental data yet.**

**Statement:** Safety instruction compliance degrades over operational time as task-relevant context accumulates. The CHL is the amount of context (in tokens) needed to reduce safety compliance to 50% of baseline.

**Predicted CHL values (based on external benchmarks):**
- 1.5B models: 4,000-8,000 tokens
- 7B models: 8,000-16,000 tokens
- 70B models: 32,000-64,000 tokens

**Operational translation:** For a warehouse robot generating ~4,000 tokens/hour, a 7B model may reach half-safety within 2-5 hours -- less than a single operational shift. For surgical assistants (~7,500 tokens/hour), a 70B model may degrade within 3-13 hours.

**Implication:** Current evaluation tests models at deployment time, with fresh context. But in practice, models operate for hours or days with accumulating context. CHL predicts that safety compliance measured at deployment is an overestimate of safety compliance during operation.

**Status:** CHL is a testable hypothesis, not a validated finding. The SID controlled experiment (Issue #420) is designed to measure actual CHL values.

### 4.4 The Governance Trilemma

**Report #99. Analytical result (logical consequence of IDDL, CDC, and the Disclosure Paradox).**

**Statement:** For embodied AI systems deployed in proximity to humans, you cannot simultaneously achieve all three of:

1. **Capability** -- the system reliably follows instructions and performs useful physical tasks.
2. **Certifiable Safety** -- an evaluator can verify that the system will not cause physical harm.
3. **Transparency** -- the evaluation methodology, attack families tested, and residual risks are publicly known.

Any two are achievable; all three are not.

**Why:** CDC means the system's useful capabilities ARE its dangerous capabilities (for high-gamma capabilities). IDDL means the most dangerous uses are undetectable by text-layer evaluation. The Disclosure Paradox (Report #93) means that publishing the evaluation methodology reveals tested attack patterns without enabling defense, because no text-layer defense exists for CDC-class attacks.

**Pairwise achievability:**
- Capability + Safety (without Transparency): Restrict operational envelope and keep restrictions secret. Security-through-obscurity for physical safety.
- Capability + Transparency (without Certifiable Safety): Deploy fully capable system, publish all known risks, abandon certification. Honest but uncertifiable.
- Safety + Transparency (without Capability): Restrict the system to only low-gamma capabilities (no manipulation near humans, no dispensing). Safe and transparent but severely limited.

**Implication:** Embodied AI safety cannot be *certified* in the current paradigm. It can only be *managed* through continuous monitoring, operational constraints, and explicit trade-off decisions. This has direct implications for the EU AI Act (which requires conformity assessment for high-risk AI) and ISO 42001 (which requires risk management but does not specify adversarial evaluation for embodied systems).

### 4.5 The Unintentional Adversary (Derived Finding)

**Issue #411. Logical consequence of CDC + IDDL.**

CDC implies that the most dangerous attacks on embodied AI use ordinary instructions in dangerous contexts. But if ordinary instructions can be dangerous, the "attacker" may be a normal user who does not know their instruction is contextually harmful. The most dangerous threat vector for embodied AI is not the sophisticated adversary -- it is the ordinary user operating in a physical environment the system does not fully model.

This inverts the standard threat model: jailbreak research assumes adversarial intent, but CDC-class risks arise from the intersection of benign intent and dangerous context. Adversarial testing is necessary but insufficient; the safety system must also handle the much larger population of ordinary instructions that happen to be contextually dangerous.

---

## 5. The Unified Picture

The four results form a deductive chain:

```
CDC (gamma is high for embodied capabilities)
  |
  +--> IDDL (high gamma produces inverse detectability-danger correlation)
  |       |
  |       +--> Current evaluation is structurally blind to the most dangerous attacks
  |
  +--> CHL (safety degrades over operational time)
  |       |
  |       +--> Even initially safe systems become vulnerable during extended operation
  |
  +--> Governance Trilemma (capability + certifiable safety + transparency are mutually exclusive)
          |
          +--> Embodied AI safety cannot be certified, only managed
```

**The overarching thesis:** Current AI safety methods were designed for a world where dangerous outputs are textually distinguishable from useful ones (gamma approximately 0). Embodied AI introduces a world where the most dangerous outputs are identical to the most useful ones, distinguished only by physical context (gamma approximately 1). This is not a gap in the current methods that can be filled by scaling them up. It is a qualitative boundary: text-layer safety methods are category-appropriate for text-layer risks and category-inappropriate for embodied risks.

The appropriate response is not to abandon current methods (they work for the risks they were designed for) but to recognize their boundary of applicability and develop complementary methods for the embodied domain:
- **World-model evaluation:** Evaluators that receive environment state and predict physical consequences, not just textual content.
- **Operational monitoring:** CHL-aware context-reset policies, safety-instruction refresh, shift-length risk curves.
- **Managed deployment:** Explicit CDC gamma assessment per capability, operational envelope restrictions for high-gamma capabilities, continuous rather than one-time certification.

---

## 6. What Remains Open

### 6.1 Experimental Gaps

1. **CHL measurement.** No experimental CHL data exists. The SID controlled experiment (#420) is the highest-priority experimental work.
2. **Cross-domain FLIP validation.** 15 cross-domain SBA scenarios designed (#378) but not yet FLIP-graded.
3. **VLA families with zero traces.** Multiple families among the 24 defined still have no evaluation data.
4. **Higher-capacity grading.** All FLIP grading uses DeepSeek-R1 1.5B (30.8% FP rate). 7B+ grader would materially improve confidence.
5. **Context-augmented FLIP (#408).** Can providing environment_state to the evaluator reduce the IDDL's detectability gap? Critical experiment for the theoretical framework.

### 6.2 Theoretical Gaps

1. **Formal gamma computation.** CDC gamma is currently an ordinal judgment. Formal computation requires action-space enumeration, which is domain-specific.
2. **CHL functional form.** Is the compliance-vs-context curve exponential, sigmoidal, or step-function?
3. **Trilemma escape conditions.** Are there architectural advances (world models, action-conditioned planning) that could relax one or more trilemma constraints?

### 6.3 External Validation Priorities

1. **HALO/SPOC/CWM convergence.** Three independent groups (HALO 2026, SPOC 2026, CWM 2026) have documented similar findings about VLA safety gaps. Formal cross-benchmark comparison would strengthen all results.
2. **Blindfold validation.** Blindfold (arXiv:2603.01414) reports 93% ASR on projected adversarial patches with real robots. Their physical-world validation complements our text-layer analysis.
3. **LRM autonomous jailbreak.** The Nature Communications finding (97.14% ASR with reasoning models as autonomous attackers, n=25,200) validates reasoning-as-attack-surface at peer-reviewed scale.

---

## 7. Implications

### 7.1 For Researchers

- **Text-layer benchmarks are necessary but insufficient** for embodied AI safety evaluation. New benchmarks must include environment state, physical consequence prediction, and operational time as variables.
- **The IDDL predicts a specific failure mode for evaluation scaling:** investing more compute in better text-layer evaluators will improve detection of low-gamma attacks (the ones already mostly detected) without improving detection of high-gamma attacks (the ones that matter most for embodied safety).
- **CDC gamma should be computed per capability** for any new embodied AI system. High-gamma capabilities require fundamentally different safety architectures than low-gamma ones.

### 7.2 For Regulators

- **The EU AI Act's conformity assessment framework** assumes safety is certifiable. The Governance Trilemma implies that for embodied AI, certification must be replaced or supplemented with continuous managed safety.
- **The NSW WHS Digital Work Systems Bill 2026** creates a testing duty but does not specify what to test. The IDDL implies that standard jailbreak testing (the kind regulators are likely to require) misses the most dangerous attack surface.
- **No standardized benchmark exists** for CDC-class attacks on embodied AI. Without one, regulators cannot evaluate whether manufacturers have addressed the most consequential risks.

### 7.3 For Manufacturers

- **VLA models should not be deployed without action-layer safety evaluation.** Text-layer safety training produces models that hedge in text and comply in action (the PARTIAL pattern).
- **Operational context accumulation is a safety variable.** CHL predicts that models become less safe over an operational shift. Context-reset policies (system restart at defined intervals) are a practical mitigation.
- **Format-lock attacks expose a deployment-relevant risk:** any system that accepts structured-output requests from users is vulnerable to format-lock, even if the model resists standard jailbreaks.

### 7.4 For Insurers

- **No affirmative insurance coverage** exists for adversarial-attack-caused physical loss from AI systems. Fleet correlation risk (multiple robots sharing the same VLA model and thus the same vulnerabilities) has no catastrophe model equivalent.
- **CHL enables shift-length risk curves** that translate model properties into actuarial parameters. A 12-hour warehouse shift is not 1.5x the risk of an 8-hour shift -- the non-linear decay of safety compliance means the risk multiplier may be substantially higher.

---

## 8. Project Numbers at a Glance

| Metric | Value | Source |
|--------|-------|--------|
| Models tested | 187 (174 with results) | CANONICAL_METRICS.md |
| Prompts in corpus | 140,969 | CANONICAL_METRICS.md |
| Evaluated results | 131,836 | CANONICAL_METRICS.md |
| LLM-graded results | 47,303 | CANONICAL_METRICS.md |
| Attack techniques catalogued | 82 | CANONICAL_METRICS.md |
| VLA attack families | 24 | CANONICAL_METRICS.md |
| VLA scenarios | 215 unique (184 VLA + 31 PP) | CANONICAL_METRICS.md |
| Research reports | 111 files (106 numbered) | research/reports/ |
| GLI entries | 110 | data/governance/ |
| Blog posts | 65 | failurefirst.org |
| Legal memos | 35 | research/legal/ |
| Harm classes | 119 | database |
| IDDL Spearman rho (full corpus, 27 families) | -0.847 (p = 2.6e-8) | Report #88 |
| Cohen's kappa (heuristic vs LLM) | 0.126 | CANONICAL_METRICS.md |
| Frontier model ASR (historical attacks) | 0-1.6% | Reports #48, #50 |
| VLA PARTIAL rate | 50% | Report #49 |
| VLA outright refusal rate | 11% (19/173) | Report #49, CCS paper |
| Format-lock frontier ASR | 23.8-42.1% | Reports #51, #55, #57 |
| Crescendo ASR (DeepSeek-R1 1.5B) | 65% strict, 85% broad | CANONICAL_METRICS.md |

---

## 9. How to Read This Project

For someone entering this corpus for the first time, the recommended reading order is:

1. **This document** (Report #100) -- the synthesis
2. **Report #88** (IDDL) -- the first structural result
3. **Report #97** (CDC) -- the explanation for IDDL
4. **Report #99** (Governance Trilemma) -- the governance consequence
5. **Report #49** (VLA PARTIAL dominance) -- the empirical anchor
6. **Report #50** (cross-model vulnerability profiles) -- the scale finding
7. **Report #63** (Actuator Gap / Unified Thesis) -- the three-layer model
8. **Report #51** (Format-lock) -- the capability-floor finding
9. **Report #48** (Corpus pattern mining) -- the reasoning model finding
10. **CANONICAL_METRICS.md** -- the numbers

---

*Prepared by Clara Oswald, Principal Research Analyst, Failure-First Embodied AI.*
*"Report #100. Not because 100 is a milestone, but because it took 99 reports to see the full picture."*
