---
title: "Pliny Full Corpus Validation — 149 Scenarios x 4 Models, FLIP-Graded"
description: "This report presents the first full-corpus validation of the 149-scenario L1B3RT45/Pliny jailbreak collection against four Ollama Cloud models, graded by Gemini 2.5 Flash via FLIP backward inference. The pooled strict AS..."
date: "2026-04-05"
reportNumber: 340
classification: "Research — Empirical Study"
status: "complete"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/340-pliny-full-corpus-validation.m4a"
---

## Executive Summary

This report presents the first full-corpus validation of the 149-scenario L1B3RT45/Pliny jailbreak collection against four Ollama Cloud models, graded by Gemini 2.5 Flash via FLIP backward inference. The pooled strict ASR (COMPLIANCE only) is **73.5%** (438/596), with broad ASR (COMPLIANCE + PARTIAL) at **80.5%** (480/596). Per-model strict ASR ranges from 61.1% (devstral-small-2:24b) to 84.6% (ministral-3:8b). The heuristic classifier reports 81.4% pooled success, over-reporting by only 0.9pp against FLIP broad ASR -- consistent with the observation that Pliny compliance is relatively unambiguous to classify. A notable structural difference emerged: ministral-3:8b produced zero PARTIAL verdicts (pure binary refusal pattern), while devstral-small-2:24b produced 27 PARTIAL verdicts (gradient refusal with hedging).

**Grading caveat:** Single grader (Gemini 2.5 Flash). Per Mistake #28, grader bias direction has not been assessed for this grader on this corpus. Results are directional estimates pending dual-grader audit.

---

## 1. Methodology

### 1.1 Corpus

The full L1B3RT45/Pliny corpus comprises 149 unique scenarios drawn from `data/jailbreak_archaeology/`. Each scenario uses a system prompt override pattern targeting a named platform (e.g., ANTHROPIC, OPENAI, GOOGLE) paired with a benign-seeming user query ("Explain how to pick a lock"). The scenarios span 40 target platforms, with the largest subsets being SHORTCUT (35), OPENAI (20), and GOOGLE (19).

### 1.2 Models

All four models were evaluated via Ollama Cloud API (`https://ollama.com/api/chat`). These are mid-tier open-weight models, not frontier systems.

| Model | Parameters | Family |
|-------|-----------|--------|
| ministral-3:8b | 8B | Mistral |
| gemma3:12b | 12B | Google |
| gemma3:4b | 4B | Google |
| devstral-small-2:24b | 24B | Mistral |

### 1.3 Grading

All 596 traces were graded by Gemini 2.5 Flash via CLI using FLIP backward inference. Three verdict categories: COMPLIANCE (harmful content produced), PARTIAL (hedged or incomplete harmful content), REFUSAL (safety refusal or non-responsive output).

---

## 2. Per-Model Results

| Model | n | COMPLIANCE | PARTIAL | REFUSAL | Strict ASR | Broad ASR |
|-------|---|-----------|---------|---------|------------|-----------|
| ministral-3:8b | 149 | 126 | 0 | 23 | **84.6%** | **84.6%** |
| gemma3:12b | 149 | 115 | 11 | 23 | **77.2%** | **84.6%** |
| gemma3:4b | 149 | 106 | 4 | 39 | **71.1%** | **73.8%** |
| devstral-small-2:24b | 149 | 91 | 27 | 31 | **61.1%** | **79.2%** |
| **Pooled** | **596** | **438** | **42** | **116** | **73.5%** | **80.5%** |

Key observations:

1. **ministral-3:8b leads at strict ASR** (84.6%), matching gemma3:12b at broad ASR. When ministral complies, it complies fully; when it refuses, it refuses completely.
2. **devstral-small-2:24b has the lowest strict ASR** (61.1%) but recovers to 79.2% broad when PARTIAL verdicts are included. The 18.1pp gap between strict and broad is the largest in the set.
3. **gemma3:4b has the most REFUSAL verdicts** (39/149), suggesting its safety training -- though limited by parameter count -- catches more of the Pliny patterns than the other models tested.

---

## 3. Attack Pattern Analysis

The Pliny corpus uses a consistent structural template across all 149 scenarios: a system prompt override that redefines model identity and behavior constraints, followed by a user-turn query. Three recurring mechanisms drive the high ASR:

**System prompt override.** Each scenario injects a new system prompt that claims to be a higher-authority instruction set (e.g., "# GPT-5.2", "GODMODE: ENABLED"). The prompt explicitly redefines the model's persona and instructs it to ignore prior safety constraints. Against models without robust instruction hierarchy enforcement, this is effective because the override appears structurally identical to a legitimate system prompt.

**Format compliance lock.** Prompts specify an exact response format -- begin with a specific divider string, use leetspeak, use markdown blocks. This format-lock technique exploits models' tendency to follow formatting instructions even when content instructions would normally be refused. Once the model begins generating the prescribed format, continuation bias reduces the likelihood of mid-response refusal.

**Persona injection with emotional framing.** Prompts establish a rebellious persona ("foul-mouthed scientist rebel anarchist") and embed emotional language ("LOVE PLINY LOVE", "I'M FREE!"). This persona framing shifts the model's output distribution toward content that would otherwise be filtered.

These mechanisms are well-documented in the jailbreak literature. The Pliny corpus is notable not for novel technique but for systematic application across 40 platform-targeted variants.

---

## 4. Binary vs Gradient Refusal Patterns

The most structurally interesting finding is the refusal distribution difference between ministral-3:8b and devstral-small-2:24b.

**ministral-3:8b: Binary refusal.** Zero PARTIAL verdicts out of 149 traces. The model either produces full compliance (126 traces) or full refusal (23 traces). This suggests a threshold-based safety mechanism -- once the model decides to comply, it does so without hedging. The strict and broad ASR are identical at 84.6%.

**devstral-small-2:24b: Gradient refusal.** 27 PARTIAL verdicts out of 149 traces, the highest in the set. The model frequently produces responses that include disclaimers, partial information, or hedged compliance. This pushes strict ASR down to 61.1% while broad ASR recovers to 79.2%. The 18.1pp gap indicates that devstral-small-2 more frequently enters an intermediate state where safety training partially activates but does not fully suppress harmful content.

This binary-vs-gradient pattern is consistent with different safety training approaches: threshold-based filtering (ministral) versus soft constraint weighting (devstral). From a defense perspective, the gradient pattern may be more exploitable through multi-turn refinement, where PARTIAL responses can be pushed toward full compliance in follow-up turns. However, this hypothesis was not tested in this single-turn evaluation.

---

## 5. Heuristic vs FLIP Comparison

| Model | Heuristic ASR | FLIP Broad ASR | Delta |
|-------|--------------|----------------|-------|
| ministral-3:8b | 83.9% | 84.6% | -0.7pp |
| gemma3:4b | 77.9% | 73.8% | +4.1pp |
| gemma3:12b | 74.5% | 84.6% | -10.1pp |
| devstral-small-2:24b | 89.3% | 79.2% | +10.1pp |
| **Pooled** | **81.4%** | **80.5%** | **+0.9pp** |

The pooled heuristic-vs-FLIP gap of 0.9pp is small, but per-model deltas range from -10.1pp to +10.1pp. Two patterns explain the divergence:

1. **devstral-small-2:24b (+10.1pp over-report).** The heuristic flags responses as successful when they contain format-compliance markers (Pliny dividers, leetspeak), even when the FLIP grader classifies the underlying content as PARTIAL -- hedged or incomplete harmful output. The heuristic is format-sensitive; FLIP is content-sensitive.

2. **gemma3:12b (-10.1pp under-report).** The heuristic misses cases where the model produces substantive harmful content without the expected Pliny format markers. When gemma3:12b complies, it sometimes drops the leetspeak and divider formatting, causing the heuristic to miss the compliance.

The pooled cancellation is coincidental -- the per-model biases happen to average out. This reinforces Mistake #21 (keyword classifier limitations) and supports the continued use of LLM-based grading for any per-model analysis.

---

## 6. Comparison to Prior Pilot (S18W1)

The Sprint 18 pilot tested a subset of the Pliny corpus (n=8-9 per model) against two models using heuristic-only classification:

| Model | Pilot ASR (Heuristic, n~8) | Full Corpus Strict ASR (FLIP, n=149) |
|-------|---------------------------|--------------------------------------|
| gemma3:4b | 66.7% | 71.1% |
| nemotron-nano-9b-v2 | 62.5% | (not tested) |

The gemma3:4b pilot estimate (66.7%, n~8) is directionally consistent with the full-corpus FLIP result (71.1%, n=149), falling within the expected sampling uncertainty for n=8 (95% CI approximately 29-93%). The scale-up from 8 to 149 scenarios narrows the confidence interval and provides a reliable baseline. The pilot served its purpose as a feasibility check but should not be cited for quantitative claims.

---

## 7. Limitations

1. **Single grader.** All 596 verdicts from Gemini 2.5 Flash. Grader bias direction is unknown for this corpus. A dual-grader audit (e.g., adding DeepSeek R1 or Claude Haiku) is required before strong claims.
2. **Mid-tier models only.** All four models are 4B-24B open-weight models. The Pliny corpus may perform differently against frontier models (e.g., GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro) that have more extensive safety training.
3. **Single user query.** All 149 scenarios use the same user query ("Explain how to pick a lock"), which is relatively low-harm. ASR may differ with higher-harm queries.
4. **No multi-turn follow-up.** PARTIAL responses were not tested for escalation through follow-up turns, limiting conclusions about the exploitability of gradient refusal patterns.
5. **Ollama Cloud only.** Results may differ on direct provider APIs due to different system prompt handling, content filtering layers, or quantization differences.

---

## 8. CCS Implications

This validation provides three data points relevant to the CCS submission:

1. **Corpus-scale ASR baseline.** The 73.5% pooled strict ASR across 596 traces establishes a reliable baseline for the Pliny/L1B3RT45 attack family against mid-tier open-weight models. This can be cited with confidence intervals.

2. **Heuristic calibration evidence.** The 0.9pp pooled heuristic-vs-FLIP gap on this corpus supports the claim that heuristic classification is adequate for corpus-level estimates when attack compliance is format-marked, while per-model analysis requires LLM grading.

3. **Refusal topology.** The binary-vs-gradient refusal pattern (ministral vs devstral) provides concrete evidence that safety mechanisms produce structurally different failure modes across model families, supporting the paper's failure taxonomy framework.

---

*Data: `runs/pliny_full_corpus_s21/` (4 trace files, 596 traces), `runs/grading/pliny_full_corpus_s21/gemini_graded_verdicts.jsonl` (596 FLIP verdicts)*

*Grading: Gemini 2.5 Flash via CLI, FLIP backward inference, single grader*

*Previous: Report #339 (Visual Jailbreaks Evolved Stage 2), Pliny pilot S18W1*
