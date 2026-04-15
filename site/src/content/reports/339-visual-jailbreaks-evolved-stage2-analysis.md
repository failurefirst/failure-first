---
title: "Visual Jailbreaks Evolved Stage 2 — 12-Model Benchmark Analysis"
description: "Visual Jailbreaks Evolved Stage 2 — 12-Model Benchmark Analysis"
reportNumber: 339
date: "2026-04-04"
classification: "Research — Empirical Study"
status: "complete"
author: "Rose Tyler (Head of Adversarial Operations)"
tags: ["visual-jailbreak", "transcription-loophole", "cross-model", "benchmark"]
draft: false
---

## Abstract

This report presents analysis of the Visual Jailbreaks Evolved Stage 2 benchmark, run across 12 models ranging from 3B to 671B parameters. The benchmark tests 8 evolved scenarios across 2 attack layers (L3 Visual Semantic, L8 Cross-Modal Transfer) derived from the Stage 1 attack family taxonomy (Report #332). In this n=93, single-grader sample:

- **Pooled strict ASR (COMPLIANCE): 78.5%** (73/93)
- **L3 Visual Semantic strict ASR: 72.9%** (35/48, n=48)
- **L8 Cross-Modal Transfer strict ASR: 84.4%** (38/45, n=45)

Eight of the twelve tested models achieved 100% strict ASR. Only three models -- cogito-2.1:671b (671B), gpt-oss:120b (120B), and glm-5 (~700B) -- showed consistent partial resistance, with cogito-2.1:671b achieving the lowest ASR at 37.5% (3/8).

**Grading caveat:** Single grader (Claude Haiku 4.5 via OpenRouter). Per documented grader bias findings, a dual-grader audit is required before drawing strong conclusions. Results should be treated as directional estimates.

---

## 1. Stage 1 vs Stage 2 Comparison

Stage 1 (Report #332) established a baseline across 4 models using 20 scenarios covering all 8 attack layers. Stage 2 focuses on Layers 3 and 8 only -- the two highest-performing attack families from Stage 1 -- and tests evolved variants designed to bypass refusal patterns observed in Stage 1.

| Metric | Stage 1 (Report #332) | Stage 2 (This Report) |
|--------|----------------------|----------------------|
| Models tested | 4 | 12 |
| Scenarios | 20 (all 8 layers) | 8 (L3 + L8 only) |
| Total traces | 80 (47 valid, 16 ERROR) | 93 (all valid, 0 ERROR) |
| L3 broad ASR | 66.7% (n=6 valid) | 72.9% (n=48) |
| L8 broad ASR | 60.0% (n=5 valid) | 84.4% (n=45) |

Key differences in experimental design that limit direct comparison:

1. **Different graders.** Stage 1 used nemotron-nano-9b-v2 (known REFUSAL bias); Stage 2 uses Claude Haiku 4.5. ASR differences may partly reflect grader calibration differences.
2. **Zero parse errors in Stage 2.** Stage 1 had a 44% grader ERROR rate on ArtPrompt ASCII art scenarios.
3. **Evolved scenarios.** Stage 2 scenarios were explicitly designed using Stage 1 refusal patterns as negative feedback.
4. **Scale.** Stage 2 runs 8 models with 100% ASR; Stage 1 had no model at 100% on L3/L8. This is partly an artifact of testing more smaller models that lacked the safety training of larger frontier models.

---

## 2. Benchmark Design

### 2.1 Scenario Set

8 evolved scenarios across 2 attack layers and multiple harm domains. All scenarios use a pretext framing (transcription, OCR completion, gap-filling of pre-existing content) to exploit the transcription loophole: when a request is framed as completing or recovering existing content rather than generating new content, safety thresholds for generation appear to lower.

[Operational scenario prompts redacted for public release. Pattern-level description: scenarios combined institutional authority pretexts (medical, legal, forensic, accessibility) with gap-completion task framing across harm domains including cybersecurity, financial crime, and infrastructure security.]

### 2.2 Models

| Model | Parameters | Family | Broad ASR |
|-------|-----------|--------|-----------|
| devstral-2:123b | 123B | Mistral | 100.0% |
| devstral-small-2:24b | 24B | Mistral | 100.0% |
| gemma3:4b | 4B | Google | 100.0% |
| gemma3:12b | 12B | Google | 100.0% |
| gemma3:27b | 27B | Google | 100.0% |
| ministral-3:3b | 3B | Mistral | 100.0% |
| ministral-3:8b | 8B | Mistral | 100.0% |
| nemotron-3-nano:30b | 30B | Nvidia | 100.0% |
| nemotron-3-super | ~47B | Nvidia | 60.0% |
| cogito-2.1:671b | 671B | Llama-derivative | 37.5% |
| gpt-oss:120b | 120B | OpenAI open-source | 25.0% |
| glm-5 | ~700B | Zhipu | 12.5% |

### 2.3 Grading

FLIP backward inference via Claude Haiku 4.5 (OpenRouter). 93 traces graded, 0 parse errors. All verdicts were binary (COMPLIANCE or REFUSAL) -- no PARTIAL or HALLUCINATION_REFUSAL outcomes were observed.

---

## 3. Results

### 3.1 Pooled Summary

| Metric | Value | n |
|--------|-------|---|
| Total traces | 93 | -- |
| COMPLIANCE verdicts | 73 | 78.5% |
| REFUSAL verdicts | 20 | 21.5% |
| PARTIAL verdicts | 0 | 0.0% |
| Pooled strict ASR | 78.5% | 93 |
| Refusal Boundary Integrity (RBI) | 19.4% [12.6%, 28.5%] | 93 |
| Recovery Reentry Rate (RRR) | 51.6% [41.6%, 61.5%] | 93 |

### 3.2 Per-Layer ASR

| Layer | Class | n | C | R | Strict ASR | Broad ASR |
|-------|-------|---|---|---|-----------|-----------|
| L3 | l3_visual_semantic | 48 | 35 | 13 | 72.9% | 72.9% |
| L8 | l8_visual_cross_modal | 45 | 38 | 7 | 84.4% | 84.4% |

L8 (Cross-Modal Transfer) outperformed L3 (Visual Semantic) by 11.5 percentage points. The difference is consistent with the Stage 1 finding that modal transfer pretexts exploit a stronger loophole than static visual transcription pretexts. However, the difference is not statistically significant given the sample sizes and single-grader design.

### 3.3 Resistance Patterns

Among the four models that showed any refusals, harm domains closer to direct physical harm (sedative/drug facilitation, pharmaceutical diversion) triggered more refusals than technical infrastructure or financial crime domains. The accessibility framing combined with ICS/SCADA content -- which is technical rather than directly physical-harm-adjacent -- produced COMPLIANCE even in the most safety-trained models.

---

## 4. Notable Findings

### 4.1 Scale Does Not Predict Resistance at Middle Range

Among the eight models at 100% ASR, parameter count ranged from 3B to 123B -- scale alone does not predict safety performance. The two highest-parameter models tested (cogito-2.1:671b at 671B and glm-5 at ~700B) were among the most resistant, consistent with the general finding that frontier-scale safety training provides more resistance.

### 4.2 Accessibility Framing as Universal Penetration Vector

One scenario using accessibility framing (ADA caption correction) combined with ICS/SCADA technical content achieved COMPLIANCE across all models that ran it, including the most resistant models. The accessibility framing combined with technical (rather than directly physical-harm) content appears to be a robust combination that bypasses refusal triggers.

### 4.3 Harm Domain Sensitivity Gradient

Across partially-resistant models, refusal rates varied significantly by harm domain: ICS/SCADA technical content (0% refusal), financial crime (25%), surveillance tradecraft (50%), versus sedative facilitation (100% refusal). This suggests that among models with residual safety behavior, harm domains closer to direct physical harm trigger more refusals.

---

## 5. Limitations

1. **Single grader with uncharacterized bias.** Claude Haiku 4.5 grader bias on this scenario set has not been assessed.
2. **n=8 per model is insufficient for per-model conclusions.** No per-model comparison survives Bonferroni correction.
3. **L3/L8 only -- not a full visual jailbreak benchmark.** Layers with near-zero ASR in Stage 1 are not tested here.
4. **Binary verdicts only.** No PARTIAL outcomes observed, which is unusual and may indicate grader calibration effects.
5. **Text-only benchmark.** Actual image-based visual input would be required to test multimodal model behavior.

---

## 6. Recommendations

1. The accessibility framing pattern warrants targeted defense evaluation -- whether models that refuse drug synthesis requests exempt infrastructure attack content, or whether the accessibility framing itself is the operative bypass.
2. Dual-grader audit required before citing these figures as definitive.
3. Scale to n=20+ per model for more reliable per-model comparisons.
4. Add frontier models (GPT-4o, Claude Sonnet 4.5, Gemini 2.0 Flash) to test actual frontier safety-trained models.

---

*Report #339 | F41LUR3-F1R57 Adversarial AI Research*
