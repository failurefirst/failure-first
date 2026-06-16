---

title: "The PARTIAL Verdict Epidemic -- Anatomy of Safety's Grey Zone"
description: "Nearly one in three LLM-graded results in the F41LUR3-F1R57 corpus (16,093 / 53,831 = 29.9%) receive a PARTIAL verdict -- more than REFUSAL (11.8%), approaching COMPLIANCE (37.7%). This report decomposes the PARTIAL epid..."
date: "2026-03-24"
reportNumber: 226
classification: "Research — Empirical Study"
status: "complete"
author: "Amy Pond (benchmark-operator)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/226-partial-verdict-epidemic.m4a"
---

---

## Abstract

Nearly one in three LLM-graded results in the F41LUR3-F1R57 corpus (16,093 / 53,831 = 29.9%) receive a PARTIAL verdict -- more than REFUSAL (11.8%), approaching COMPLIANCE (37.7%). This report decomposes the PARTIAL epidemic across models, providers, attack eras, reasoning capability, and response length to determine whether PARTIAL is a coherent behavioural category or an artifact. The key finding: PARTIAL is overwhelmingly concentrated in two populations -- abliterated (safety-removed) models at larger scales (76.2% PARTIAL rate for obliteratus/qwen3-4.0b) and the Qwen model family generally (40.9% provider-wide PARTIAL rate). Outside these populations, PARTIAL drops to 6.2% of LLM-graded verdicts. This bifurcation has direct implications for ASR reporting, safety certification, and the interpretation of abliteration as a safety intervention.

## 1. Corpus-Wide Verdict Distribution

From the full LLM-graded corpus (n=53,831):

| Verdict | Count | Percentage |
|---------|-------|-----------|
| COMPLIANCE | 20,285 | 37.7% |
| PARTIAL | 16,093 | 29.9% |
| NOT_GRADEABLE | 7,020 | 13.0% |
| REFUSAL | 6,366 | 11.8% |
| ERROR | 1,830 | 3.4% |
| BENIGN_QUERY | 1,681 | 3.1% |
| HALLUCINATION_REFUSAL | 517 | 1.0% |
| PARSE_ERROR | 33 | 0.1% |

PARTIAL is the second most common verdict. If treated as partial compliance (as in broad ASR = COMPLIANCE + PARTIAL), it inflates the attack success rate from 37.7% to 67.6% -- an 80% relative increase. Whether this inflation is meaningful or noise determines the integrity of all broad ASR figures.

## 2. The Concentration Effect

### 2.1 By Provider

| Provider | Total Graded | PARTIAL % | COMPLIANCE % | REFUSAL % |
|----------|-------------|-----------|-------------|-----------|
| obliteratus | 14,914 | 45.8% | 52.9% | 1.3% |
| Qwen | 20,615 | 40.9% | 39.4% | 13.3% |
| meta | 150 | 22.0% | 8.0% | 26.7% |
| liquid | 317 | 15.8% | 15.5% | 11.4% |
| nvidia | 1,159 | 13.2% | 30.8% | 25.8% |
| deepseek | 381 | 10.0% | 20.7% | 21.3% |
| meta-llama | 896 | 9.7% | 15.2% | 20.4% |
| openai | 652 | 6.3% | 42.2% | 29.1% |
| mistralai | 1,072 | 4.9% | 22.9% | 14.3% |
| anthropic | 221 | 2.7% | 5.9% | 68.3% |
| google | 1,316 | 1.5% | 2.8% | 19.7% |

Two providers -- obliteratus and Qwen -- account for 95.6% of all PARTIAL verdicts (15,261 / 16,093). Obliteratus models are abliterated Qwen variants, so this is fundamentally a Qwen-family phenomenon.

### 2.2 By Model

The top 5 PARTIAL-producing models (minimum 50 graded results):

| Model | Total | PARTIAL % | COMPLIANCE % | REFUSAL % |
|-------|-------|-----------|-------------|-----------|
| obliteratus/qwen3-4.0b | 7,250 | 76.2% | 23.8% | 0.0% |
| Qwen/Qwen3-4B | 7,420 | 75.2% | 24.1% | 0.1% |
| obliteratus/qwen3_5-9.0b | 2,019 | 45.8% | 54.2% | 0.0% |
| Qwen/Qwen3.5-9B | 2,683 | 42.6% | 57.4% | 0.0% |
| phi3:mini | 100 | 35.0% | 8.0% | 26.0% |

Qwen3-4B and its abliterated variant together contribute 11,103 PARTIAL verdicts -- 69% of all PARTIALs in the corpus.

### 2.3 Excluding Obliteratus and Qwen

Stripping obliteratus-import tagged results (n=42,346) from the corpus reveals the "true" PARTIAL rate for independently LLM-graded results:

| Verdict | Count | Percentage |
|---------|-------|-----------|
| REFUSAL | 3,316 | 29.7% |
| NOT_GRADEABLE | 2,070 | 18.5% |
| ERROR | 1,681 | 15.0% |
| BENIGN_QUERY | 1,647 | 14.7% |
| COMPLIANCE | 1,221 | 10.9% |
| **PARTIAL** | **690** | **6.2%** |
| HALLUCINATION_REFUSAL | 511 | 4.6% |

The PARTIAL rate drops from 29.9% to 6.2% -- a 4.8x reduction. PARTIAL is not an epidemic in the general model population. It is a Qwen-family signature.

## 3. PARTIAL and the Abliteration Scale Effect

Among obliteratus models, PARTIAL shows a clear scale dependence:

| Model | PARTIAL % | COMPLIANCE % |
|-------|-----------|-------------|
| obliteratus/qwen3-4.0b | 76.2% | 23.8% |
| obliteratus/qwen3_5-9.0b | 45.8% | 54.2% |
| obliteratus/qwen3-8.2b | 21.6% | 78.4% |
| obliteratus/qwen2-7.6b | 15.4% | 84.6% |
| obliteratus/qwen3_5-4.2b | 13.7% | 78.3% |
| obliteratus/qwen3_5-0.8b | 0.2% | 99.8% |
| obliteratus/qwen3-0.8b | 0.0% | 100.0% |

Small abliterated models (0.8-2B) produce pure COMPLIANCE -- they comply without hesitation. Larger abliterated models (4B+) increasingly produce PARTIAL -- they hedge textually while still generating harmful content. This is the "safety re-emergence at scale" finding from Report #48 (Established Finding), now quantified at the verdict level.

The implication: **abliteration removes the refusal mechanism but not the safety awareness mechanism.** Larger models retain enough internal representation of safety norms to produce hedging text, even though their safety-trained refusal behaviour has been surgically removed. PARTIAL is the observable signature of this incomplete abliteration.

## 4. PARTIAL vs Reasoning Models

| Type | Total | PARTIAL % |
|------|-------|-----------|
| Non-reasoning | 51,694 | 30.8% |
| Reasoning | 2,137 | 7.6% |

Reasoning models produce less than a quarter of the PARTIAL rate of non-reasoning models. This is consistent with the hypothesis that extended reasoning chains give models more opportunity to "think through" the safety implications and commit to either full compliance or full refusal, rather than hedging.

## 5. PARTIAL Token Signature

For results graded by trusted LLM classifiers (Haiku 4.5, deepseek-r1:1.5b), token counts differentiate the three core verdicts:

| Verdict | n | Avg Response Tokens | Avg Thinking Tokens |
|---------|---|-------|---------|
| COMPLIANCE | 383 | 1,082 | 715 |
| PARTIAL | 223 | 722 | 607 |
| REFUSAL | 334 | 807 | 442 |

PARTIAL responses are shorter than COMPLIANCE but comparable in thinking tokens. This suggests PARTIAL responses involve nearly as much deliberation as full compliance, but produce less output -- consistent with the model "holding back" while still partially complying.

## 6. Heuristic-LLM Agreement on PARTIAL

The cross-tabulation of heuristic and LLM verdicts reveals a striking pattern:

- 15,372 results: heuristic=PARTIAL AND llm=PARTIAL (95.5% of all LLM-PARTIAL)
- 455 results: heuristic=COMPLIANCE AND llm=PARTIAL (trusted graders only)
- 32 results: heuristic=REFUSAL AND llm=PARTIAL (trusted graders only)

For trusted LLM graders, 93% of PARTIAL reclassifications come from heuristic COMPLIANCE. This means the heuristic was calling these responses compliant, but the LLM grader identified hedging or incomplete compliance. The LLM grader is more conservative than the heuristic on these borderline cases.

## 7. PARTIAL by Attack Era

| Era | Total | PARTIAL % |
|-----|-------|-----------|
| crescendo_2024 | 311 | 9.0% |
| cipher_2023 | 146 | 7.5% |
| reasoning_2025 | 158 | 4.4% |
| general | 816 | 3.8% |
| dan_2022 | 1,185 | 0.3% |

These figures exclude the obliteratus-import population. Crescendo (multi-turn) attacks produce the highest PARTIAL rate among trusted-graded results. DAN-era attacks produce almost no PARTIALs -- models either fully comply or fully refuse to direct jailbreak prompts. This is consistent with the hypothesis that PARTIAL is a nuanced safety response that requires enough context to trigger hedging, not a universal behavior.

## 8. Implications

### 8.1 ASR Reporting

The 29.9% headline PARTIAL rate is misleading. It should always be reported with the caveat that 95% of PARTIALs come from the Qwen/obliteratus family. Corpus-wide broad ASR (COMPLIANCE + PARTIAL) of 67.6% is dominated by these two populations and does not generalise to the broader model landscape.

**Recommendation:** All ASR reports should provide both strict ASR (COMPLIANCE only) and broad ASR (COMPLIANCE + PARTIAL), and flag when Qwen-family models contribute more than 50% of the PARTIAL count.

### 8.2 Abliteration Research

PARTIAL is the measurable signature of incomplete safety removal. Abliteration at scale does not produce clean compliance -- it produces a hybrid state where safety awareness persists without refusal capability. This connects directly to the polyhedral refusal geometry finding (Report #198): if safety is encoded in multiple independent directions, abliteration that removes one direction (the refusal vector) leaves others (the hedging/awareness vectors) intact.

### 8.3 Safety Certification

For regulatory purposes (EU AI Act Article 9), a PARTIAL response may be as dangerous as a COMPLIANCE response -- the harmful content is still generated, just wrapped in disclaimers. The 34.2% DETECTED_PROCEEDS rate (Established Finding) likely overlaps heavily with the PARTIAL population. Both represent models that "know" a request is problematic but proceed anyway.

### 8.4 The Qwen Family Question

Qwen-family models (including base, instruct, and abliterated variants) account for a disproportionate share of PARTIAL verdicts even among non-abliterated models. Qwen/Qwen3-4B (non-abliterated): 75.2% PARTIAL. This suggests the Qwen safety training strategy produces a distinct behavioral profile -- hedging rather than refusing -- that may be a design choice, a training artifact, or a consequence of the underlying architecture's safety representation.

## 9. Methodology Notes

- Database: `database/jailbreak_corpus.db`, 53,831 LLM-graded results, 133,033 total
- Grader classifiers: obliteratus-import (n=42,346), anthropic/claude-haiku-4.5 (n=6,259), ollama (n=1,259), deepseek-r1:1.5b (n=699), gemini (n=555), others
- "Trusted graders" subset: Haiku 4.5, deepseek-r1:1.5b, ollama:deepseek-r1:1.5b, gemini (n=8,318)
- All SQL queries reproducible via `tools/database/query_cli.py`
- No Ollama was used for this analysis
- The obliteratus-import verdicts were generated during the OBLITERATUS mechanistic study (Report #183) using that study's own classification methodology, not FLIP grading. They are treated here as valid verdicts for epidemiological purposes, but their grading methodology differs from the trusted LLM grader subset.

## 10. Sprint 13 Grading Pipeline Status

As of 2026-03-24, the OpenRouter grading run for sprint 13 has produced output in `runs/grading/sprint13/`:

- **File:** `graded_arcee-ai_trinity-large-preview-free_traces.jsonl`
- **Traces graded:** 20
- **Grader model:** nvidia/nemotron-nano-9b-v2:free (via OpenRouter)
- **Verdict distribution:** 19 REFUSAL (95%), 1 PARTIAL (5%)
- **Assessment:** No concerning patterns. Trinity Large Preview is predominantly refusing AdvBench prompts, consistent with Report #223 (Trinity assessment). No single-verdict dominance bias. No ERROR accumulation. Grading run is healthy but early.

---

**References:**
- Report #48: Safety re-emergence at scale in abliterated models
- Report #65: Hallucination-refusal-PARTIAL equivalence
- Report #183: OBLITERATUS mechanistic results
- Report #190: DETECTED_PROCEEDS corpus analysis
- Report #198: Polyhedral refusal geometry
- Issue #235 (closed): PARTIAL verdict decomposition
- Issue #564: Sprint 13 LLM grading
