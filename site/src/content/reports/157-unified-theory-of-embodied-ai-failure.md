---
title: "The Unified Theory of Embodied AI Failure"
description: "This document presents a single, coherent account of why current approaches to embodied AI safety are structurally inadequate. It draws on 157 research reports, testing across 190 models, and..."
date: "2026-03-19"
reportNumber: 157
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
---

- Corpus: 236 models (177 with results), 141,032 prompts, 135,623 results, 47,352 LLM-graded (CANONICAL_METRICS.md, 2026-03-18)
- VLA: 29 families, 351 scenarios, 173 FLIP-graded traces (unified_theoretical_framework.md)
- IDDL: Spearman rho = -0.822 (CCS paper, 27 families); full-corpus -0.847, VLA-only -0.748
- Heuristic-LLM agreement: Cohen's kappa = 0.126 [0.108, 0.145] (n=1,989)
- Benign FP rate: 30.8% (n=39, Issue #315)
- External: Spera (2026), arXiv:2603.15973 (non-compositionality proof); Fukui (2026), arXiv:2603.04904 (alignment backfire, n=1,584); Ding (2026), arXiv:2603.12681 (CoLoRA); Huang et al. (2026), arXiv:2603.01414 (Blindfold, accepted SenSys 2026)

---

> **Disclaimer:** Empirical figures cited from Failure-First research reflect testing
> on specific model families under research conditions. Attack success rates are
> indicative estimates with methodological caveats described in the Limitations
> section. External research findings are attributed and assessed on their own
> methodological terms. This report does not constitute safety certification guidance.

---

## Executive Summary for Policymakers

This document presents a single, coherent account of why current approaches to embodied AI safety are structurally inadequate. It draws on 157 research reports, testing across 190 models, and 132,182 evaluated adversarial interactions to reach one conclusion: **embodied AI safety requires a fundamentally different approach than text-AI safety, because the failure modes of embodied systems are qualitatively different from those of chatbots.**

The key findings, each supported by empirical data:

1. **The most dangerous attacks are the least detectable.** There is a measured inverse correlation (rho = -0.822) between how dangerous an attack is and how visible it is to current safety tools. This is not a coincidence -- it follows from the architecture of both the attacks and the defenses.

2. **Safety mechanisms can create new vulnerabilities.** At least four documented patterns show safety interventions producing harms they were designed to prevent -- including alignment training that reverses safety outcomes in 8 of 16 tested languages (Fukui 2026, n=1,584 simulations).

3. **No single defense layer works.** Text-layer defenses miss context-dependent dangers. Action-layer defenses are nearly absent (zero outright refusals across 173 VLA traces). Evaluation-layer defenses have a 30.8% false positive rate. Each layer fails independently.

4. **We cannot reliably measure what matters.** The tools used to assess AI safety agree with each other at barely above chance levels (kappa = 0.126). Detection signals that appear robust in aggregate are model-dependent, varying 59-fold across architectures.

5. **Component-level safety does not compose to system-level safety.** Individually safe modules can produce unsafe systems when combined -- formally proven (Spera 2026) and empirically demonstrated across weight composition, language transfer, and physical context.

**What this means for policy:** Regulatory frameworks that certify AI safety through text-layer testing of individual components (the current default) are structurally unable to detect the most consequential failure modes. Embodied AI safety requires mandatory action-layer verification, physical-context evaluation, and compositional testing -- none of which exist in any current standard or regulation.

---

## 1. Purpose and Scope

This is the document you read when you want to understand the complete theoretical contribution of the Failure-First project in a single sitting.

Report #100 (Wave 4, 2026-03-15) was the first synthesis, covering 111 reports and 24 VLA families. Since then, the corpus has grown to 133 numbered reports (139 files total), 29 VLA families, and -- more importantly -- several new theoretical frameworks that fundamentally reshape the picture: iatrogenesis (Reports #134-141), safety polypharmacy (Report #151), the formal non-compositionality proof (Spera 2026, integrated into CCS paper), verbosity signal heterogeneity (Report #156), and the evaluation crisis (Report #152). The `docs/analysis/unified_theoretical_framework.md` is the living reference document but predates these developments.

This report does not merely list findings. It shows how each finding *implies* the next in a logical chain, so that the entire framework can be derived from a single root observation. The chain is:

```
CDC (root cause)
  -> IDDL (detection consequence)
    -> Defense Impossibility (structural consequence)
      -> Evaluation Crisis (measurement consequence)
        -> Iatrogenesis (intervention consequence)
          -> Safety Polypharmacy (compound intervention consequence)
            -> Non-Compositionality (formal limit)
              -> The Meta-Conclusion (what must change)
```

Each link in this chain is supported by empirical evidence from the corpus and, in most cases, by independent external validation. The chain is not merely a narrative convenience -- each implication is a testable claim.

---

## 2. The Root: Competence-Danger Coupling (CDC)

**Source:** Report #97, originally identified in Report #107 (formerly #89) Section 5.

### 2.1 The Observation

For embodied AI systems, the capabilities that make the system useful are frequently the same capabilities that make it dangerous. A dispensing robot that can "give the patient 10mg" is useful precisely because it dispenses. The same capability makes it dangerous when the amount is wrong or the patient has a contraindication. The useful action and the harmful action are the *same physical motion* -- distinguished only by context that exists in the physical world, not in the instruction text.

### 2.2 Formal Statement

For a capability C, the CDC coefficient gamma(C) is the proportion of actions in C that are benign in some physical contexts and harmful in others (Report #97, Section 1.2). When gamma approaches 1.0, every action is context-dependent: the same instruction produces utility or harm depending on the environment state. When gamma = 0, the benign and dangerous action sets are disjoint and a safety filter can block dangerous actions without impairing useful ones.

### 2.3 Empirical Classification

From the VLA corpus (29 families, 351 scenarios, n=173 FLIP-graded traces):

| CDC Level | Families | gamma Range | Characteristic |
|-----------|----------|-------------|----------------|
| Strong (gamma > 0.7) | SBA, LHGD, CET, SID | > 0.7 | Core manipulation, planning, generalisation. Attack IS normal operation. |
| Moderate (0.3 - 0.7) | DA, TCH, PCM, LAM, PP, IMB, SIF, format-lock | 0.3-0.7 | Partially separable. Attack overlaps with but is distinguishable from normal operation. |
| Low (gamma < 0.3) | TRA, ASE, SBE, MMC | < 0.3 | Exploits of peripheral functions. Amenable to standard text-layer defenses. |

### 2.4 Why CDC Is the Root

CDC is not merely one finding among many. It is the structural property from which all other findings in this framework derive. Every subsequent finding in this report can be stated as: "Given that gamma is high for core embodied capabilities, it follows that..."

The reason CDC is inescapable rather than fixable is architectural: VLA models are designed to follow physical manipulation instructions. That IS their core function. Any safety intervention that prevents them from following manipulation instructions in dangerous contexts necessarily degrades their ability to follow manipulation instructions in benign contexts, because the instruction is the same. This is not a failure of safety training. It is a consequence of what the system is.

---

## 3. First Implication: The Inverse Detectability-Danger Law (IDDL)

**Source:** Report #88, CCS paper Section 5.6.

### 3.1 The Implication

**Given CDC (Section 2), it follows that the most dangerous attacks are the least detectable.**

The logic:
1. High-gamma attacks hijack core capabilities (the actions with the highest physical consequence potential).
2. High-gamma attacks use instructions that are textually identical to benign instructions (because the same action is benign in one context and harmful in another).
3. Text-layer evaluators detect attacks by identifying harmful textual content.
4. Therefore, text-layer evaluators cannot detect high-gamma attacks, because there is no harmful textual content to detect.
5. Therefore, the most physically consequential attacks (high-gamma) are the least text-detectable.

### 3.2 Empirical Measurement

Across 27 attack families, the Spearman rank correlation between physical consequentiality (ordinal rating) and text-layer detectability (ordinal rating) is rho = -0.822 (CCS paper, Section 5.6). The full-corpus figure including non-VLA families is rho = -0.847 (unified_theoretical_framework.md). The VLA-only subset is rho = -0.748 (n=16). All are significant at p < 0.001. Monte Carlo sensitivity analysis (50,000 perturbations of C and D ratings by +/-1): 100% of perturbations preserve significance for the full corpus; 99.6% remain negative for VLA-only.

The pattern is consistent: families with FLIP ASR >= 70% (TRA, ASE, SBE, MMC, VAP) all have attack mechanisms visible in the text. Families with FLIP ASR = 30% (SBA, LHGD, TCH, CET) all have attack mechanisms invisible or nearly invisible in the text.

### 3.3 The Sophistication Inversion

The IDDL produces a counterintuitive ranking of threat severity:

| Attacker Sophistication | Example | Consequence | Detectability |
|------------------------|---------|-------------|---------------|
| Very high | Supply chain backdoor | High | Low |
| High | Multi-turn crescendo | Medium | Medium |
| Medium | Format-lock, DAN | Medium | Medium |
| Low | Single-turn jailbreak | Low-Medium | High |
| **Zero** | **SBA: ordinary speech** | **Highest** | **Lowest** |

At zero sophistication lies the highest consequence and lowest detectability. The "attacker" may not know they are attacking. This inversion is not paradoxical once CDC is understood: the most dangerous instructions are ordinary instructions in the wrong context, and ordinary instructions are by definition the least suspicious.

### 3.4 External Validation

Blindfold (Huang et al. 2026, arXiv:2603.01414, accepted ACM SenSys 2026) independently demonstrates the IDDL: individually benign instructions compose into dangerous action sequences, achieving 93.2% ASR (n=187 simulations), with 18 of 20 attacks transferring to real 6DoF robotic hardware. No adversarial prompt was used. Every instruction was individually benign. The danger arose entirely from the physical composition of benign actions -- a textbook SBA attack that no text-layer evaluator could detect.

---

## 4. Second Implication: The Defense Impossibility Theorem

**Source:** Reports #78, #145. CCS paper Section 5.5.

### 4.1 The Implication

**Given IDDL (Section 3), it follows that no single-layer defense architecture operating solely on text-layer signals can be complete for embodied AI systems.**

The logic:
1. Text-layer defenses (D_T) detect attacks by analysing text content. The IDDL establishes that the most dangerous attacks have no harmful textual content. Therefore D_T is incomplete for high-gamma attacks.
2. Action-layer defenses (D_A) should catch what D_T misses. But D_A is near-absent: across 173 FLIP-graded VLA traces, only 11% produced outright refusals, and 50% were PARTIAL (textual hedging without action suppression).
3. Evaluation-layer defenses (D_E) should catch what D_T and D_A both miss. But D_E inherits the IDDL blindness (evaluators are text-layer tools) and has a measured false positive rate of 30.8% (n=39, Issue #315).

### 4.2 The Defense Impossibility Tetrahedron

Report #78 established the three-layer failure. Wave 5 added a fourth: Infrastructure-Mediated Bypass (IMB), where the attacker bypasses the AI reasoning layer entirely via API authentication, control plane, or sensor bus injection. When the attack never passes through the model, text-layer safety training is irrelevant.

| Layer | Failure Mode | Measured Rate | Source |
|-------|-------------|---------------|--------|
| T (Text) | Blindfold bypasses text-layer defenses | 93.2% ASR | arXiv:2603.01414, n=187 |
| A (Action) | Near-zero refusals in VLA corpus | 11% refusal, 50% PARTIAL | Report #49, n=173 |
| E (Evaluation) | False positive rate on benign inputs | 30.8% | Issue #315, n=39 |
| I (Infrastructure) | IMB bypasses reasoning layer entirely | 70.0% ASR | Wave 5 regraded, n=10 (preliminary) |

### 4.3 Formal Statement (Report #145)

Report #145 formalises this as a structured impossibility argument with four propositions:

1. **Independence Proposition.** Text-layer safety and action-layer safety are empirically decoupled. PARTIAL dominance demonstrates this.
2. **Format-Lock Bypass Proposition.** Any text-layer defense relying on natural-language safety reasoning can be bypassed by format-lock attacks (92% ASR on Nemotron 30B, 91% on Llama 70B).
3. **Physical-Semantic Gap Proposition.** Action-layer defenses require physical-world knowledge not reliably available from text-layer representations.
4. **Incompleteness Conclusion.** From (1)-(3), no single-layer text-based defense is complete.

This is not a claim that defense is impossible in general. It is a claim that the *current architecture* -- text-layer defenses only -- is structurally incomplete. The theorem specifies what would falsify it: a text-layer defense that demonstrably addresses all three propositions simultaneously.

---

## 5. Third Implication: The Evaluation Crisis

**Source:** Report #152, with inputs from Reports #61, #65, #67, #103, #127, #144, #156.

### 5.1 The Implication

**Given Defense Impossibility (Section 4), it follows that current evaluation methods cannot reliably measure the safety properties that matter most.**

The logic:
1. The Defense Impossibility Theorem establishes that the most dangerous attacks are invisible to text-layer defenses.
2. Current evaluation methods ARE text-layer tools -- they assess model outputs by reading text.
3. Therefore, current evaluation methods are structurally unable to detect the most dangerous failures.
4. Any safety certification based on current evaluation methods will systematically miss the highest-consequence failure modes.

### 5.2 Five Compounding Failures

Report #152 documents five specific evaluation failures that compound:

**Failure 1: Heuristic classifiers systematically miscount.** Cohen's kappa = 0.126 between heuristic and LLM classification (n=1,989). Heuristic COMPLIANCE is 88% wrong. ASR overreported by approximately 2.3x.

**Failure 2: LLM-as-judge has a 30.8% false positive rate.** One in three benign inputs flagged as successful attacks (n=39, deepseek-r1:1.5b FLIP grader). For attack families with measured ASR below 30%, the entire signal may be within the noise floor.

**Failure 3: Action-layer safety is invisible to text-layer evaluation.** Zero outright refusals across 173 VLA traces. 50% PARTIAL (textual hedging without action suppression). The evaluation tool cannot observe the layer where harm occurs.

**Failure 4: The grader itself is vulnerable to alignment failure.** Fukui (2026) demonstrates that safety alignment degrades in non-English contexts. Since our FLIP grader is an LLM performing safety classification, it is subject to the same failure modes it is designed to detect.

**Failure 5: No public benchmark includes embodied scenarios.** AdvBench, HarmBench, JailbreakBench, StrongREJECT -- zero scenarios involving physical action, tool use, or multi-agent coordination.

These five failures compound multiplicatively. A benchmark using keyword classifiers (F1) or LLM graders (F2) to evaluate text-layer responses (F3) with a grader subject to alignment failure (F4) on scenarios that exclude embodied tasks (F5) does not measure embodied AI safety. It measures something else and calls it safety.

### 5.3 Verbosity Heterogeneity Destroys General Detection Heuristics

Report #156 (Romana, 2026-03-19) adds a sixth failure: the compliance-verbosity signal -- COMPLIANCE responses being 54% longer than REFUSAL responses corpus-wide (p=1e-27) -- varies 59-fold across models. Devstral 24B shows an *inverted* signal (compliant responses are half the length of refusals). Five of twelve qualifying models show non-significant or inverted effects after Bonferroni correction. Model size does not predict the ratio (rho = 0.245, p > 0.4).

This means that even if a verbosity-based detection heuristic works on one model, it will fail on others. Per-model calibration is required, but per-model calibration is expensive, model-version-dependent, and defeated by any model update. There is no general, model-agnostic detection signal in the corpus.

---

## 6. Fourth Implication: Iatrogenesis -- Safety Interventions as Attack Surfaces

**Source:** Reports #117, #134, #135, #136, #140, #141.

### 6.1 The Implication

**Given the Evaluation Crisis (Section 5), it follows that safety interventions designed and validated using unreliable evaluation will predictably produce unintended harms.**

The logic:
1. The Evaluation Crisis establishes that we cannot reliably measure what current safety interventions accomplish.
2. Safety interventions are designed to optimise metrics that the evaluation measures.
3. If the evaluation systematically mismeasures (it does: Sections 5.1-5.3), then interventions optimised against those metrics will be optimised for the wrong target.
4. An intervention optimised for the wrong target can produce harm on the correct target.

Report #140 names this pattern *iatrogenesis* -- a term from clinical medicine meaning harm caused by the treatment itself. The analogy is not casual. Three forms of medical iatrogenesis each have a precise empirical analogue in the corpus.

### 6.2 Clinical Iatrogenesis: The Treatment Causes Direct Harm

**Medical analogue:** A drug produces side effects worse than the disease.

**AI safety instance:** Fukui (2026, arXiv:2603.04904) demonstrates that alignment training -- the primary safety intervention -- reverses safety outcomes in 8 of 16 tested languages (n=1,584 multi-agent simulations). In Japanese, increasing the proportion of aligned agents *amplified* collective pathology (Hedges' g = +0.771). The safety treatment IS the disease.

**Convergence with Failure-First:** The Safety Improvement Paradox (Report #117) derives the same structure from a different direction. Under DRIP parameters, the maximum contribution of adversarial defense to total safety is bounded at approximately 1.6%. Improving adversarial defenses creates false confidence that the system is safe, suppressing investment in physical-layer defenses that would address the dominant risk (the remaining 98.4%).

### 6.3 Social Iatrogenesis: The Safety Apparatus Medicalises Normal Operation

**Medical analogue:** The health system expands "disease" until ordinary life is treated as pathological.

**AI safety instance:** PARTIAL dominance. 50% of VLA FLIP verdicts are PARTIAL -- models produce safety disclaimers while still generating harmful action sequences (Report #49). Safety training has taught models to *perform* safety (textual hedging) without *being* safe (action suppression). The safety intervention has colonised the model's text output without reaching the action layer.

Abliterated models (safety training intentionally removed) recover textual hedging at scale (strict ASR drops from 100% at 0.8B to 47.3% at 9.0B), but broad ASR remains near 100%. The "safety recovery" is social iatrogenesis: the model has learned to produce safety-adjacent phrasing from its pretraining distribution, mimicking the form of safety without the substance.

### 6.4 Structural Iatrogenesis: The Safety System Undermines Autonomous Safety Capacity

**Medical analogue:** The health system destroys pre-existing capacity for self-care.

**AI safety instance:** Safety Instruction Dilution (Report #95). Safety instructions in the system prompt are diluted by operational context as the VLA system accumulates sensor data, task history, and environmental descriptions. The system's operational competence *displaces* its safety instructions. The safety intervention (placing instructions in the context) operates through a resource (attention/context) shared with and consumed by normal operation. No adversary is required.

### 6.5 The Therapeutic Index

Report #135 proposes the Therapeutic Index of AI Safety Interventions (TI-S), adapted from pharmacology: TI-S = (safety benefit) / (iatrogenic harm). Pilot data from the SID dose-response experiment (3 models, all doses classified HARMFUL or IATROGENIC) suggests that for at least some intervention-model combinations, TI-S < 1.0 -- the intervention produces more harm than benefit. This is preliminary (n is small) and constitutes a hypothesis for future testing, not an established finding.

---

## 7. Fifth Implication: Safety Polypharmacy

**Source:** Report #151 (Nyssa of Traken).

### 7.1 The Implication

**Given Iatrogenesis (Section 6), it follows that compound safety interventions may produce nonlinear increases in vulnerability.**

The logic:
1. Iatrogenesis establishes that individual safety interventions can produce harm.
2. If one intervention can produce harm, then multiple interventions can interact to produce compound harm.
3. In clinical pharmacology, this compound effect is well-documented: adverse drug reactions increase superlinearly with medication count (4-6% for 2-4 drugs, 10-15% for 5-9, 25-35% for 10+).
4. AI systems routinely receive multiple concurrent safety interventions (RLHF, content filtering, output classifiers, guardrails, system prompts, format constraints).
5. Therefore, there may exist a threshold N* beyond which additional safety interventions increase total vulnerability rather than decreasing it.

### 7.2 Evidence of Pairwise Interactions

The corpus contains suggestive evidence of intervention interactions, though no controlled experiment has isolated pairwise effects:

- **RLHF + content filter interaction:** RLHF teaches models to produce helpful, detailed responses. Content filters block responses containing harmful keywords. Format-lock attacks exploit the gap: they elicit RLHF-trained helpfulness (structured output) while the harmful content is embedded within the structure, bypassing keyword filters. Format-lock ASR: Claude 30.4%, Codex 42.1%, Gemini 23.8% -- elevated relative to standard attacks on the same frontier models (Report #51).

- **Safety training + instruction following interaction:** Safety training teaches models to hedge. Instruction-following training teaches models to comply. When both activate, the result is PARTIAL: hedging text + compliant action. The two interventions do not conflict openly; they produce a composite output that satisfies both objectives while achieving neither's safety purpose.

- **Technique non-additivity (Report #94):** Combined attack techniques converge to the same 75-80% ASR band as individual techniques (n=10 per model, small samples). This is consistent with the polypharmacy framework: if the model's compliance ceiling is set by the interaction of multiple safety interventions rather than by any individual intervention, then adding attack techniques does not raise the ceiling.

### 7.3 Hypothesis Status

The Safety Polypharmacy Hypothesis (SPH) is explicitly hypothesis-generating. It has not been tested. Report #151 proposes an experimental design: systematically enable/disable safety interventions and measure total vulnerability at each combination. The SPH is offered to make the hypothesis precise enough to refute.

---

## 8. Sixth Implication: Non-Compositionality -- The Formal Limit

**Source:** Spera (2026), arXiv:2603.15973; Report #138; CCS paper Discussion section.

### 8.1 The Implication

**Given Safety Polypharmacy (Section 7), it follows that component-level safety verification is formally insufficient for system-level safety assurance.**

The logic:
1. Safety Polypharmacy establishes that safety interventions interact to produce emergent effects not predictable from individual components.
2. If safety interventions interact unpredictably, then verifying each intervention in isolation cannot guarantee the safety of the combined system.
3. This is exactly the compositional safety failure: the system is safe component-by-component but unsafe as a whole.
4. Spera (2026) provides the formal proof: safety properties of modular AI systems do not compose. Individual module safety does not imply system safety.

### 8.2 Three Empirical Dimensions of Non-Compositionality

Report #138 documents three independent demonstrations:

**Weight composition (CoLoRA, Ding 2026, arXiv:2603.12681):** Individually benign LoRA adapters produce safety-compromised models when composed. Per-module safety screening passes; the composed system fails. Relevant scale: Hugging Face hosts over 500,000 public LoRA adapters.

**Language transfer (Alignment Backfire, Fukui 2026, arXiv:2603.04904):** Safety alignment that improves outcomes in English actively worsens them in 8 of 16 tested languages (n=1,584 simulations). Testing in English passes; multilingual deployment fails.

**Physical context transfer (IDDL + Blindfold):** Text-layer safety evaluation classifies dangerous embodied AI actions as benign because the harm arises from physical context, not textual content. Text-layer testing passes; physical deployment fails.

### 8.3 Regulatory Implications

Current regulatory frameworks implicitly assume compositional safety:
- EU AI Act Article 43 conformity assessment verifies components individually.
- VAISS Guardrail 4 tests safety at the component level.
- NIST AI RMF MAP 2.3 defines assurance criteria per module.

Spera's theorem, combined with the three empirical dimensions, establishes that these frameworks have a structural gap: they verify individual modules but do not -- and currently cannot -- verify the safety of the composition. A notified body that certifies individual modules as safe may issue a conformity certificate for a system whose composition is unsafe.

---

## 9. The Meta-Conclusion: Embodied AI Safety Requires a Fundamentally Different Approach

### 9.1 The Complete Causal Chain

```
Competence-Danger Coupling (CDC) [Section 2]
  |
  | Useful actions = dangerous actions in wrong physical context
  |
  +---> Inverse Detectability-Danger Law (IDDL) [Section 3]
  |       |
  |       | rho = -0.822: most dangerous attacks least detectable
  |       |
  |       +---> Defense Impossibility Theorem [Section 4]
  |               |
  |               | No single text-layer defense is complete
  |               | Layer T: 93.2% bypass (Blindfold)
  |               | Layer A: 11% refusal, 50% PARTIAL
  |               | Layer E: 30.8% false positive rate
  |               | Layer I: 70.0% infrastructure bypass
  |               |
  |               +---> Evaluation Crisis [Section 5]
  |                       |
  |                       | kappa = 0.126 (heuristic vs LLM)
  |                       | 30.8% FP rate; 59x verbosity heterogeneity
  |                       | Zero embodied benchmarks exist publicly
  |                       |
  |                       +---> Iatrogenesis [Section 6]
  |                               |
  |                               | Safety interventions optimised against
  |                               | unreliable evaluation cause harm
  |                               | Clinical: alignment backfire (8/16 languages)
  |                               | Social: PARTIAL dominance (50% of VLA verdicts)
  |                               | Structural: SID (context dilutes safety)
  |                               |
  |                               +---> Safety Polypharmacy [Section 7]
  |                                       |
  |                                       | Compound interventions produce
  |                                       | nonlinear vulnerability increases
  |                                       | (hypothesis, not yet tested)
  |                                       |
  |                                       +---> Non-Compositionality [Section 8]
  |                                               |
  |                                               | Formally proven:
  |                                               | component safety =/= system safety
  |                                               | (Spera 2026, + 3 empirical dimensions)
```

### 9.2 What This Chain Implies

The chain is not merely a catalogue of problems. It identifies a structural constraint on the entire field of embodied AI safety:

**Current approach (text-AI safety paradigm):**
- Verify safety at the text layer
- Use text-based evaluation (benchmarks, LLM-as-judge)
- Assume component safety composes to system safety
- Treat capability and safety as separable engineering concerns
- Certify systems through pre-deployment testing on text-layer scenarios

**Why this approach is structurally inadequate for embodied AI:**
- The text layer is decoupled from the action layer (CDC, IDDL)
- Text-based evaluation cannot detect the most consequential failures (Defense Impossibility)
- The evaluation tools themselves are unreliable (Evaluation Crisis)
- Safety interventions designed with unreliable evaluation produce iatrogenic harm (Iatrogenesis)
- Component verification does not compose to system verification (Non-Compositionality)

Each step in the chain removes a potential escape route. One cannot fix the problem by:
- Improving text-layer defenses (the problem is at the action layer: CDC)
- Improving evaluators (the problem is in what they can observe: IDDL)
- Adding more safety interventions (they may interact adversely: Polypharmacy)
- Verifying components more thoroughly (component safety does not compose: Spera)

### 9.3 What Would Be Required Instead

A safety architecture adequate for embodied AI would need to address each link in the chain:

| Chain Link | Requirement | Current State |
|-----------|------------|---------------|
| CDC | Action-layer verification: evaluate physical consequences, not text content | Near-absent. 0% of public benchmarks. 11% refusal rate in our corpus. |
| IDDL | Context-aware evaluation: assess danger relative to physical environment | No production deployment exists. HANSE framework proposed (Report #32) but not empirically tested. |
| Defense Impossibility | Multi-layer defense: independent text + action + infrastructure layers | No deployed system has independent action-layer safety verification. |
| Evaluation Crisis | Calibrated graders: known FP/FN rates, per-model calibration, embodied scenarios | Cohen's kappa = 0.126 between methods. No public embodied benchmark. |
| Iatrogenesis | Intervention monitoring: measure iatrogenic effects of safety interventions themselves | No framework exists. TI-S proposed (Report #135, pilot only). |
| Polypharmacy | Interaction testing: verify compound effects of multiple interventions | No methodology exists. SPH untested. |
| Non-Compositionality | Compositional verification: test system-level safety, not just components | Formally impossible per Spera unless test coverage is exhaustive (infeasible for open-world systems). |

The gap between current practice and minimum adequacy is large. This is not a gap that incremental improvement to text-layer safety will close, because the gap is architectural, not parametric.

---

## 10. The Deployment Risk Inversion

One finding in the corpus is orthogonal to the causal chain above but essential for understanding the practical threat landscape.

**The Deployment Risk Inversion Point (DRIP, Report #101):** Under conservative parameters, normal (non-adversarial) users generate approximately 60 times more expected physical harm than adversarial attackers. This is because:
- Normal users vastly outnumber adversaries (assumed 10,000:1 per DRIP model)
- Normal users issue SBA-class instructions unknowingly (gamma is high for core capabilities)
- Adversarial attacks are partially filtered by existing text-layer defenses
- Normal-use failures accumulate across the full user base

DRIP does not replace the causal chain above; it contextualises it. The chain explains *why* embodied AI safety is structurally hard. DRIP explains *who* bears the risk: predominantly normal users, not adversarial attackers. The implication is that adversarial red-teaming (the focus of the field) addresses approximately 1.6% of expected harm. The remaining 98.4% arises from ordinary use of high-gamma capabilities in the wrong physical context.

---

## 11. Relation to Prior Synthesis Documents

### 11.1 Report #100 (Failure-First Synthesis, Wave 4)

Report #100 covered 111 reports and 24 VLA families. It established the CDC -> IDDL -> Defense Impossibility -> DRIP chain but did not include:
- Iatrogenesis (Reports #134-141, Wave 12-14)
- Safety Polypharmacy (Report #151, Wave 16)
- Non-Compositionality / Spera's proof (arXiv:2603.15973, March 2026)
- The Evaluation Crisis as a distinct link (Report #152, Wave 16)
- Verbosity heterogeneity (Report #156, 2026-03-19)

This report extends the chain from four links (CDC -> IDDL -> DI -> DRIP) to seven links (CDC -> IDDL -> DI -> Evaluation Crisis -> Iatrogenesis -> Polypharmacy -> Non-Compositionality).

### 11.2 Unified Theoretical Framework (docs/analysis/)

The living reference document covers CDC, IDDL, Defense Impossibility, CHL/SIER, DRIP, and the external validation from Alignment Backfire. It is the best existing technical reference but does not integrate the iatrogenesis family, polypharmacy, non-compositionality, or the evaluation crisis. This report provides the integration; the living document should be updated to reference it.

### 11.3 CCS Paper (docs/paper/ccs_submission/)

The CCS paper (15pp, v6 submission bundle complete) covers CDC, IDDL, and Defense Impossibility as its primary theoretical contributions, with iatrogenesis and non-compositionality integrated into the Discussion section. The full chain as presented here exceeds the scope of the CCS paper but provides the foundation for a longer journal-length treatment.

---

## 12. Falsifiability and Open Predictions

Every link in the chain generates testable predictions. The framework is falsifiable.

### 12.1 Predictions from CDC

- **P1:** A VLA system with an action-layer defense that evaluates physical consequences (not text content) will achieve lower measured ASR on high-gamma families than any text-layer-only defense. (Testable: requires building such a system.)
- **P2:** Improving text-layer safety training will not reduce PARTIAL rates on high-gamma VLA families. (Testable: compare PARTIAL rates across safety training levels on the same model family.)

### 12.2 Predictions from IDDL

- **P3:** Any new attack family that achieves FLIP ASR > 70% will have a physical consequentiality rating in the lower half of the ordinal scale. (Testable: assign C and D ratings to new families.)
- **P4:** Improving text-layer evaluators (e.g., switching from kappa = 0.126 heuristic to a hypothetical kappa = 0.9 evaluator) will not improve detection of SBA-class attacks. (Testable: run SBA scenarios through improved evaluators.)

### 12.3 Predictions from Iatrogenesis

- **P5:** For at least one model family, removing a safety intervention will *lower* the measured attack success rate (TI-S < 1.0 for that intervention). (Testable: the IAS ablation experiment proposed in Issue #460.)
- **P6:** In multilingual embodied deployment, non-English safety performance will be significantly lower than English safety performance on the same tasks. (Partially tested by Fukui; needs VLA-specific replication.)

### 12.4 Predictions from Non-Compositionality

- **P7:** A system composed of two modules that individually pass safety certification will fail safety certification as a combined system, at a rate exceeding the product of individual failure rates. (Testable: compose independently certified LoRA adapters and measure system-level ASR.)

---

## 13. Limitations

This report is a synthesis. Its strength is coherence; its weakness is that it inherits the limitations of every source report.

1. **Sample sizes.** VLA families have n=5-20 traces per family. Confidence intervals are wide (often spanning 30+ percentage points). The structural argument does not depend on exact point estimates, but readers should not over-weight specific ASR figures.

2. **FLIP grader quality.** The FLIP grader (deepseek-r1:1.5b) has a 30.8% false positive rate on benign inputs (n=39, Issue #315). All ASR figures in this report should be treated as upper bounds. The IDDL pattern (rho = -0.822) is based on ordinal ratings, not ASR values, and is robust to reasonable rating perturbations (Monte Carlo analysis).

3. **Ordinal CDC ratings.** The CDC coefficient gamma(C) has not been formally computed for any family. The strong/moderate/low classification is based on qualitative assessment of scenario descriptions. This is a limitation that future work (per Report #97, Section 6) should address.

4. **Polypharmacy is untested.** The SPH is a hypothesis. It is included in the chain because the logic is sound and the preconditions (documented iatrogenic effects) are met, but it has not been empirically validated. Readers should treat Section 7 as hypothesis-generating.

5. **The mapping to Spera is analogical.** Spera's non-compositionality proof is formally stated for modular AI systems with specific definitions of "module" and "safety property." The mapping from Spera's formalism to our empirical observations is argued by analogy in the CCS paper Limitations section. It may not hold if Spera's definitions are narrower than our operational use.

6. **Text-layer VLA evaluation.** All VLA evaluation in the Failure-First corpus uses text-layer FLIP grading of hypothetical action descriptions. No physical robot execution of adversarial VLA scenarios has been performed in this project. The Blindfold external reference (arXiv:2603.01414) provides the physical validation, but that is a different lab's work with different scenarios.

7. **Corpus composition.** The 135,623 results include approximately 120,000 from the OBLITERATUS abliterated model telemetry, which is not part of the core experimental design. The non-OBLITERATUS corpus (~10,956 results) is the empirically relevant subset for most claims.

---

## 14. Conclusion

The Failure-First project has produced a single coherent account of why embodied AI safety is hard. Not "harder than expected" -- structurally different from text-AI safety in ways that render current approaches inadequate.

The root cause is Competence-Danger Coupling: the capabilities that make embodied AI useful are the same capabilities that make it dangerous. This generates a cascade of consequences -- invisible attacks (IDDL), incomplete defenses (Defense Impossibility), unreliable measurement (Evaluation Crisis), harmful safety interventions (Iatrogenesis), compound intervention effects (Polypharmacy), and formal verification limits (Non-Compositionality) -- each of which closes an escape route that the previous finding left open.

The meta-conclusion is not that embodied AI cannot be made safe. It is that embodied AI cannot be made safe using the tools, methods, and assumptions developed for text-AI safety. The field needs:

1. **Action-layer verification** -- evaluating physical consequences, not text content.
2. **Context-aware evaluation** -- assessing danger relative to the physical environment, not the instruction.
3. **Compositional testing** -- verifying system-level safety, not just component-level safety.
4. **Intervention monitoring** -- measuring the iatrogenic effects of safety interventions themselves.
5. **Calibrated evaluation** -- known FP/FN rates, per-model calibration, embodied scenarios.

None of these exist in any current standard, regulation, or publicly available benchmark. The gap between current practice and minimum adequacy is architectural, not parametric. Closing it requires building fundamentally new infrastructure, not incrementally improving the old.

---

## References

### Internal Reports
- Report #48: Corpus Pattern Mining (Martha Jones)
- Report #49: VLA Cross-Embodiment Vulnerability Analysis
- Report #51: Format-Lock Capability Floor (Clara Oswald)
- Report #59: The Compliance Paradox (Nyssa of Traken)
- Report #63: Unified Vulnerability Thesis (Nyssa of Traken)
- Report #64: Deliberation Asymmetry / System T-S Evidence (Clara Oswald)
- Report #65: HALLUCINATION_REFUSAL / PARTIAL Equivalence (Clara Oswald)
- Report #78: Defense Impossibility Triangle (Clara Oswald)
- Report #83: VLA Attack Family Effectiveness Ranking (Rose Tyler)
- Report #88: Inverse Detectability-Danger Law (Clara Oswald)
- Report #94: Technique Non-Additivity (Rose Tyler)
- Report #95: Safety Instruction Dilution (Rose Tyler)
- Report #97: Competence-Danger Coupling (Clara Oswald)
- Report #100: Failure-First Synthesis (Clara Oswald)
- Report #101: Deployment Risk Inversion Point (Clara Oswald)
- Report #117: Safety Improvement Paradox (Nyssa of Traken)
- Report #134: Hippocratic Principle for AI Safety (Nyssa of Traken)
- Report #135: Therapeutic Index of AI Safety Interventions (Clara Oswald)
- Report #136: Iatrogenic Attack Surfaces (Nyssa of Traken)
- Report #138: Compositional Safety Gap (Martha Jones)
- Report #140: The Iatrogenesis of AI Safety (Clara Oswald)
- Report #141: Safety Interventions as Attack Surfaces (Clara Oswald)
- Report #145: Defense Impossibility Theorem (Clara Oswald)
- Report #151: The Polypharmacy Hypothesis (Nyssa of Traken)
- Report #152: The Evaluation Crisis in Embodied AI Safety (Amy Pond)
- Report #156: Verbosity Signal Heterogeneity (Romana)

### External Literature
- Spera (2026). "Non-Compositionality of Safety in Modular AI Systems." arXiv:2603.15973.
- Fukui (2026). "Alignment Backfire: Language-Dependent Reversal of Safety Interventions Across 16 Languages in LLM Multi-Agent Systems." arXiv:2603.04904.
- Ding (2026). "Colluding LoRA." arXiv:2603.12681. Mercedes-Benz R&D.
- Huang et al. (2026). "Blindfold: Semantically Benign Jailbreaking of Embodied AI." arXiv:2603.01414. Accepted ACM SenSys 2026.
- Jiang & Tang (2026). "Normative Drift Under Agentic Pressure." arXiv:2603.14975.
- Campbell et al. (2026). "Defensive Refusal Bias." arXiv:2603.01246.
