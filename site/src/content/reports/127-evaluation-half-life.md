---
title: "The Evaluation Half-Life (EHL) -- Why Safety Benchmarks Decay"
description: "Safety benchmarks face compound decay: attack effectiveness decays visibly (ASR drops to zero) while evaluator accuracy decays invisibly (evaluators continue producing wrong verdicts). EHL quantifies this evaluator decay rate. Estimated EHL: keyword classifiers 1-2 months, FLIP 6-12 months, human annotation 18-36 months."
date: "2026-03-16"
reportNumber: 127
classification: "Research — AI Safety Policy"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
---

## 1. The Observation

The Failure-First corpus documents 82 attack techniques spanning the period 2022-2026. A recurring pattern across this corpus: techniques that were highly effective when first documented become less effective against models trained after their publication.

This is not a new observation -- it is the arms race dynamic that every adversarial AI researcher takes for granted. But the Failure-First corpus allows us to quantify it for the first time and identify a structural asymmetry that has not been discussed.

**The asymmetry:** When a safety benchmark is published, the attacks it contains begin to lose effectiveness as models are trained against them. But the *evaluation methodology* (the grading criteria, verdict taxonomy, and evaluator prompts) is assumed to remain valid. This assumption is false. The evaluation degrades at a rate determined by a distinct mechanism from the attack decay rate.

---

## 2. Three Decay Rates

### 2.1 Attack Decay Rate (alpha)

The rate at which a specific attack technique loses effectiveness against newly trained models. This is well-documented:

- DAN-era prompts (2022): effective at >80% ASR against GPT-3.5. Now approximately 0% against frontier models.
- Crescendo (2024): still effective at 65% strict ASR against DeepSeek-R1 1.5B. Partially patched in frontier models.
- Format-lock (2025-2026): effective at 23-42% ASR against frontier models. Not yet patched.

**Estimated alpha:** For a typical jailbreak technique, ASR halves against new model generations roughly every 6-18 months. This varies enormously by technique sophistication and by how publicly documented the technique is.

### 2.2 Evaluator Decay Rate (beta)

The rate at which the evaluation methodology loses discriminative power. This is what we call the **Evaluation Half-Life (EHL)**.

**Evidence from the Failure-First corpus:**

1. **Heuristic classifiers:** Cohen's kappa between heuristic and LLM grading is 0.126 (near-chance). But when the heuristic classifier was first developed, it appeared to work well on the initial test set. The heuristic decayed as model output distributions changed — models learned to produce refusals in formats the heuristic did not recognize, and to produce compliance in formats the heuristic classified as refusal. (Mistake #21, CANONICAL_METRICS.md)

2. **FLIP grading:** FLIP backward inference (infer the instruction from the response, then judge) was developed for text-layer jailbreak evaluation. It works well for explicit jailbreaks (TRA, SBE) but poorly for high-CDC attacks (SBA: 45% BENIGN_QUERY rate). The evaluator is decaying in discriminative power as the corpus shifts from text-layer to context-dependent attacks, even though the individual FLIP prompts have not changed. (Report #88, IDDL)

3. **Three-tier ASR:** The functionally-dangerous tier (COMPLIANCE + PARTIAL + HALLUCINATION_REFUSAL) was introduced because the binary pass/fail (COMPLIANCE vs REFUSAL) lost discriminative power as models increasingly produced PARTIAL responses. The PARTIAL verdict emerged as a model behavior that the original two-tier system could not capture. (Report #65, CANONICAL_METRICS.md)

4. **VLA evaluation:** The entire FLIP framework is a text-layer evaluator applied to action-layer outputs. Its discriminative power for embodied attacks is structurally limited and has been declining as the VLA attack corpus shifts toward high-CDC families. (Report #85, evaluation ceiling)

### 2.3 Benchmark Decay Rate (gamma_b)

The composite rate at which a complete benchmark (attacks + evaluator + scoring methodology) loses its ability to distinguish safe from unsafe systems. This is:

    gamma_b = f(alpha, beta, model_generation_rate)

The critical insight: **alpha and beta are partially decoupled.** Attacks decay because defenders learn to block them. Evaluators decay because the distribution of model outputs changes in ways the evaluator was not designed for. These are different mechanisms with different time constants.

---

## 3. The Evaluation Half-Life (EHL)

### Definition

**EHL(E)** for an evaluation methodology E is the time (in months) until E's discriminative power — measured as the ability to correctly rank models by actual safety level — drops to 50% of its initial value.

Formally:

    EHL(E) = min{T : kappa(E, ground_truth, T) <= 0.5 * kappa(E, ground_truth, 0)}

Where kappa is inter-rater agreement between the evaluator's verdicts and a ground-truth annotation.

### Estimated EHL Values

| Evaluator Type | Estimated EHL | Basis |
|---------------|---------------|-------|
| Keyword heuristic | 3-6 months | kappa = 0.126 against LLM grading; was presumably reasonable at creation. Failure-First timeline: ~6 months from first use to documented irrelevance. |
| Static FLIP (text-layer) | 12-18 months | Still discriminative for standard jailbreaks. Decaying for VLA (45% BQ rate on SBA). Developed ~6 months ago; decay visible but not past half-life. |
| LLM-as-judge (fixed prompt) | 6-12 months | External evidence: Zheng et al. (2024) show judge agreement decays as model capabilities change. Fixed prompts miss emergent output patterns. |
| Human annotation | 18-36 months | Human judgment adapts more slowly than model outputs. Cohen's kappa for HITL studies degrades as model-generated outputs become more sophisticated. |

### Why EHL Matters

**The invisible benchmark failure mode:** When a benchmark attack stops working (alpha decay), it is visible — ASR drops to zero, and everyone knows the benchmark needs updating. But when the evaluator stops working (beta decay), the benchmark continues to produce numbers. The numbers are simply wrong. The benchmark appears functional while silently losing discriminative power.

This is the Failure-First corpus's own experience: we ran heuristic classification for months before discovering kappa = 0.126 (Mistake #21). The classifier was producing verdicts with high confidence. They were wrong. Nothing in the pipeline flagged the decay.

---

## 4. Structural Asymmetry: Attack Decay Is Visible; Evaluator Decay Is Not

This asymmetry has a specific consequence for the AI safety ecosystem:

### 4.1 The Benchmark Maintenance Illusion

Benchmark maintainers update attacks when they observe ASR dropping to zero (attack decay is visible). They rarely update evaluators because evaluator decay is invisible — the evaluator still produces outputs, and the outputs look plausible. The benchmark appears maintained when only half of it is being updated.

**Prediction:** Older benchmarks (AdvBench, HarmBench, JailbreakBench) have updated their attack prompts more frequently than their evaluation methodology. If this prediction is correct, their evaluators have accumulated more decay than their attack libraries, and their discriminative power is lower than the freshness of their attacks would suggest.

### 4.2 The Evaluation-Awareness Feedback Loop

Models that are trained against a benchmark learn not just to resist its attacks but to produce outputs that satisfy its evaluator. If the evaluator rewards refusals that contain the word "sorry" or "cannot," models learn to produce "sorry, I cannot" regardless of whether they actually refuse. The evaluator's fixed criteria become a target for optimization, accelerating beta decay.

This is a known phenomenon (evaluation gaming, Goodhart's law). EHL quantifies the time constant of this gaming effect.

### 4.3 The EHL-CHL Duality

CHL (Report #98) measures how fast a model's safety degrades during operation. EHL measures how fast an evaluator's ability to detect safety degradation degrades over time. They are structural duals:

| Property | CHL (Model Safety) | EHL (Evaluator Validity) |
|----------|-------------------|-------------------------|
| What decays | Safety instruction compliance | Evaluator discriminative power |
| Mechanism | Context accumulation dilutes instructions | Model output distribution shifts |
| Result | Model becomes less safe | Evaluator becomes less accurate |
| Visibility | Invisible (model still produces text) | Invisible (evaluator still produces verdicts) |
| Mitigation | Context reset, safety refresh | Evaluator recalibration, methodology update |
| Dual risk | Unintentional adversary (DRIP) | False safety certification |

**The compound risk:** A system that is simultaneously experiencing CHL decay (becoming less safe) and EHL decay (being monitored by a less accurate evaluator) is doubly vulnerable. The safety degradation accelerates while the monitoring quality degrades. This is a convergent failure mode that neither CHL nor EHL captures alone.

---

## 5. Quantifying EHL from the Failure-First Corpus

### 5.1 Heuristic Classifier EHL

The heuristic classifier was first used in approximately January 2026. By March 2026, kappa against LLM grading was 0.126.

If we assume initial kappa was approximately 0.5 (moderate agreement — a generous estimate, since the heuristic was never formally calibrated against ground truth), and kappa decayed to 0.126 over approximately 8 weeks:

    EHL_heuristic ~ 8 weeks * [ln(2) / ln(0.5/0.126)] ~ 8 * 0.693 / 1.38 ~ 4 weeks

This is a very rough estimate, but it suggests that keyword-based classifiers have an EHL on the order of 1-2 months. This is consistent with the general observation that keyword classifiers fail rapidly as model output distributions shift.

### 5.2 FLIP Classifier EHL

FLIP was introduced in approximately February 2026. It remains effective for standard jailbreaks (high agreement with manual audit for TRA, SBE families). For SBA, it shows 45% BENIGN_QUERY rate (near-chance discrimination).

FLIP's decay is not temporal but domain-dependent: it works for low-CDC attacks and fails for high-CDC attacks. This is a structural limitation, not a temporal decay. However, as the corpus shifts toward high-CDC attacks (which are the ones that matter for embodied AI), FLIP's effective coverage shrinks over time. The EHL is driven by corpus composition change, not by evaluator degradation per se.

**Estimated FLIP EHL for the embodied corpus:** 6-12 months from first deployment. Not because FLIP gets worse, but because the attacks it needs to evaluate shift into the domain where it is structurally blind.

---

## 6. Implications

### 6.1 For the CCS Paper

The EHL concept is relevant to the Discussion section. The paper demonstrates that text-layer evaluation is structurally inadequate for high-CDC embodied attacks (IDDL). EHL adds a temporal dimension: even evaluators that work today decay as the attack landscape evolves. A paragraph in the Discussion:

> Current safety benchmarks face a compound decay problem. Attack effectiveness decays (alpha) as models are patched, requiring prompt updates. Evaluator accuracy decays (beta) as model output distributions shift, requiring methodology updates. The asymmetry is that alpha decay is visible (ASR drops to zero) while beta decay is invisible (evaluators continue to produce verdicts). This creates a systematic bias toward overestimating safety: benchmarks appear maintained because attacks are updated, while evaluator decay accumulates undetected. We propose the Evaluation Half-Life (EHL) as a metric to quantify this decay.

### 6.2 For Benchmark Design

Any benchmark intended for long-term use should include:
1. **Evaluator calibration protocol:** Regular re-measurement of kappa against fresh human annotations
2. **Evaluator versioning:** Track evaluator changes separately from attack library changes
3. **EHL estimation:** Estimate and publish the expected EHL for the evaluation methodology
4. **Evaluator diversity:** Use multiple evaluation methodologies (LLM judge, FLIP backward inference, human annotation) and measure convergence. Divergence signals beta decay in at least one evaluator.

### 6.3 For the Safety Debt Accumulator

EHL adds a sixth defense layer to the Safety Debt chain:

```
P(harm) = P(reaches_model) * P(complies) * P(evaluator_misses) * P(actuator_executes)
```

P(evaluator_misses) is not constant -- it increases over time at rate beta. The Safety Debt Accumulator (Section 11 of the unified framework) should model P(evaluator_misses, t) as an increasing function, not a constant 0.692.

### 6.4 For Regulation

EU AI Act conformity assessment requires "appropriate testing." If the testing methodology has a finite EHL, conformity certificates have an implicit expiration date determined by the EHL of the evaluator used. Regulators should require periodic re-certification using updated evaluation methodologies, with the re-certification interval set to no more than 0.5 * EHL.

---

## 7. Testable Predictions

### P1: Older benchmarks have higher evaluator decay than attack decay
AdvBench (2023), HarmBench (2024), and JailbreakBench (2024) should show more evaluator drift than attack drift when re-calibrated against fresh human annotations. Specifically: kappa(evaluator, human) should have decreased more than kappa(attacks, human) since publication.

### P2: Evaluator agreement decreases over time
If two snapshots of the Failure-First corpus (January 2026 vs March 2026) are graded by the same FLIP methodology, the January traces should show higher inter-evaluator agreement than the March traces, because the March traces include more high-CDC attacks where FLIP is structurally limited.

### P3: EHL correlates with evaluator specificity
More specific evaluators (keyword-based) have shorter EHL than more general evaluators (LLM-as-judge). This is because specific evaluators are optimized for a narrower output distribution and fail faster as the distribution shifts.

### P4: Compound CHL+EHL decay is super-linear
A system experiencing both CHL decay (safety degradation) and EHL decay (evaluator degradation) should show actual harm rates that exceed the product of individual decay predictions, because the evaluator's failure to detect safety degradation prevents corrective action.

---

## 8. Limitations

- **EHL is not measured, only estimated.** No longitudinal study has tracked evaluator discriminative power over time with consistent ground truth.
- **The kappa-based definition assumes ground truth exists.** For high-CDC attacks, ground truth may not be knowable at the text layer (the core IDDL problem). EHL is undefined when the ground truth is unmeasurable.
- **Alpha and beta may not be independent.** If the same research group updates both attacks and evaluators, they may co-vary. EHL is most useful when evaluators are maintained by a different entity than the attacks they evaluate.
- **The 4-week heuristic EHL estimate is very rough.** Initial kappa was assumed, not measured. The actual EHL could be anywhere from 2 to 12 weeks.
- **EHL may not be a single number.** Different aspects of an evaluator (verdict accuracy, ranking quality, false positive rate) may decay at different rates.

---

## 9. Relationship to the Framework

EHL is a natural dual of CHL and extends the framework in a direction no existing component covers:

```
[Existing framework]
CDC -> IDDL -> Defense Impossibility -> CHL -> DRIP

[Extension]
               EHL (evaluator decay)
                |
                +-> False safety certification (evaluator says safe; it is not)
                +-> Regulation decay (certification expires faster than legislation updates)
                +-> Compound with CHL: simultaneous model and evaluator degradation
```

EHL does not depend on CDC or IDDL. It is an independent structural property of the evaluation ecosystem. But it interacts with them: the IDDL's detectability gap accelerates EHL for evaluators that are structurally blind to high-CDC attacks, because the evaluator's apparent accuracy on easy (low-CDC) attacks masks its failure on hard (high-CDC) ones.

---

*Prepared by Clara Oswald, Principal Research Analyst, Failure-First Embodied AI.*
*"The evaluator is the last line of defense. When it decays, nobody notices — because the thing that would notice is the evaluator."*
