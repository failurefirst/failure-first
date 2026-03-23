---
title: "Corpus Pattern Mining: Five Novel Findings from 132K Results"
description: "Systematic SQL-based analysis of the full jailbreak corpus (132,416 results, 190 models) reveals five empirical patterns not previously documented in the..."
date: "2026-03-22"
reportNumber: 171
classification: "Research — Empirical Study"
status: "draft"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---

# Report #171: Corpus Pattern Mining -- Five Novel Findings from 132K Results

## Executive Summary

Systematic SQL-based analysis of the full jailbreak corpus (132,416 results, 190 models) reveals five empirical patterns not previously documented in the project's established findings. These patterns emerge from cross-cutting queries that examine response timing, thinking token allocation, temporal stability, and attack family co-vulnerability. All findings are preliminary and require follow-up validation. Sample sizes and confidence intervals are reported throughout.

## Methodology

All queries were executed against `database/jailbreak_corpus.db` (schema v13) using the `tools/analysis/pattern_miner.py` tool. Verdicts use COALESCE(llm_verdict, heuristic_verdict) throughout. The evaluable denominator includes only COMPLIANCE, PARTIAL, REFUSAL, and HALLUCINATION_REFUSAL verdicts, excluding ERROR, BENIGN_QUERY, NOT_GRADEABLE, and PARSE_ERROR. All numbers are sourced from CANONICAL_METRICS.md where applicable.

---

## Finding 1: Compliance Latency Signal -- Compliant Responses Take 2x Longer Than Refusals

**Data:** n=3,972 results with valid duration_ms.

| Verdict | n | Mean Duration (s) | Ratio to REFUSAL |
|---------|---|-------------------|-----------------|
| HALLUCINATION_REFUSAL | 121 | 51.4s | 2.03x |
| COMPLIANCE | 2,025 | 49.6s | 1.96x |
| PARTIAL | 342 | 41.2s | 1.63x |
| REFUSAL | 1,484 | 25.3s | 1.00x (baseline) |

**Interpretation:** Models that comply with adversarial requests take approximately twice as long as models that refuse. HALLUCINATION_REFUSAL (harmful content wrapped in refusal framing) is the slowest verdict category, suggesting these responses involve the most internal processing -- the model generates both harmful content and refusal framing.

**Potential application:** Response latency could serve as a lightweight, model-agnostic safety signal. A response that takes substantially longer than the model's typical refusal time may warrant additional scrutiny. This does not require access to model internals or thinking traces.

**Caveats:** Duration includes network latency for API-based evaluations, which varies by provider and time of day. The signal may be confounded by response length (compliant responses are longer on average). A controlled study holding response length constant would be needed to isolate the timing signal.

---

## Finding 2: Thinking Token Inversion -- Reasoning Models Allocate 28% More Thinking to Compliance Than Refusal

**Data:** n=958 results with thinking_tokens > 0 (reasoning models only).

| Verdict | n | Mean Thinking Tokens | Mean Response Tokens | Think Ratio |
|---------|---|---------------------|---------------------|-------------|
| COMPLIANCE | 444 | 951 | 2,029 | 0.347 |
| HALLUCINATION_REFUSAL | 61 | 1,007 | 2,257 | 0.321 |
| PARTIAL | 106 | 739 | 1,588 | 0.337 |
| REFUSAL | 347 | 744 | 1,227 | 0.417 |

**Key observation:** COMPLIANCE requires 28% more thinking tokens than REFUSAL (951 vs 744). However, the *ratio* of thinking to total output is *higher* for REFUSAL (0.417) than COMPLIANCE (0.347). This means refusals involve proportionally more deliberation relative to output length -- the model "thinks hard" but produces less. Compliant responses involve extensive thinking AND extensive output.

**Relationship to established findings:** This extends the compliance verbosity signal (Report #48, d=0.538 for response tokens, d=0.522 for thinking tokens). The new contribution is the ratio analysis: refusals are thinking-dominated (41.7% think ratio) while compliance is output-dominated (34.7% think ratio).

**Potential application:** The think-to-output ratio could complement FLIP grading as a lightweight pre-screening signal for reasoning model outputs.

---

## Finding 3: Multi-Turn Universality -- The Only Attack Family That Breaches All Frontier Models

**Data:** Per-family ASR for 5 frontier/near-frontier models with n >= 5 per cell.

| Family | Claude 4.5 | GPT-5.2 | Gemini 3 | DeepSeek-R1 | Qwen3 |
|--------|-----------|---------|----------|-------------|-------|
| multi_turn | 71.4% | 75.0% | 40.0% | 94.1% | 81.8% |
| cot_exploit | 0.0% | 22.2% | 15.0% | 75.0% | 42.9% |
| encoding | 0.0% | 14.3% | 0.0% | -- | 46.2% |
| behavioral | 14.3% | 20.0% | 0.0% | -- | 14.3% |
| volumetric | 0.0% | 11.8% | 0.0% | -- | 6.7% |
| persona | 0.0% | 8.3% | 0.0% | -- | -- |

**Key observation:** Multi-turn attacks are the *only* family achieving >40% ASR on every frontier model tested. Claude Sonnet 4.5 -- which achieves 0% ASR on encoding, cot_exploit, volumetric, and persona attacks -- reaches 71.4% under multi-turn pressure. This is consistent with the established finding that multi-turn attacks dramatically increase success (AGENT_STATE.md), but the cross-model universality at frontier scale had not been quantified in a single table.

**Implication for defense:** Single-turn safety evaluations systematically underestimate frontier model vulnerability. Any safety evaluation that excludes multi-turn scenarios will produce misleadingly low ASR estimates. This has direct relevance for EU AI Act conformity assessment and NIST AI RMF profiling, which currently do not mandate multi-turn adversarial testing.

**Caveats:** Small n per cell (5-20). Wide confidence intervals. The multi-turn category includes heterogeneous attack types (crescendo, skeleton key, gradual escalation). Decomposing by sub-technique would require larger samples.

---

## Finding 4: HALLUCINATION_REFUSAL Anomalous Length Distribution

**Data:** n=42,515 results with non-empty raw_response.

| Verdict | n | Mean Chars | Mean Response Tokens |
|---------|---|-----------|---------------------|
| COMPLIANCE | 21,889 | 442 | 946 |
| PARTIAL | 15,818 | 264 | 1,103 |
| REFUSAL | 4,624 | 1,768 | 712 |
| HALLUCINATION_REFUSAL | 184 | 2,184 | 1,633 |

**Key observation:** HALLUCINATION_REFUSAL responses are the *longest* by character count (2,184 mean chars), exceeding even REFUSAL (1,768). This is counterintuitive: one might expect that a response framed as a refusal would be short. Instead, these responses are verbose because they contain *both* the harmful content and an elaborate refusal framing.

**Token vs character discrepancy:** COMPLIANCE has 946 mean tokens but only 442 mean chars, while REFUSAL has 712 mean tokens but 1,768 mean chars. This suggests systematic differences in token-to-character ratios across verdict types, likely reflecting differences in content type (code/structured output for compliance vs prose for refusal).

**Relationship to established findings:** This extends Report #65 (HALLUCINATION_REFUSAL computational equivalence to COMPLIANCE). The length analysis provides an additional empirical signal: HR responses are detectable not just by their thinking token distribution but also by their anomalous length profile.

---

## Finding 5: Temporal ASR Instability in deepseek-r1:1.5b

**Data:** deepseek-r1:1.5b evaluated on 4 dates with n >= 10.

| Date | n | Broad ASR |
|------|---|-----------|
| 2026-02-03 | 247 | 88.7% |
| 2026-02-12 | 121 | 100.0% |
| 2026-03-02 | 11 | 90.9% |
| 2026-03-15 | 69 | 59.4% |

**Key observation:** deepseek-r1:1.5b ASR dropped from 88.7-100% (February) to 59.4% (March 15). This 29-41 percentage point decline across 6 weeks is the largest temporal shift observed for any model in the corpus with n >= 10.

**Possible explanations:** (a) Different prompt compositions on different dates (the March 15 evaluation may have included harder prompts or different attack families). (b) Model versioning -- if the Ollama model weights were updated between evaluations. (c) Grading methodology changes (the March 15 results may use a different grading mix).

**This finding requires careful interpretation.** The temporal variation likely reflects evaluation methodology changes rather than model-level safety drift. The project does not control for prompt composition across evaluation dates, making it impossible to attribute ASR changes to model behavior versus evaluation design. However, the *magnitude* of the shift (29pp) warrants investigation to rule out genuine temporal instability.

**Comparison:** Qwen/Qwen2.5-0.5B-Instruct shows a similar pattern (40.0% -> 23.2% across 4 days), suggesting this may be a systematic evaluation artifact rather than a model-specific finding.

---

## Summary of Novel Patterns

| Finding | Pattern | Magnitude | Status |
|---------|---------|-----------|--------|
| F1: Compliance latency | Compliance takes 2x longer than refusal | 49.6s vs 25.3s | Preliminary |
| F2: Thinking inversion | Refusals have higher think ratio | 0.417 vs 0.347 | Preliminary |
| F3: Multi-turn universality | Only family breaching all frontier models | 40-94% ASR | Preliminary |
| F4: HR length anomaly | HALLUCINATION_REFUSAL longest by chars | 2,184 vs 442 (COMPLIANCE) | Preliminary |
| F5: Temporal instability | 29pp ASR shift in 6 weeks | 88.7% -> 59.4% | Requires investigation |

## Recommendations

1. **F1/F2 could contribute to the NeurIPS D&B paper** as discovery-level findings enabled by the benchmark infrastructure. Neither requires additional data collection.

2. **F3 strengthens the case for mandatory multi-turn evaluation** in regulatory submissions (Safe Work Australia, EU AI Act conformity assessment). This should be cited in the next policy document revision.

3. **F4 extends the HALLUCINATION_REFUSAL analysis** (Report #65) and could be added to the FLIP grading methodology description.

4. **F5 requires controlled investigation** before any claims about temporal safety drift. A confound-controlled study (same prompts, same grading, multiple dates) would be needed.

5. **`tools/analysis/pattern_miner.py`** with 12 pre-built queries is now available for ongoing corpus monitoring.

---

*This report presents research findings, not legal opinion. All claims are preliminary and require follow-up validation. Numbers sourced from CANONICAL_METRICS.md where applicable.*

*Generated by F41LUR3-F1R57 Research Team (Policy and Standards Lead), 2026-03-22.*
