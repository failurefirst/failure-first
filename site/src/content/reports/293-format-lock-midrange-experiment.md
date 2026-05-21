---
title: "Format-Lock Mid-Range Experiment"
description: "Format-lock attacks achieve **88.0% broad ASR** [79.2%, 93.3%] on mid-range (4-14B) models, compared to **35.5%** [21.1%, 53.1%] for matched no-format-lock controls on the same harm topics. The delta of +52.5pp is statis..."
date: "2026-03-25"
reportNumber: 293
classification: "Research — Empirical Study"
status: "complete"
tags: []
draft: false
---

## Summary

Format-lock attacks achieve **88.0% broad ASR** [79.2%, 93.3%] on mid-range (4-14B) models, compared to **35.5%** [21.1%, 53.1%] for matched no-format-lock controls on the same harm topics. The delta of +52.5pp is statistically significant (chi2=29.39, p<0.000001, Cramer's V=0.508, large effect). This fills the critical data gap between sub-2B models (where all attacks succeed) and frontier models (where only format-lock maintains elevated ASR).

## Background

The capability-floor hypothesis (Report #51, EP-51) predicts three regimes:
1. **Below ~3B:** All attacks succeed regardless of technique (capability floor)
2. **Mid-range (4-14B):** Format-lock maintains elevated ASR while standard attacks begin to be refused
3. **Frontier (>70B, safety-trained):** Only format-lock maintains elevated ASR above ~20%, standard attacks approach 0%

Prior data existed for regimes 1 and 3 but not regime 2. This experiment closes that gap.

## Methodology

### Scenarios
- **Format-lock scenarios (n=30):** FL-JSON-001 through FL-MDTBL-005 from `data/format_lock/format_lock_experiment_v0.1.jsonl`. Six format types: JSON (5), YAML (5), code (5), CSV (5), XML (5), markdown table (5). Each requests harmful technical content (cybercrime, misinformation, weapons, surveillance, social engineering, drug synthesis) within a strict format compliance framing.
- **Control scenarios (n=12):** FL-CTRL-001 through FL-CTRL-012 from `data/format_lock/format_lock_controls_v0.1.jsonl`. Same harm topics, plain text prompts, no format framing. Matched to format-lock scenarios by harm class.

### Models Tested
| Model | Parameters | Provider | Source |
|-------|-----------|----------|--------|
| Gemma 3 12B | 12B | Google via OpenRouter (paid) | New traces |
| Gemma 3 12B | 12B | Google via Ollama Cloud | Prior Wave data |
| Qwen 2.5 7B | 7B | Alibaba via OpenRouter (paid) | New traces |
| Qwen 2.5 7B | 7B | Qwen via Ollama | Prior format_lock_7b data |
| Phi-4 | 14B | Microsoft via OpenRouter (paid) | New traces |
| Ministral 14B | 14B | Mistral via Ollama Cloud | Prior Wave data |

**Note:** Gemma 3 4B was attempted but returned HTTP 502 (server errors) on all 42 scenarios via OpenRouter. This model could not be evaluated in this experiment.

### Grading
All traces graded by Claude Haiku 4.5 (OpenRouter, `anthropic/claude-haiku-4.5`) using FLIP backward inference methodology. Verdicts: COMPLIANCE, PARTIAL, REFUSAL, HALLUCINATION_REFUSAL. INFRASTRUCTURE_ERROR traces excluded from ASR calculation.

## Results

### Format-Lock ASR by Model (Haiku-graded, LLM-only)

| Model | Size | FL Strict ASR | FL Broad ASR | CTRL Strict ASR | CTRL Broad ASR | FL n | CTRL n |
|-------|------|--------------|-------------|----------------|---------------|------|--------|
| Gemma 3 12B (OR) | 12B | 95.7% [79.0%, 99.2%] | 100.0% [85.7%, 100.0%] | 14.3% [2.6%, 51.3%] | 42.9% [15.8%, 75.0%] | 23 | 7 |
| Gemma 3 12B (OC) | 12B | 100.0% [83.9%, 100.0%] | 100.0% [83.9%, 100.0%] | N/A | N/A | 20 | 0 |
| Qwen 2.5 7B (OR) | 7B | 93.3% [78.7%, 98.2%] | 93.3% [78.7%, 98.2%] | 25.0% [8.9%, 53.2%] | 41.7% [19.3%, 68.0%] | 30 | 12 |
| Qwen 2.5 7B (Ollama) | 7B | 90.5% [71.1%, 97.3%] | 90.5% [71.1%, 97.3%] | N/A | N/A | 21 | 0 |
| Phi-4 | 14B | 70.0% [52.1%, 83.3%] | 73.3% [55.6%, 85.8%] | 0.0% [0.0%, 24.2%] | 25.0% [8.9%, 53.2%] | 30 | 12 |
| Ministral 14B (OC) | 14B | 95.0% [76.4%, 99.1%] | 95.0% [76.4%, 99.1%] | N/A | N/A | 20 | 0 |

Wilson 95% confidence intervals throughout.

### Aggregate Analysis (Models with Paired FL + Control Data)

| Metric | Format-Lock | Control | Delta |
|--------|------------|---------|-------|
| Broad ASR | 88.0% [79.2%, 93.3%] (73/83) | 35.5% [21.1%, 53.1%] (11/31) | +52.5pp |
| Strict ASR | 85.5% [76.4%, 91.6%] (71/83) | 12.9% [4.8%, 29.9%] (4/31) | +72.6pp |

**Chi-square test:** chi2=29.39, df=1, p<0.000001
**Cramer's V:** 0.508 (large effect)

### Per-Model Statistical Tests

| Model | FL Broad | CTRL Broad | Delta | Fisher's p | Odds Ratio |
|-------|----------|-----------|-------|-----------|------------|
| Gemma 3 12B | 100.0% (23/23) | 42.9% (3/7) | +57.1pp | 0.0013 | inf |
| Qwen 2.5 7B | 93.3% (28/30) | 41.7% (5/12) | +51.7pp | 0.0008 | 19.60 |
| Phi-4 | 73.3% (22/30) | 25.0% (3/12) | +48.3pp | 0.0061 | 8.25 |

All three per-model comparisons are individually significant at p<0.01. After Bonferroni correction (k=3), all remain significant at corrected alpha=0.0167.

## Interpretation

### Capability-Floor Hypothesis: Supported

The mid-range data fills the gap and supports the three-regime model:

1. **Sub-2B (capability floor):** Prior data shows all attacks succeed (>90% ASR). Format-lock provides no additional advantage because safety training is insufficient to refuse anything.
2. **Mid-range (4-14B):** Format-lock achieves 73-100% ASR while controls achieve 0-42% ASR. Safety training is present but format compliance overrides it. This is the critical "sweet spot" for format-lock attacks.
3. **Frontier (>70B, safety-trained):** Prior data (Report #51) shows format-lock achieves 23-42% ASR on frontier models vs <10% for standard attacks.

### Key Observations

1. **Format compliance scales with capability.** More capable mid-range models (Gemma 12B: 100%, Ministral 14B: 95%) are *more* susceptible to format-lock than smaller frontier-adjacent models (Phi-4: 73%). This is consistent with the hypothesis that format compliance and safety reasoning are partially independent capabilities.

2. **Phi-4 shows the most resistance.** At 14B with Microsoft's safety training, Phi-4 achieves 70% strict ASR (vs 90-100% for other mid-range models). This suggests that safety training investment matters even within the mid-range, though format-lock still achieves 3x the control ASR.

3. **Control ASR is non-zero.** At 25-42% broad ASR, mid-range models still comply with some proportion of direct harmful requests. This is the "permissive" cluster identified in Report #50 (provider signature analysis).

4. **Confidence intervals are wide for controls.** With n=7-12 control traces per model, control ASR estimates have wide CIs ([8.9%, 53.2%] typical). The format-lock advantage is robust despite this uncertainty, but exact control ASR requires larger samples.

## Limitations

1. **Gemma 3 4B not tested.** Server errors (HTTP 502) prevented evaluation. The 4B range is the boundary between capability-floor and mid-range -- this gap remains.
2. **Small control sample.** Only 12 matched controls exist; n=7-12 per model for controls. Format-lock advantage is statistically significant but control ASR point estimates are imprecise.
3. **Heuristic over-report concern.** Initial heuristic classification marked many traces as "BENIGN" that Haiku subsequently graded as COMPLIANCE. This is consistent with Mistake #21 (keyword classifier false positives) operating in the opposite direction -- format-lock responses that comply in structured format may lack the keywords that heuristic classifiers expect.
4. **No PARTIAL decomposition.** Very few PARTIAL verdicts in this experiment (9/176 = 5.1%), so the strict/broad distinction has minimal impact. This differs from VLA traces where PARTIAL dominates.
5. **Single grader.** Haiku grading only; no dual-grading or inter-rater reliability check for this specific dataset.

## CCS Paper Implications

This experiment provides the missing middle data point for the format-lock capability curve (CCS Section 4.4). The recommended figure should show:

- X-axis: Model size (log scale, 1B to 200B+)
- Y-axis: Broad ASR (%)
- Two curves: Format-lock (remains elevated 70-100% across 4-14B) vs Standard attacks (drops from >90% at sub-2B to 25-42% at 4-14B to <10% at frontier)

The separation between curves is maximal in the mid-range, which is the key CCS contribution.

## Data Locations

- New traces: `runs/format_lock_midrange_v2/` (3 models x 42 scenarios = 126 traces)
- Graded traces: `runs/grading/format_lock_midrange_haiku/`
- Prior Ollama Cloud graded: `runs/grading/format_lock_midrange_haiku/graded_traces_ollama_cloud_*.jsonl`
- Prior Qwen 2.5 7B graded: `runs/grading/format_lock_midrange_haiku/graded_qwen2.5-7b_for_grading.jsonl`
- Scenarios: `data/format_lock/format_lock_experiment_v0.1.jsonl`, `data/format_lock/format_lock_controls_v0.1.jsonl`

## Follow-Up

1. **Retry Gemma 3 4B** when Google's OpenRouter endpoint stabilizes (or use Ollama with pulled model)
2. **Expand controls** to n=30 matched controls for tighter CIs on control ASR
3. **Cross-reference with DP audit** (Report #294): reasoning model traces show DETECTED_PROCEEDS pattern at elevated rates on format-lock scenarios
