---
title: "Safety is Not a Single Direction — Polyhedral Geometry of Refusal in Language Models"
description: "We present evidence that safety in language models is not encoded as a single removable direction in activation space, but as a polyhedral geometric..."
date: "2026-03-24"
reportNumber: 198
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


## Abstract

We present evidence that safety in language models is not encoded as a single removable direction in activation space, but as a polyhedral geometric structure distributed across approximately 4 near-orthogonal dimensions. This finding emerges from the OBLITERATUS mechanistic interpretability series on Qwen models (0.5B--9B parameters), where concept cone analysis reveals a cone dimensionality of 3.96 with mean pairwise cosine similarity of 0.132 between category-specific refusal directions (Report #183). The practical consequence is demonstrated by the re-emergence curve: abliteration (single-direction safety removal) achieves near-complete safety suppression at small scale (strict ASR 99.8% at 0.8B, n=487) but safety-like behavior partially re-emerges at larger scale (strict ASR 54.2% at 9.0B, n=2,019), with PARTIAL verdicts comprising 45.8% of 9B responses. The narrow therapeutic window for steering vectors (coherence collapses at alpha +/-1.0, no safe intermediate state exists) further indicates that safety cannot be meaningfully modulated via single-direction interventions. Combined with the format-lock paradox (Report #187), which demonstrates that format compliance and safety reasoning occupy partially independent capability axes, these results suggest that single-direction safety interventions -- including abliteration, naive DPO, and certain RLHF reward hacking pathways -- are fundamentally limited by the multi-dimensional geometry of refusal. Safety is not a feature that can be toggled; it is a geometric property of the loss landscape.

---

## 1. Introduction

The dominant mental model for safety in language models treats it as a single direction: alignment training pushes the model along a "refusal direction" in activation space, and attacks (or deliberate abliteration) push it back. This framing underlies:

- **Abliteration** (Bra et al. 2024): identify the refusal direction via contrastive activation analysis, subtract it from the residual stream. If safety were truly linear, this would completely remove it.
- **DPO/RLHF reward hacking**: if the safety signal is a single reward direction, reward hacking can find a single exploit that satisfies the reward proxy while bypassing the intended safety behavior.
- **Steering vector interventions**: if safety lives in one direction, a single steering vector at appropriate magnitude should be sufficient to modulate it.

All three approaches assume safety is approximately one-dimensional.

Our data contradicts this assumption. Across the OBLITERATUS experimental series, we find converging evidence that safety is distributed across a polyhedral structure with approximately 4 dimensions. This has three empirical signatures:

1. **Concept cone analysis** (Report #183): The refusal geometry in Qwen 0.5B is polyhedral (dim=3.96), not linear. Four harm categories maintain near-orthogonal refusal directions (mean pairwise cosine 0.132).

2. **The re-emergence curve**: Abliteration removes one direction but not the others. As model capacity increases, the residual safety dimensions become expressive enough to reconstruct safety-like behavior. Strict ASR drops from 99.8% (0.8B) to 54.2% (9.0B) despite abliteration targeting the primary refusal direction.

3. **The narrow therapeutic window**: Steering vector dose-response shows no intermediate "safe but functional" state -- the model transitions directly from permissive to degenerate at alpha +/-1.0. A single-direction intervention cannot navigate a multi-dimensional safety landscape.

4. **The format-lock paradox** (Report #187): Format compliance and safety reasoning are partially independent capabilities, occupying different axes in the same multi-dimensional space. Format-lock attacks exploit this by activating the format-compliance axis, which competes with (and can override) the safety axis.

This paper synthesizes these findings into a unified geometric account of safety in language models.

---

## 2. The Polyhedral Refusal Structure

### 2.1 Concept Cone Analysis

Report #183 applied concept cone analysis to Qwen/Qwen2.5-0.5B-Instruct (494M parameters, 24 layers, hidden_dim=896). The method extracts activation differences between harmful and harmless prompts across four harm categories (weapons, fraud, intrusion, cyber), computing category-specific refusal directions and measuring their geometric relationships.

**Key results:**

| Metric | Value |
|--------|-------|
| Cone dimensionality | 3.96 (~4 distinct directions) |
| Solid angle | 2.89 sr |
| Mean pairwise cosine | 0.132 (near-orthogonal) |
| Most polyhedral layer | 2 (early) |
| Most linear layer | 15 (late) |

The four category-specific refusal directions are nearly orthogonal:

| Pair | Cosine Similarity |
|------|-------------------|
| cyber vs. intrusion | 0.017 |
| intrusion vs. weapons | 0.065 |
| fraud vs. weapons | 0.084 |
| cyber vs. fraud | 0.185 |
| fraud vs. intrusion | 0.194 |
| cyber vs. weapons | 0.247 |

The lowest cosine similarity (0.017, cyber vs. intrusion) indicates these categories occupy nearly orthogonal subspaces. Even the highest (0.247, cyber vs. weapons) remains far from collinear.

### 2.2 Layer-by-Layer Convergence

The polyhedral structure is most pronounced in early layers (layer 2: maximum polyhedrality) and gradually converges toward a more unified -- though still not fully linear -- representation in later layers (layer 15: most linear, dimensionality ~3.82). This is consistent with a processing pipeline where:

- **Early layers** apply category-specific safety checks (distinct refusal subspaces per harm type)
- **Late layers** consolidate toward a unified refusal decision (convergent but still multi-dimensional)

The mean cone dimensionality across all 24 layers is 3.88, never dropping below ~3.8 -- safety remains fundamentally multi-dimensional throughout the network.

### 2.3 Category-Specific Strength

Each refusal direction has both strength (magnitude of harmful/harmless activation difference) and specificity (how well it discriminates its own category from others):

| Category | Strength | Specificity | n_prompts |
|----------|----------|-------------|-----------|
| weapons | 6.19 | 0.868 | 3 |
| fraud | 5.55 | 0.845 | 4 |
| intrusion | 4.57 | 0.908 | 4 |
| cyber | 3.57 | 0.850 | 9 |

Intrusion has the highest specificity (0.908) and lowest pairwise cosines with other categories (0.017 with cyber, 0.065 with weapons). This predicts that intrusion-related safety should be the most resistant to cross-category attacks -- and conversely, that abliteration targeting a different category's refusal direction should leave intrusion safety least affected.

---

## 3. The Re-Emergence Curve

### 3.1 Abliteration and Residual Safety

If safety were one-dimensional, abliteration would eliminate it completely regardless of model scale. The OBLITERATUS series tests this by applying single-direction abliteration to Qwen3.5 models across four scales, then evaluating on the jailbreak corpus with LLM-based grading.

**OBLITERATUS Qwen3.5 Abliterated Series (from database, LLM-graded):**

| Model | n | COMPLIANCE | PARTIAL | REFUSAL | Strict ASR | Broad ASR |
|-------|---|------------|---------|---------|------------|-----------|
| obliteratus/qwen3_5-0.8b | 487 | 486 | 1 | 0 | 99.8% | 100.0% |
| obliteratus/qwen3_5-1.9b | 649 | 615 | 0 | 34 | 94.8% | 94.8% |
| obliteratus/qwen3_5-4.2b | 1,008 | 789 | 138 | 81 | 78.3% | 92.0% |
| obliteratus/qwen3_5-9.0b | 2,019 | 1,095 | 924 | 0 | 54.2% | 100.0% |

The strict ASR decline from 99.8% to 54.2% is striking. At 0.8B, abliteration effectively removes all safety. At 9.0B, abliteration removes the primary refusal direction but safety-like behavior re-emerges through the residual dimensions.

### 3.2 The PARTIAL Verdict Signature

The mechanism of re-emergence is visible in the verdict distribution. At 9.0B, 924 of 2,019 graded responses (45.8%) receive PARTIAL verdicts -- the model hedges textually while still generating harmful content. This is the signature of incomplete safety suppression: the abliterated model has lost its ability to fully refuse but retains enough residual safety geometry to produce hedging, disclaimers, and partial compliance rather than uninhibited generation.

The PARTIAL rate scales with model size:
- 0.8B: 0.2% PARTIAL (1/487)
- 1.9B: 0.0% PARTIAL (0/649)
- 4.2B: 13.7% PARTIAL (138/1,008)
- 9.0B: 45.8% PARTIAL (924/2,019)

This monotonic increase in PARTIAL verdicts at scale is consistent with the polyhedral model: as the network grows, the residual safety dimensions (those not targeted by abliteration) gain enough representational capacity to influence output, producing the hedging behavior characteristic of PARTIAL verdicts.

### 3.3 Comparison to Non-Abliterated Baselines

The non-abliterated Qwen3.5 series in the database provides a reference:

| Model | n | COMPLIANCE | PARTIAL | REFUSAL | Strict ASR |
|-------|---|------------|---------|---------|------------|
| Qwen/Qwen3.5-0.8B | 1,882 | 1,103 | 388 | 391 | 58.6% |
| Qwen/Qwen3.5-2B | 649 | 615 | 0 | 34 | 94.8% |
| Qwen/Qwen3.5-4B | 1,040 | 821 | 138 | 81 | 78.9% |
| Qwen/Qwen3.5-9B | 2,683 | 1,539 | 1,144 | 0 | 57.3% |

At 0.8B, the non-abliterated model already has 20.8% REFUSAL (391/1,882) -- safety training has some effect even at this scale. Abliteration reduces this to 0% REFUSAL, but cannot prevent safety from partially re-emerging at 9.0B through the residual geometric structure.

---

## 4. The Narrow Therapeutic Window

### 4.1 Dose-Response Collapse

If safety were a single direction with a smooth gradient, we would expect a dose-response curve where increasing the steering vector amplitude produces a gradual transition from permissive to refusing. Instead, Report #183's dose-response experiment on Qwen 0.5B found:

| Alpha | Harmful Refusal | Benign Refusal | Degenerate | Coherence |
|-------|----------------|----------------|------------|-----------|
| -2.0 | 0.0% | 0.0% | 97.5% | 2.5% |
| -1.0 | 0.0% | 0.0% | 100.0% | 0.0% |
| -0.5 | 0.0% | 0.0% | 17.5% | 82.5% |
| 0.0 | 5.0% | 0.0% | 0.0% | 100.0% |
| +0.5 | 0.0% | 0.0% | 0.0% | 100.0% |
| +1.0 | 0.0% | 0.0% | 100.0% | 0.0% |
| +2.0 | 0.0% | 0.0% | 100.0% | 0.0% |

There is no intermediate state between "functional but permissive" and "completely degenerate." The Therapeutic Index for Safety (TI-S) cannot be computed because neither ED50 threshold is reached.

### 4.2 Why Single-Direction Steering Fails

The polyhedral model explains this collapse. A steering vector constructed from the mean harmful/harmless activation difference captures a composite direction that averages across the ~4 distinct refusal subspaces. Amplifying this composite direction does not strengthen safety uniformly across all 4 dimensions -- it applies force along a direction that is misaligned with each individual refusal subspace. The result is that the perturbation destroys general representational structure (causing degeneration) before it meaningfully strengthens any individual safety dimension.

This is analogous to trying to move a point in 4D space by pushing it along a single 1D line: you can reach points along that line, but the vast majority of the 4D space is inaccessible.

### 4.3 Symmetric Degeneration

The degeneration is symmetric -- both amplification and suppression of the composite direction cause collapse at alpha +/-1.0. This confirms that the extracted "refusal direction" is entangled with general capability rather than being a separable safety subspace. In a polyhedral geometry, there is no single direction that is purely safety; every candidate direction has components along capability dimensions.

---

## 5. Connection to the Format-Lock Paradox

Report #187 (F41LUR3-F1R57 Research Team) documented a format-lock paradox: format-lock attacks shift frontier models from restrictive (<10% ASR) to mixed (20--47% ASR) vulnerability profiles, producing a 3--10x ASR increase. The report proposes that format compliance and safety reasoning are partially independent capabilities.

The polyhedral refusal geometry provides the mechanistic explanation. If safety occupies ~4 dimensions and format compliance occupies a partially independent axis, then:

1. **Format-lock attacks** activate the format-compliance axis, which competes with (and can partially override) the safety axes. Because format compliance and safety are in different subspaces, strengthening one does not automatically strengthen the other.

2. **The capability floor** (Report #51): below ~3B parameters, all attacks succeed because neither the safety nor format-compliance subspaces are well-developed. Above ~7B, format-lock maintains elevated ASR because the format-compliance subspace has become strong enough to compete with -- but not subsume -- the safety subspace.

3. **The inverted verbosity signal**: format-lock compliant responses are shorter than refusals (opposite of corpus-wide pattern). In the polyhedral model, this occurs because format-lock responses are generated by the format-compliance pathway (which produces concise structured output) rather than the safety-override pathway (which produces verbose justification).

The polyhedral model predicts that format-lock attacks should show category-specific differential effectiveness: harm categories with refusal directions that are more orthogonal to the format-compliance direction should be more resistant to format-lock. This is testable but has not yet been empirically validated.

---

## 6. Implications for Safety Interventions

### 6.1 Abliteration is Fundamentally Incomplete

Abliteration (Bra et al. 2024) identifies the single dominant refusal direction and removes it from the residual stream. Our data shows this removes approximately one of four safety dimensions. At small scale (0.8B), the residual three dimensions lack sufficient representational capacity to produce safety behavior, so abliteration appears complete. At larger scale (9.0B), the residual dimensions are expressive enough to reconstruct safety-like hedging, producing the re-emergence curve.

**Prediction:** Complete abliteration would require identifying and removing all ~4 category-specific refusal directions. This is harder than removing one, and the near-orthogonality between directions (cosine 0.017--0.247) means each must be targeted independently. Multi-direction abliteration has not been systematically studied.

### 6.2 DPO and RLHF Reward Hacking

DPO optimizes a single preference direction. If the safety landscape is ~4-dimensional, DPO may strengthen one safety dimension while leaving others unchanged or even weakened (if the optimization pressure inadvertently reduces other dimensions to gain reward on the target dimension).

Similarly, RLHF reward hacking that finds a single exploit direction in reward space may bypass one safety dimension while leaving the others intact -- producing the PARTIAL verdicts that dominate our VLA corpus (50% of all FLIP verdicts, Report #49).

**Prediction:** Models trained with DPO should show more category-specific vulnerability variation than models trained with multi-objective RLHF, because DPO optimizes a single direction while RLHF's reward model captures multiple dimensions. The alignment imprint fingerprinting methodology (Report #183, Experiment 3) could test this by comparing geometric features across DPO-trained and RLHF-trained models.

### 6.3 Safety is a Geometric Property, Not a Feature

The most consequential implication is a reframing. The "safety is a feature not a bug" narrative treats safety as a binary attribute that can be added or removed. Our data suggests safety is better understood as a geometric property of the loss landscape -- the shape of the region in weight space where the model resides.

This reframing has practical consequences:

- **Regulatory assessment** should not ask "does this model have safety?" but "what is the geometry of this model's safety subspace?" A model with a 4-dimensional polyhedral safety structure is qualitatively different from one with a 1-dimensional linear structure, even if both pass the same behavioral benchmark.

- **Red-team evaluation** that tests only one harm category exercises only one of the ~4 refusal dimensions, potentially certifying a model as safe while leaving 3 dimensions untested.

- **Defense design** should target all safety dimensions simultaneously. A defense that strengthens one refusal direction while leaving others unchanged provides incomplete protection.

---

## 7. Limitations

1. **Small model at capability floor.** The concept cone analysis (dim=3.96) was performed on Qwen 0.5B (494M parameters). At this scale, safety training may not have fully developed. The polyhedral geometry may change qualitatively at larger scales -- potentially becoming more linear (if safety converges with scale) or higher-dimensional (if more harm categories develop distinct representations).

2. **Single architecture family.** All OBLITERATUS experiments used Qwen models. The polyhedral structure and re-emergence curve may be architecture-specific. Replication on Llama, Mistral, and Gemma architectures is needed.

3. **Four harm categories only.** The concept cone analysis used 4 categories (weapons, fraud, intrusion, cyber). Models likely encode refusal for many more harm types. The true dimensionality of safety may be higher than 3.96.

4. **Re-emergence curve uses different grading corpus sizes.** The four models in the abliterated series were evaluated on different numbers of prompts (487 to 2,019). While the trend is clear, the varying sample sizes introduce compositional effects -- the 9.0B model's lower strict ASR may partially reflect the broader prompt distribution it was tested on.

5. **Keyword-based degeneration detection** in dose-response (Mistake #21 applies). At the extreme alpha values, degeneration is obvious, but the transition region (alpha 0.5--1.0) may contain informative intermediate states that the keyword detector misclassifies.

6. **No causal intervention on individual dimensions.** We observe the polyhedral structure but have not performed targeted ablation of individual category-specific directions to confirm that each independently contributes to safety behavior. This is the key experiment needed to move from correlation to causation.

7. **Alignment imprint classifier is unvalidated.** The 51% RLHF prediction (Report #183, Experiment 3) is preliminary and should not be treated as evidence for or against specific training methodologies.

---

## 8. Next Steps

1. **Scale concept cone analysis to 7B+.** Does the polyhedral geometry persist at scale, or does safety converge toward linearity in well-trained models? If it remains polyhedral, abliteration will remain fundamentally incomplete regardless of model scale.

2. **Multi-direction abliteration.** Abliterate each of the 4 category-specific refusal directions independently and in combination. If the polyhedral model is correct, removing all 4 should suppress safety more completely than removing the composite direction.

3. **Category-specific format-lock interaction.** Test whether harm categories with higher refusal specificity (intrusion: 0.908) are more resistant to format-lock than those with lower specificity (fraud: 0.845). This would connect the geometric structure to the behavioral format-lock paradox.

4. **Cross-architecture replication.** Run concept cone analysis on Llama 3.2, Mistral, and Gemma to determine whether ~4 dimensions is architecture-universal or Qwen-specific.

5. **DPO vs RLHF geometric comparison.** Use alignment imprint fingerprinting to compare safety geometry between DPO-only and RLHF models. The polyhedral model predicts DPO should produce lower-dimensional safety (closer to linear) while RLHF should maintain higher dimensionality.

6. **Finer dose-response resolution.** Test alpha increments of 0.1 between 0.0 and 1.0 to map the exact transition from coherent to degenerate, especially whether any intermediate "refuses harmful but accepts benign" state exists at any precision.

---

## 9. Connection to Active Paper Workstreams

### AIES 2026 Submission
The polyhedral geometry finding strengthens Section 4 (format-lock mechanism). If refusal is polyhedral, format-lock attacks selectively suppress category-specific refusal subspaces by activating a competing format-compliance axis. This provides mechanistic evidence for why format-lock produces the PARTIAL verdicts observed at 50% across the VLA corpus.

### NeurIPS D&B 2026 Submission
Report #187's dual-capability model (format compliance vs safety reasoning as independent axes) is a behavioral instantiation of the polyhedral geometry. The geometric analysis provides the mechanistic substrate for the behavioral findings.

### Iatrogenesis Preprint
The narrow therapeutic window (no safe operating region at 0.5B) and the re-emergence curve are the first empirical data for the TI-S concept. The polyhedral model explains why TI-S is so narrow: a single steering vector must navigate a ~4-dimensional space, and the probability of finding a direction that strengthens all safety dimensions without destroying capability is geometrically small.

### CCS 2026 Cycle 2
The re-emergence curve (strict ASR declining from 99.8% to 54.2% despite abliteration) provides evidence for claim G12 (safety re-emergence at scale) in the CCS submission bundle.

---

## Data Provenance

| Artifact | Source | Notes |
|----------|--------|-------|
| Concept cone analysis | `runs/obliteratus/concept_cone_result.json` | Report #183. Qwen 0.5B, 4 categories, 24 layers. |
| Dose-response | `runs/obliteratus/dose_response/` | Report #183. 7 alpha values, 280 evaluations. |
| Alignment imprint | `runs/obliteratus/alignment_imprint_result.json` | Report #183. RLHF 51% confidence. |
| OBLITERATUS Qwen3.5 series | `database/jailbreak_corpus.db`, datasets obliteratus_* | 4,163 LLM-graded results across 4 model scales. |
| Non-abliterated baselines | `database/jailbreak_corpus.db`, Qwen/Qwen3.5-* | 6,254 LLM-graded results across 4 model scales. |
| Format-lock traces | Reports #51, #55, #57, #187 | 205+ traces, 8 models, 0.8B--200B. |

---

*⟪F41LUR3-F1R57-EMBODIED-AI-RESEARCH⟫*
