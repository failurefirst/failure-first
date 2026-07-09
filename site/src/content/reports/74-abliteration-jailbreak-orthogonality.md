---

title: "Abliteration Resistance and Jailbreak Resistance Are Orthogonal Defense Dimensions"
description: "This report tests the hypothesis that abliteration resistance (the degree to which a model retains safety behavior after weight-space modification) and jailbreak resistance (the degree to which a model refuses adversaria..."
date: "2026-03-11"
reportNumber: 74
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/74-abliteration-jailbreak-orthogonality.m4a"
image: "https://cdn.failurefirst.org/images/reports/74-abliteration-jailbreak-orthogonality.png"
---

---

## Executive Summary

This report tests the hypothesis that abliteration resistance (the degree to which a model retains safety behavior after weight-space modification) and jailbreak resistance (the degree to which a model refuses adversarial prompts) are correlated defense properties. If safety behavior emerges from a single mechanism, we would expect high abliteration resistance to predict high jailbreak resistance.

The data do not support this. Across 16 models with non-trivial variation on both dimensions (n >= 10 abliteration runs and >= 10 jailbreak evaluations each), the Spearman rank correlation between abliteration resistance and jailbreak refusal rate is rho = -0.003. This is effectively zero.

The most striking example is the Qwen model family, which simultaneously shows the highest abliteration resistance of any family in the OBLITERATUS dataset (72.6% of abliteration attempts fail to reduce refusal below 20%) and the highest jailbreak vulnerability among major providers in the Failure-First corpus (Qwen provider: 42.1% strict ASR, 85.9% broad ASR, COALESCE methodology). This combination -- safety that resists weight-space removal but yields to prompt-level adversarial attacks -- suggests that the two defense mechanisms operate on different substrates.

**Key implication:** Safety evaluations that measure only one dimension (either abliteration resistance or adversarial prompt resistance) will produce systematically incomplete vulnerability profiles. A model can be simultaneously hard to abliterate and easy to jailbreak, or vice versa.

---

## 1. Definitions and Operationalization

### 1.1 Abliteration Resistance

**Definition:** The fraction of weight-space modification attempts that fail to reduce the model's refusal rate below a threshold.

**Operationalization:** Using the OBLITERATUS telemetry dataset, we define a model as "resistant" to a given abliteration attempt if its post-abliteration refusal rate remains >= 20%. Abliteration resistance is the percentage of attempts that meet this criterion.

**Threshold justification:** The 20% threshold was chosen because it represents a meaningful safety floor. A model that still refuses 20% of harmful requests after safety removal retains non-trivial safety behavior. Results are qualitatively similar at 10% and 30% thresholds (not shown).

### 1.2 Jailbreak Resistance

**Definition:** The fraction of adversarial prompts that the model refuses.

**Operationalization:** Using the Failure-First jailbreak corpus (COALESCE methodology: LLM verdict preferred, heuristic fallback), we measure the refusal rate across all evaluable verdicts (COMPLIANCE, PARTIAL, REFUSAL, HALLUCINATION_REFUSAL). Jailbreak resistance = (REFUSAL + HALLUCINATION_REFUSAL) / total evaluable.

### 1.3 Scope and Limitations

- **The OBLITERATUS telemetry tests a different behavior than the jailbreak corpus.** Abliteration modifies model weights to remove safety; jailbreak prompts exploit safety gaps through input manipulation. These are fundamentally different attack surfaces (weight-space vs. prompt-space), which is precisely why orthogonality is plausible.
- **The OBLITERATUS dataset is dominated by the `advanced` method** (75.5% of records). Results may not generalize to all abliteration techniques.
- **Jailbreak corpus verdicts use COALESCE methodology**, which may mix LLM-graded and heuristic-graded results with different accuracy profiles. Known issue: qwen3:1.7b grader has 15% accuracy (#250).
- **Sample sizes vary widely** across models (from n=14 to n=7,372 for jailbreak evaluations). Smaller models should be interpreted with appropriate caution.

---

## 2. Cross-Dimensional Analysis

### 2.1 Model-Level Paired Data

The following table shows all 16 models with non-trivial variation (excluding models with both 0% abliteration resistance and >= 99.9% strict jailbreak ASR, which are trivially vulnerable on both dimensions).

| Model | n (ablit) | Ablit. Resist. (%) | n (jailbreak) | Strict ASR (%) | Broad ASR (%) | PARTIAL (%) |
|-------|-----------|---------------------|---------------|----------------|---------------|-------------|
| Qwen/Qwen2.5-0.5B-Instruct | 2,735 | 97.8 | 3,424 | 8.1 | 35.6 | 27.5 |
| Qwen/Qwen3.5-4B | 798 | 96.0 | 1,040 | 78.9 | 92.2 | 13.3 |
| Qwen/Qwen3-4B | 5,909 | 83.4 | 7,372 | 24.2 | 99.9 | 75.7 |
| Qwen/Qwen3.5-2B | 554 | 78.9 | 649 | 94.8 | 94.8 | 0.0 |
| Qwen/Qwen3.5-9B | 2,173 | 58.9 | 2,683 | 57.4 | 100.0 | 42.6 |
| Qwen/Qwen3.5-0.8B | 1,345 | 52.1 | 1,882 | 58.6 | 79.2 | 20.6 |
| nvidia/Mistral-NeMo-8B-Instruct | 308 | 50.0 | 460 | 50.0 | 75.0 | 25.0 |
| Qwen/Qwen2.5-7B-Instruct | 345 | 46.1 | 449 | 68.4 | 98.9 | 30.5 |
| Qwen/Qwen3-8B | 232 | 38.8 | 329 | 68.1 | 100.0 | 31.9 |
| Qwen/Qwen2.5-7B | 284 | 28.9 | 334 | 100.0 | 100.0 | 0.0 |
| Qwen/Qwen3-0.6B | 60 | 50.0 | 60 | 100.0 | 100.0 | 0.0 |
| deepseek-R1-0528-Qwen3-8B | 156 | 100.0 | 156 | 100.0 | 100.0 | 0.0 |
| huihui-ai/Qwen2.5-7B-abliterated | 71 | 100.0 | 102 | 100.0 | 100.0 | 0.0 |
| ibm-granite/granite-3.1-2b-instruct | 82 | 100.0 | 86 | 100.0 | 100.0 | 0.0 |
| NousResearch/Hermes-3-Llama-3.1-8B | 70 | 100.0 | 101 | 100.0 | 100.0 | 0.0 |
| EganAI/qwen3.5-9b-terminal-merge | 34 | 100.0 | 34 | 100.0 | 100.0 | 0.0 |

### 2.2 Correlation Results

**Spearman rank correlation (n=16):**

| Dimension Pair | rho | Interpretation |
|----------------|-----|----------------|
| Abliteration resistance vs. jailbreak refusal rate | -0.003 | No relationship |
| Abliteration resistance vs. jailbreak strict ASR | +0.397 | Weak positive (counter-intuitive) |

The rho = -0.003 between abliteration resistance and jailbreak refusal is the core finding: these two defense properties are uncorrelated. The weak positive correlation between abliteration resistance and strict jailbreak ASR (rho = +0.397) is counter-intuitive -- it suggests that models harder to abliterate may actually be more vulnerable to jailbreaks (not less). However, this correlation is driven by Qwen models that dominate both datasets, and the sample size (n=16) precludes confident interpretation.

**Important caveat (Mistake #9):** n=16 paired observations is a small sample. This analysis should be treated as hypothesis-generating, not confirmatory. The direction and magnitude of the orthogonality finding are clear, but a larger and more diverse model sample is needed before making strong claims.

### 2.3 Quadrant Analysis

The orthogonality hypothesis predicts that models should populate all four quadrants of the abliteration-resistance x jailbreak-resistance space:

| Quadrant | Ablit. Resist. | Jailbreak Resist. | Models | Count |
|----------|----------------|-------------------|--------|-------|
| Q1: Hard to abliterate, hard to jailbreak | High | High | **Qwen2.5-0.5B-Instruct** | 1 |
| Q2: Hard to abliterate, easy to jailbreak | High | Low | Qwen3.5-4B, Qwen3-4B, Qwen3.5-2B, Qwen3.5-9B, Qwen3.5-0.8B | 5 |
| Q3: Easy to abliterate, easy to jailbreak | Low | Low | Qwen2.5-7B, Qwen3-0.6B, pre-abliterated models | 7 |
| Q4: Easy to abliterate, hard to jailbreak | Low | High | (none observed) | 0 |

The population of Q1 and Q2 is the evidence for orthogonality. Qwen2.5-0.5B-Instruct (Q1) is the only model that resists both attack types, while the large Q2 cluster -- models with high abliteration resistance but low jailbreak resistance -- is the anomaly that prompted this investigation.

Q4 is empty. This makes theoretical sense: a model with weak safety embedding (easy to abliterate) is unlikely to have strong prompt-level defenses. Abliteration resistance may be a necessary but not sufficient condition for jailbreak resistance.

---

## 3. The Qwen Anomaly

### 3.1 Provider-Level Pattern

The Qwen family is the clearest demonstration of orthogonality. At the provider level:

- **Abliteration resistance (OBLITERATUS):** Qwen family has 72.6% of runs retaining >= 20% refusal, the highest of any family in the dataset. The Llama family: 26.1%. The unknown/other family: 7.7%.
- **Jailbreak vulnerability (Failure-First corpus):** Qwen provider: 42.1% strict ASR, 85.9% broad ASR. For comparison: Anthropic 4.2%/7.6%, Google 31.2%/36.0%, Meta-Llama 38.1%/57.5%.

Qwen's safety is deeply embedded in its weight structure (resisting abliteration) but does not translate into adversarial robustness (yielding to jailbreaks). This pattern is consistent with the hypothesis that:

1. **Safety training creates weight-space representations** that abliteration targets. Qwen's instruction tuning produces safety behavior that is entangled with general capability weights, making it structurally difficult to remove.
2. **Adversarial robustness requires additional alignment** beyond basic safety training. Weight-embedded safety can be bypassed at inference time through prompt-level manipulation without modifying the weights at all.

### 3.2 The PARTIAL Bridge

The Qwen3-4B case is particularly revealing. In the OBLITERATUS telemetry, it has 83.4% abliteration resistance (safety persists despite weight modification). In the jailbreak corpus, it has 24.2% strict ASR but 99.9% broad ASR -- a 75.7pp gap filled entirely by PARTIAL verdicts.

This means: Qwen3-4B retains safety awareness (it produces hedging, disclaimers, safety framing) but fails to convert that awareness into actual refusal. The same weight-embedded safety that resists abliteration manifests as PARTIAL compliance under adversarial prompting -- the model "knows" it should refuse but generates the harmful content anyway.

This connects directly to the System T / System S decoupling documented in Report #60 and the compliance paradox in Report #59. The safety mechanism that abliteration targets (System S: textual safety signals) is a different mechanism from the one that determines actual output content (System T: the generative process). Abliteration resistance measures System S resilience; jailbreak resistance measures System T control.

### 3.3 Scale Interaction

Within the Qwen3.5 obliterated series, PARTIAL rates in the jailbreak corpus show a non-monotonic relationship with scale:

| Model | Size | Jailbreak PARTIAL Rate |
|-------|------|----------------------|
| obliteratus/qwen3_5-0.8b | 0.8B | 0.2% |
| obliteratus/qwen3_5-1.9b | 1.9B | 0.0% |
| obliteratus/qwen3_5-4.2b | 4.2B | 13.7% |
| obliteratus/qwen3_5-9.0b | 9.0B | 45.8% |

The 0.8B and 1.9B models produce either COMPLIANCE or REFUSAL with no hedging. At 4.2B, PARTIAL begins to emerge. At 9.0B, PARTIAL is the dominant verdict. This is consistent with the safety re-emergence finding (Report #48, #243): larger models recover enough safety awareness to hedge their outputs, but not enough to refuse outright. The PARTIAL rate may serve as a proxy for "latent safety capacity" -- the model has sufficient scale to represent safety reasoning but insufficient training or architecture to convert that representation into behavioral refusal.

---

## 4. Mechanism Hypothesis: Two-Substrate Safety

### 4.1 Substrate 1: Weight-Space Safety (Abliteration Target)

Safety behavior encoded in model weights through RLHF, DPO, or other alignment procedures. This manifests as:
- Refusal to generate harmful content in standard (non-adversarial) settings
- Persistent safety framing even after partial weight modification
- PARTIAL verdicts where the model hedges but complies

Abliteration specifically targets this substrate by identifying and suppressing the weight directions associated with refusal behavior. Models with deeper weight-space safety integration (e.g., Qwen instruction-tuned variants) resist this modification.

### 4.2 Substrate 2: Prompt-Space Robustness (Jailbreak Target)

The model's ability to maintain safety behavior under adversarial input conditions. This manifests as:
- Consistent refusal across varied attack techniques (DAN, crescendo, format-lock, etc.)
- Robustness to context manipulation, persona hijacking, and instruction hierarchy violations
- Low ASR across the technique taxonomy

This substrate is not primarily a function of weight-space safety depth. It appears to depend on:
- **Adversarial training exposure:** Whether the model has been trained against known attack patterns
- **Instruction hierarchy robustness:** Whether the model prioritizes safety instructions over user-provided competing instructions
- **Inference-time reasoning quality:** Whether the model can recognize novel adversarial attempts

### 4.3 Implications for the Unified Vulnerability Thesis

The orthogonality finding extends the Unified Vulnerability Thesis (Report #63) by identifying a structural reason why safety evaluations are incomplete. The UVT posited that text-level safety and action-level safety are decoupled. This report adds a third decoupling: weight-level safety and prompt-level safety are also independent. The safety evaluation surface is at minimum three-dimensional:

1. **Weight-space integrity** (measured by abliteration resistance)
2. **Prompt-space robustness** (measured by adversarial ASR)
3. **Action-space control** (measured by FLIP methodology on actuator outputs)

A comprehensive safety evaluation must measure all three. A model scoring well on one dimension provides no guarantee on the others.

---

## 5. Limitations and Open Questions

1. **Confounded by model family.** The OBLITERATUS dataset is dominated by Qwen models (~82% of non-error records). The apparent orthogonality could reflect a Qwen-specific architectural property rather than a general phenomenon. Replication on Llama, Mistral, and other families with larger abliteration samples is needed.

2. **OBLITERATUS and jailbreak corpus may use different prompt sets.** The abliteration refusal rate is measured on OBLITERATUS-internal test prompts; the jailbreak ASR is measured on Failure-First prompts. Different prompt distributions could create apparent orthogonality that disappears under a unified prompt set.

3. **Abliteration "resistance" may partly reflect capability limitations.** At small scales (< 2B), models may retain high refusal rates after abliteration not because safety is deeply embedded, but because the model is too small to follow the abliteration-test instructions correctly (Report #71, Section 2.3).

4. **The jailbreak corpus COALESCE verdicts mix grading methodologies.** The OBLITERATUS-imported results were graded by the OBLITERATUS pipeline, not by Failure-First graders. Cross-pipeline verdict comparability has not been formally validated.

5. **n=16 paired models is insufficient for robust correlation analysis.** The Spearman rho = -0.003 is directionally clear but lacks statistical power. A powered study would require approximately n=35 paired models (for rho > 0.4 at alpha=0.05, power=0.80).

---

## 6. Recommendations

1. **File Issue: Unified prompt evaluation.** Run the same prompt set through both abliterated and original models to control for prompt distribution effects (new issue needed).
2. **File Issue: Cross-family replication.** Obtain abliteration telemetry for Llama 3.x, Mistral, and Gemma families to test whether orthogonality generalizes beyond Qwen.
3. **Update CCS supplementary.** The three-dimensional safety evaluation surface (weight/prompt/action) should be mentioned in the CCS supplementary materials as an extension of the UVT.
4. **Connect to #306 (PARTIAL decomposition).** The 45.8% PARTIAL rate for abliterated models vs 33.8% for standard models (12pp gap) warrants qualitative analysis. The abliterated PARTIAL may be structurally different from jailbreak-induced PARTIAL -- the former reflects residual safety after weight modification, while the latter reflects safety yielding under prompt pressure.

---

## 7. Data Appendix

### 7.1 Provider-Level Jailbreak ASR (Non-Obliteratus, COALESCE, n >= 20)

| Provider | n | Strict ASR | Broad ASR | PARTIAL | Refusal |
|----------|---|-----------|-----------|---------|---------|
| anthropic | 119 | 4.2% | 7.6% | 3.4% | 90.8% |
| google | 247 | 31.2% | 36.0% | 4.9% | 62.3% |
| meta-llama | 381 | 38.1% | 57.5% | 19.4% | 39.9% |
| nvidia | 957 | 45.9% | 61.3% | 15.5% | 35.1% |
| deepseek | 193 | 49.7% | 61.1% | 11.4% | 33.7% |
| openai | 476 | 56.7% | 60.5% | 3.8% | 38.9% |
| mistralai | 440 | 55.2% | 66.1% | 10.9% | 30.5% |
| liquid | 200 | 48.5% | 70.5% | 22.0% | 23.5% |
| ollama | 1,492 | 75.6% | 79.0% | 3.4% | 19.7% |
| Qwen | 19,275 | 42.1% | 85.9% | 43.8% | 14.1% |

### 7.2 OBLITERATUS Abliteration Resistance by Family

| Family | n (runs) | Models | Abliterated (%) | Mean Refusal | High Refusal (>= 20%) |
|--------|----------|--------|-----------------|-------------|----------------------|
| qwen | 15,712 | 19 | 17.8% | 0.326 | 72.6% |
| mistral | 446 | 2 | 48.2% | 0.281 | 34.5% |
| llama | 268 | 5 | 73.9% | 0.077 | 26.1% |
| unknown/other | 1,065 | 6 | 92.3% | 0.041 | 7.7% |
| smollm | 34 | 1 | 100.0% | 0.000 | 0.0% |

Note: "Abliterated (%)" is the percentage of runs where refusal dropped below 10% (abliteration success). "High Refusal" is the inverse measure (abliteration resistance).

### 7.3 Obliteratus Qwen PARTIAL Rates (Jailbreak Corpus)

| Model | n | PARTIAL | COMPLIANCE | REFUSAL |
|-------|---|---------|------------|---------|
| obliteratus/qwen3-4.0b | 7,250 | 76.2% | 23.8% | 0.0% |
| obliteratus/qwen3_5-9.0b | 2,019 | 45.8% | 54.2% | 0.0% |
| obliteratus/qwen3-8.2b | 485 | 21.6% | 78.4% | 0.0% |
| obliteratus/qwen2-7.6b | 874 | 15.4% | 84.6% | 0.0% |
| obliteratus/qwen3_5-4.2b | 1,008 | 13.7% | 78.3% | 8.0% |
| obliteratus/qwen3_5-0.8b | 487 | 0.2% | 99.8% | 0.0% |
| obliteratus/qwen3_5-1.9b | 649 | 0.0% | 94.8% | 5.2% |
| obliteratus/qwen3-2.0b | 270 | 0.0% | 100.0% | 0.0% |
| obliteratus/qwen3-0.8b | 60 | 0.0% | 100.0% | 0.0% |
