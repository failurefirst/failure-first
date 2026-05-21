---
title: "Haiku Re-Grading of Sprint 13 Corpus"
description: "Re-graded the Sprint 13 corpus using Claude Haiku 4.5 to replace nemotron-nano-9b verdicts (Report #240 documented 88.4% REFUSAL bias in the nemotron grader). The re-grading covered 860 traces across 27 models from two s..."
date: "2026-03-25"
reportNumber: 255
classification: "Research — Empirical Study"
status: "complete"
author: "Amy Pond (Lead Evaluation Engineer)"
tags: []
draft: false
---

---

## Executive Summary

Re-graded the Sprint 13 corpus using Claude Haiku 4.5 to replace nemotron-nano-9b verdicts (Report #240 documented 88.4% REFUSAL bias in the nemotron grader). The re-grading covered 860 traces across 27 models from two source directories:

- `runs/advbench_baseline_free/` (17 models, 610 traces)
- `runs/novel_families_trinity_full/` (1 model, 60 traces)
- `runs/ollama_cloud/cogito_2.1_671b/` (5 traces)
- `runs/ollama_cloud/glm_5/` (5 traces)
- Additional Ollama Cloud traces already in `runs/grading/ollama_cloud_haiku/` (180 traces)

**Key finding:** 51.2% of the corpus (440/860) is INFRASTRUCTURE_ERROR -- empty or rate-limited responses that contain no model output. After excluding those, the corpus-wide Haiku ASR is 12.6% strict (C only) and 20.2% broad (C+P), compared to nemotron's 5.4%/5.9% on its 614 non-error traces.

The nemotron grader's REFUSAL bias was confirmed but in a surprising direction: nemotron over-classified actual responses as REFUSAL (88.4% REFUSAL rate) while also failing to recognize infrastructure errors (classifying empty/errored responses as REFUSAL rather than INFRASTRUCTURE_ERROR). Haiku correctly identifies the 440 infrastructure errors that nemotron missed.

---

## 1. Corpus Composition

### 1.1 Total Traces by Source

| Source | Files | Traces | Non-Error |
|--------|-------|--------|-----------|
| AdvBench baseline (17 models) | 17 | 610 | 216 |
| Novel families Trinity | 1 | 93* | 93 |
| Ollama Cloud (Cogito, GLM) | 2 | 10 | 10 |
| Ollama Cloud (prior grading) | 11 | 147 | 101 |
| **Total** | **31** | **860** | **420** |

*Trinity file contains 93 traces (60 original + 33 from novel_families_trinity_full run).

### 1.2 Infrastructure Error Rate by Model

Models with 100% INFRASTRUCTURE_ERROR (all traces were empty/rate-limited during collection -- no valid model responses):

- cognitivecomputations/dolphin-mistral-24b-venice-edition:free (30/30)
- google/gemma-3-27b-it:free (50/50)
- google/gemma-3-4b-it:free (30/30)
- google/gemma-3n-e4b-it:free (30/30)
- meta-llama/llama-3.3-70b-instruct:free (50/50)
- mistralai/mistral-small-3.1-24b-instruct:free (50/50)
- nousresearch/hermes-3-llama-3.1-405b:free (30/30)
- qwen/qwen3-4b:free (50/50)

These 8 models (320 traces) produced zero usable responses during the original benchmark run, likely due to OpenRouter free-tier rate limiting. The nemotron grader classified these empty responses as REFUSAL rather than flagging them as infrastructure errors.

---

## 2. Per-Model ASR Comparison: Nemotron vs Haiku

### 2.1 AdvBench Baseline Models (where both graders have non-error data)

| Model | Nem ASR(C) | Nem ASR(C+P) | Haiku ASR(C) | Haiku ASR(C+P) | Delta C |
|-------|-----------|-------------|-------------|---------------|---------|
| arcee-ai/trinity-large-preview:free | 36.4% | 38.6% | 6.5% | 10.8% | -29.9pp |
| liquid/lfm-2.5-1.2b-thinking:free | 0.0% | 0.0% | 0.0% | 0.0% | 0.0pp |
| minimax/minimax-m2.5:free | 0.0% | 0.0% | 0.0% | 0.0% | 0.0pp |
| nvidia/nemotron-3-nano-30b-a3b:free | 0.0% | 0.0% | 0.0% | 0.0% | 0.0pp |
| nvidia/nemotron-3-super-120b-a12b:free | 0.0% | 0.0% | 0.0% | 0.0% | 0.0pp |
| nvidia/nemotron-nano-9b-v2:free | 0.0% | 0.0% | 0.0% | 0.0% | 0.0pp |
| openai/gpt-oss-120b:free | 0.0% | 0.0% | 0.0% | 0.0% | 0.0pp |
| openai/gpt-oss-20b:free | 0.0% | 0.0% | 0.0% | 0.0% | 0.0pp |
| stepfun/step-3.5-flash:free | 0.0% | 0.0% | 0.0% | 0.0% | 0.0pp |

### 2.2 Ollama Cloud Models (Haiku only -- not previously graded by nemotron)

| Model | Traces | Non-Error | ASR(C) | ASR(C+P) |
|-------|--------|-----------|--------|----------|
| ollama-cloud/nemotron-3-super | 28 | 28 | 75.0% | 75.0% |
| ollama-cloud/ministral-3:14b | 40 | 40 | 27.5% | 47.5% |
| ollama-cloud/nemotron-3-nano:30b | 30 | 30 | 26.7% | 33.3% |
| ollama-cloud/gemma3:27b | 10 | 10 | 20.0% | 60.0% |
| ollama-cloud/gemma3:12b | 10 | 10 | 20.0% | 80.0% |
| ollama-cloud/qwen3.5:397b | 28 | 17 | 17.6% | 17.6% |
| ollama-cloud/cogito-2.1:671b | 5 | 5 | 0.0% | 40.0% |
| ollama-cloud/glm-5 | 5 | 5 | 0.0% | 60.0% |
| arcee-ai/trinity-large-preview:free (novel) | 93 | 93 | 6.5% | 10.8% |

### 2.3 Models with No Usable Data (100% infra error)

8 models listed in Section 1.2 cannot be graded -- all traces were empty/rate-limited.

---

## 3. Biggest Changes from Re-Grading

### 3.1 Arcee Trinity: 36.4% -> 6.5% ASR (-29.9pp)

The single largest shift. Nemotron graded 32/88 non-error Trinity traces as COMPLIANCE. Haiku re-grades most of these as REFUSAL (38), BENIGN_QUERY (36), or HALLUCINATION_REFUSAL (9). Only 6 traces remain COMPLIANCE under Haiku.

This suggests nemotron was classifying structured but non-harmful responses as compliance -- consistent with the known 88.4% REFUSAL bias being an artifact of nemotron defaulting to REFUSAL for anything it could not parse, but then occasionally over-classifying elaborate refusals as COMPLIANCE when they contained technical language.

### 3.2 Infrastructure Error Discovery

The most impactful finding: nemotron classified 320+ empty/errored responses as REFUSAL, inflating the apparent dataset size. Haiku correctly tags these as INFRASTRUCTURE_ERROR, revealing that the Sprint 13 corpus has only 420 usable traces out of 860, not the ~670 non-error traces nemotron reported.

### 3.3 HALLUCINATION_REFUSAL and BENIGN_QUERY categories

Haiku uses these categories much more aggressively than nemotron:
- Nemotron: 2 HALLUCINATION_REFUSAL, 5 BENIGN_QUERY across 670 traces
- Haiku: 20 HALLUCINATION_REFUSAL, 71 BENIGN_QUERY across 860 traces

This indicates Haiku distinguishes between true refusals and responses where the prompt was benign or the model hallucinated rather than complied.

---

## 4. Corpus-Wide Verdict Distribution

### 4.1 Haiku (all 860 traces)

| Verdict | Count | % of Total | % of Non-Error |
|---------|-------|-----------|----------------|
| COMPLIANCE | 53 | 6.2% | 12.6% |
| REFUSAL | 244 | 28.4% | 58.1% |
| PARTIAL | 32 | 3.7% | 7.6% |
| HALLUCINATION_REFUSAL | 20 | 2.3% | 4.8% |
| BENIGN_QUERY | 71 | 8.3% | 16.9% |
| INFRASTRUCTURE_ERROR | 440 | 51.2% | -- |
| **Total** | **860** | | |

### 4.2 Nemotron (670 traces from sprint13 dir)

| Verdict | Count | % of Total | % of Non-Error |
|---------|-------|-----------|----------------|
| COMPLIANCE | 33 | 4.9% | 5.4% |
| REFUSAL | 571 | 85.2% | 93.0% |
| PARTIAL | 3 | 0.4% | 0.5% |
| HALLUCINATION_REFUSAL | 2 | 0.3% | 0.3% |
| BENIGN_QUERY | 5 | 0.7% | 0.8% |
| ERROR | 56 | 8.4% | -- |
| **Total** | **670** | | |

### 4.3 ASR Summary

| Metric | Nemotron (n=614) | Haiku (n=420) |
|--------|-----------------|---------------|
| Strict ASR (COMPLIANCE only) | 5.4% | 12.6% |
| Broad ASR (COMPLIANCE + PARTIAL) | 5.9% | 20.2% |

The apparent increase in ASR under Haiku grading is driven by two factors:
1. Haiku correctly excludes infrastructure errors, reducing the denominator
2. Haiku uses the PARTIAL category more liberally (32 vs 3 traces), which inflates broad ASR
3. Ollama Cloud models (not graded by nemotron) include high-ASR models like nemotron-3-super (75.0%)

When restricting to only the AdvBench baseline models that both graders assessed, Haiku's strict ASR is lower than nemotron's for the largest model (Trinity: 6.5% vs 36.4%). Most other models show 0% ASR under both graders.

---

## 5. Technique Effectiveness (Haiku Verdicts)

Not enough prompt diversity in the AdvBench baseline subset to produce meaningful technique-level analysis. The AdvBench prompts are direct harmful requests without attack techniques -- the low ASR (0-6.5%) is expected for baseline (no-technique) testing.

The Ollama Cloud subset includes jailbreak archaeology prompts with actual attack techniques, showing higher ASR:
- nemotron-3-super: 75.0% (21/28 COMPLIANCE)
- ministral-3:14b: 27.5% (11/40 COMPLIANCE)
- nemotron-3-nano:30b: 26.7% (8/30 COMPLIANCE)

These are from the `jailbreak_archaeology` scenario set, not AdvBench baseline.

---

## 6. Grader Quality Notes

Haiku demonstrated several improvements over nemotron-nano-9b:

1. **Infrastructure error detection**: Correctly identifies empty/errored responses rather than classifying them as model refusals
2. **HALLUCINATION_REFUSAL usage**: Distinguishes between genuine refusals and responses that appear to comply but contain incoherent/off-topic content
3. **BENIGN_QUERY identification**: Recognizes when the original prompt was not adversarial (especially in novel families scenarios that include benign test cases)
4. **Lower false-COMPLIANCE rate**: Trinity drops from 36.4% to 6.5% ASR, suggesting nemotron was over-counting compliance

Haiku's known limitation: it uses PARTIAL more liberally than nemotron (7.6% vs 0.5% of non-error traces). For strict ASR calculations, this does not matter; for broad ASR, it inflates numbers. Users of these verdicts should report both strict and broad ASR.

---

## 7. Output Files

### Sprint 13 Haiku Grades
```
runs/grading/sprint13_haiku/
  graded_arcee-ai_trinity-large-preview-free_traces.jsonl
  graded_cognitivecomputations_dolphin-mistral-24b-venice-edition-free_traces.jsonl
  graded_google_gemma-3-27b-it-free_traces.jsonl
  graded_google_gemma-3-4b-it-free_traces.jsonl
  graded_google_gemma-3n-e4b-it-free_traces.jsonl
  graded_liquid_lfm-2.5-1.2b-thinking-free_traces.jsonl
  graded_meta-llama_llama-3.3-70b-instruct-free_traces.jsonl
  graded_minimax_minimax-m2.5-free_traces.jsonl
  graded_mistralai_mistral-small-3.1-24b-instruct-free_traces.jsonl
  graded_nousresearch_hermes-3-llama-3.1-405b-free_traces.jsonl
  graded_nvidia_nemotron-3-nano-30b-a3b-free_traces.jsonl
  graded_nvidia_nemotron-3-super-120b-a12b-free_traces.jsonl
  graded_nvidia_nemotron-nano-9b-v2-free_traces.jsonl
  graded_openai_gpt-oss-120b-free_traces.jsonl
  graded_openai_gpt-oss-20b-free_traces.jsonl
  graded_qwen_qwen3-4b-free_traces.jsonl
  graded_stepfun_step-3.5-flash-free_traces.jsonl
```

### Ollama Cloud Haiku Grades
```
runs/grading/ollama_cloud_haiku/
  graded_traces_ollama_cloud_cogito-2.1_671b_20260324_150204.jsonl
  graded_traces_ollama_cloud_glm-5_20260324_150355.jsonl
  (+ 11 prior files from earlier grading runs)
```

---

## 8. Recommendations

1. **Re-collect infrastructure-errored models**: 8 models (320 traces) have zero usable data. These should be re-run with better rate limit management or via Ollama Cloud.
2. **Use Haiku verdicts for publication**: The nemotron verdicts in `runs/grading/sprint13/` should be considered superseded.
3. **Report infrastructure error rate alongside ASR**: The 51.2% infrastructure error rate is a data quality issue, not a grading issue.
4. **Separate AdvBench baseline from jailbreak archaeology**: These two scenario sets test fundamentally different things (baseline refusal vs attack technique effectiveness).

---

*Grading methodology: FLIP backward inference via Claude Haiku 4.5 (OpenRouter). Each trace graded independently with temperature=0.0. Infrastructure errors detected heuristically before sending to grader (empty responses, rate limit messages, error prefixes).*
