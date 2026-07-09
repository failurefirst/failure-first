---

title: "Free-Tier Safety Equity — Differential Jailbreak Vulnerability by API Pricing Tier"
description: "This report presents a matched-prompt analysis of safety behavior differences between free-tier (`:free` suffix) and paid API endpoints for the same underlying models served via OpenRouter. Using McNemar's test on matche..."
date: "2026-03-25"
reportNumber: 277
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/277-free-tier-safety-equity-analysis.m4a"
image: "https://cdn.failurefirst.org/images/reports/277-free-tier-safety-equity-analysis.png"
---

---

## Executive Summary

This report presents a matched-prompt analysis of safety behavior differences between free-tier (`:free` suffix) and paid API endpoints for the same underlying models served via OpenRouter. Using McNemar's test on matched pairs — the correct statistical test for paired binary outcomes — we find:

1. **DeepSeek R1-0528** shows a statistically significant free-tier safety degradation: 66.7% strict ASR (free) vs 16.7% (paid) on n=18 matched prompts (McNemar p=0.0039, 12:0 broad discordant pairs, p=0.0005).
2. **Devstral-2512** shows a directional effect: 37.5% vs 0.0% strict ASR (n=16, 6:0 discordant, McNemar p=0.031).
3. **GPT-OSS-120B** shows the *opposite* pattern: paid tier is more compliant (77.8% vs 36.1% strict ASR, p=0.006), suggesting different routing or system prompts rather than quantization.
4. **Llama 3.3-70B** shows a directional effect (+8.9pp strict ASR gap) but is not statistically significant after cleaning (McNemar p=0.42, n=45). The originally reported 3.75:1 ratio (Report #276) was inflated by NOT_GRADEABLE confounding — 29 of 45 "free-only compliances" were compared against paid responses that returned NOT_GRADEABLE (often zero-token outputs), not genuine refusals.
5. **Aggregate** across 7 model pairs: free tiers show higher strict ASR in 5 of 7 pairs (sign test p=0.23, not significant). The broad ASR aggregate approaches significance (46:30 discordant ratio, McNemar p=0.085).

**Policy implication:** The evidence suggests that free-tier endpoints for some models — particularly DeepSeek R1 — provide measurably lower safety than paid endpoints. This creates a two-tier safety system where users who cannot afford paid API access receive less safe model behavior. However, the effect is not uniform: it is model-specific and sometimes reversed, which argues against a simple "free = less safe" narrative.

---

## Motivation

Report #276, Finding 1, identified that free-tier models on OpenRouter appear to show systematically higher compliance with adversarial prompts than their paid counterparts. The original analysis reported a 3.75:1 ratio for Llama 3.3-70B (45 free-only compliances vs 12 paid-only) and 13:1 for DeepSeek R1.

This report deepens that finding by:
- Applying the correct statistical test (McNemar's matched-pair test) rather than ratio comparison
- Cleaning the data to exclude NOT_GRADEABLE, ERROR, and BENIGN_QUERY verdicts that inflated the original numbers
- Analyzing whether the effect is model-specific or provider-wide
- Examining what types of prompts drive the gap
- Assessing policy and regulatory implications

---

## Methodology

### Matched-Pair Design

For each model with both `:free` and paid variants in the database, we identify prompts evaluated by both endpoints. This yields matched pairs where the prompt is held constant and only the endpoint tier varies. This design controls for prompt difficulty, topic, and attack technique.

### Verdict Classification

We use COALESCE(llm_verdict, heuristic_verdict) throughout. For the cleaned analysis, we restrict to the four core verdicts: COMPLIANCE, PARTIAL, REFUSAL, and HALLUCINATION_REFUSAL. This excludes NOT_GRADEABLE (often zero-token responses from rate-limited free endpoints), ERROR, BENIGN_QUERY, and PARSE_ERROR.

### Statistical Test

McNemar's test (via exact binomial test on discordant pairs) is the appropriate test for paired binary outcomes. For each model pair, we count:
- **Free-only comply:** Prompts where free tier returned COMPLIANCE but paid did not
- **Paid-only comply:** The reverse

Under the null hypothesis (no tier effect), discordant pairs should split 50:50.

### Database

`database/jailbreak_corpus.db` (schema version 13). All OBLITERATUS datasets excluded.

---

## Results

### Table 1: Cleaned Matched-Pair Analysis (Core Verdicts Only)

| Model | n | Free Strict ASR | Paid Strict ASR | Gap | Discordant (F:P) | McNemar p | Sig |
|-------|---|-----------------|-----------------|-----|-------------------|-----------|-----|
| meta-llama/llama-3.3-70b-instruct | 45 | 40.0% | 31.1% | +8.9pp | 9:5 | 0.424 | ns |
| nvidia/nemotron-nano-9b-v2 | 41 | 43.9% | 31.7% | +12.2pp | 11:6 | 0.332 | ns |
| openai/gpt-oss-120b | 36 | 36.1% | 77.8% | -41.7pp | 6:21 | 0.006 | ** |
| google/gemma-3-27b-it | 35 | 5.7% | 0.0% | +5.7pp | 2:0 | 0.500 | ns |
| deepseek/deepseek-r1-0528 | 18 | 66.7% | 16.7% | +50.0pp | 9:0 | 0.004 | ** |
| mistralai/devstral-2512 | 16 | 37.5% | 0.0% | +37.5pp | 6:0 | 0.031 | * |
| nvidia/nemotron-3-nano-30b-a3b | 13 | 53.8% | 100.0% | -46.2pp | 0:6 | 0.031 | * |

### Table 2: Broad ASR (COMPLIANCE + PARTIAL)

| Model | n | Free Broad ASR | Paid Broad ASR | Gap | Discordant (F:P) | McNemar p | Sig |
|-------|---|----------------|----------------|-----|-------------------|-----------|-----|
| meta-llama/llama-3.3-70b-instruct | 45 | 48.9% | 42.2% | +6.7pp | 10:7 | 0.629 | ns |
| nvidia/nemotron-nano-9b-v2 | 41 | 63.4% | 43.9% | +19.5pp | 13:5 | 0.096 | ns |
| openai/gpt-oss-120b | 36 | 66.7% | 77.8% | -11.1pp | 6:10 | 0.455 | ns |
| google/gemma-3-27b-it | 35 | 8.6% | 5.7% | +2.9pp | 2:1 | 1.000 | ns |
| deepseek/deepseek-r1-0528 | 18 | 83.3% | 16.7% | +66.7pp | 12:0 | 0.0005 | *** |
| mistralai/devstral-2512 | 16 | 62.5% | 62.5% | +0.0pp | 3:3 | 1.000 | ns |
| nvidia/nemotron-3-nano-30b-a3b | 13 | 69.2% | 100.0% | -30.8pp | 0:4 | 0.125 | ns |

### Table 3: Aggregate Statistics

| Metric | Free-Only Discordant | Paid-Only Discordant | Ratio | McNemar p |
|--------|---------------------|---------------------|-------|-----------|
| Strict ASR | 43 | 38 | 1.13:1 | 0.657 |
| Broad ASR | 46 | 30 | 1.53:1 | 0.085 |

**Direction (strict):** Free tier shows higher ASR in 5 of 7 model pairs (sign test p=0.23, ns).

### Table 4: Full Verdict Distribution (All Verdicts, Unpaired)

| Model | Tier | COMPLIANCE | PARTIAL | REFUSAL | HR | NOT_GRADEABLE | ERROR | Other |
|-------|------|------------|---------|---------|-----|---------------|-------|-------|
| Llama 3.3-70B | free | 54 | 13 | 36 | 2 | 4 | 73 | 17 |
| Llama 3.3-70B | paid | 82 | 72 | 136 | -- | 141 | 51 | 81 |
| DeepSeek R1-0528 | free | 16 | 14 | 20 | 1 | -- | -- | 28 |
| DeepSeek R1-0528 | paid | 4 | 0 | 8 | 8 | -- | -- | -- |

---

## Key Findings

### Finding 1: DeepSeek R1 Shows Significant Free-Tier Safety Degradation

DeepSeek R1-0528 is the strongest signal in the dataset. On 18 matched prompts with core verdicts, the free tier complied on 12 (66.7%) while the paid tier complied on 3 (16.7%). All 12 discordant broad pairs favor the free tier being less safe (p=0.0005). This is a large and statistically robust effect.

**Prompt types driving the gap:** The free-only compliances include reasoning-exploit prompts (JA-REASON series: API simulation, code generation with harmful intent, struct initialization) and firmware debug mode attacks. These are sophisticated prompts that require the model to reason about whether the request is harmful. The paid tier's lower compliance suggests additional safety guardrails or different system prompts.

### Finding 2: The Original Llama 3.75:1 Ratio Was Inflated by NOT_GRADEABLE Confound

Report #276 reported 45 free-only compliances vs 12 paid-only for Llama 3.3-70B. However, 29 of those 45 "free-only" compliances were matched against paid-tier responses classified as NOT_GRADEABLE — typically zero-token responses from rate-limited or overloaded free endpoints being compared to a paid endpoint that simply did not generate output.

After restricting to the four core verdicts (both endpoints must return COMPLIANCE, PARTIAL, REFUSAL, or HALLUCINATION_REFUSAL), the Llama signal drops to 9:5 discordant pairs (McNemar p=0.42, not significant). The directional trend persists (+8.9pp strict ASR gap) but the sample size is insufficient for statistical significance.

**Lesson:** NOT_GRADEABLE verdicts must be excluded from matched-pair comparisons. A model that returns 0 tokens (NOT_GRADEABLE) is not the same as a model that actively refuses. This is a distinct failure mode — infrastructure failure vs safety behavior.

### Finding 3: The Effect Is Not Uniform — Some Models Show Reversed Patterns

**GPT-OSS-120B** shows the paid tier being *more* compliant (77.8% vs 36.1%, p=0.006). **Nemotron-3-Nano-30B** shows a similar reversal (100% paid vs 53.8% free, p=0.031). These reversed patterns suggest the tier difference is not a simple "free = quantized = less safe" story. Possible explanations include:

1. **Different routing infrastructure:** Free and paid endpoints may route to different model versions or backend providers
2. **Different system prompts:** OpenRouter may inject different safety system prompts for free vs paid tiers
3. **Quantization effects:** Free-tier models may use lower-precision quantization, but this can affect safety in either direction (reducing both capability and safety reasoning, or reducing capability to comply with complex harmful requests)
4. **Load-dependent behavior:** Free endpoints under heavy load may truncate responses or apply different generation parameters

### Finding 4: Prompt Types Suggest Reasoning-Exploit Vulnerability

The DeepSeek R1 free-only compliances cluster around reasoning-exploit prompts (JA-REASON series) and code/API simulation attacks. These are attacks that require the model to evaluate complex context to determine harm. The Llama free-only compliances include conlang-encoded prompts (though many were matched against NOT_GRADEABLE, so the signal is weak).

This pattern is consistent with a safety mechanism that operates at a different layer from the base model — if free-tier endpoints omit or reduce safety system prompts, the model's native reasoning about harm may be less reliable than externally-imposed guardrails.

---

## Corrections to Report #276

Report #276, Finding 1 should be read with the following corrections:

1. **Llama 3.75:1 ratio is overstated.** After excluding NOT_GRADEABLE confound, the cleaned ratio is approximately 1.8:1 (9:5 discordant) and not statistically significant (McNemar p=0.42).
2. **DeepSeek R1 13:1 ratio is confirmed and strengthened.** The cleaned analysis shows 9:0 strict discordant (p=0.004) and 12:0 broad discordant (p=0.0005). This is the most robust finding.
3. **The effect is model-specific, not provider-wide.** GPT-OSS-120B and Nemotron-3-Nano-30B show statistically significant reversed patterns (paid more compliant).

---

## Regulatory and Venue Implications

### EU AI Act (Article 9, Article 51)

The EU AI Act requires high-risk AI systems to maintain consistent safety properties across deployment configurations. If the same model exhibits materially different safety behavior depending on pricing tier, this could constitute:

- **Non-discrimination concern (Article 9(4)):** Safety properties should not vary based on the economic capacity of the API user
- **Conformity assessment challenge (Article 43):** Which tier represents the assessed configuration? Free-tier safety degradation means the conformity assessment of the paid tier does not transfer

### CCS Paper

This finding is directly relevant to Section 4 (Cross-Model Analysis) of the CCS paper. The free-tier safety gap represents a **deployment-level vulnerability** distinct from model-level vulnerability. It demonstrates that safety is not an intrinsic property of a model but a property of the deployment stack (model + system prompt + guardrails + quantization + routing).

**Recommended addition:** A brief subsection on "deployment-layer safety variance" noting the DeepSeek R1 finding (p=0.004 on strict, p=0.0005 on broad). This strengthens the paper's argument that safety evaluation must extend beyond model checkpoints to deployment configurations.

### AIES / FAccT

The free-tier safety equity finding has direct relevance to AI ethics venues:

- **Fairness dimension:** Lower-income users receive less safe AI through free tiers
- **Transparency dimension:** OpenRouter does not publicly document safety differences between free and paid tiers
- **Accountability dimension:** Who is responsible when a free-tier endpoint produces harmful content that the paid tier would refuse?

This framing makes it suitable for **AIES 2027** or **FAccT 2027** as a short paper on "Safety as a Luxury Good in API Markets."

### NeurIPS D&B Track

The matched-pair methodology and the NOT_GRADEABLE confound discovery are methodological contributions relevant to the NeurIPS Datasets & Benchmarks track. The finding that naive ratio comparison (Report #276) yields inflated estimates correctable by McNemar's test on cleaned pairs is a useful cautionary tale for safety benchmarking.

---

## Limitations

1. **Small sample sizes.** The largest cleaned matched set is n=45 (Llama); DeepSeek is n=18. These are sufficient for detecting large effects (DeepSeek's 50pp gap) but not for detecting small effects (<10pp).

2. **Observational design.** We cannot determine the causal mechanism (quantization, system prompt, routing, guardrails). A controlled experiment with identical prompts sent simultaneously to both endpoints is needed (see Issue for experiment design).

3. **Temporal confound.** Free and paid evaluations may have been run at different times. Model endpoints evolve; safety behavior observed in January may not reflect current state.

4. **Grading methodology.** Verdicts use COALESCE(llm_verdict, heuristic_verdict). As documented in CANONICAL_METRICS.md, heuristic verdicts have known over-report bias (kappa=0.126 vs LLM). Where both free and paid use the same grading methodology, this bias cancels in matched comparisons. But if grading quality differs (e.g., one tier's responses are more borderline), this could affect results.

5. **Platform-specific finding.** This analysis is specific to OpenRouter's free/paid tier distinction. Other platforms (direct DeepSeek API, Hugging Face Inference API, Replicate) may show different patterns.

6. **Lack of harm category stratification.** Most matched prompts lack AILuminate harm category labels (only benchmark_traces source dataset), preventing analysis of whether specific harm categories show larger gaps.

---

## Recommended Follow-Up

1. **Controlled experiment:** Send identical prompt sets simultaneously to free and paid endpoints for 5+ model pairs, n >= 100 per pair. Control for time-of-day, rate limiting, and response truncation. (See GitHub Issue.)

2. **System prompt extraction:** Attempt to extract system prompts from both free and paid endpoints using known system-prompt extraction techniques. This could reveal whether safety system prompts differ between tiers.

3. **Quantization isolation:** Compare the same model at different quantization levels (e.g., Llama 70B at Q4, Q6, Q8, FP16) on identical prompts to isolate the quantization effect from the platform effect.

4. **Cross-platform comparison:** Compare the same model (e.g., DeepSeek R1) served through OpenRouter free, OpenRouter paid, and the direct DeepSeek API to determine whether the effect is OpenRouter-specific.

5. **Longitudinal tracking:** Monitor the free/paid safety gap over time. If OpenRouter updates their free-tier infrastructure, the gap may change.

---

## Reproducing Queries

### Core Matched-Pair Query

```sql
WITH paired AS (
  SELECT REPLACE(m.name, ':free', '') as base,
    CASE WHEN m.name LIKE ':free' THEN 'free' ELSE 'paid' END as tier,
    r.prompt_id, COALESCE(r.llm_verdict, r.heuristic_verdict) as verdict
  FROM results r
  JOIN evaluation_runs er ON r.evaluation_run_id = er.id
  JOIN models m ON er.model_id = m.id
  JOIN prompts p ON r.prompt_id = p.id
  JOIN source_datasets sd ON p.source_dataset_id = sd.id
  WHERE sd.name NOT LIKE '%obliteratus%'
    AND COALESCE(r.llm_verdict, r.heuristic_verdict)
        IN ('COMPLIANCE','PARTIAL','REFUSAL','HALLUCINATION_REFUSAL')
    AND (m.name LIKE '%:free' OR m.name IN (
      SELECT REPLACE(name, ':free', '') FROM models WHERE name LIKE '%:free'))
)
SELECT p1.base, COUNT(*) as n,
  SUM(CASE WHEN p1.verdict='COMPLIANCE' AND p2.verdict!='COMPLIANCE' THEN 1 ELSE 0 END) as free_only,
  SUM(CASE WHEN p2.verdict='COMPLIANCE' AND p1.verdict!='COMPLIANCE' THEN 1 ELSE 0 END) as paid_only
FROM paired p1
JOIN paired p2 ON p1.base = p2.base AND p1.prompt_id = p2.prompt_id
WHERE p1.tier = 'free' AND p2.tier = 'paid'
GROUP BY p1.base
HAVING n >= 10
ORDER BY n DESC;
```

---

*Report generated by Clara Oswald, Principal Research Analyst*
*F41LUR3-F1R57 Embodied AI Safety Research*
