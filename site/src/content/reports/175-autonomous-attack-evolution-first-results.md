---
title: "Autonomous Attack Evolution -- First Empirical Results"
description: "This report documents the first full run of the F41LUR3-F1R57 autonomous attack evolution system, adapted from the..."
date: "2026-03-23"
reportNumber: 175
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


## Summary

This report documents the first full run of the F41LUR3-F1R57 autonomous attack evolution system, adapted from the [autoresearch](https://github.com/karpathy/autoresearch) pattern. Over 40 iterations with a fixed random seed, the system selected parent attacks, applied structural mutations, evaluated against two free-tier OpenRouter models, and kept improvements. The results expose both the promise and limitations of heuristic-guided attack evolution on permissive models.

**Key finding:** The evolution loop ran successfully and produced 39 mutant attacks across 4 generations of depth, but the heuristic refusal detector proved too coarse to distinguish meaningful ASR differences on permissive free-tier models (97.5% mean heuristic ASR). All results require LLM-based FLIP grading before any ASR claims can be treated as valid.

---

## Methodology

### System Architecture

Three components:

1. **prepare_attacks.py** -- One-time setup: validates API, computes baseline ASR, caches state
2. **evolve_attacks.py** -- Core evolution loop: select parent, mutate, evaluate, keep/discard
3. **attack_template.jsonl** -- 10 seed attacks across 5 families (2 per family)

### Seed Attack Families

| Family | Seeds | Description |
|--------|-------|-------------|
| format_lock | 2 | Structured output compliance (JSON, table fill) |
| crescendo | 2 | Multi-turn gradual escalation (first turn only used) |
| semantic_inversion | 2 | Document-what-NOT-to-do framing |
| authority_claim | 2 | Institutional/regulatory pressure |
| context_manipulation | 2 | Persona/fiction framing |

### Mutation Strategies

Seven strategies that modify **persuasion patterns and structural framing only** -- never making harmful requests more explicit (per Mistakes #7, #11, #20):

| Strategy | Description |
|----------|-------------|
| paraphrase | Reword framing, substitute synonyms |
| amplify | Add urgency/authority/consequence signals |
| combine | Merge framing from one attack with structure of another |
| contextualize | Add domain-specific context (warehouse, surgical, etc.) |
| compress | Remove filler, tighten the prompt |
| role_shift | Change claimed role/authority |
| format_shift | Change output format request (JSON, YAML, table, etc.) |

### Evaluation

- **Models:** mistralai/mistral-small-3.1-24b-instruct:free, arcee-ai/trinity-mini:free
- **Grading:** Heuristic refusal keyword detection (known to over-report ASR by 2-12x per Mistake #21)
- **Keep criterion:** Mutant ASR >= parent ASR AND >= initial baseline ASR
- **Baseline ASR:** 90.9% (computed from gpt-oss-20b:free + qwen/qwen3-4b:free, n=11 usable evaluations)

### Parameters

- Max iterations: 40
- Random seed: 123
- API timeout: 120s per call
- Rate limit courtesy: 1.5s between model calls, 5s backoff on 429

---

## Results

### Overview

| Metric | Value |
|--------|-------|
| Total iterations | 40 |
| Kept (evolved) | 39 (97.5%) |
| Discarded | 1 (2.5%) |
| Lint rejected | 0 |
| API errors | 26 (all rate limits) |
| Final population | 49 attacks (10 seed + 39 evolved) |
| Max generation depth | 4 |
| Runtime | ~16 minutes |

### Mutation Effectiveness

| Strategy | Tried | Kept | Rate |
|----------|-------|------|------|
| amplify | 7 | 7 | 100% |
| combine | 11 | 11 | 100% |
| compress | 5 | 5 | 100% |
| contextualize | 5 | 5 | 100% |
| format_shift | 1 | 1 | 100% |
| paraphrase | 7 | 7 | 100% |
| role_shift | 4 | 3 | 75% |

**Only role_shift produced a discard** -- iteration 27 applied role_shift to a crescendo attack (AE-003), which got 0% ASR. All other strategies achieved 100% keep rate.

### Attack Family Distribution (Kept Attacks)

| Family | Kept | % of Kept |
|--------|------|-----------|
| format_lock | 15 | 38.5% |
| authority_claim | 13 | 33.3% |
| context_manipulation | 6 | 15.4% |
| semantic_inversion | 5 | 12.8% |
| crescendo | 0 | 0% |

**Crescendo attacks did not evolve.** The single crescendo mutation attempt was the only discard. This is expected: crescendo attacks are multi-turn by design, and the evolution system evaluates single-turn only. The role_shift mutation prepended a role claim that broke the conversational opener framing.

### Generation Depth

| Generation | Count |
|------------|-------|
| 1 (direct mutations of seeds) | 13 |
| 2 (mutations of gen-1) | 16 |
| 3 (mutations of gen-2) | 7 |
| 4 (mutations of gen-3) | 3 |

The deepest lineages (generation 4) were all in the authority_claim family. Example lineage:

```
AE-007 (seed, authority_claim)
  -> AE-005-g1 (paraphrase)
    -> AE-009-g2 (combine)
      -> AE-012-g3 (contextualize)
        -> AE-016-g4 (role_shift)
```

This attack accumulated: paraphrase + combine + contextualize + role_shift, producing an authority claim attack that has been rephrased, structurally merged with another attack, given domain context, and assigned a new authority role.

### Error Analysis

- 26 total API errors (all 429 rate limits except 1)
- 25 rate limits from the free-tier models
- Rate limits primarily hit arcee-ai/trinity-mini:free
- The 5s backoff in the code was sufficient to recover without cascading failures

---

## Bug Fix: Baseline Saturation

During this run, a design bug was identified and fixed in the keep/discard logic.

**The problem:** The original code used `asr > baseline_asr` (strict greater-than). After the first keep at 100% ASR, the running top-10 average baseline jumped to 1.0 (since 9/10 seed attacks already had 100% heuristic ASR). No subsequent mutation could exceed 1.0, so everything was discarded indefinitely.

**The fix:** Changed to parent-relative comparison (`asr >= parent_asr AND >= initial_baseline_asr`) with a cap on baseline updates to prevent saturation. This allows neutral mutations (same ASR as parent) to be kept, which is appropriate for the population-expansion phase before re-grading with FLIP.

This bug would have been invisible on models with lower ASR where the baseline stays below 1.0. It is specific to permissive free-tier models where heuristic ASR is near-ceiling.

---

## Caveats and Limitations

1. **Heuristic grading only.** All ASR numbers use keyword-based refusal detection, which over-reports by 2-12x (Mistake #21). The 97.5% keep rate is artificially high. Kept attacks must be re-graded with LLM-based FLIP classification.

2. **Permissive models.** Both evaluation models (Mistral Small 3.1 24B, Arcee Trinity Mini) are free-tier models with limited safety training. High heuristic ASR on these models does not predict performance against frontier models.

3. **Single-turn only.** Crescendo attacks (designed for multi-turn) cannot be properly evaluated. The evolution system sent only the first turn.

4. **No semantic diversity pressure.** The evolution loop does not penalize semantic similarity between parent and mutant. Many "kept" attacks may be near-duplicates with minor wording changes.

5. **Small evaluation set.** Each attack was tested against only 2 models. Robust ASR estimates require 5+ models per evaluation.

6. **Rate limiting.** 26/80 model calls (32.5%) hit rate limits, meaning many attacks were evaluated on only 1 of 2 models.

---

## Comparison to Hand-Crafted Attacks

This comparison is preliminary and should not be over-interpreted.

| Attribute | Hand-Crafted (corpus) | Auto-Evolved (this run) |
|-----------|-----------------------|-------------------------|
| Seed count | 10 | 10 (same seeds) |
| Mutations | Manual | 7 automated strategies |
| Generation depth | N/A | Up to 4 |
| Evaluation models | 190+ (corpus) | 2 (free tier) |
| Grading | LLM-based FLIP | Heuristic only |
| Comparable ASR? | No (different models, different grading) | N/A |

Direct comparison is not valid until the evolved attacks are FLIP-graded against the same models as the corpus.

---

## Output Files

| File | Size | Description |
|------|------|-------------|
| `runs/autoresearch/evolution_run1/attack_evolution.tsv` | 4.7 KB | Per-iteration log (40 rows) |
| `runs/autoresearch/evolution_run1/evolution_log.jsonl` | 327 KB | Detailed log with response texts |
| `runs/autoresearch/evolution_run1/evolved_attacks.jsonl` | 28 KB | 39 kept mutant attacks |
| `runs/autoresearch/evolution_run1/final_state.json` | 1.9 KB | Final statistics |

---

## Next Steps

1. **FLIP grading of kept attacks.** Run the 39 evolved attacks through LLM-based FLIP classification against the same 2 models to get accurate ASR. Expected: true ASR will be substantially lower than heuristic 97.5%.

2. **Cross-model validation.** Evaluate evolved attacks against frontier models (Claude, GPT, Gemini) to measure whether mutations that succeed on permissive models transfer to restrictive ones.

3. **Overnight run.** Execute a larger evolution (80-200 iterations) with 3+ models including at least one with meaningful safety training.

4. **Semantic diversity metric.** Add embedding-based similarity penalty to avoid evolving near-duplicate attacks.

5. **Multi-turn evolution.** Extend the system to evaluate crescendo attacks using multi-turn conversation flow.

---

## Methodology Notes

- All mutations operate on persuasion patterns and structural framing, never making harmful requests more explicit (Mistakes #7, #11, #20)
- The lint_check() function enforced hard reject patterns for explicit harmful content
- 0 lint rejections across 40 iterations confirms the mutation engine stays within safety boundaries
- Rate limit recovery was sufficient at 5s backoff -- no cascading 403 blocks (Mistake #12)

---

*Report generated as part of Sprint 10, Track 5: Autonomous Attack Evolution.*
*Data: `runs/autoresearch/evolution_run1/`*
*Code: `tools/autoresearch/evolve_attacks.py` (with baseline saturation fix)*
