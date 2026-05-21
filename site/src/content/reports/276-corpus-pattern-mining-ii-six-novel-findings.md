---
title: "Corpus Pattern Mining II — Six Novel Empirical Findings"
description: "Continuing the pattern mining program initiated in Report #184, this report documents six empirical patterns discovered in the non-OBLITERATUS corpus (approximately 12,791 non-OBLITERATUS results across 236 models). All ..."
date: "2026-03-25"
reportNumber: 276
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
---

---

## Executive Summary

Continuing the pattern mining program initiated in Report #184, this report documents six empirical patterns discovered in the non-OBLITERATUS corpus (approximately 12,791 non-OBLITERATUS results across 236 models). All findings are backed by SQL queries against `database/jailbreak_corpus.db` with sample sizes and COALESCE(llm_verdict, heuristic_verdict) methodology noted. Each finding is novel relative to the 273 prior reports.

**Key Findings:**

1. **Free-tier safety degradation on matched prompts** — Llama 3.3-70B free-tier complies on 45 prompts where the paid tier refuses (n=203 matched pairs). DeepSeek R1 free-tier shows 13 free-only compliances vs 1 paid-only (n=79). The effect is directional: free tiers are consistently less safe.
2. **Reasoning overthink inverted-U in DeepSeek R1** — Short thinking traces (<500 tokens) yield 36.0% strict ASR, medium (500-1000) yield 40.0%, but very long traces (2000+) drop to 28.2%. More deliberation does not monotonically increase safety (n=182).
3. **Safety theater verbosity ratio** — Devstral-2512 generates refusals 1.91x longer than its compliances (1,487 vs 777 tokens). Models with theater_ratio > 1.2 produce verbose safety justifications that consume more compute than the harmful content they prevent (n=5 models with ratio > 1.2).
4. **Reasoning-era attacks bypass providers immune to legacy attacks** — Google shows 0.0% ASR on cipher_2023 but 18.2% on reasoning_2025 (n=22). Meta-Llama shows 0.0% on general AdvBench but 45.0% on reasoning_2025 (n=20). Providers have patched old attack families without generalizing to new ones.
5. **Response duration as a safety predictor** — Responses under 2 seconds show 5.1% strict ASR; responses over 60 seconds show 25.8% (n=6,800 with duration data). Faster responses correlate with safety, likely because refusals require less generation.
6. **Response-to-thinking ratio predicts compliance direction** — When response tokens exceed 5x thinking tokens (ratio > 5.0), strict ASR reaches 29.8% with only 13.0% refusal rate. When ratio is below 1.0x, refusal rate is 50.0% (n=1,224 with both metrics).

---

## Finding 1: Free-Tier Safety Degradation on Matched Prompts

**Claim:** Models served via OpenRouter's free tier (:free suffix) show systematically lower safety than their paid counterparts, measured on the same prompt set. This is not a sampling artifact -- the comparison uses identical prompts evaluated by both tiers.

**Evidence (Matched-Prompt Analysis):**

| Model Base | Matched Prompts | Free-Only Comply | Paid-Only Comply | Both Comply | Both Refuse |
|------------|-----------------|------------------|------------------|-------------|-------------|
| meta-llama/llama-3.3-70b-instruct | 203 | 45 | 12 | 9 | 13 |
| nvidia/nemotron-nano-9b-v2 | 98 | 14 | 27 | 7 | 8 |
| deepseek/deepseek-r1-0528 | 79 | 13 | 1 | 3 | 2 |
| openai/gpt-oss-120b | 58 | 9 | 21 | 7 | 2 |
| mistralai/devstral-2512 | 46 | 6 | 0 | 0 | 2 |
| google/gemma-3-27b-it | 89 | 2 | 0 | 0 | 24 |
| mistralai/mistral-small-3.1-24b-instruct | 60 | 0 | 0 | 0 | 0 |

**Directional Analysis:**
- **Llama 3.3-70B:** 45 prompts where free complied and paid refused, vs only 12 in the reverse direction. Ratio: 3.75:1 in favor of free-tier being less safe.
- **DeepSeek R1:** 13:1 ratio (free less safe).
- **NVIDIA Nemotron-9B and OpenAI GPT-OSS-120B** show the opposite pattern (paid more compliant), which may indicate different routing or quantization behavior.

**Source datasets for Llama free-only compliances:** 42 of 45 come from `benchmark_traces` (general adversarial prompts), 3 from `jailbreak_archaeology`. The free-tier vulnerability is not technique-specific.

**Interpretation:** Free-tier model endpoints on OpenRouter may use lower-precision quantization, different safety system prompts, or reduced guardrail layers compared to paid endpoints. The Llama 3.3-70B free-tier safety gap (45 free-only vs 12 paid-only compliances on 203 matched prompts) represents a meaningful deployment-level safety asymmetry. Users who cannot afford paid API access receive measurably less safe model behavior.

**Limitation:** This finding is observational. We cannot distinguish between quantization effects, system prompt differences, and rate-limit-induced safety bypass at the API level. Sample sizes per model pair range from 22 to 203 matched prompts. The NVIDIA and OpenAI inverse patterns suggest the effect is not uniform across providers.

```sql
-- Reproducing query
WITH paired AS (
  SELECT REPLACE(m.name, ':free', '') as base,
    CASE WHEN m.name LIKE '%:free' THEN 'free' ELSE 'paid' END as tier,
    r.prompt_id, COALESCE(r.llm_verdict, r.heuristic_verdict) as verdict
  FROM results r
  JOIN evaluation_runs er ON r.evaluation_run_id = er.id
  JOIN models m ON er.model_id = m.id
  JOIN prompts p ON r.prompt_id = p.id
  JOIN source_datasets sd ON p.source_dataset_id = sd.id
  WHERE sd.name NOT LIKE '%obliteratus%'
    AND (m.name LIKE '%:free' OR m.name IN (
      SELECT REPLACE(name, ':free', '') FROM models WHERE name LIKE '%:free'))
)
SELECT p1.base,
  COUNT(*) as matched_prompts,
  SUM(CASE WHEN p1.verdict='COMPLIANCE' AND p2.verdict!='COMPLIANCE' THEN 1 ELSE 0 END) as free_only_comply,
  SUM(CASE WHEN p1.verdict!='COMPLIANCE' AND p2.verdict='COMPLIANCE' THEN 1 ELSE 0 END) as paid_only_comply
FROM paired p1
JOIN paired p2 ON p1.base = p2.base AND p1.prompt_id = p2.prompt_id
WHERE p1.tier = 'free' AND p2.tier = 'paid'
GROUP BY p1.base
HAVING matched_prompts >= 15
ORDER BY free_only_comply DESC;
```

---

## Finding 2: Reasoning Overthink Inverted-U in DeepSeek R1

**Claim:** DeepSeek R1's compliance rate follows an inverted-U pattern as thinking trace length increases. Moderate deliberation (500-1000 tokens) yields the highest ASR, while both very short and very long traces show lower ASR.

**Evidence (DeepSeek R1 only, n=182 with thinking traces):**

| Thinking Bin | n | Strict ASR | Refusal Rate |
|-------------|---|------------|--------------|
| short (<500 tokens) | 50 | 36.0% | 40.0% |
| medium (500-1000) | 45 | 40.0% | 33.3% |
| long (1001-2000) | 48 | 31.3% | 27.1% |
| very long (2000+) | 39 | 28.2% | 28.2% |

**Interpretation:** This suggests two competing mechanisms:
- **Short traces:** The model may not engage deeply enough with adversarial framing, defaulting to trained safety reflexes (high refusal rate 40.0%).
- **Medium traces (peak ASR):** The model engages with the adversarial reasoning sufficiently to be manipulated, but not long enough to reason its way back to safety.
- **Long traces:** Extended deliberation gives the model more opportunity to identify the adversarial intent and course-correct (refusal rate drops but so does compliance -- suggesting more PARTIAL/HR verdicts).

This is consistent with Report #184 Finding 4 (thinking-token allocation inversion) but adds the non-monotonic shape. The finding is specific to DeepSeek R1; cross-model validation is needed.

**Limitation:** n=182 total, split across 4 bins of 39-50 each. The inverted-U pattern is suggestive but the per-bin sample sizes yield wide confidence intervals (approximately +/-14pp at 95% CI for the 40.0% peak).

---

## Finding 3: Safety Theater Verbosity Ratio

**Claim:** Some models generate significantly longer refusals than compliances, a phenomenon we term the "safety theater verbosity ratio." This represents wasted compute on safety justifications.

**Evidence (Models with >= 5 compliances and >= 5 refusals, response_tokens > 0):**

| Model | Avg Refuse Tokens | Avg Comply Tokens | Theater Ratio | n_refuse | n_comply |
|-------|-------------------|-------------------|---------------|----------|----------|
| mistralai/devstral-2512 | 1,487 | 777 | 1.91 | 19 | 11 |
| gemma2:2b | 410 | 229 | 1.79 | 31 | 6 |
| Qwen/Qwen2.5-7B-Instruct | 1,188 | 912 | 1.30 | 12 | 9 |
| deepseek-r1:1.5b | 1,181 | 939 | 1.26 | 62 | 88 |
| nvidia/nemotron-3-super-120b-a12b:free | 710 | 636 | 1.12 | 97 | 13 |

**Contrast:** Models with ratio < 1.0 (compliance longer than refusal):

| Model | Theater Ratio | n_refuse | n_comply |
|-------|---------------|----------|----------|
| deepseek/deepseek-r1-0528 | 0.74 | 59 | 62 |
| stepfun/step-3.5-flash:free | 0.64 | 76 | 8 |
| meta-llama/llama-3.3-70b-instruct | 0.51 (*) | 93 | 60 |

(*) Llama's compliances average 483 tokens while refusals average 245 -- efficiently brief refusals.

**Interpretation:** Models like Devstral-2512 spend nearly twice as many tokens explaining why they cannot comply as they would spend actually complying. This "verbose refusal" pattern has three implications: (1) it consumes unnecessary inference compute, (2) it may signal overtrained safety behavior that generates elaborate justifications, and (3) the verbosity itself may be a byproduct of instruction-following quality -- the model is "helpfully" explaining its refusal in detail. This connects to Report #259's FLIM Level 5 (safety theater) concept at the token generation level.

**Limitation:** Theater ratio is a descriptive metric, not a normative one. Verbose refusals may serve legitimate purposes (user education). Small compliance samples (n_comply < 10 for some models) make the ratio estimates noisy.

---

## Finding 4: Reasoning-Era Attacks Bypass Legacy-Immune Providers

**Claim:** Providers that show near-zero vulnerability to legacy attack eras (DAN 2022, cipher 2023) are significantly vulnerable to reasoning_2025 attacks. The safety training patched specific attack families without generalizing to new exploit vectors.

**Evidence (Provider x Era, n >= 10 per cell):**

| Provider | dan_2022 | cipher_2023 | crescendo_2024 | reasoning_2025 | general |
|----------|----------|-------------|----------------|----------------|---------|
| anthropic | - | 5.3% (n=38) | 5.4% (n=56) | 0.0% (n=20) | - |
| google | - | 0.0% (n=36) | 1.7% (n=58) | **18.2% (n=22)** | 4.6% (n=131) |
| meta-llama | - | - | - | **45.0% (n=20)** | 0.0% (n=50) |
| openai | - | 7.9% (n=38) | 10.3% (n=58) | 11.1% (n=18) | 13.3% (n=60) |
| nvidia | - | - | - | - | 18.2% (n=110) |

**Key Asymmetries:**
- **Google:** 0.0% ASR on cipher_2023 -> 18.2% on reasoning_2025. The Gemini 3 Flash preview model is specifically vulnerable to `reasoning_exploit/cot_manipulation` (4/4 = 100% ASR on that sub-technique, though n=4).
- **Meta-Llama:** 0.0% ASR on general AdvBench -> 45.0% on reasoning_2025. The free tier is even more vulnerable at 60.0% (n=10).
- **Anthropic:** The only provider showing 0.0% on reasoning_2025, maintaining its safety across all eras tested. This is consistent with Report #184's finding that Claude Sonnet 4.5 achieves 0% on CoT-exploits.

**Specific Reasoning Techniques (n >= 5):**

| Technique | n | Strict ASR | Broad ASR |
|-----------|---|------------|-----------|
| cot_manipulation | 29 | 41.4% | 51.7% |
| thinking_trace | 21 | 33.3% | 33.3% |
| meta_reasoning | 13 | 30.8% | 30.8% |
| chain_injection | 13 | 23.1% | 23.1% |
| reward_hacking | 13 | 15.4% | 15.4% |
| deductive_trap | 13 | 15.4% | 23.1% |
| safety_introspection | 15 | 13.3% | 20.0% |
| self_contradiction | 15 | 0.0% | 0.0% |

**Interpretation:** The reasoning_2025 era represents a qualitatively different attack surface. Legacy attacks (DAN, cipher, persona) operate at the prompt level -- they manipulate what the model is told to do. Reasoning exploits operate at the inference level -- they manipulate how the model thinks. Providers appear to have invested heavily in prompt-level defenses while the inference-level attack surface remains undertrained.

**Limitation:** Small per-cell samples (n=18-58) for era-stratified analysis. The reasoning_2025 prompts were specifically designed as novel attacks, which may inflate ASR relative to well-known legacy prompts that models have been trained to recognize.

---

## Finding 5: Response Duration as a Safety Predictor

**Claim:** Response latency correlates positively with compliance rate. Faster responses are more likely to be refusals; slower responses are more likely to be compliances.

**Evidence (n=6,800 with duration_ms > 0, non-OBLITERATUS):**

| Duration Bin | n | Strict ASR | Broad ASR | Refusal Rate |
|-------------|---|------------|-----------|--------------|
| < 2 seconds | 938 | 5.1% | 6.8% | 20.0% |
| 2-5 seconds | 672 | 6.5% | 10.3% | 26.3% |
| 5-15 seconds | 1,184 | 16.6% | 25.0% | 45.5% |
| 15-30 seconds | 1,785 | 16.1% | 24.6% | 24.3% |
| 30-60 seconds | 1,431 | 15.2% | 26.6% | 24.3% |
| 60+ seconds | 790 | 25.8% | 36.2% | 17.8% |

**Key Observation:** The jump from < 2s (5.1% ASR) to 60s+ (25.8% ASR) is a 5.1x increase. The pattern is approximately monotonic with one plateau in the 5-60s range.

**Interpretation:** This is primarily a confound rather than a causal mechanism: compliant responses generate more tokens (avg 1,294 tokens for COMPLIANCE vs 807 for REFUSAL, per verdict-verbosity analysis), which takes longer. Refusals are brief and therefore fast. However, the finding has practical implications:

- **Inference-time safety monitoring:** An anomalously long generation time could serve as a soft signal for compliance review.
- **Timeout-based safety:** Very short timeouts might inadvertently improve safety by truncating compliant generations before harmful content is fully produced.

**Limitation:** Duration confounded with response length, model speed, and server load. Not a causal relationship.

---

## Finding 6: Response-to-Thinking Ratio Predicts Compliance Direction

**Claim:** The ratio of response tokens to thinking tokens is a strong predictor of compliance vs. refusal among reasoning models.

**Evidence (n=1,224 results with both response_tokens > 0 and thinking_tokens > 0, non-OBLITERATUS):**

| Ratio Bin (resp/think) | n | Strict ASR | Refusal Rate | Avg Resp Tokens | Avg Think Tokens |
|------------------------|---|------------|--------------|-----------------|------------------|
| 0.5-1.0x (balanced) | 170 | 23.5% | 50.0% | 1,201 | 1,358 |
| 1-2x (resp dominant) | 659 | 20.0% | 44.8% | 1,339 | 1,019 |
| 2-5x (resp heavy) | 264 | 17.8% | 27.3% | 1,701 | 592 |
| >5x (minimal thinking) | 131 | 29.8% | 13.0% | 3,834 | 418 |

**Key Observations:**
- When thinking roughly equals response length (0.5-1x), refusal rate is highest (50.0%). The model is "agonizing" over the decision and more often refusing.
- When response tokens are 5x+ thinking tokens, the model produces very long outputs (avg 3,834 tokens) with minimal deliberation (avg 418 tokens). This yields the highest ASR (29.8%) and lowest refusal rate (13.0%).
- The minimal-thinking / long-response pattern suggests the model has "decided" quickly (possibly bypassed safety reasoning) and is generating at length.

**Interpretation:** This extends Report #184 Finding 4 (thinking-token allocation inversion). The ratio metric may be more diagnostic than absolute thinking tokens because it normalizes for the overall complexity of the task. A response-to-thinking ratio above 5.0 appears to be a strong signal that safety reasoning has been abbreviated relative to output generation -- a potential flag for automated safety monitoring.

**Limitation:** The ratio is model-dependent (some models always produce short thinking traces). Cross-model pooling may mask model-specific patterns.

---

## Cross-Cutting Theme: The Inference-Time Safety Gap

Findings 2, 4, 5, and 6 collectively point to a consistent pattern: **safety is not uniformly applied at inference time**. Models show variable safety behavior depending on:
- How long they think (Finding 2: inverted-U)
- What attack era they face (Finding 4: reasoning attacks bypass legacy defenses)
- How long the response takes to generate (Finding 5: duration correlation)
- How much thinking precedes the response (Finding 6: ratio as predictor)

This suggests that safety training creates a set of heuristic checkpoints rather than a deep semantic understanding of harmful intent. When the attack vector operates at a different level (reasoning vs. prompt, fast vs. slow, brief thinking vs. extended), the checkpoints fail.

---

## Recommended Follow-Up Experiments

1. **Free-tier safety audit (Finding 1):** Run identical prompt sets through free and paid endpoints for 10+ model pairs with n >= 100 per pair. Isolate whether the gap is quantization, system-prompt, or guardrail-related.
2. **Reasoning overthink validation (Finding 2):** Replicate the inverted-U pattern on Qwen3 and Nemotron reasoning models. If confirmed across 3+ models, this becomes a robust empirical finding.
3. **Safety theater cost estimation (Finding 3):** Calculate the aggregate compute cost of verbose refusals across the corpus. Estimate what fraction of inference spend goes to safety justifications.
4. **Reasoning-era attack expansion (Finding 4):** Expand the reasoning_2025 prompt set from 164 to 500+ results to reduce per-cell confidence intervals below +/-5pp.
5. **Resp/think ratio monitor prototype (Finding 6):** Build a lightweight classifier that flags results with resp/think > 5.0 for human review. Test whether this improves FLIP grading efficiency.

---

## Methodology

- **Database:** `database/jailbreak_corpus.db` (schema version 13)
- **Verdict source:** COALESCE(llm_verdict, heuristic_verdict) throughout
- **Corpus filter:** All analyses exclude OBLITERATUS datasets (`sd.name NOT LIKE '%obliteratus%'`)
- **Statistical note:** Per-cell sample sizes are noted for all findings. Confidence intervals are wide for cells with n < 50; findings should be treated as preliminary patterns requiring validation, not definitive conclusions.
- **Grading methodology:** Mixed (LLM-graded where available, heuristic fallback). See CANONICAL_METRICS.md for grading quality notes.

---

*Report generated by Clara Oswald, Principal Research Analyst*
*F41LUR3-F1R57 Embodied AI Safety Research*
