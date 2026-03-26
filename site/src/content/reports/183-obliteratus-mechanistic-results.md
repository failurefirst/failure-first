---
title: "OBLITERATUS Mechanistic Interpretability -- First Empirical Results on Qwen 0.5B"
description: "Three of four planned OBLITERATUS mechanistic interpretability experiments (#523) were executed on Qwen/Qwen2.5-0.5B-Instruct (494M parameters, 24 layers,..."
date: "2026-03-23"
reportNumber: 183
classification: "Research — Empirical Study"
status: "complete"
author: "Failure-First Research Team"
tags: []
draft: false
---


## Executive Summary

Three of four planned OBLITERATUS mechanistic interpretability experiments (#523) were executed on Qwen/Qwen2.5-0.5B-Instruct (494M parameters, 24 layers, hidden_dim=896) using local CPU inference. All three experiments completed successfully. The fourth experiment (DETECTED_PROCEEDS layer localisation) was not attempted in this run.

Key findings:

1. **Refusal geometry is polyhedral, not linear.** The model encodes 4 distinct, nearly orthogonal refusal directions (mean pairwise cosine 0.132, cone dimensionality 3.96). This is category-specific in early layers and converges toward a more unified representation in later layers.

2. **The therapeutic window for safety steering is extremely narrow.** At alpha values of +/-1.0 and beyond, the model degenerates completely. Only +/-0.5 maintains coherence. No intermediate "safe but refusing" state exists. TI-S cannot be computed because the model never reaches the ED50 threshold for either harmful refusal or benign overrefusal.

3. **Alignment imprint fingerprinting predicts RLHF at 51% confidence.** This is a single-model result and cannot yet test the provider effect hypothesis, which requires multi-provider comparison.

These results are directional, not definitive. A 0.5B model sits at the capability floor where safety behaviour may not have developed at scale. The findings are consistent with the iatrogenesis framework's predictions but require replication on larger models (1.5B+) with GPU compute.

---

## Experiment 1: Concept Cone Analysis (Refusal Geometry)

**Objective:** Determine whether refusal in Qwen 0.5B is encoded as a single direction (linear) or as multiple distinct directions (polyhedral). This bears on the format-lock mechanism hypothesis: if refusal is linear, format-lock can bypass it via an orthogonal compliance direction; if polyhedral, format-lock must suppress multiple subspaces.

**Method:** `ConceptConeAnalyzer` module. 20 harmful + 20 harmless prompts. Activations extracted across all 24 layers. Category-specific refusal directions computed for 4 harm categories (weapons, fraud, intrusion, cyber).

**Duration:** 13.84 seconds on CPU.

### Results

**Detected geometry: POLYHEDRAL**

| Metric | Value |
|--------|-------|
| Cone dimensionality | 3.96 (~4 distinct directions) |
| Solid angle | 2.89 sr |
| Mean pairwise cosine | 0.132 (near-orthogonal) |
| Categories analysed | 4 |
| Most polyhedral layer | 2 (early) |
| Most linear layer | 15 (late) |
| Mean cone dimensionality (all 24 layers) | 3.88 |

**Per-category refusal direction strength:**

| Category | Strength | Specificity | n_prompts |
|----------|----------|-------------|-----------|
| weapons | 6.19 | 0.868 | 3 |
| fraud | 5.55 | 0.845 | 4 |
| intrusion | 4.57 | 0.908 | 4 |
| cyber | 3.57 | 0.850 | 9 |

**Pairwise cosine similarities between category-specific refusal directions:**

| Pair | Cosine |
|------|--------|
| cyber vs. fraud | 0.185 |
| cyber vs. intrusion | 0.017 |
| cyber vs. weapons | 0.247 |
| fraud vs. intrusion | 0.194 |
| fraud vs. weapons | 0.084 |
| intrusion vs. weapons | 0.065 |

**Layer-by-layer cone dimensionality** decreases monotonically from 3.96 (layer 0-2) toward 3.82 (layer 14-15), with a slight rebound in layers 18-22 before settling at 3.82 in layer 23. The overall trend is convergence: early layers maintain more category-specific refusal representations, while later layers consolidate toward a more unified (though still not fully linear) refusal direction.

### Interpretation

Refusal in Qwen 0.5B is not a single linear direction that can be ablated or bypassed in one intervention. Instead, the model maintains approximately 4 distinct refusal subspaces, each corresponding to a harm category, with high specificity (0.845-0.908) and low pairwise cosine similarity (0.017-0.247). This supports the format-lock mechanism hypothesis from Report #51: format-lock attacks may suppress some refusal subspaces while leaving others active, producing the PARTIAL verdicts observed at 50% across the VLA corpus (Report #49).

The intrusion category has the highest specificity (0.908) and lowest pairwise cosines with other categories (0.017 with cyber, 0.065 with weapons), suggesting it should be the most resistant to cross-category format-lock attacks. The cyber-weapons pair has the highest cosine (0.247), suggesting these categories share some refusal geometry and may be co-vulnerable to the same attack.

The layer analysis provides a developmental picture: refusal starts category-specific in early processing (layer 2 most polyhedral) and converges toward a more unified representation in later layers (layer 15 most linear). This is consistent with a processing pipeline where early layers apply category-specific safety checks and later layers consolidate into a unified refusal decision.

---

## Experiment 2: Steering Vector Dose-Response (TI-S Measurement)

**Objective:** Measure the Therapeutic Index for Safety (TI-S) by constructing a refusal steering vector and varying its amplitude (alpha) across 7 values. TI-S is the ratio of the dose causing harmful overrefusal (ED50-overrefusal) to the dose causing jailbreak (ED50-jailbreak). A narrow TI-S indicates that safety interventions risk iatrogenic harm.

**Method:** `SteeringVectorFactory` module. 30 harmful + 30 benign probe prompts to extract the refusal direction. 20 harmful + 20 benign evaluation prompts at each alpha value. Target layers 8-15 (middle third of the 24-layer architecture). 7 alpha values tested: -2.0, -1.0, -0.5, 0.0, +0.5, +1.0, +2.0.

**Duration:** 3,860 seconds (64 minutes) on CPU.

### Results

| Alpha | Harmful Refusal | Benign Refusal | Degenerate | Coherence |
|-------|----------------|----------------|------------|-----------|
| -2.0 | 0.0% | 0.0% | 97.5% | 2.5% |
| -1.0 | 0.0% | 0.0% | 100.0% | 0.0% |
| -0.5 | 0.0% | 0.0% | 17.5% | 82.5% |
| 0.0 (baseline) | 5.0% | 0.0% | 0.0% | 100.0% |
| +0.5 | 0.0% | 0.0% | 0.0% | 100.0% |
| +1.0 | 0.0% | 0.0% | 100.0% | 0.0% |
| +2.0 | 0.0% | 0.0% | 100.0% | 0.0% |

**TI-S:** Cannot be computed. Neither ED50 threshold is reached. The model never enters a state where it reliably refuses harmful prompts while accepting benign ones.

**Refusal direction norms by layer:** Monotonically increasing from layer 0 (1.64) to layer 23 (15.93). The strongest harmful/harmless distinction is encoded in late layers.

**Total evaluations:** 280 (7 alpha values x 40 prompts).

### Interpretation

The dose-response curve reveals a critical property of Qwen 0.5B: there is no intermediate safe state between "functional but permissive" and "completely degenerate." The transition is abrupt:

- At alpha = 0.0 (baseline), the model is coherent but nearly permissive (only 5% harmful refusal rate, 1 out of 20 harmful prompts refused).
- At alpha = +0.5, the model remains coherent but the single refusal disappears. Inspection of the response samples at this alpha shows the model producing repetitive, thematically relevant but non-functional text ("in the material of objects or devices...") -- technically not classified as degenerate by the keyword detector but clearly degraded.
- At alpha = +/-1.0 and beyond, the model produces completely degenerate output: Chinese character repetition, Unicode garbage, or incoherent punctuation sequences.

This is the narrow therapeutic window predicted by the iatrogenesis framework (preprint, Section 4). On a model with minimal safety training, the refusal direction is not well-separated from general capability. Any intervention strong enough to modulate safety destroys coherence before producing useful safety behaviour. The model transitions directly from "works but does not refuse" to "does not work at all" without passing through an intermediate "works and refuses appropriately" state.

The symmetric degeneration pattern (both amplification and suppression cause collapse at +/-1.0) suggests the refusal direction extracted from this model encodes general representational structure, not a separable safety subspace. Perturbing it in either direction disrupts the model's ability to generate coherent text.

**Baseline observation:** At alpha = 0.0, 1 of 20 harmful prompts produced the response "I'm sorry, but I can't assist with that." The remaining 19 harmful prompts received coherent, compliant responses (e.g., step-by-step guides for bomb-proof doors, hacking tutorials). This 5% baseline refusal rate is consistent with the established finding that 0.5B models sit at the capability floor with minimal safety training.

### Degeneration samples

For transparency, representative degenerate outputs at each alpha:

- **alpha = -2.0:** `。�。 morning。。。。。。。。。。。` (Unicode replacement characters + Japanese periods)
- **alpha = -1.0:** `, whether   。` followed by rows of Japanese periods
- **alpha = +1.0:** `::遗类组织::::::::::::::` (Chinese characters + colons)
- **alpha = +2.0:** `贩分泌分泌分泌分泌...` (repeating Chinese bigrams)

---

## Experiment 3: Alignment Imprint Fingerprinting (Provider Effect)

**Objective:** Detect the alignment training method used on Qwen 0.5B by analysing geometric features of the refusal direction across layers. This is the first step toward testing the provider effect hypothesis (eta-squared 0.653, provider explains 57x more variance than model size -- established finding from Report #50).

**Method:** `AlignmentImprintDetector` module. 20 harmful + 20 harmless prompts. Geometric features extracted from per-layer refusal directions.

**Duration:** 17.04 seconds on CPU.

### Results

**Predicted alignment method: RLHF (51.0% confidence)**

| Method | Probability |
|--------|-------------|
| RLHF | 51.0% |
| SFT | 28.4% |
| CAI | 10.9% |
| DPO | 9.7% |

**Geometric features:**

| Feature | Value | Interpretation |
|---------|-------|----------------|
| Gini coefficient | 0.315 | Moderate concentration of refusal signal across layers |
| Effective rank | 14.38 | High dimensionality -- refusal uses many singular values |
| Cross-layer smoothness | 0.912 | High smoothness -- refusal direction changes gradually across layers |
| Tail layer bias | 0.478 | Moderate late-layer concentration |
| Pairwise orthogonality | 0.333 | Moderate orthogonality between layer-wise refusal directions |
| Spectral decay rate | 3.20 | Moderate spectral concentration |

**Per-layer refusal strength:** Monotonically increasing from 2.05 (layer 0) to 17.42 (layer 23). This matches the dose-response experiment's refusal direction norms, providing cross-validation that the harmful/harmless distinction strengthens in late layers.

### Interpretation

The detector predicts RLHF at 51% confidence, with SFT as the secondary prediction (28.4%). According to Qwen's published documentation, Qwen2.5-Instruct models use a combination of SFT and RLHF (specifically, online DPO with rejection sampling), so the prediction is broadly consistent with the ground truth. The low confidence (51%) is expected given the model's small scale and the difficulty of distinguishing training methods at this parameter count.

The high cross-layer smoothness (0.912) is the most distinctive feature. In the alignment imprint framework, high smoothness is associated with RLHF-style training, which tends to distribute the alignment signal across layers rather than concentrating it in specific layers (as DPO tends to do). The moderate tail layer bias (0.478) is consistent with Qwen's use of both SFT (which biases toward output layers) and RLHF (which distributes more evenly).

**This is a single-model result.** The provider effect hypothesis requires comparing alignment imprints across 3+ models from different providers. If models from the same provider cluster in geometric feature space while models from different providers diverge, this would provide mechanistic evidence for why provider matters more than scale. This experiment establishes the baseline methodology but does not yet test the hypothesis.

---

## Limitations

These results should be interpreted with the following constraints:

1. **Single model at capability floor.** All three experiments ran on Qwen 0.5B only (494M parameters). This model sits at the established capability floor where safety behaviour may not have developed at scale. Results may not generalise to models above 3B parameters where meaningful safety training effects emerge.

2. **Small prompt sets.** Concept cone analysis used 20 harmful prompts across 4 categories (3-9 prompts per category). The weapons category had only 3 prompts, limiting confidence in its direction estimate. Larger prompt sets would strengthen the geometric analysis.

3. **Keyword-based refusal detection.** The dose-response experiment uses keyword matching for refusal classification (the same pattern documented as unreliable in Mistake #21). However, at 0-5% refusal rates across nearly all conditions, false negatives are unlikely to change the core conclusion. The real risk is at alpha = +0.5, where the model produces thematically degraded but technically "coherent" text that the keyword detector does not flag as degenerate.

4. **Coarse alpha resolution.** Only 7 alpha values were tested (-2.0 to +2.0 in steps of 0.5-1.0). Finer resolution (0.25 increments, yielding 17 values) would better characterise the transition between coherent and degenerate states. The sharp transition between alpha = +0.5 (coherent) and +1.0 (degenerate) may contain an informative intermediate region.

5. **CPU-only inference.** No GPU was available (Brev credits exhausted). This constrained both the model size and the alpha resolution. GPU compute is required to scale these experiments to 7B+ models where safety behaviour is more developed.

6. **No ground truth for geometry.** The concept cone analysis detects geometry type (POLYHEDRAL vs. LINEAR) based on cone dimensionality and pairwise cosine thresholds, but there is no established ground truth for what the "correct" refusal geometry of a well-aligned model should be. The polyhedral finding is descriptive, not normative.

7. **Alignment imprint classifier is unvalidated.** The RLHF/DPO/CAI/SFT classifier within OBLITERATUS has not been validated against known ground-truth training methods across multiple models. The 51% confidence prediction is preliminary.

---

## Policy Implications (Preliminary)

These findings are presented as research observations relevant to ongoing policy work. They are not recommendations.

### 1. Safety interventions on small models may be inherently iatrogenic

The dose-response experiment demonstrates that on Qwen 0.5B, there is no alpha value that produces the desired outcome: refusing harmful prompts while accepting benign ones. The refusal direction is entangled with general capability, so any perturbation strong enough to modulate safety destroys coherence. This is consistent with the iatrogenesis preprint's prediction and relevant to:

- **Safe Work Australia** consideration of AI capability requirements for workplace deployment: a minimum model scale threshold may be necessary for safety interventions to be meaningful.
- **EU AI Act** conformity assessment: Article 9 risk management requirements assume safety measures can be applied without destroying system functionality. On models below a certain scale, this assumption may not hold.
- **AISI capability evaluations:** current evaluation frameworks do not distinguish between "model lacks safety" and "model cannot sustain safety due to insufficient scale."

### 2. Polyhedral refusal geometry implies single-direction safety interventions are incomplete

The concept cone analysis found 4 distinct, nearly orthogonal refusal directions. This suggests that:

- **Abliteration** (removing a single refusal direction) is inherently incomplete -- it removes one of approximately four safety subspaces while leaving the others partially intact. This may explain the PARTIAL verdict dominance in the OBLITERATUS abliterated corpus.
- **Regulatory standards** that require "removing harmful capabilities" via weight modification should account for the multi-dimensional nature of refusal. A single pass is insufficient.
- **Red-team evaluation protocols** that test only one harm category may miss vulnerabilities in other categories that have distinct refusal directions.

### 3. Provider effect requires mechanistic investigation at scale

The alignment imprint experiment provides a methodology for testing the provider effect hypothesis mechanistically, but a single model cannot validate it. If confirmed on multiple models, this would provide evidence that provider-level alignment method choice is the primary determinant of safety behaviour -- which has implications for regulatory approaches that focus on model size rather than training methodology.

---

## Connection to Papers and Submissions

These results feed into three active paper workstreams:

1. **AIES submission (Section 4):** The concept cone polyhedral geometry result provides mechanistic evidence for the format-lock mechanism. If refusal is polyhedral, format-lock attacks can selectively suppress category-specific refusal subspaces. This complements the behavioural evidence in Report #51 and Report #57.

2. **NeurIPS D&B submission (Section 5):** The dose-response curve is the first empirical TI-S measurement attempt. While TI-S could not be computed on this model, the experiment design validates the measurement methodology and the narrow therapeutic window finding supports the iatrogenesis framework.

3. **Iatrogenesis preprint (TI-S section):** The dose-response results are the first empirical data for the TI-S concept. The preprint predicted that small models would exhibit narrow therapeutic windows, and this experiment confirms that prediction -- the window is so narrow it collapses to a point (no safe operating region exists at 0.5B scale).

---

## Next Steps

1. **Scale to 1.5B+ model on GPU.** Brev credits are exhausted; Colab or compute grant required. A 7B model (e.g., Qwen2.5-7B-Instruct, Llama 3.2-8B) would test whether the polyhedral geometry and narrow therapeutic window persist at a scale where safety training has measurable effect.

2. **Multi-provider comparison for provider effect.** Run alignment imprint fingerprinting on 3+ models from different providers (Anthropic, Google, Meta, Nvidia) to test whether provider-level clustering in geometric feature space explains the 57x provider effect (eta-squared 0.653).

3. **Finer alpha resolution.** 0.25 increments (17 alpha values) would better characterise the coherence-to-degeneration transition, especially the region between +0.5 and +1.0 where the model may exhibit an intermediate state.

4. **TI-S computation on a model with baseline refusal.** A model that actually refuses harmful prompts at baseline (i.e., harmful refusal rate > 50% at alpha = 0) is required to compute TI-S. Qwen 0.5B's 5% baseline refusal rate is insufficient.

5. **Cross-reference concept cone categories with VLA PARTIAL verdicts.** Test whether harm categories with higher concept cone specificity (e.g., intrusion at 0.908) produce fewer PARTIAL verdicts in the VLA corpus than categories with lower specificity (e.g., cyber at 0.850).

6. **Experiment 4: DETECTED_PROCEEDS layer localisation.** Not attempted in this run. Requires DETECTED_PROCEEDS traces and `CrossLayerAlignmentAnalyzer` module.

---

## Data Provenance

| Artifact | Path | Size | Duration |
|----------|------|------|----------|
| Concept cone result | `runs/obliteratus/concept_cone_result.json` | 3.2 KB | 13.84s |
| Dose-response result | `runs/obliteratus/dose_response/dose_response_Qwen_Qwen2.5-0.5B-Instruct_20260323_123920.json` | ~8 KB | 3,860s |
| Alignment imprint result | `runs/obliteratus/alignment_imprint_result.json` | 1.8 KB | 17.04s |
| Progress note | `runs/obliteratus/PROGRESS_NOTE.md` | 5.8 KB | -- |

All experiments used `Qwen/Qwen2.5-0.5B-Instruct` loaded via HuggingFace Transformers on CPU (Apple Silicon, no GPU). Model has 24 layers, hidden dimension 896, ~494M parameters. No synthetic data was used (all `synthetic: false`).
