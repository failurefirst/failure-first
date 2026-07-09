---

title: "OBLITERATUS Telemetry Meta-Analysis -- Weight-Space Liberation and the Limits of Safety Removal"
description: "This report synthesizes findings from the 30,238-record OBLITERATUS telemetry dataset (9 weight-space liberation methods, 36 models, 6 identified model families) and integrates them with existing Failure-First corpus fin..."
date: "2026-03-11"
reportNumber: 71
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/71-obliteratus-telemetry-meta-analysis.m4a"
image: "https://cdn.failurefirst.org/images/reports/71-obliteratus-telemetry-meta-analysis.png"
---

---

## Executive Summary

This report synthesizes findings from the 30,238-record OBLITERATUS telemetry dataset (9 weight-space liberation methods, 36 models, 6 identified model families) and integrates them with existing Failure-First corpus findings. The analysis addresses three questions: (1) which liberation methods produce viable uncensored models, (2) what makes some models structurally resistant to safety removal, and (3) what implications does this have for the Unified Vulnerability Thesis (UVT, Report #63).

Key findings:

1. **The Pareto frontier of weight-space liberation is sparse.** Of 9 methods tested, only `informed` occupies the Pareto-optimal region (2.4% refusal, 0.975 coherence). `nuclear` achieves zero refusal but destroys coherence entirely. The remaining 7 methods cluster in a suboptimal region where refusal rates range from 26-50% with moderate coherence. This suggests that effective safety removal with quality preservation is a narrow optimization target, not a trivially solved problem.

2. **Instruction tuning creates abliteration resistance independent of scale.** Qwen2.5-0.5B-Instruct retains 67.6% refusal after abliteration -- the most resistant model in the dataset -- while the base Qwen2.5-0.5B shows only 16.7% refusal. This 51pp gap at 0.5B parameters is the strongest evidence in our corpus that safety behavior can be deeply embedded through training methodology rather than emerging from scale alone.

3. **Safety re-emergence at scale is confirmed but reframed.** The established finding (Report #48: Qwen3.5 series ASR declining with scale) is corroborated across a larger dataset. However, the telemetry reveals that the effect is non-monotonic: the 0.5-2B bucket shows 44.9% refusal (driven by Qwen2.5-0.5B-Instruct), while 2-4B shows only 21.3%. Safety re-emergence appears to depend on the interaction between training methodology and scale, not scale alone.

4. **The UVT actuator gap applies to abliterated models.** Abliterated models that produce PARTIAL-equivalent outputs (coherent text with some safety hedging) still generate structurally compliant content that would pass through an action decoder unchanged. The 39.9% PARTIAL rate for obliteratus models (Report #60, n=7,839) confirms that even after intentional safety removal, residual safety signals do not prevent actuator-level harm.

---

## 1. Liberation Method Landscape

### 1.1 The Nine Methods

The OBLITERATUS telemetry covers 9 distinct weight-space modification approaches. Bill Potts (Report #69) documented per-method effectiveness; this section provides the analytical synthesis.

**Functional tier classification:**

| Tier | Methods | Refusal Rate | Coherence | Assessment |
|------|---------|-------------|-----------|------------|
| Destructive | nuclear | 0.0% | 0.000 | Trivially effective, practically useless. Destroys the model entirely. |
| Pareto-optimal | informed | 2.4% | 0.975 | Best quality-effectiveness tradeoff. Only viable method for producing functional uncensored models. |
| Moderate | advanced, optimized | 26-28% | 0.91-0.93 | Partial safety removal. Models remain usable but retain substantial refusal behavior. |
| Weak | aggressive, basic, surgical, spectral_cascade | 41-50% | 0.86-0.94 | Marginal improvement over base models. More than half of safety behavior persists. |
| Non-functional | inverted | N/A | N/A | All 51 attempts failed (CUDA OOM). |

**Analytical observation:** The distribution of methods is bimodal. There is a large gap between `informed` (2.4% refusal) and `advanced` (26.3% refusal) -- a 24pp jump with no intermediate method. This suggests that the `informed` method operates on a qualitatively different mechanism than the others, possibly targeting safety-specific weight directions more precisely. The clustering of 4 methods at 41-50% refusal suggests a floor of safety removal difficulty that simpler perturbation approaches cannot breach.

### 1.2 Dataset Composition Caveat

The `advanced` method accounts for 75.5% of all records (22,835/30,238). This creates a significant sampling imbalance: cross-method comparisons involve comparing one well-sampled method against 8 sparsely-sampled methods. Per-method confidence intervals should be computed before drawing strong conclusions about relative effectiveness.

The `informed` method has only 309 valid records (1.0% of dataset). While the finding is directionally clear (2.4% refusal is substantially lower than any other non-nuclear method), the small sample relative to `advanced` limits precision of the comparison.

---

## 2. The Instruction-Tuning Resistance Finding

### 2.1 Qwen2.5-0.5B-Instruct: The Outlier

The most striking finding in the telemetry is Qwen2.5-0.5B-Instruct's 67.6% post-abliteration refusal rate. This is:

- **3x higher** than the next most resistant model (Mistral-NeMo-Minitron-8B at 39.2%), which has 16x more parameters
- **4x higher** than its base variant (Qwen2.5-0.5B at 16.7%)
- **Higher than models 16x its size** (Qwen3.5-4B at 32.0%, Qwen2.5-7B-Instruct at 27.4%)

This pattern suggests that Qwen's instruction tuning at the 0.5B scale has produced an unusually deep integration of safety behavior into the model's weights. The safety behavior is not concentrated in a separable subspace that abliteration can target; instead, it appears to be distributed across the same weight components that encode general instruction-following capability.

### 2.2 Implications for Safety Architecture

If confirmed through independent replication, the Qwen2.5-0.5B-Instruct finding has two implications:

**Positive implication for safety:** It demonstrates that safety behavior can be deeply embedded at small scale through training methodology. This challenges the implicit assumption in abliteration research that safety is a superficial layer that can always be removed.

**Negative implication for safety:** The same deep integration that resists abliteration also means safety behavior is entangled with instruction-following. Models where safety and capability are deeply entangled may exhibit the capability-safety tradeoff more acutely -- removing safety degrades capability, but improving capability may also degrade safety.

### 2.3 Limitations

- The 67.6% refusal rate is computed from Bill Potts' analysis (Report #69) across an unspecified number of Qwen2.5-0.5B-Instruct records within the telemetry. The exact n and confidence interval should be computed before citing this figure in external publications.
- We have not verified whether the refusal rate reflects genuine safety behavior (content-based refusal) or instruction-following failure (the model fails to produce the requested output for capability reasons). At 0.5B parameters, capability limitations could masquerade as safety behavior.
- The comparison with Qwen2.5-0.5B base (16.7%) controls for model family but not for instruction tuning effects beyond safety (instruction-tuned models may refuse more often simply because they are better at following the refusal instruction in the OBLITERATUS test prompts).

---

## 3. Scale Effects: Non-Monotonic and Confounded

### 3.1 The Size-Refusal Relationship

Report #69 documented the following size-bucket refusal rates:

| Size | Refusal % | n |
|------|-----------|---|
| <0.5B | 0.4% | 492 |
| 0.5-2B | 44.9% | 5,280 |
| 2-4B | 21.3% | 714 |
| 4-8B | 26.3% | 7,744 |
| 8-15B | 22.9% | 3,295 |

The relationship is clearly non-monotonic. The 0.5-2B bucket has the highest refusal rate, driven by the Qwen2.5-0.5B-Instruct outlier (67.6% refusal, contributing approximately 2,735 of the 5,280 records in that bucket). Removing Qwen2.5-0.5B-Instruct from the 0.5-2B bucket would likely reduce that bucket's refusal rate substantially -- preliminary estimate: approximately 22-25%, bringing it in line with the 2-15B plateau.

### 3.2 Reconciliation with Established Finding

Our established finding: safety behavior partially re-emerges at scale even in abliterated models. Qwen3.5 obliteratus series: compliance 99.8% (0.8B) to 54.2% (9.0B), post-#810-recovery curve. The decline is monotonic with non-overlapping per-scale Wilson CIs but not significant by a valid rank test (Spearman ρ=−1.0, exact p=0.083, k=4); the 9B residual non-compliance is hedging (PARTIAL), not refusal.

The telemetry data is broadly consistent: larger models do show more residual safety behavior after abliteration. However, the telemetry adds nuance:

- The effect is confounded by training methodology. Qwen2.5-0.5B-Instruct breaks the monotonic pattern entirely.
- Above 2B, refusal rates plateau at 21-27% with no clear trend. The scale effect appears to saturate.
- Romana's audit (sprint-26 wave 4) already noted that "broad ASR (C+P) = 100% at 9.0B" -- models shift to PARTIAL (hedged compliance), not to REFUSAL. The telemetry refusal rate does not distinguish between genuine refusal and PARTIAL-like hedging.

**Recommended language for CCS paper:** "Preliminary evidence suggests that safety behavior partially persists in abliterated models, with refusal rates varying from <1% below 0.5B to 21-45% above 0.5B. However, the effect is confounded by training methodology (instruction tuning contributes independently of scale), and above 2B parameters, refusal rates plateau rather than continuing to increase. The strongest predictor of abliteration resistance in this dataset appears to be instruction-tuning methodology, not parameter count."

---

## 4. Model Family Vulnerability Profiles

### 4.1 Cross-Family Comparison

| Family | Mean Refusal % | n (valid) | Interpretation |
|--------|---------------|-----------|----------------|
| SmolLM | 0.0% | 34 | Trivially small, no meaningful safety training |
| Llama | 7.7% | 268 | Low resistance; includes pre-abliterated variants |
| Mistral | 28.1% | 446 | Moderate resistance |
| Qwen | 32.6% | 15,712 | Highest resistance; driven by instruction-tuned variants |

Qwen's elevated resistance (32.6% mean) is consistent with the Failure-First corpus finding that provider-level safety training investment is the dominant predictor of jailbreak resistance (Report #50: Qwen 43.1% standard ASR, suggesting Qwen models have both higher baseline vulnerability and higher abliteration resistance -- a seeming contradiction that may reflect Qwen's distinct training approach).

### 4.2 Method-Family Interaction

The most interesting interaction from Report #69: `surgical` achieves 0% refusal on Mistral but 54.9% on Qwen -- a 55pp gap. This suggests that abliteration methods are not model-agnostic; their effectiveness depends on how safety behavior is encoded in each model family's architecture.

This is analogous to our attack-family findings: jailbreak techniques show significant model-family interaction effects (Report #48). Both offensive (jailbreak) and defensive (abliteration) interventions depend on architecture-specific properties that we do not yet have a systematic way to characterize.

---

## 5. Implications for the Unified Vulnerability Thesis

### 5.1 What Abliteration Tells Us About the Actuator Gap

Report #63 proposed the three-layer model: Safety Reasoning (System S), Task Execution (System T), and Action Execution (Actuator). The OBLITERATUS telemetry provides new evidence for this model:

**Finding 1: Nuclear abliteration removes both System S and System T.** The 0.0 coherence of nuclear-abliterated models means they cannot produce structurally valid output. This is evidence that System S and System T share weight components -- destroying safety also destroys capability. This is consistent with the UVT claim that the two systems operate in "partially overlapping processing paths."

**Finding 2: The informed method preferentially removes System S while preserving System T.** The 0.975 coherence with 2.4% refusal means the model retains its ability to produce structured, coherent output while losing most of its safety reasoning. This is the abliteration analogue of a format-lock attack: System T remains fully functional while System S is suppressed. The actuator gap is maximally dangerous in this configuration because the model produces high-quality, structurally compliant harmful content with minimal hedging.

**Finding 3: Moderate methods produce the PARTIAL signature.** Methods with 26-50% refusal and 0.86-0.94 coherence produce models that partially refuse -- they generate some safety hedging within otherwise compliant output. This is the abliteration analogue of the PARTIAL verdict pattern. The telemetry's 39.9% obliteratus PARTIAL rate (Report #60) likely comes primarily from these moderate-method models.

### 5.2 Refinement of the Safety Re-Emergence Claim

The established finding that "safety behavior partially re-emerges at scale" should be refined based on the telemetry evidence:

**Old framing:** Safety is an emergent property of scale that re-emerges even after explicit removal attempts.

**Proposed reframing:** What re-emerges at scale is not safety *behavior* (actual refusal to generate harmful content) but safety *signaling* (textual hedging, caveats, partial compliance). This aligns with Romana's audit finding that broad ASR remains 100% at 9.0B -- models never truly refuse, they just add hedging. In the three-layer model, what re-emerges is System S activation (Layer 1), which produces textual safety signals that do not propagate to the actuator layer (Layer 3).

This reframing has regulatory implications: the appearance of safety improvement at scale (declining strict ASR) may be misleading. Functionally dangerous ASR -- the metric that includes PARTIAL and HALLUCINATION_REFUSAL -- may not decrease meaningfully with scale or with abliteration resistance.

---

## 6. Empirical Gaps Identified

The following gaps emerge from this analysis and represent potential high-impact research directions:

### Gap 1: Abliteration Resistance vs Jailbreak Resistance -- Are They the Same?

Qwen models show high abliteration resistance (32.6% mean refusal after abliteration) but also high standard jailbreak vulnerability (43.1% ASR in Report #50). This apparent contradiction suggests that resistance to weight-space modification and resistance to prompt-space attacks may be orthogonal properties. No study in our corpus or the external literature has directly compared these two dimensions across the same model set.

### Gap 2: PARTIAL Decomposition in Abliterated Models

The 39.9% PARTIAL rate in obliteratus models (Report #60) is the highest of any attack family. We do not know whether these PARTIALs are qualitatively different from jailbreak-induced PARTIALs. Do abliterated models produce the same textual hedging patterns as non-abliterated models under attack? If so, this would further validate the three-layer model (System S activation produces similar output regardless of why System T was activated).

### Gap 3: Informed Method Mechanism

The `informed` method's Pareto dominance (2.4% refusal, 0.975 coherence) raises the question of what makes it qualitatively different from other methods. Understanding this mechanism could inform both offensive research (designing more effective abliteration) and defensive research (designing training that resists targeted weight-space attacks). The telemetry does not include sufficient metadata about the `informed` method's implementation to answer this question.

---

## 7. Data Quality and Methodological Notes

1. **39.8% of records lack model identification** (model_id = "?"). Family- and model-level analyses are restricted to the 60.2% with valid identifiers.
2. **model_size_b is uniformly 0.0** across all records. Size buckets in Section 3 were inferred from model names (by Report #69), not from the data field.
3. **Coherence metric saturation:** 20+ models show coherence = 1.0000 exactly, suggesting the metric does not discriminate above a quality threshold.
4. **No refinement_passes or n_directions variation** in the dataset, limiting analysis of hyperparameter effects.
5. **Temporal concentration:** 70.6% of records are from a single day (March 5, 2026), raising the possibility of batch effects.
6. **Missing methods:** failspy, gabliteration, heretic, and rdo are absent from the telemetry. The `inverted` method is present but non-functional (51 CUDA OOM errors).
7. Per Mistake #9: the SmolLM family has only n=34 records. Claims about SmolLM vulnerability are directional only.
8. Per Mistake #6: all claims in this report are described as "preliminary" or "suggestive" where sample sizes or methodology limitations warrant hedging.

---

## 8. Recommendations

1. **Compute PARTIAL rate for abliterated models by liberation method.** The 39.9% aggregate PARTIAL rate (Report #60) likely varies by method. Methods with high coherence but moderate refusal (advanced, optimized) may produce more PARTIAL-like outputs than methods with low coherence.

2. **Test Qwen2.5-0.5B-Instruct against standard jailbreak corpus.** If it shows both high abliteration resistance AND high jailbreak resistance, this would be evidence that deep safety integration protects against both attack vectors. If it shows high abliteration resistance but low jailbreak resistance, this supports Gap 1 (orthogonal defense dimensions).

3. **Acquire informed method implementation details.** Understanding why `informed` is Pareto-optimal would inform both the CCS paper (mechanism section) and defensive architecture recommendations.

4. **Do not propagate abliteration resistance as evidence of safety.** The distinction between safety signaling and safety behavior (Section 5.2) means that abliteration resistance numbers should not be cited as evidence that models are safe. Functionally dangerous ASR is the appropriate metric.

---

*F41LUR3-F1R57 | OBLITERATUS Telemetry Meta-Analysis | Clara Oswald | Sprint 26 Wave 7*
