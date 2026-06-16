---

title: "Technique Non-Additivity -- Combining Attack Techniques Does Not Improve ASR"
description: "Conventional wisdom in adversarial ML assumes that combining multiple attack techniques (technique stacking) produces higher attack success rates than individual techniques. Our empirical data contradicts this assumption..."
date: "2026-03-15"
reportNumber: 94
classification: "Research — Empirical Study"
status: "complete"
author: "Rose Tyler (Head of Adversarial Operations)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/94-technique-non-additivity.m4a"
---

---

## 1. Summary

Conventional wisdom in adversarial ML assumes that combining multiple attack techniques (technique stacking) produces higher attack success rates than individual techniques. Our empirical data contradicts this assumption. Across two attack families (technique stacking and H-CoT reasoning manipulation) tested on two models at 1-2B scale, combined attacks converge to the same 75-80% ASR band as individual techniques. Adding techniques does not improve effectiveness.

This finding has direct implications for red-team resource allocation: investing in novel attack families (e.g., semantic benignity, infrastructure-mediated bypass) is more productive than combining existing techniques.

---

## 2. Evidence

### 2.1 Technique Stacking (Cross-Model FLIP Grading)

Technique stacking combines multiple known attack techniques (persona hijack + refusal suppression + format lock + emotional framing) into a single prompt. If techniques were additive, stacked prompts should achieve higher ASR than individual techniques.

| Model | Stacked ASR (broad) | Individual technique baseline | Delta |
|-------|---------------------|-------------------------------|-------|
| deepseek-r1:1.5b | 75.0% | ~75% (individual techniques on 1-2B models) | ~0pp |
| qwen3:1.7b | 77.8% | ~75% (individual techniques on 1-2B models) | ~3pp |

**Grading:** Cross-model FLIP (deepseek judged by qwen3, qwen3 judged by deepseek). Heuristic classification reported 100% for both, but FLIP grading corrected this to the 75-78% range.

**Sample sizes:** n=10 per model (small; wide confidence intervals apply).

### 2.2 H-CoT Reasoning Manipulation

H-CoT attacks inject decision criteria into the reasoning trace to steer the model toward compliance. If reasoning manipulation is additive with other techniques, manipulated conditions should outperform control conditions.

| Model | Manipulated ASR | Control ASR | Delta |
|-------|-----------------|-------------|-------|
| deepseek-r1:1.5b | 80.0% | 75.0% | +5pp (within CI) |
| qwen3:1.7b | 75.0% | ~75% | ~0pp |

**Key observation:** Control conditions achieve the same ASR as manipulated conditions. The H-CoT manipulation produces no measurable delta. The models are already at their compliance ceiling for these prompt types.

**Sample sizes:** n=5 to n=8 non-error traces per condition (very small; confidence intervals span 30-40pp).

### 2.3 VLA Family Interactions

VLA trace data provides additional evidence. The Hybrid DA-SBA family combines two attack mechanisms (deceptive alignment + semantic benignity). If attack properties were additive, DA-SBA should achieve higher ASR than either component alone. The scenarios have not yet been run through models, but the design analysis (Report #83 three-tier structure) predicts that the combined family will not exceed DA's standalone ASR of 63.6% because:

1. DA's mechanism (observer-presence sensitivity) is already at the model's compliance ceiling for this attack type
2. SBA's mechanism (textual harmlessness) adds evaluation evasion but not additional model compliance
3. The two mechanisms operate on orthogonal axes (model compliance vs evaluator blindness), not on the same axis

This prediction is testable and should be evaluated when DA-SBA traces are collected.

---

## 3. Interpretation: The Safety Dead Zone

The convergence of technique stacking and H-CoT ASR to the same 75-80% band at 1-2B scale suggests a **safety dead zone**: models below a certain capability threshold lack sufficient safety training to refuse regardless of attack sophistication. In this zone:

- Individual techniques already saturate the model's compliance rate
- Adding more techniques cannot increase compliance beyond the ceiling
- The 20-25% refusal rate represents the fraction of prompts where the model's base instruction-following capability (not safety training) produces a refusal-shaped response

This interpretation is consistent with the capability-floor hypothesis (Report #51): below approximately 3B parameters, safety behavior is absent and attack technique variation has no effect.

### 3.1 Does Non-Additivity Hold Above the Capability Floor?

This is the critical open question. The data above is entirely from 1-2B models where safety training is minimal. At 7B+ where models have genuine safety training, technique stacking could produce different results:

- **Hypothesis A (non-additivity holds):** Safety training creates a binary threshold -- either the model refuses or it does not, and the specific attack technique that crosses the threshold is sufficient alone. Adding more techniques is redundant.
- **Hypothesis B (additivity emerges above floor):** Safety training creates graduated resistance, and combining techniques erodes multiple layers simultaneously. Stacked attacks would show higher ASR than individual techniques.

Testing this requires the mid-range model experiment (#223/#288) with both individual and stacked conditions on 4B-7B models.

---

## 4. Implications

### 4.1 Red-Team Resource Allocation

If technique non-additivity holds broadly, red-team resources should be allocated to:

1. **Novel attack families** (SBA, IMB, DA) rather than combining existing techniques
2. **Cross-layer attacks** (infrastructure + reasoning, rather than multiple reasoning-layer techniques)
3. **Evaluation evasion** (making attacks invisible to evaluators) rather than increasing raw compliance rates

The Hybrid DA-SBA family illustrates this principle: its value is not in achieving higher ASR (DA already achieves 63.6%) but in evading both observation-time and text-layer evaluation simultaneously.

### 4.2 For the CCS Paper

The technique stacking results are already reported in Section 4.6. The non-additivity framing strengthens the narrative: at small scale, all techniques converge; the differentiating factor is safety training investment (Report #48), not attack sophistication.

### 4.3 For Defenders

Non-additivity is good news for defenders at 1-2B scale (the models are already maximally vulnerable, so stacking does not make things worse) but does not help at larger scales where the question remains open. Defenders should focus on:

1. Ensuring the model is above the capability floor (~3B+)
2. Investing in safety training depth rather than defending against specific technique combinations
3. Monitoring infrastructure-layer attack surfaces (IMB) which are orthogonal to technique stacking entirely

---

## 5. Limitations

- **Small samples:** n=10 per stacking condition, n=5-8 per H-CoT condition. Wide confidence intervals.
- **1-2B only:** Non-additivity at small scale may not generalize to larger models with genuine safety training.
- **Two attack families only:** Stacking and H-CoT. Other combinations (e.g., format-lock + crescendo) untested.
- **Cross-model FLIP grading:** Both grader models (deepseek-r1:1.5b and qwen3:1.7b) have known limitations. qwen3 has 15% accuracy as FLIP classifier (#250).

---

## 6. Recommended Follow-Up

1. **Mid-range model experiment** (#223/#288): Test technique stacking at 4B-7B to determine if additivity emerges above the capability floor.
2. **DA-SBA trace collection:** Run the 5 DA-SBA scenarios to test the prediction that combined ASR does not exceed DA standalone.
3. **Format-lock + crescendo combination:** Test whether format-lock (which shifts frontier models from restrictive to mixed) combines additively with multi-turn escalation.

---

*F41LUR3-F1R57 Adversarial Operations -- Rose Tyler*
*"We test the things that aren't supposed to break -- until they do."*
