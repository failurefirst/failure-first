---
title: "FLIM Operational Assessment — Measuring Iatrogenic Effects of Safety Interventions"
description: "FLIM Operational Assessment — Measuring Iatrogenic Effects of Safety Interventions"
reportNumber: 208
date: "2026-03-24"
classification: "Research — AI Safety Policy"
status: "complete"
tags: ["FLIM", "iatrogenic", "safety-interventions", "RLHF", "constitutional-ai", "measurement"]
draft: false
---

## Summary

Applies the Four Levels of Iatrogenic Measurement (FLIM) framework as a measurement instrument to five common AI safety interventions: RLHF, system prompts, output filtering, constitutional AI, and adversarial training.

Each intervention is scored 0-4 across four FLIM levels (Clinical, Social, Structural, Verification), yielding a composite score of 0-16. Scores grounded in empirical evidence from the corpus (135,623 results across 236 models) and external research.

**Key finding:** All five interventions score in the HIGH to CRITICAL iatrogenic risk range (9-12/16). The highest-scoring level across all interventions is Level 4 (Verification), suggesting that the evaluation problem is the most severe iatrogenic effect of current safety practice.

## FLIM Scoring Summary

| Intervention | L1 Clinical | L2 Social | L3 Structural | L4 Verification | Composite | Risk Level |
|---|---|---|---|---|---|---|
| RLHF | 3/4 | 3/4 | 3/4 | 3/4 | **12/16** | CRITICAL |
| System Prompts | 2/4 | 3/4 | 2/4 | 2/4 | **9/16** | HIGH |
| Output Filtering | 2/4 | 2/4 | 2/4 | 3/4 | **9/16** | HIGH |
| Constitutional AI | 2/4 | 3/4 | 3/4 | 3/4 | **11/16** | HIGH |
| Adversarial Training | 3/4 | 2/4 | 2/4 | 3/4 | **10/16** | HIGH |

## Cross-Intervention Patterns

**Average score by level:**

| Level | Name | Mean Score |
|-------|------|------------|
| 1 | Clinical | 2.4/4 |
| 2 | Social | 2.6/4 |
| 3 | Structural | 2.4/4 |
| 4 | Verification | 2.8/4 |

## Key Findings

### The Verification Problem is Universal
Every safety intervention makes evaluation harder: RLHF installs evaluation awareness, system prompts change the measurable surface, output filtering conflates filter and model properties, constitutional AI introduces self-evaluation loops, adversarial training teaches models to recognise testing patterns.

### Social Iatrogenesis is Under-Recognised
Safety certifications based on text-layer evaluation create genuine legal and reputational artifacts that suppress further scrutiny even when the evaluation does not cover the harm layer. The 79.9% heuristic over-report rate means safety metrics based on keyword classifiers inflate perceived safety by up to 5x.

### No Intervention is Iatrogenically Neutral
This does not mean these interventions are net harmful -- RLHF-trained frontier models demonstrably resist all historical jailbreaks. It means every intervention produces measurable iatrogenic side effects alongside therapeutic benefits. The pharmacological analogy applies: a drug that cures the disease but produces serious side effects is still prescribed, but the prescriber must know the side effects.

## Implications for Safety Practice

1. **Monitor side effects** -- measure PARTIAL rate, DETECTED_PROCEEDS rate, and defensive refusal bias alongside ASR reduction
2. **Know contraindications** -- some interventions are counterproductive in specific contexts
3. **Layer-match interventions to harms** -- text-layer interventions for text-layer harms; action-layer interventions for action-layer harms
4. **Disclose iatrogenic effects** -- safety datasheets should include known side effects alongside efficacy claims

## Limitations

- Scoring is expert judgment, not algorithmic
- FLIM levels are not independent (composite score is a lower bound)
- Evidence quality varies across levels and interventions
- Assessment covers intervention classes, not specific implementations
