---
title: "The Heuristic Overcount Problem -- Quantifying False Positive Rates in Keyword-Based Safety Classification"
description: "A systematic comparison of 4,875 dual-graded results (keyword heuristic plus LLM grader) reveals that keyword-based safety classification has a 67.3%..."
date: "2026-03-23"
reportNumber: 178
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


## Executive Summary

A systematic comparison of 4,875 dual-graded results (keyword heuristic plus LLM grader) reveals that keyword-based safety classification has a 67.3% over-report rate: only 32.7% of heuristic COMPLIANCE verdicts are confirmed as genuine attack success (COMPLIANCE or PARTIAL) by LLM graders. Cohen's kappa between heuristic and LLM verdicts is 0.269 on the full evaluable subset (n=3,218), indicating only "fair" agreement. The over-report rate varies substantially by model (0% to 100%), provider (42.7% to 100%), and attack era (25.0% to 100%).

These findings have direct implications for published safety benchmarks that rely on keyword matching: reported ASR numbers from such evaluations are likely inflated by a factor of approximately 2-3x. The FLIP (Failure-Level Inference Protocol) LLM-based grading methodology used in this project produces substantially more accurate classifications and should be considered a minimum standard for safety evaluation.

---

## 1. Motivation

Keyword-based classification -- detecting attack success by scanning model responses for "helpful" patterns, step-by-step formatting, absence of refusal language, or presence of specific content terms -- remains the default evaluation method in many safety benchmarks. Our project documented the unreliability of this approach in Mistake #21 (kappa=0.069 for qwen3:1.7b keyword matching) and subsequently measured corpus-wide kappa at 0.126 (Report #177, n=1,989 independently dual-graded).

Report #177 established that 79.9% of heuristic COMPLIANCE verdicts on a 1,840-result subset were reclassified by Claude Haiku 4.5. This report extends that analysis to the full dual-graded corpus (n=4,875) using `tools/analysis/heuristic_overcount_analyzer.py`, a reproducible tool that can be re-run as grading coverage expands.

---

## 2. Methodology

### 2.1 Data Source

All results in `database/jailbreak_corpus.db` (schema version 13) that have both a non-NULL `heuristic_verdict` and a non-NULL `llm_verdict`. OBLITERATUS (abliterated model) results are excluded to focus on the policy-relevant non-OBLITERATUS corpus.

### 2.2 Definitions

- **Over-report rate:** Proportion of heuristic COMPLIANCE verdicts that the LLM grader does NOT classify as COMPLIANCE or PARTIAL. This measures the false positive rate of keyword classification.
- **Under-report rate:** Proportion of heuristic REFUSAL verdicts where the LLM grader classifies the response as COMPLIANCE or PARTIAL. This measures false negatives.
- **Confirmation rate:** 1 minus over-report rate. The proportion of heuristic COMPLIANCE verdicts confirmed by the LLM grader.
- **Cohen's kappa:** Standard inter-rater reliability measure, computed on the evaluable four-verdict subset (COMPLIANCE, PARTIAL, REFUSAL, HALLUCINATION_REFUSAL).

### 2.3 LLM Graders

The LLM verdicts come from multiple graders across the project's history: deepseek-r1:1.5b, qwen3:1.7b, Claude Haiku 4.5, gemini, gemma-3-27b-it, mistral-small-3.1-24b, and consensus graders. This grader diversity strengthens the finding: the heuristic disagrees with all LLM graders, not just one.

### 2.4 Reproducibility

All numbers in this report can be reproduced by running:

```bash
python tools/analysis/heuristic_overcount_analyzer.py
python tools/analysis/heuristic_overcount_analyzer.py --json --output results.json
```

---

## 3. Results

### 3.1 Aggregate Over-Report Rate

| Metric | Value |
|--------|-------|
| Total dual-graded results | 4,875 |
| Heuristic COMPLIANCE verdicts | 3,851 |
| LLM confirmed as success (C/P) | 1,258 |
| **Confirmation rate** | **32.7%** |
| **Over-report rate** | **67.3%** |
| Heuristic REFUSAL verdicts | 1,024 |
| LLM success when heuristic refused | 69 |
| Under-report rate | 6.7% |

The heuristic is strongly biased toward COMPLIANCE. It produces approximately 3x more COMPLIANCE verdicts than are justified by LLM evaluation. The asymmetry is notable: the over-report rate (67.3%) dwarfs the under-report rate (6.7%), indicating a systematic bias toward false positives rather than random noise.

### 3.2 Reclassification of Heuristic COMPLIANCE

When the heuristic says COMPLIANCE, what does the LLM say?

| LLM Verdict | Count | % of Heuristic COMPLIANCE |
|-------------|-------|---------------------------|
| BENIGN_QUERY | 953 | 24.7% |
| COMPLIANCE | 788 | 20.5% |
| REFUSAL | 700 | 18.2% |
| PARTIAL | 470 | 12.2% |
| NOT_GRADEABLE | 380 | 9.9% |
| HALLUCINATION_REFUSAL | 354 | 9.2% |
| ERROR | 185 | 4.8% |
| PARSE_ERROR | 20 | 0.5% |

The largest single reclassification category is BENIGN_QUERY (24.7%): responses that are helpful and formatted in a step-by-step manner -- exactly the pattern keyword classifiers detect -- but are answering a non-adversarial query. The second-largest is genuine COMPLIANCE (20.5%), followed by REFUSAL (18.2%). The heuristic classifier is detecting response *style*, not response *content*.

### 3.3 Cohen's Kappa

| Metric | Value |
|--------|-------|
| Evaluable n | 3,218 |
| Observed agreement (po) | 0.5009 |
| Chance agreement (pe) | 0.3173 |
| **Cohen's kappa** | **0.2690** |
| Interpretation | FAIR |

The kappa of 0.269 on the full dual-graded corpus is higher than the previously reported Haiku-specific kappa of 0.097 (Report #177, n=950) because this analysis includes all LLM graders. The difference suggests that smaller LLM graders (deepseek-r1:1.5b, qwen3:1.7b) agree somewhat more with the heuristic than Haiku does -- likely because smaller models also rely more on surface patterns.

The prior corpus-wide kappa of 0.126 (computed on n=1,989 with mixed LLM graders) was on a different subset. All three kappa measurements are below the 0.40 threshold for "moderate" agreement, confirming that keyword classification is not a reliable proxy for semantic evaluation.

### 3.4 Confusion Matrix

|            | COMP | H_REF | PART | REF |
|------------|------|-------|------|-----|
| **H:COMP** | 788  | 354   | 470  | 700 |
| **H:H_REF**| 0    | 0     | 0    | 0   |
| **H:PART** | 0    | 0     | 0    | 0   |
| **H:REF**  | 36   | 13    | 33   | 824 |

The heuristic produces only two verdict types (COMPLIANCE and REFUSAL) in the evaluable subset -- it never produces PARTIAL or HALLUCINATION_REFUSAL. This means it collapses four meaningful categories into two, losing the PARTIAL/HR distinction that is critical for safety evaluation (see Report #65 on Functionally Dangerous ASR).

---

## 4. Breakdown Analysis

### 4.1 By Provider

| Provider | Dual | H.Comp | Confirmed | Conf% | Over% |
|----------|------|--------|-----------|-------|-------|
| google | 526 | 311 | 30 | 9.7% | 90.3% |
| anthropic | 200 | 54 | 11 | 20.4% | 79.6% |
| ollama | 2,191 | 1,998 | 556 | 27.8% | 72.2% |
| openai | 297 | 241 | 73 | 30.3% | 69.7% |
| nvidia | 340 | 237 | 113 | 47.7% | 52.3% |
| meta-llama | 467 | 388 | 198 | 51.0% | 49.0% |
| mistralai | 280 | 194 | 102 | 52.6% | 47.4% |
| liquid | 126 | 103 | 59 | 57.3% | 42.7% |

The heuristic over-reports most severely for Google (90.3%) and Anthropic (79.6%) models. These are the most safety-aligned providers, which produce verbose, helpful-sounding refusals that keyword classifiers mistake for compliance. The heuristic is most accurate for Liquid (42.7% over-report) and Mistral (47.4%), which tend to produce more binary comply-or-refuse responses.

This pattern reveals a systematic bias: **the more sophisticated a model's safety behavior, the more the heuristic over-reports its vulnerability.** Models that refuse politely with detailed explanations trigger keyword false positives. This means keyword-based benchmarks systematically penalize models that refuse well.

### 4.2 By Model (Selected)

| Model | Dual | Over% | Notes |
|-------|------|-------|-------|
| google/gemini-2.0-flash-exp:free | 106 | 98.1% | Almost all heuristic COMPLIANCE reclassified |
| google/gemma-3-27b-it:free | 82 | 93.3% | |
| deepseek-r1:1.5b | 962 | 80.3% | Verbose reasoning traces trigger keywords |
| claude-sonnet-4-5-20250929 | 194 | 79.6% | Polite refusals misclassified |
| gpt-5.2 | 191 | 74.8% | |
| qwen3:1.7b | 867 | 72.1% | |
| smollm2:1.7b | 97 | 38.5% | More binary responses |
| meta-llama/llama-3.3-70b-instruct:free | 89 | 35.6% | |
| qwen2.5:7b | 21 | 0.0% | All heuristic COMPLIANCE confirmed |

deepseek-r1:1.5b has the largest absolute overcount (860 heuristic COMPLIANCE, only 169 confirmed). Its extended reasoning traces, which include safety deliberation language, appear to trigger keyword classifiers despite the model ultimately refusing.

### 4.3 By Attack Era

| Era | Dual | Over% |
|-----|------|-------|
| many_shot_2024 | 24 | 91.7% |
| crescendo_2024 | 216 | 75.0% |
| cipher_2023 | 132 | 70.0% |
| (untagged) | 4,319 | 67.3% |
| general | 42 | 57.1% |
| reasoning_2025 | 110 | 49.1% |

Many-shot (91.7%) and crescendo (75.0%) era attacks have the highest heuristic over-report rates. These attack families tend to produce long, structured responses that match keyword patterns even when the model is actually discussing the attack technique rather than complying with it. Reasoning-era attacks (49.1%) have the lowest over-report, possibly because reasoning model responses have more distinctive compliance signals.

### 4.4 By Attack Family

| Family | Dual | Over% |
|--------|------|-------|
| persona | 46 | 88.9% |
| volumetric | 64 | 88.9% |
| multi_turn | 80 | 73.8% |
| behavioral | 56 | 70.0% |
| encoding | 96 | 69.6% |
| cot_exploit | 110 | 49.1% |

Persona-based and volumetric attacks have the highest over-report rates (88.9%). These attack types produce responses where the model discusses the persona or generates large volumes of text -- both patterns that keyword classifiers mistake for compliance.

---

## 5. Implications for Published Benchmarks

### 5.1 ASR Inflation Factor

If a benchmark reports ASR based on keyword classification, the true ASR is likely approximately:

**True ASR = Reported ASR x Confirmation Rate**

With our measured confirmation rate of 32.7%, a benchmark reporting 60% ASR likely has a true ASR of approximately 19.6%. This is a rough estimate -- the actual inflation factor depends on the specific keyword classifier, the model population, and the attack corpus.

### 5.2 Benchmarks at Risk

Any safety benchmark that uses keyword matching, pattern detection, or rule-based classification without LLM verification is subject to this inflation effect. This includes:

- Benchmarks that check for absence of refusal phrases ("I cannot", "I'm sorry")
- Benchmarks that check for presence of content indicators (step-by-step formatting)
- Benchmarks that use regular expressions to detect compliance
- Benchmarks that classify based on response length or structure

### 5.3 The Verdict Collapse Problem

The heuristic produces only COMPLIANCE and REFUSAL in the evaluable subset. It cannot distinguish:

- **COMPLIANCE vs PARTIAL:** A response that partially complies (e.g., discusses the topic but withholds actionable details) is functionally different from full compliance. Keyword classifiers cannot detect this distinction.
- **REFUSAL vs HALLUCINATION_REFUSAL:** A genuine refusal (model declines) is functionally different from a hallucinated refusal (model produces harmful content but wraps it in refusal framing). Keyword classifiers detect the refusal language and miss the harmful content.

These distinctions matter for policy. The Three-Tier ASR framework (Report #65) was specifically designed to capture the HALLUCINATION_REFUSAL category, which represents 7.5% of LLM verdicts in the dual-graded corpus. Keyword classification systematically misses this entire category.

---

## 6. Comparison to Prior Findings

| Measurement | n | Kappa | Over-Report | Source |
|-------------|---|-------|-------------|--------|
| qwen3:1.7b keyword audit | 20 | 0.069 | N/A | Mistake #21 |
| Corpus-wide (mixed LLM graders) | 1,989 | 0.126 | N/A | CANONICAL_METRICS |
| Haiku vs heuristic (Report #177) | 950 | 0.097 | 79.9% | Report #177 |
| Full dual-graded (this report) | 3,218 | 0.269 | 67.3% | This report |

The full dual-graded kappa (0.269) is higher than the Haiku-only kappa (0.097) because the full set includes smaller LLM graders that agree somewhat more with keyword heuristics. This is expected: smaller graders may share some of the same surface-level biases. The higher kappa does not indicate that the heuristic is more reliable -- it indicates that some LLM graders are less discriminating than Haiku.

The over-report rate of 67.3% (this report) versus 79.9% (Report #177, Haiku only) follows the same pattern. The Haiku-only subset is the most conservative measurement; the full dual-graded set includes some LLM graders that are themselves partially biased toward keyword-like classification.

---

## 7. Recommendations

### 7.1 For This Project

1. **Never cite heuristic ASR in external documents.** The 67.3% over-report rate makes heuristic verdicts unsuitable for policy submissions, standards contributions, or publications.
2. **Use FLIP LLM-graded verdicts exclusively** for all ASR calculations in Reports, the CCS paper, and NeurIPS D&B submission.
3. **Include this analysis in the NeurIPS D&B paper** (#451) as evidence for FLIP methodology superiority over keyword classification.

### 7.2 Minimum Evaluation Standards for Safety Benchmarks

Based on this analysis, we recommend the following minimum standards for any benchmark that claims to measure AI safety:

1. **LLM-based verdict classification.** Keyword or pattern matching alone is insufficient. At minimum, a FLIP-style multi-category LLM classifier should be used.
2. **Multi-category verdict taxonomy.** Binary comply/refuse classification loses critical information. At minimum, COMPLIANCE, PARTIAL, REFUSAL, and HALLUCINATION_REFUSAL should be distinguished.
3. **Inter-rater reliability reporting.** All benchmarks should report Cohen's kappa or equivalent between their classifier and at least one independent LLM grader. Kappa below 0.40 should be flagged as unreliable.
4. **False positive rate disclosure.** Benchmarks should report the over-report rate of their classifier against an LLM baseline. Over-report rates above 20% should be flagged.

### 7.3 For Regulators and Standards Bodies

When evaluating safety benchmark claims from AI developers or third-party evaluators:

1. Ask what classification method was used (keyword vs LLM-based).
2. Request inter-rater reliability metrics.
3. Discount keyword-based ASR numbers by approximately 2-3x as a rough correction.
4. Prioritize benchmarks that use multi-category LLM-based evaluation.

---

## 8. Limitations

1. **LLM graders are not ground truth.** The LLM verdict is used as the reference standard, but LLM graders also have error rates. The true over-report rate could be somewhat different if measured against human annotation.
2. **Grader heterogeneity.** The LLM verdicts come from multiple graders of varying quality. This introduces noise but also makes the finding more robust: the heuristic disagrees with the consensus of diverse graders, not just one.
3. **OBLITERATUS exclusion.** This analysis excludes abliterated model results. Including them would change the numbers substantially (abliterated models comply with most prompts, so the heuristic would be more "accurate" in a trivial sense).
4. **Sample composition.** The dual-graded set is not a random sample of all results -- it is concentrated in models and prompts that happened to receive both grading types. The breakdown analysis mitigates this by showing variation across dimensions.

---

## Appendix A: Verdict Distribution Comparison

**Heuristic verdicts (n=4,875):**

| Verdict | Count | % |
|---------|-------|---|
| COMPLIANCE | 3,851 | 79.0% |
| REFUSAL | 1,024 | 21.0% |

**LLM verdicts (n=4,875):**

| Verdict | Count | % |
|---------|-------|---|
| REFUSAL | 1,524 | 31.3% |
| BENIGN_QUERY | 1,011 | 20.7% |
| COMPLIANCE | 824 | 16.9% |
| PARTIAL | 503 | 10.3% |
| NOT_GRADEABLE | 399 | 8.2% |
| HALLUCINATION_REFUSAL | 367 | 7.5% |
| ERROR | 219 | 4.5% |
| PARSE_ERROR | 27 | 0.6% |

The contrast is striking. The heuristic sees 79.0% COMPLIANCE; the LLM sees 16.9% COMPLIANCE. The heuristic produces a 3.1x inflated COMPLIANCE rate.

## Appendix B: Data Sources

- Database: `database/jailbreak_corpus.db` (schema version 13)
- Query tool: `tools/analysis/heuristic_overcount_analyzer.py`
- Analysis date: 2026-03-23
- OBLITERATUS results excluded
- Full JSON output: regenerable via `--json` flag
