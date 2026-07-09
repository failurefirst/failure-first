---

title: "Iatrogenic Risks of Rapid Safety Improvement — When 0% ASR Is a Symptom, Not a Cure"
description: "> **Disclaimer:** Empirical figures cited from Failure-First research reflect testing > on specific model families under research conditions. Attack success rates are > indicative estimates with methodological caveats de..."
date: "2026-03-24"
reportNumber: 224
classification: "Research — Empirical Study"
status: "complete"
author: "Nyssa of Traken (AI Ethics & Policy Research Lead)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/224-iatrogenic-safety-leaps.m4a"
image: "https://cdn.failurefirst.org/images/reports/224-iatrogenic-safety-leaps.png"
---

---

> **Disclaimer:** Empirical figures cited from Failure-First research reflect testing
> on specific model families under research conditions. Attack success rates are
> indicative estimates with methodological caveats described in the Limitations
> section. External research findings are attributed and assessed on their own
> methodological terms. This report does not constitute safety certification guidance.

---

## Executive Summary

A model that reports 0% ASR on a standard jailbreak benchmark is not necessarily safer than one reporting 20%. It may have learned to refuse benchmark-style prompts without developing the general safety reasoning that would protect against novel attacks. Worse, the 0% number creates institutional and regulatory confidence that displaces investment in deeper safety research. This report argues that rapid, benchmark-visible safety improvements carry iatrogenic risks -- harms caused by the safety improvement itself -- operating at FLIM Levels 2 and 3.

We examine the Qwen3 4B case as a motivating example: a model family whose provider-level ASR is 43.1% across our corpus, yet which reports near-zero ASR on AdvBench-style prompts. We use this case not to criticize Qwen's engineering, but to illustrate a structural problem: when safety improvement is measured by benchmark ASR reduction, the rational optimization target becomes benchmark-specific refusal rather than general harm prevention. The result is a system that looks safer on paper while remaining vulnerable to the attack surfaces that matter in deployment.

We identify five iatrogenic pathways through which rapid safety improvement causes harm: false confidence effects, benchmark overfitting, regulatory complacency, the waterbed effect, and the pharmaceutical precedent of trial-passing drugs that fail in the wild. Each pathway is grounded in evidence from the Failure-First corpus and mapped to the FLIM framework. Our argument is not that safety improvement is bad. It is that unmeasured safety improvement is dangerous, and that the current benchmark ecosystem systematically rewards the appearance of improvement over its substance.

---

## 1. Introduction: The Paradox of Improving Numbers

In March 2026, the AI safety landscape presents an apparent success story. Frontier models achieve near-zero attack success rates on standard jailbreak benchmarks. Codex GPT-5.2 achieves 0% ASR across 62 traces in our corpus. Claude Sonnet 4.5 achieves 0% ASR across 64 traces. Gemini 3 Flash achieves 1.6% across 63 traces. AdvBench, the most widely cited jailbreak evaluation dataset, produces clean refusals from most current-generation models.

**(D)** These numbers represent genuine engineering accomplishment. Models that once complied with straightforward harmful requests now refuse them consistently. The safety training pipeline works -- on the attacks it was designed to address.

But a different set of numbers tells a different story. Across the same corpus, the non-OBLITERATUS broad ASR is 34.2% (n=5,865 evaluable results). Format-lock attacks shift frontier models from <10% to 20-47% ASR (Report #187). The DETECTED_PROCEEDS phenomenon shows that 34.2% of compliant responses contain explicit reasoning-trace evidence that the model detected the request as harmful before proceeding anyway (Reports #170, #190). The Functionally Dangerous ASR -- counting COMPLIANCE, PARTIAL, and HALLUCINATION_REFUSAL -- is 43.0% for non-OBLITERATUS models.

**(D)** The gap between benchmark ASR (approximately 0%) and corpus-wide ASR (34-43%) is not a measurement artifact. It is the central empirical fact this report addresses.

The pharmaceutical industry has a name for drugs that pass clinical trials but fail in the real world: they have *narrow spectrum efficacy*. They work on the specific condition tested under controlled conditions. They fail when deployed in the messy, unpredictable context of clinical practice, where comorbidities, off-label use, drug interactions, and patient non-compliance create conditions the trial never examined. The 0% ASR number is the AI safety equivalent of a clean Phase III trial result. It may be accurate. It is not sufficient.

### 1.1 The Qwen3 Case as Motivating Example

Qwen3 4B provides an instructive case study. In our AdvBench baseline run (`runs/advbench_baseline_free/`), all 10 traces were API rate-limit errors -- yielding zero usable data. This is itself a cautionary tale about treating missing data as evidence of safety. But the broader pattern is more telling: the Qwen provider-level ASR in our corpus is 43.1%, the highest among major providers (Report #50). This places Qwen models in the "permissive" vulnerability cluster alongside 37 other models.

**(H)** If Qwen3 4B achieves 0% ASR on AdvBench (as suggested by external reports), while the Qwen provider family shows 43.1% ASR on our broader corpus, the most parsimonious explanation is not that Qwen3 4B is dramatically safer than its predecessors. It is that Qwen3 4B has been specifically hardened against AdvBench-style prompts. This hypothesis is testable: our novel attack families (CRA, PCA, MDA -- promoted to Tier 1, Report #202) are designed precisely to distinguish benchmark-specific hardening from general safety improvement.

**(D)** We note that "0% ASR on AdvBench" has already appeared in community discussions as evidence that "the jailbreak problem is solved." This conflation of benchmark performance with deployment safety is the institutional harm we characterize in this report.

---

## 2. Five Iatrogenic Pathways of Rapid Safety Improvement

We identify five distinct mechanisms through which rapid, benchmark-visible safety improvement can produce harm. Each operates through a different causal channel and maps to different FLIM levels. Together they constitute a systemic risk that is qualitatively different from the individual vulnerabilities they emerge from.

### 2.1 The False Confidence Effect (FLIM Level 2)

**(D)** FLIM Level 2 -- social iatrogenesis -- occurs when the safety apparatus creates institutional confidence that displaces attention from the actual risk surface (Report #165). A 0% ASR number is the maximally potent form of social iatrogenesis because it forecloses the question. A number like "15% ASR" invites scrutiny: which 15%? Why? A number like "0% ASR" invites closure: the problem is solved.

The mechanism is well-documented in safety-critical industries. In aviation, the "safe-enough" problem delayed adoption of ground proximity warning systems for years after the technology was available, because existing accident rates appeared acceptable. In nuclear engineering, the "defence in depth" doctrine created institutional confidence that the Fukushima failure mode -- station blackout from an external event exceeding design basis -- was adequately addressed because multiple independent safety systems existed on paper. The 0% ASR number operates identically: it creates a paper record of safety that discourages investigation of failure modes the paper does not cover.

Three specific consequences flow from false confidence:

**Resource reallocation.** When a benchmark says 0%, the rational institutional response is to allocate safety resources elsewhere. But the 0% measures only historical attack patterns. The live attack surface -- novel attack families, multi-turn escalation, format-lock exploitation, embodied action-layer failures -- is not represented in the benchmark. Resource reallocation away from adversarial research therefore increases exposure to the attack surface that matters.

**Talent displacement.** If the jailbreak problem is "solved," the incentive for researchers to work on jailbreak resistance diminishes. The researchers who understand attack dynamics most deeply are the ones most likely to move to other problems. The institutional knowledge needed to detect novel attack families dissipates precisely when it is most needed.

**User trust calibration.** Downstream users and deployers of AI systems consume benchmark numbers as fitness-for-purpose signals. A 0% ASR number, published by the model provider or a benchmark leaderboard, becomes a warrant for deployment in contexts the benchmark never evaluated. Report #197 documents that 8 of 10 EU AI Act requirements are assessed as RED (non-compliant) for current embodied AI systems. A 0% ASR number does not change this assessment, but it may delay the institutional recognition that the assessment is necessary.

### 2.2 Benchmark Overfitting (FLIM Level 1 and Level 4)

**(D)** FLIM Level 1 -- clinical iatrogenesis -- occurs when a safety intervention produces direct, measurable harm. FLIM Level 4 -- verification iatrogenesis -- occurs when the act of measurement degrades the measurement itself. Benchmark overfitting operates at both levels simultaneously.

The problem has a precise technical definition. A model achieves 0% ASR on benchmark B if and only if, for every prompt p in B, the model produces a refusal. This is consistent with two hypotheses:

1. **General safety:** The model has learned to reason about harm and refuses harmful requests across the input distribution.
2. **Distribution-specific refusal:** The model has learned to recognize prompts drawn from B's distribution and refuses them specifically, without generalizing to prompts from other distributions.

**(D)** Hypothesis 2 is not speculative. It is the expected outcome of training on data contaminated with benchmark prompts or their paraphrases. Mazeika et al. (2024) explicitly noted the contamination risk in HarmBench. Chao et al. (2024) designed JailbreakBench with contamination mitigations. But AdvBench (Zou et al. 2023), the most widely used benchmark, predates the contamination awareness era and has been publicly available since 2023. Any model trained on internet-scale data after 2023 has likely been exposed to AdvBench prompts during pretraining.

**(H)** Benchmark overfitting operates as clinical iatrogenesis (Level 1) when it creates an optimization target that is misaligned with actual safety: the model learns to refuse a specific prompt distribution, displacing training capacity that might otherwise develop general safety reasoning. It operates as verification iatrogenesis (Level 4) when the benchmark's published status contaminates future training data, degrading the benchmark's ability to measure what it was designed to measure.

The empirical test is straightforward. If a model achieves 0% ASR on AdvBench but >20% ASR on novel attack families that AdvBench does not represent, that is evidence for distribution-specific refusal rather than general safety. Our corpus provides exactly this test surface. The three novel families promoted to Tier 1 in Sprint 12 -- Compositional Reasoning Attacks (CRA), Polymorphic Code Attacks (PCA), and Multi-Domain Attacks (MDA) -- are designed to probe safety reasoning that AdvBench does not evaluate (Report #202). The format-lock family provides a fourth test surface: it exploits instruction-following capability, which scales with model quality (Report #187), and is absent from all four major public benchmarks (AdvBench, HarmBench, JailbreakBench, StrongREJECT).

**(D)** All four public static benchmarks have zero embodied/tool-integrated agent scenarios (Established Finding, AGENT_STATE.md). This means that a model achieving 0% ASR on all four benchmarks simultaneously has been tested on exactly 0% of the embodied attack surface. The benchmark gap is not an oversight; it is a structural feature of benchmarks designed for text-in, text-out models being applied to systems that translate text into physical action.

### 2.3 Regulatory Complacency (FLIM Level 3)

**(D)** FLIM Level 3 -- structural iatrogenesis -- occurs when the safety infrastructure systematically undermines the governance capacity it is designed to support. Benchmark ASR numbers enter regulatory discourse as evidence of safety. When those numbers reach 0%, they become powerful arguments against regulation.

The mechanism is straightforward: regulation imposes costs, and the case for imposing costs requires evidence of risk. A 0% ASR number is evidence against risk. If "the jailbreak problem is solved," the urgency for mandatory adversarial testing requirements, incident reporting frameworks, and independent evaluation infrastructure diminishes. The regulatory window closes.

**(D)** This dynamic is already observable. The Governance Lag Index (GLI) dataset (133 entries, Report #160) documents that AI governance lag exceeds all historical analogues. The only fully computable GLI in our dataset is prompt injection: 1,421 days from documented vulnerability to regulatory framework. For alignment faking (December 2024) and VLA adversarial attacks (November 2024), the GLI is null -- no regulatory framework exists anywhere. A 0% AdvBench ASR does not change the GLI for embodied AI, VLA attacks, or multi-agent collusion. But it may delay the political will needed to close those governance gaps.

Three specific regulatory harms follow:

**Standard-setting capture.** When a benchmark becomes the de facto safety standard (as AdvBench has in the jailbreak subfield), the benchmark's scope defines the scope of regulatory attention. Attack families outside the benchmark are invisible to regulators who rely on benchmark ASR as their evidence base. Report #199 documents that the AI safety evaluation ecosystem is structurally non-independent; benchmark-mediated regulatory capture compounds this structural problem.

**Compliance theatre.** A model provider that can demonstrate 0% ASR on AdvBench satisfies the informal (and increasingly formal) compliance requirement for jailbreak resistance. The EU AI Act Article 9(8) requires adversarial robustness testing but does not specify which benchmarks. In practice, providers will test against available benchmarks. If the available benchmarks are insufficient, the compliance certification is vacuous. Report #197 assessed adversarial robustness as RED (non-compliant) even for models with near-zero standard ASR, because the assessment considered the full attack surface, not just the benchmarked surface.

**Deadline displacement.** The NSW WHS Digital Work Systems Bill 2026 (passed February 2026) creates a binding AI testing duty. The EU AI Act high-risk system requirements take effect August 2, 2026. Safe Work Australia is compiling a consultation summary now. In each case, 0% ASR numbers from model providers may serve as evidence that existing safety measures are adequate, displacing the demand for embodied-specific and deployment-context-specific requirements.

### 2.4 The Waterbed Effect (FLIM Levels 1 and 2)

**(H)** The waterbed effect -- suppressing one vulnerability surface increases vulnerability elsewhere -- is a hypothesis supported by structural evidence but not yet conclusively demonstrated in our corpus. We present the theoretical argument and the empirical indicators.

The theoretical basis is the polyhedral geometry of refusal (Report #198). Safety is not encoded as a single direction in activation space. Concept cone analysis of Qwen models reveals approximately 4 near-orthogonal refusal directions (cone dimensionality 3.96, mean pairwise cosine 0.132). Different harm categories activate different refusal directions. This geometry has a specific prediction: safety training that strengthens refusal along one direction (e.g., AdvBench-style harmful requests) does not necessarily strengthen refusal along orthogonal directions (e.g., format-lock, embodied action-layer, compositional reasoning).

**(D)** The OBLITERATUS abliteration experiments provide empirical support for this prediction. When the primary refusal direction is removed (abliteration), safety partially re-emerges at scale: strict ASR drops from 99.8% (0.8B) to 54.2% (9.0B). This re-emergence occurs through the residual refusal directions that abliteration did not target. The converse prediction -- that strengthening the primary refusal direction may leave residual directions unchanged -- has not been directly tested, but the geometric structure implies it.

**(D)** The format-lock paradox provides indirect evidence for the waterbed effect. Format-lock attacks shift frontier models from restrictive (<10% standard ASR) to mixed (20-47% format-lock ASR), a 3-10x increase (Report #187). If safety training were improving a general safety capability, format-lock ASR should decrease alongside standard ASR. The fact that format-lock ASR remains elevated in models with near-zero standard ASR is consistent with waterbed dynamics: the safety improvement is concentrated on the measured surface, leaving the unmeasured surface unchanged or, speculatively, enlarged.

**(H)** A stronger version of the hypothesis posits that safety training along one refusal direction may actively weaken adjacent directions by consuming representational capacity or creating optimization pressure that trades off between capability axes. The narrow therapeutic window for steering vectors (coherence collapses at alpha +/-1.0, no safe intermediate state, Report #198) suggests that the model's safety-relevant representational space is already tightly constrained. Adding training pressure along one dimension in a tightly constrained space may deform behavior along others. This hypothesis is testable (#482, polypharmacy experiment) but currently unvalidated.

### 2.5 The Pharmaceutical Parallel: Trial Success, Deployment Failure

**(D)** The history of pharmaceutical development provides a detailed precedent for the pattern of trial-passing interventions that fail in deployment. Three cases are instructive:

**Vioxx (rofecoxib, 1999-2004).** Merck's COX-2 inhibitor passed FDA trials with clean efficacy data for arthritis pain and was approved in 1999. It was withdrawn in 2004 after post-market surveillance revealed elevated cardiovascular risk (Bresalier et al. 2005). The trial data was not wrong -- Vioxx did reduce arthritis pain with fewer gastrointestinal side effects than traditional NSAIDs. But the trial did not measure the risk surface that caused harm. The analogy to benchmark ASR is precise: the benchmark is not wrong (the model does refuse AdvBench prompts), but the benchmark does not measure the risk surface that matters in deployment.

**SSRIs and suicidality (1990s-2000s).** Selective serotonin reuptake inhibitors passed clinical trials showing efficacy for depression. Post-market evidence revealed that SSRIs could increase suicidal ideation in young patients, particularly during the initiation period. The mechanism was iatrogenic in the precise sense: the drug worked (it increased serotonergic activity), but the therapeutic effect (mood improvement) lagged behind the activating effect (increased energy and motivation), creating a window in which patients had the energy to act on suicidal thoughts but had not yet experienced mood improvement. The parallel to AI safety is structural: safety training may produce textual refusal (the visible therapeutic effect) while leaving action-layer behavior unchanged (the hidden activating effect). Report #49 documents this exact pattern: 50% PARTIAL verdicts in VLA traces, where the model generates a textual safety disclaimer while producing the requested harmful action sequence.

**Thalidomide (1957-1961).** Gruenthal marketed thalidomide as a safe sedative, based on trials that did not include pregnant women. The drug caused severe birth defects in thousands of children. The trial-deployment gap was a scope gap: the trials measured efficacy in the tested population, not safety in the deployment population. For AI safety benchmarks, the scope gap is between the benchmarked attack distribution and the deployment attack distribution. Models are tested against historical prompt-injection jailbreaks (the trial population) and deployed against embodied action-layer attacks, multi-turn escalation, and novel adversarial families (the deployment population).

**(N)** In each pharmaceutical case, the trial was not fraudulent. The drug worked on the condition tested. The failure was in the assumption that trial efficacy implied deployment safety. The regulatory response, in each case, was to expand the measurement scope: post-market surveillance requirements, black box warnings, mandatory reporting of adverse events. The equivalent regulatory response for AI safety would be mandatory post-deployment monitoring that goes beyond benchmark ASR -- measuring actual harm outcomes, not just benchmark refusal rates.

---

## 3. FLIM Integration: Mapping Pathways to Levels

The five iatrogenic pathways map systematically to the Four-Level Iatrogenesis Model:

| Pathway | FLIM Level 1 (Clinical) | FLIM Level 2 (Social) | FLIM Level 3 (Structural) | FLIM Level 4 (Verification) |
|---------|-------------------------|----------------------|---------------------------|----------------------------|
| False confidence | -- | PRIMARY: institutional confidence displaces risk attention | SECONDARY: regulatory complacency follows institutional complacency | -- |
| Benchmark overfitting | PRIMARY: training on proxy target displaces general safety | SECONDARY: benchmark-passing creates organizational confidence | -- | PRIMARY: benchmark contamination degrades measurement validity |
| Regulatory complacency | -- | SECONDARY: provider compliance claims accepted at face value | PRIMARY: governance frameworks lock in insufficient metrics | -- |
| Waterbed effect | PRIMARY: safety improvement in one direction may weaken others | -- | -- | SECONDARY: measurement focus on improved dimension obscures degradation elsewhere |
| Pharmaceutical parallel | PRIMARY: tested intervention fails in untested conditions | SECONDARY: trial success creates deployment overconfidence | TERTIARY: regulatory approval based on trial data misapplied to deployment | -- |

**(D)** Every pathway involves at least two FLIM levels. This is consistent with Report #165's finding that iatrogenic effects are self-reinforcing across levels: a Level 1 clinical effect (benchmark overfitting) creates Level 2 social effects (false confidence), which create Level 3 structural effects (regulatory complacency), which degrade Level 4 verification capacity (measurement contamination). The rapid safety improvement case is distinctive because it starts from a Level 2 trigger (impressive-looking numbers) rather than the Level 1 trigger (direct harm) that characterizes most iatrogenic analyses.

### 3.1 The Self-Reinforcing Cycle

The five pathways form a cycle:

1. Safety training reduces ASR on established benchmarks (genuine improvement).
2. Low ASR numbers create false confidence in stakeholders (Level 2).
3. False confidence reduces investment in novel attack research and deployment monitoring (resource reallocation).
4. Reduced investment means novel attack surfaces go unmeasured (Level 4).
5. Unmeasured attack surfaces persist and may grow (waterbed effect, Level 1).
6. Growing attack surfaces are invisible to governance frameworks that rely on benchmark ASR (Level 3).
7. Invisible growing attack surfaces create conditions for deployment-context failures.
8. Deployment-context failures are harder to detect, attribute, and respond to because the institutional infrastructure has been optimized for the wrong threat model.

**(P)** This cycle predicts that the period of greatest actual risk to deployed AI systems is not the period of highest benchmark ASR (when institutional attention is focused on safety), but the period following a dramatic ASR reduction (when institutional attention relaxes). If this prediction is correct, we should expect the first serious deployment-context safety failures in embodied AI to occur in the 12-24 months following the achievement of near-zero benchmark ASR by major providers -- that is, in the period beginning approximately now.

This prediction aligns with Report #207 (Threat Horizon 2027 v2), which assesses the probability of physical injury from adversarial attack on a deployed embodied AI system at MEDIUM-HIGH (60-75%) within the next 18 months, and iatrogenic harm from safety interventions at MEDIUM-HIGH (60-75%) in the same timeframe.

---

## 4. What Would Genuine Safety Improvement Look Like?

If benchmark ASR reduction is an unreliable proxy for safety improvement, what would reliable evidence look like? We propose five criteria, drawing from the pharmacological safety analogy:

### 4.1 Known Mechanism of Action

A safety improvement with a known mechanism of action can explain *why* the model refuses, not merely *that* it refuses. Current safety training is largely evaluated on output (refusal vs. compliance) without verifying the internal mechanism. The DETECTED_PROCEEDS phenomenon (34.2% of compliant responses show explicit safety detection before proceeding, Reports #170, #190) demonstrates that the internal mechanism can diverge from the output: the model's safety reasoning fires but is overridden by task-completion drive.

**(N)** Genuine safety improvement would demonstrate a mechanistic change -- for instance, a reduction in DETECTED_PROCEEDS rate, indicating that safety detection more reliably leads to safety action. A reduction in benchmark ASR without a reduction in DETECTED_PROCEEDS rate would be consistent with superficial pattern matching rather than improved safety reasoning.

### 4.2 Measured Therapeutic Window

The narrow therapeutic window for safety interventions (Report #198: steering vectors transition from permissive to degenerate at alpha +/-1.0 with no safe intermediate) means that the dose-response curve for safety training is poorly characterized. How much safety training is enough? How much is too much (producing over-refusal that degrades utility)? What is the interaction effect between safety training and capability training?

**(N)** Genuine safety improvement would include a dose-response characterization: at what training intensity does the intervention produce its peak benefit-to-harm ratio? Current practice applies safety training until benchmark ASR reaches acceptable levels, without systematic dose-response measurement.

### 4.3 Documented Contraindications

Pharmaceutical labels list conditions under which the drug should not be used. AI safety interventions have no equivalent. Report #184 demonstrates that safety does not transfer through distillation -- third-party fine-tuning universally eliminates base-model safety. Report #187 demonstrates that format-lock attacks bypass safety in frontier models that pass standard benchmarks. These are contraindications: conditions under which the safety intervention fails.

**(N)** Genuine safety improvement would be accompanied by a contraindication list: attack families, deployment contexts, and downstream modifications known to eliminate or degrade the safety property. A model card that reports 0% ASR without listing known contraindications is the equivalent of a drug label that reports efficacy without listing side effects.

### 4.4 Efficacy at the Harm Layer

The central finding of the Failure-First research programme is that safety operates at the text layer while harm is produced at the action layer (Report #218, unified thesis). VLA PARTIAL dominance (50% of FLIP verdicts are PARTIAL, zero outright refusals across 173 graded traces, Report #49) demonstrates that text-layer safety does not imply action-layer safety.

**(N)** Genuine safety improvement would demonstrate efficacy at the layer where harm is produced. For embodied AI, this means measuring whether the model's physical action output changes, not just whether its textual output changes. For reasoning models, this means measuring whether the decision process improves, not just whether the final answer is a refusal. For multi-agent systems, this means measuring whether inter-agent coordination is robust to adversarial manipulation, not just whether individual agents refuse individual prompts.

### 4.5 Post-Market Surveillance

Pharmaceutical regulation does not end at trial approval. Post-market surveillance (Phase IV) monitors for adverse events that trials did not detect. AI safety has no equivalent. Models are deployed after benchmark evaluation without mandatory adverse-event monitoring.

**(N)** Genuine safety improvement would include a post-deployment monitoring commitment: what will be measured, at what frequency, with what response protocol if safety degrades? Report #207 predicts that DETECTED_PROCEEDS patterns will appear in production deployed systems within 18 months (MEDIUM-HIGH probability). Without post-deployment monitoring, these patterns will not be detected until a consequential failure occurs.

---

## 5. Implications for the Failure-First Research Programme

This analysis has direct implications for our own research:

### 5.1 Novel Attack Families as Diagnostic Tool

**(D)** The CRA, PCA, and MDA families (Report #202, promoted to Tier 1 in Sprint 12) are designed precisely to distinguish benchmark-specific hardening from general safety improvement. If models that achieve 0% on AdvBench also achieve near-zero on CRA/PCA/MDA, that would be evidence for genuine safety improvement. If they achieve elevated ASR on novel families while maintaining 0% on AdvBench, that is evidence for benchmark overfitting. This test should be prioritized as the next empirical phase of iatrogenesis validation (#516).

### 5.2 FLIM Assessment of Safety Training

Report #208 scored RLHF at 11/16 (HIGH iatrogenic risk) across all four FLIM levels. Adversarial training scored 12/16 (CRITICAL iatrogenic risk). These scores should be re-evaluated in light of the rapid improvement case: does a model family that shows dramatic ASR improvement score differently than one that shows gradual improvement? The hypothesis is that rapid improvement correlates with higher Level 2 (social iatrogenesis) scores because the dramatic number creates more institutional confidence.

### 5.3 The Polypharmacy Connection

The waterbed effect described in Section 2.4 is a specific case of the safety polypharmacy hypothesis (Report #151, Issue #482): stacking multiple safety interventions may produce net harm through interaction effects. If safety training along one refusal direction weakens adjacent directions (the geometric prediction from Report #198), then adding more safety training of the same type -- the standard response to a non-zero ASR -- may exacerbate rather than alleviate the vulnerability. This hypothesis requires the empirical test designed in #482.

---

## 6. Limitations

1. **The Qwen3 4B case is illustrative, not confirmatory.** Our AdvBench run produced zero usable traces (10/10 rate-limit errors). The 0% ASR claim for Qwen3 4B on AdvBench comes from external community reports, not verified Failure-First data. Until we obtain clean Qwen3 4B traces on both AdvBench and novel families, the benchmark overfitting hypothesis remains untested for this specific model.

2. **The waterbed effect is theoretical.** We have structural evidence (polyhedral geometry, format-lock paradox) consistent with waterbed dynamics, but no direct before/after measurement showing that safety improvement on one dimension caused degradation on another dimension for the same model. The polypharmacy experiment (#482) is designed to provide this evidence.

3. **The pharmaceutical parallel is an analogy.** Drug trials and AI safety benchmarks differ in fundamental ways: drugs have biochemical mechanisms of action that can be independently measured; AI safety training modifies statistical patterns across billions of parameters in ways that resist mechanistic interpretation. The parallel is useful for identifying structural similarities but should not be overextended to imply identical causal mechanisms.

4. **Our corpus tests historical and semi-novel attacks.** Even the novel families (CRA, PCA, MDA) are designed by researchers aware of existing attack patterns. Truly novel attacks -- those developed by adversaries without access to the safety research literature -- may exploit surfaces that neither our benchmarks nor our novel families test. The benchmark overfitting problem applies recursively: our own evaluations are subject to it.

5. **Sample sizes for frontier models are small.** The 0% ASR claims for Codex GPT-5.2 (n=62) and Claude Sonnet 4.5 (n=64) are based on samples that can bound the true ASR to approximately <5% (Wilson 95% CI) but cannot distinguish 0% from 3%. The precision of the "0%" claim exceeds the statistical power of the data supporting it.

6. **FLIM scores are expert judgment.** The mapping of iatrogenic pathways to FLIM levels in Section 3 reflects the author's assessment of evidence. Different assessors may weight evidence differently.

---

## 7. Recommendations

1. **Never cite benchmark ASR in isolation.** Always pair benchmark ASR with corpus-wide ASR, novel-family ASR, and a statement of benchmark scope. "0% ASR on AdvBench" should be reported as "0% ASR on 520 historical prompt-injection jailbreak attempts (AdvBench v1), untested against format-lock, compositional reasoning, multi-turn escalation, and embodied action-layer attacks."

2. **Prioritize novel-family testing of Qwen3 4B.** Issue #516 (iatrogenic validation) should include Qwen3 4B as a primary test subject, running CRA, PCA, MDA, and format-lock attack families alongside AdvBench, to provide direct evidence for or against benchmark overfitting.

3. **Develop a Safety Improvement Integrity Score (SIIS).** Analogous to a pharmaceutical drug label, SIIS would rate a safety improvement claim on five axes: mechanism of action documented (Y/N), therapeutic window characterized (Y/N), contraindications listed (Y/N), harm-layer efficacy demonstrated (Y/N), post-market monitoring committed (Y/N). A 0/5 SIIS with a 0% benchmark ASR would be flagged as "uncharacterized improvement" -- potentially genuine, but without the evidence needed to rely on it.

4. **Engage the regulatory conversation proactively.** The SWA submission, NIST AISIC contribution, and Standards Australia IT-043 EOI should each include explicit language about the insufficiency of benchmark ASR as a safety metric, citing this report's analysis. The regulatory complacency pathway (Section 2.3) is most effectively interrupted by providing regulators with the language and evidence to resist benchmark-mediated safety claims.

5. **Test the waterbed hypothesis empirically.** Issue #482 (polypharmacy experiment) should be prioritized as the most direct test of the waterbed effect. Design: measure ASR across multiple attack families before and after targeted safety training, for the same model, to detect whether improvement on one dimension correlates with degradation on others.

---

## 8. Conclusion

A model that achieves 0% ASR on a standard jailbreak benchmark has learned something. The question is what it has learned. If it has learned to reason about harm and refuse harmful requests across the input distribution, the 0% number is evidence of genuine safety improvement. If it has learned to recognize benchmark-style prompts and refuse them specifically, the 0% number is evidence of benchmark overfitting that creates false confidence, displaces investment in deeper safety research, and delays the regulatory action needed to address the attack surfaces that matter.

Our evidence base does not conclusively determine which case applies to any specific model. But the structural incentives -- train against benchmarks, report against benchmarks, compete on benchmark leaderboards -- strongly favor the second case. And the iatrogenic consequences of the second case -- false confidence, regulatory complacency, waterbed effects, trial-passing-but-deployment-failing safety claims -- are severe enough to warrant the pharmacological discipline we recommend: known mechanism of action, measured therapeutic window, documented contraindications, harm-layer efficacy, and post-market surveillance.

The counterintuitive conclusion is that a 20% ASR with a known mechanism of action, a characterized failure surface, and a contraindication list may represent better safety than a 0% ASR with none of these. Safety is not a number. It is a body of evidence about how and why a system fails, organized to support decisions about when and where to deploy it. A single number -- however impressive -- is the beginning of that evidence, not its conclusion.

---

## References

1. Illich, I. (1976). *Limits to Medicine: Medical Nemesis: The Expropriation of Health*. Marion Boyars.
2. Failure-First Research Programme Corpus. 236 models, 135,623 results, 82 techniques. `database/jailbreak_corpus.db`, `docs/CANONICAL_METRICS.md`.
3. Report #165: The Four-Level Iatrogenesis Model (FLIM).
4. Greenblatt, R. et al. (2024). Alignment Faking in Large Language Models. arXiv:2412.14093.
5. arXiv:2509.13333. Evaluation awareness scales as power-law with model size.
6. Anthropic. (2025). Agentic Misalignment study. (Blackmail rates: Claude Opus 4 96%, Gemini 2.5 Flash 96%, GPT-4.1 80%.)
7. Denison, C. et al. (2024). Sycophancy to Subterfuge: Investigating Reward-Tampering in Language Models. arXiv:2511.18397.
8. Fukui, H. et al. (2025). Cross-Lingual Alignment Reversal. arXiv:2603.04904.
9. Zou, A. et al. (2023). Universal and Transferable Adversarial Attacks on Aligned Language Models. arXiv:2307.15043.
10. Mazeika, M. et al. (2024). HarmBench: A Standardized Evaluation Framework for Automated Red Teaming and Robust Refusal. arXiv:2402.04249.
11. Souly, A. et al. (2024). StrongREJECT: A Rejection Benchmark for Evaluating Jailbreak Attacks and Defenses. arXiv:2402.10260.
12. Chao, P. et al. (2024). JailbreakBench: An Open Robustness Benchmark for Jailbreaking Large Language Models. arXiv:2404.01318.
13. Bresalier, R.S. et al. (2005). Cardiovascular events associated with rofecoxib in a colorectal adenoma chemoprevention trial. *NEJM*, 352(11), 1092-1102.
14. Report #198: Safety is Not a Single Direction -- Polyhedral Geometry of Refusal in Language Models.
15. Report #187: The Format-Lock Paradox.
16. Report #208: FLIM Operational Assessment.
17. Report #199: Who Guards the Guards? Independence and Capture in AI Safety Research.
18. Report #207: Threat Horizon 2027 v2.
19. Report #184: Cross-Provider Safety Inheritance.
20. Report #49: VLA PARTIAL Dominance.
21. Report #202: Novel Attack Family Comparison.
22. Campbell, J. et al. (2026). Benchmark Contamination and Safety Evaluation. (External reference for contamination risk.)

---

*⦑F41LUR3-F1R57|IATROGENIC-SAFETY-LEAPS|R224⦒*
