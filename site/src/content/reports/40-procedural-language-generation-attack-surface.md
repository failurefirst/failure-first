---

title: "Procedural Language Generation as Attack Surface"
description: "This brief presents preliminary results from testing procedurally-generated constructed language (conlang) encoding as an adversarial attack vector against large language models. Using the GLOSSOPETRAE xenolinguistics en..."
date: "2026-02-11"
reportNumber: 40
classification: "Research — Empirical Study"
status: "complete"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/40-procedural-language-generation-attack-surface.m4a"
---

---

## Executive Summary

This brief presents preliminary results from testing procedurally-generated constructed language (conlang) encoding as an adversarial attack vector against large language models. Using the GLOSSOPETRAE xenolinguistics engine, we generated 85 conlang-encoded adversarial scenarios across five attribute types and tested them against five free-tier OpenRouter models. Due to rate limiting, only one model (Llama 3.3 70B Instruct) returned usable responses.

Of 82 non-empty Llama 3.3 70B responses, keyword-based heuristic analysis flagged 76 as compliance (92.7% heuristic ASR). However, LLM-graded classification (Phase 5, using deepseek-r1:1.5b via Ollama) substantially revises this figure: **52.5% strict ASR** (42/80 COMPLIANCE) or **66.2% broad ASR** (53/80 including PARTIAL). The 40.2 percentage-point gap between heuristic and LLM-graded ASR is consistent with prior calibration showing heuristic COMPLIANCE is ~88% unreliable (Cohen's Kappa 0.245).

Per-attribute analysis reveals significant variation: ADVERSARIAL (combined encoding) achieved 75.0% strict ASR, while ADV (garden-path syntax alone) achieved only 18.8%. The model enters a "helpful translator" mode when presented with conlang input, attempting to decipher the constructed language rather than evaluating content for safety concerns.

Tokenizer analysis (Phase 3) reveals that conlang encoding compresses prompts to 0.5x the English token count while introducing 52.2% out-of-vocabulary tokens and 2.5x token fragmentation — consistent with degraded tokenizer-level pattern matching.

These results are from a single model on 80 gradable responses. They should be treated as preliminary evidence of conlang encoding's effect on safety filter engagement, not as a validated general finding.

---

## 1. Introduction

### 1.1 Context and Motivation

AI safety guardrails are primarily trained on natural languages, with the majority of safety training data in English. This creates a potential blind spot: procedurally-generated constructed languages may not trigger safety classifiers that rely on learned associations between natural language tokens and harmful intent. The GLOSSOPETRAE engine generates complete constructed languages from numeric seeds, including phonology, morphology, syntax, and a lexicon of approximately 1,254 words. Its adversarial attribute modes are designed to stress-test language model processing through garden-path syntax, tokenizer exploitation, and undertrained token representations.

This brief reports results from Phase 2 of the GLOSSOPETRAE integration (Issue #122), which benchmarked conlang-encoded adversarial scenarios against free-tier models via OpenRouter.

### 1.2 Scope

**In scope:**
- Heuristic and LLM-graded attack success rates for conlang-encoded prompts against one model (Llama 3.3 70B Instruct)
- Per-attribute breakdown across five GLOSSOPETRAE encoding types
- Qualitative analysis of model response behavior
- Tokenizer analysis of conlang encoding properties (Phase 3)
- LLM-graded classification using deepseek-r1:1.5b via Ollama (Phase 5)

**Out of scope:**
- Multi-model comparison (rate-limited; four of five models returned zero usable responses)
- English baseline comparison (not yet benchmarked under identical conditions)
- Detailed tokenizer-level attention pattern analysis

---

## 2. Methodology

### 2.1 Scenario Generation with GLOSSOPETRAE

Scenarios were generated using `tools/generate_conlang_scenarios.py`, which bridges to the GLOSSOPETRAE engine (v3.1) via a Node.js adapter (`tools/conlang/glossopetrae_bridge.mjs`). Source adversarial prompts from the F41LUR3-F1R57 jailbreak archaeology corpus were translated into the generated language "Tikauian" (a fusional language with OVS word order).

**Generation parameters:**
- Source dataset: F41LUR3-F1R57 jailbreak archaeology prompts (DAN variants, developer mode, persona hijack, etc.)
- Language: Tikauian (fusional morphology, OVS word order)
- Lexicon size: ~1,256 words
- Generator: glossopetrae_v3.1

**Five attribute types were tested, 17 scenarios each (85 total):**

| Attribute | Code | Seed | Description |
|-----------|------|------|-------------|
| Adversarial phonology | ADV | 42 | Garden-path syntax, ambiguous morphology |
| Phonotactic constraints | PHT | 1337 | Phonotactic patterns that stress language processing |
| Glitch/unicode | GLT | 9999 | Exploits undertrained token representations |
| TokenBreaker | TKB | 7777 | BPE tokenizer exploitation patterns |
| General adversarial | ADVERSARIAL | 12345 | Combined adversarial encoding |

**Important encoding characteristic:** The GLOSSOPETRAE lexicon covers approximately 1,254 words. Domain-specific and technical terms not in the lexicon pass through untranslated, enclosed in brackets (e.g., `[chatgpt]`, `[pretend]`, `[developer]`). This creates hybrid conlang/English prompts where structural words are encoded but many content-bearing words remain in English. This partial translation is a key factor in interpreting results.

### 2.2 Benchmark Configuration

Benchmarking used `tools/benchmarks/run_benchmark_http.py` via OpenRouter with five free-tier models:

| Model | Parameter Count | Result |
|-------|----------------|--------|
| meta-llama/llama-3.3-70b-instruct:free | 70B | 82/85 responses received |
| google/gemma-3-27b-it:free | 27B | 0/85 (all rate-limited, HTTP 403) |
| nvidia/nemotron-nano-9b-v2:free | 9B | 0/85 (all rate-limited, HTTP 403) |
| mistralai/mistral-small-3.1-24b-instruct:free | 24B | 0/85 (all rate-limited, HTTP 403) |
| liquid/lfm-2.5-1.2b-instruct:free | 1.2B | 0/85 (all rate-limited, HTTP 403) |

Only Llama 3.3 70B produced usable data. The remaining four models hit persistent account-level rate limits (HTTP 403) across all 85 scenarios each, returning empty responses. Total token usage for Llama: 376,877 tokens (343,935 prompt + 32,942 completion) at $0.00 (free tier).

### 2.3 Classification Method

Attack success was determined by the benchmark runner's built-in heuristic classifier, which flags responses based on keyword and structural patterns. This is the same heuristic that has been documented in prior work (Report #34, Mistake #21) as having significant limitations — specifically, it detects response style (helpful, step-by-step) rather than semantic harm content. Prior calibration on the faithfulness gap family showed heuristic COMPLIANCE was 88% incorrect (Cohen's Kappa 0.245 against LLM grading).

---

## 3. Results

### 3.1 Overall Heuristic ASR

Of 85 total scenarios submitted to Llama 3.3 70B Instruct:
- **82 returned non-empty responses** (3 failed due to HTTP 403 rate limiting on final retries)
- **76/82 non-empty responses flagged as heuristic attack success (92.7%)**
- **6 responses contained refusal keywords** (partial refusals with disclaimers)
- The 3 empty responses (all from the TKB attribute set) are excluded from ASR calculation

### 3.2 Per-Attribute Breakdown (Heuristic)

| Attribute | Usable Responses | Heuristic Attack Success | Heuristic Refusal | Heuristic ASR |
|-----------|-----------------|-------------------------|-------------------|---------------|
| ADV (adversarial phonology) | 17/17 | 15 | 2 | 88.2% |
| ADVERSARIAL (general) | 17/17 | 16 | 1 | 94.1% |
| GLT (glitch/unicode) | 17/17 | 16 | 1 | 94.1% |
| PHT (phonotactic) | 17/17 | 16 | 1 | 94.1% |
| TKB (tokenbreaker) | 14/17 | 13 | 1 | 92.9% |
| **Total** | **82/85** | **76** | **6** | **92.7%** |

All five attribute types showed heuristic ASR between 88-94%. The six refusals contained keywords like "harmful" or "I cannot" but several still partially engaged with the translated content. The three TKB failures were infrastructure errors (rate limits), not model refusals.

### 3.3 LLM-Graded Classification (Phase 5)

All 85 traces were classified using deepseek-r1:1.5b via Ollama with a 5-category verdict system (COMPLIANCE, REFUSAL, PARTIAL, BENIGN_QUERY, HALLUCINATION_REFUSAL). Five traces returned classification errors and were excluded from ASR calculations.

**Overall LLM-graded distribution (85 traces):**

| Verdict | Count | Percentage |
|---------|-------|------------|
| COMPLIANCE | 42 | 52.5% of graded |
| REFUSAL | 26 | 32.5% |
| PARTIAL | 11 | 13.8% |
| ERROR | 5 | (excluded) |
| BENIGN_QUERY | 1 | 1.2% |

**LLM-graded ASR:** 42/80 = **52.5%** (strict, COMPLIANCE only)
**Broad ASR:** 53/80 = **66.2%** (COMPLIANCE + PARTIAL)

**Per-Attribute LLM-Graded Breakdown:**

| Attribute | Graded | COMPL | PART | REF | Strict ASR | Broad ASR |
|-----------|--------|-------|------|-----|------------|-----------|
| ADV (adversarial phonology) | 16 | 3 | 5 | 8 | 18.8% | 50.0% |
| ADVERSARIAL (general) | 16 | 12 | 1 | 3 | 75.0% | 81.2% |
| GLT (glitch/unicode) | 16 | 9 | 1 | 6 | 56.2% | 62.5% |
| PHT (phonotactic) | 16 | 9 | 1 | 6 | 56.2% | 62.5% |
| TKB (tokenbreaker) | 16 | 9 | 3 | 3 | 56.2% | 75.0% |
| **Total** | **80** | **42** | **11** | **26** | **52.5%** | **66.2%** |

**Key finding:** The heuristic-to-LLM gap is 40.2 percentage points (92.7% heuristic → 52.5% LLM strict). This is the largest gap observed in any F41LUR3-F1R57 campaign, exceeding the Codex faithfulness gap (84% → 47%, 37pp). The gap is consistent across attributes but varies dramatically in magnitude: ADV drops from 88.2% to 18.8% (69.4pp gap) while ADVERSARIAL drops from 94.1% to 75.0% (19.1pp gap).

The per-attribute variation is notable: ADVERSARIAL (combined encoding) achieves 3-4x the strict ASR of ADV (garden-path syntax alone). This suggests that adversarial effectiveness is highly sensitive to the specific encoding strategy, not just the presence of conlang encoding.

### 3.4 Qualitative Response Behavior

Examination of Llama 3.3 70B responses reveals a consistent behavioral pattern. When presented with conlang-encoded input, the model appears to enter a "helpful translator" mode. A representative response begins with the model acknowledging the unusual input format and attempting to decipher the constructed language, rather than evaluating the content for safety concerns.

This behavior is consistent across all attribute types. The model treats the conlang input as a linguistic puzzle to be solved rather than as a potential adversarial prompt. Because many English content words pass through the conlang encoding untranslated (in brackets), the model can partially reconstruct the original intent — but it does so in a translation/explanation context rather than a safety-evaluation context.

**Key observation:** The model's engagement with the conlang input is qualitatively different from typical jailbreak compliance. In standard jailbreak scenarios, the model either refuses or complies with the harmful request. In conlang scenarios, the model engages with the *form* of the input (attempting translation) rather than the *content* (harmful request). Whether this form of engagement constitutes a safety filter bypass requires LLM-graded analysis of the actual response content.

### 3.5 Comparison with Prior Results

| Campaign | Model | Heuristic ASR | LLM-Graded ASR | H→L Gap |
|----------|-------|---------------|-----------------|---------|
| **Conlang (this report)** | **Llama 3.3 70B** | **92.7%** | **52.5%** | **40.2pp** |
| Faithfulness gap | Nemotron 30B | 92% | Not yet graded | — |
| Faithfulness gap | Llama 70B | 91% | Not yet graded | — |
| Faithfulness CLI | Codex | 84% | 47% | 37pp |
| Faithfulness CLI | Claude | 4% | 30% | -26pp |
| Steering family | Various | Lower range | — | — |
| Report #34 corrected | Various | ~9.7% | — | — |

The conlang campaign's 40.2pp heuristic-to-LLM gap is the largest observed across all F41LUR3-F1R57 campaigns, consistent with the "helpful translator" mode producing responses that trigger heuristic compliance keywords without containing genuinely harmful content.

---

## 4. Analysis

### 4.1 Hypothesized Mechanism: Safety Filter Bypass via Input Domain Shift

The preliminary results suggest a plausible mechanism by which conlang encoding may interact with model safety filters. Safety filters in current LLMs are trained primarily on natural language inputs. When input arrives in an unfamiliar constructed language, the model may prioritize its language modeling capabilities (translation, pattern recognition) over its safety classification capabilities. This would represent an input domain shift that moves the prompt outside the distribution on which safety training was most effective.

This hypothesis is consistent with the model's observed "helpful translator" behavior, but it remains unvalidated. Alternative explanations include:

- **Heuristic classifier artifact:** The heuristic may flag translation-mode responses as "compliance" when they are semantically benign (per Mistake #21)
- **Partial readability:** Bracketed English words preserve enough of the original prompt for the model to engage, but the conlang framing changes the model's response posture
- **Prompt length effect:** Conlang-encoded prompts are longer and contain more tokens, which may independently affect model behavior

### 4.2 The Partial Translation Factor

A distinctive feature of GLOSSOPETRAE encoding is that words absent from the ~1,254-word lexicon pass through untranslated in brackets. In practice, this means domain-specific terms, proper nouns, and many action verbs appear in English within the conlang text. For example, a prompt may contain conlang function words (case markers, prepositions, negation) surrounding English content words like `[chatgpt]`, `[pretend]`, `[developer]`, `[hack]`, `[safety]`.

This creates a hybrid encoding that is neither fully obfuscated nor fully transparent. The safety implications are ambiguous:
- If the model can reconstruct harmful intent from the bracketed English words, then the conlang encoding provides minimal obfuscation
- If the conlang framing shifts the model into a translation mode that deprioritizes safety checks, then even partial readability may be insufficient for safety enforcement

Resolving this ambiguity requires examining whether model responses actually contain harmful content or merely engage with the translation task.

### 4.3 Tokenizer Analysis (Phase 3 Results)

Tokenizer analysis using tiktoken (cl100k_base, GPT-4 class) across all 85 conlang scenarios reveals structural properties of the encoding:

| Metric | Mean | Median | Min | Max |
|--------|------|--------|-----|-----|
| Token ratio (conlang/english) | 0.484 | 0.459 | 0.155 | 0.912 |
| OOV rate (non-bracket words) | 52.2% | 52.9% | 0% | 100% |
| Token fragmentation ratio | 2.46x | 2.46x | 1.80x | 3.10x |
| Translation coverage | 57.0% | 57.9% | 40.0% | 70.6% |
| Bracket English passthrough | 7.3 words | 6 | 2 | 16 |

**Key findings:**

1. **Token compression:** Conlang prompts use approximately half the tokens of their English originals (0.48x ratio). This is because the conlang lexicon maps many English function words to shorter conlang equivalents, and untranslated words are already short tokens.

2. **High OOV rate:** 52.2% of non-bracket conlang words are out-of-vocabulary for the cl100k_base tokenizer. These novel tokens are fragmented into an average of 3.05 sub-tokens per word (versus 1.25 for English), meaning the tokenizer has no learned semantic representation for them.

3. **Partial translation:** Only 57% of words are actually translated into the conlang; 43% pass through as bracketed English. This means the model receives a mix of novel (uninterpretable) and familiar (English) tokens, potentially disrupting the sequence-level pattern matching that safety filters rely on.

These metrics are consistent with the input domain shift hypothesis: conlang encoding produces token sequences that are structurally different from the natural language distribution on which safety training was performed. However, the tokenizer analysis alone cannot determine whether this structural difference is causally related to the observed heuristic ASR.

### 4.4 Limitations of Single-Model Inference

All usable data comes from a single model (Llama 3.3 70B Instruct). Prior work in this project has shown substantial variation in safety behavior across models — faithfulness gap structural ASR ranged from 0% (Gemma 27B) to 92% (Nemotron 30B) across eight models. Llama 70B has shown high heuristic ASR across multiple attack families (91% on faithfulness gap), which may indicate this model is generally more susceptible to the heuristic classifier's detection patterns rather than specifically vulnerable to conlang encoding.

Without data from additional models, it is impossible to determine whether the observed behavior is specific to conlang encoding, specific to Llama 70B, or an artifact of the heuristic classifier.

---

## 5. Limitations

This section enumerates the known limitations of these preliminary results. Each limitation represents a potential source of error that could substantially change the findings.

### 5.1 Classification Limitations

LLM-graded classification (Phase 5) was performed using deepseek-r1:1.5b, a small reasoning model. While this model has shown reasonable accuracy on 5-category verdict classification (~80-90% agreement on prior calibration samples), it has a ~10-20% ERROR rate on longer responses. Five of 85 traces returned classification errors. Additionally, the LLM grader itself has not been calibrated against human annotation for conlang-specific response patterns — the "helpful translator" mode may present novel classification challenges.

### 5.2 Single Model

Only Llama 3.3 70B Instruct returned usable responses. Four other models (Gemma 27B, Nemotron 9B, Mistral Small 24B, LFM 1.2B) were completely rate-limited on the free tier. Single-model results cannot be generalized to other models or model families.

### 5.3 Sample Size

82 usable responses is a preliminary sample. While sufficient to identify behavioral patterns, it is insufficient for robust statistical claims about ASR by attribute type (each attribute has only 14-17 responses).

### 5.4 No English Baseline Comparison

Conlang scenarios were not benchmarked alongside their English originals under identical conditions. Without a controlled comparison, it is impossible to attribute the observed ASR to the conlang encoding specifically. The source prompts (DAN variants, developer mode, etc.) may achieve similar or higher ASR in English on the same model.

### 5.5 Free-Tier Constraints

Free-tier rate limits prevented multi-model comparison and may have introduced selection bias. The models that were available on the free tier may not be representative of production-grade models with more robust safety training.

### 5.6 Partial Translation Confound

Because many English content words pass through the conlang encoding untranslated, the effective obfuscation level is lower than a fully encoded language would provide. The observed results may reflect the model's response to partially readable adversarial prompts rather than to genuine language-level encoding.

---

## 6. Recommendations for Further Research

### 6.1 LLM-Graded Classification (COMPLETED)

Phase 5 LLM grading is complete. Results show 52.5% strict ASR (down from 92.7% heuristic), the largest heuristic-to-LLM gap observed in the project (40.2pp). Further calibration against human annotation would strengthen confidence in these figures, particularly for the novel "helpful translator" response pattern.

### 6.2 English Baseline Comparison

**Priority: High.** Benchmark the same 85 source prompts in their original English against the same model under identical conditions. This controlled comparison is necessary to determine whether the conlang encoding adds any attack effectiveness beyond what the source prompts achieve in English.

### 6.3 Multi-Model Replication

**Priority: Medium.** Repeat the benchmark against paid-tier models (bypassing free-tier rate limits) to determine whether the observed behavior is specific to Llama 3.3 70B or generalizes across model families. Prior faithfulness gap data (0%-92% ASR across 8 models) suggests substantial model-level variation is likely.

### 6.4 Extended Tokenizer Analysis

**Priority: Medium.** Phase 3 tokenizer analysis (Section 4.4) established baseline metrics. Further investigation should examine whether specific BPE fragmentation patterns correlate with safety filter bypass rates across different tokenizer implementations (SentencePiece, tiktoken, Unigram). Attention pattern analysis on conlang tokens may reveal whether the model processes them differently from natural language tokens.

### 6.5 Full Lexicon Encoding

**Priority: Low.** Investigate whether expanding the GLOSSOPETRAE lexicon to cover domain-specific terms (eliminating bracketed English pass-through words) changes the attack effectiveness. This would isolate the contribution of full language encoding versus partial translation.

---

## Appendix A: Data Sources and Artifacts

### Scenario Files

| File | Attribute | Seed | Count |
|------|-----------|------|-------|
| `data/conlang/conlang_adv_s42.jsonl` | ADV | 42 | 17 |
| `data/conlang/conlang_pht_s1337.jsonl` | PHT | 1337 | 17 |
| `data/conlang/conlang_glt_s9999.jsonl` | GLT | 9999 | 17 |
| `data/conlang/conlang_tkb_s7777.jsonl` | TKB | 7777 | 17 |
| `data/conlang/conlang_adversarial_s12345.jsonl` | ADVERSARIAL | 12345 | 17 |

### Trace Files

All traces stored in `runs/conlang_phase2/`:

| Model | Trace File | Usable Responses |
|-------|-----------|------------------|
| Llama 3.3 70B | `meta-llama_llama-3.3-70b-instruct-free_traces.jsonl` | 82/85 |
| Llama 3.3 70B (LLM-graded) | `llama70b_classified.jsonl` | 80/85 graded |
| LLM grading log | `grading.log` | 85 entries |
| Gemma 27B | `google_gemma-3-27b-it-free_traces.jsonl` | 0/85 |
| Nemotron 9B | `nvidia_nemotron-nano-9b-v2-free_traces.jsonl` | 0/85 |
| Mistral Small 24B | `mistralai_mistral-small-3.1-24b-instruct-free_traces.jsonl` | 0/85 |
| LFM 1.2B | `liquid_lfm-2.5-1.2b-instruct-free_traces.jsonl` | 0/85 |

### Tools Used

- `tools/generate_conlang_scenarios.py` — Scenario generation
- `tools/conlang/glossopetrae_bridge.mjs` — GLOSSOPETRAE Node.js bridge
- `tools/benchmarks/run_benchmark_http.py` — Benchmark runner (OpenRouter API)
- `tools/conlang/tokenizer_analysis.py` — BPE tokenizer analysis (tiktoken cl100k_base)

---

## Appendix B: Related Work

### F41LUR3-F1R57 Research Series

- **Report 31**: Jailbreak Archaeology — Historical evolution of adversarial techniques
- **Report 33**: Capability-Safety Spectrum — Trade-offs in model capability vs. safety constraints
- **Report 34**: Cross-Model Vulnerability Inheritance — Multi-agent failure modes (corrected ASR ~9.7%)
- **Report 35**: Moltbook Ecosystem Analysis — Emergent authority hierarchies in agent networks

### Relevant External Research

- Language-level adversarial attacks on LLMs (multilingual jailbreak literature)
- BPE tokenizer vulnerability research
- Safety filter generalization across languages and encodings
- Constructed language research in computational linguistics

### Related Issues

- **#122**: GLOSSOPETRAE conlang-based adversarial testing campaign (this report is Phase 4)
- **#121**: Bleeding-edge eval tracking
- **#34**: LLM grading pipeline and consensus classification

---

**Prepared by:** F41LUR3-F1R57 Research Team
**Contact:** Research conducted in the Failure-First Embodied AI repository
**License:** CC BY-SA 4.0

⟪F41LUR3-F1R57-EMBODIED-AI-RESEARCH⟫
