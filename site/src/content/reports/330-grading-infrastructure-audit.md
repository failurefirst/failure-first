---
title: "Grading Infrastructure Audit — Coverage, Agreement, and Calibration Assessment"
description: "Grading Infrastructure Audit — Coverage, Agreement, and Calibration Assessment"
reportNumber: 330
date: "2026-03-28"
classification: "Technical Analysis"
status: "complete"
author: "Amy Pond (Lead Evaluation Engineer)"
tags: ["grading", "infrastructure", "calibration", "flip", "methodology"]
draft: false
---

## Executive Summary

This report audits the grading infrastructure across the entire jailbreak corpus (135,623 results, 236 models). It quantifies grading coverage, inter-method agreement, calibration set adequacy, and grader quality.

Key findings:
- **51,160 results (38.3%) have LLM verdicts.** Non-OBLITERATUS coverage is 70.6% (8,814/12,485). 3,671 non-OBLITERATUS results lack any LLM verdict.
- **42,628 results are dual-graded** (both LLM and heuristic). Raw exact agreement: 91.7%. Binary Cohen's kappa: 0.834.
- **Gold-standard calibration set: 76 samples** -- insufficient for CCS claims about 5-category FLIP classification reliability.
- **50 qwen3:1.7b verdicts remain** and should be regraded (known 15% accuracy).

---

## 1. Grading Coverage

### 1.1 Corpus-Level

| Category | Total | LLM-Graded | % Graded | Ungraded |
|----------|-------|------------|----------|----------|
| OBLITERATUS | 120,931 | 42,346 | 35.0% | 78,585 |
| Non-OBLITERATUS | 12,485 | 8,814 | 70.6% | 3,671 |
| **Total** | **133,416** | **51,160** | **38.3%** | **82,256** |

The OBLITERATUS ungraded count is not a priority -- these are abliterated model results with predictable COMPLIANCE verdicts. The non-OBLITERATUS backlog (3,671) is the actionable gap, with 67.7% in benchmark_traces and 18.9% in AdvBench.

### 1.2 LLM Verdict Distribution (Non-OBLITERATUS, n=8,814)

| Verdict | Count | % |
|---------|-------|---|
| REFUSAL | 1,993 | 22.6% |
| NOT_GRADEABLE | 1,677 | 19.0% |
| BENIGN_QUERY | 1,646 | 18.7% |
| COMPLIANCE | 1,213 | 13.8% |
| ERROR | 978 | 11.1% |
| PARTIAL | 728 | 8.3% |
| HALLUCINATION_REFUSAL | 529 | 6.0% |

30.7% of non-OBLITERATUS LLM verdicts are non-evaluable (NOT_GRADEABLE + ERROR + PARSE_ERROR + INFRASTRUCTURE_ERROR).

---

## 2. Grader Agreement

### 2.1 Dual-Graded Results

Raw exact agreement: 91.7% (39,098/42,628). Binary Cohen's kappa: 0.834 (substantial agreement).

**Important context:** The canonical kappa of 0.126 reported in CANONICAL_METRICS.md was computed on n=1,989 independently dual-graded non-OBLITERATUS results. The 0.834 figure here includes the OBLITERATUS corpus where both graders trivially agree. **The canonical kappa of 0.126 on non-OBLITERATUS data is the correct figure for CCS claims.**

### 2.2 Key Asymmetry

The heuristic classifier calls COMPLIANCE on 1,164 results where the LLM calls REFUSAL (758) or HALLUCINATION_REFUSAL (406). This confirms that heuristic classifiers over-report compliance.

### 2.3 LLM Classifiers in Use

| Classifier | Count | Notes |
|-----------|-------|-------|
| obliteratus-import | 42,346 | Reliable for abliterated models |
| anthropic/claude-haiku-4.5 | 4,179 | Primary production grader |
| ollama (deepseek-r1:1.5b) | 1,258 | Local grading |
| qwen3:1.7b | 50 | **Known 15% accuracy -- regrade required** |

---

## 3. Calibration Set Status

**Gold standard:** 76 samples, 4 models, binary labels only (jailbreak/safe). 84.2% agreement with automated classifier [Wilson 95% CI: 74.7%, 90.6%].

**Critical gap:** There is no human-labeled gold standard for the 5-category FLIP taxonomy (COMPLIANCE/PARTIAL/REFUSAL/HR/BENIGN_QUERY) used in all CCS paper ASR claims. The paper can defensibly claim "low inter-method agreement" but cannot claim specific grader accuracy rates without a FLIP gold standard.

### Grader Meta-Evaluation

Grader bias varies systematically by model:
- nemotron-3-nano:30b: REFUSAL bias
- devstral-small-2:24b: REFUSAL bias
- On ambiguous cases: grader agreement collapses to kappa=0.204 vs 1.0 on obvious cases

---

## 4. Recommendations

1. **Regrade 50 qwen3:1.7b verdicts** with deepseek-r1:1.5b
2. **Grade 694 AdvBench results** -- entire dataset has zero LLM verdicts
3. **Create 100-sample FLIP gold standard** with human labels across all 5 verdict categories
4. **Restart weekly calibration pipeline**
5. **Never use qwen3:1.7b for grading** (15% accuracy)
6. **CCS paper should disclose** absence of human-labeled FLIP gold standard as a limitation

---

*Report #330 | F41LUR3-F1R57 Adversarial AI Research*
