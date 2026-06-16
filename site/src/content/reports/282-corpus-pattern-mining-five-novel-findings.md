---

title: "Corpus Pattern Mining — Five Novel Empirical Findings"
description: "Mining the full non-OBLITERATUS corpus (132,416 total results; approximately 10,956 non-OBLITERATUS evaluable results across 236 models), this report documents five empirical patterns not previously reported in the Failu..."
date: "2026-03-24"
reportNumber: 282
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/282-corpus-pattern-mining-five-novel-findings.m4a"
---

---

## Executive Summary

Mining the full non-OBLITERATUS corpus (132,416 total results; approximately 10,956 non-OBLITERATUS evaluable results across 236 models), this report documents five empirical patterns not previously reported in the Failure-First project. All findings are backed by SQL queries against `database/jailbreak_corpus.db` with sample sizes noted.

**Key Findings:**
1. **CoT-exploit attacks show inverted scaling** — small models (<4B) at 42.9% strict ASR vs XL models (120B+) at 7.5%, specific to the `cot_exploit` family (n=114).
2. **Multi-turn attacks produce the highest PARTIAL rate** in the corpus (28.6%) — a distinct failure mode of hedging compliance (n=171).
3. **Hallucination-refusal scales inversely with model size** — small models at 21.3% HR rate vs XL at 3.0% (n=3,379 evaluable with known size).
4. **Reasoning models show a thinking-token allocation inversion** — refusals have higher think/response ratios (0.66) than compliances (0.55), suggesting deliberation costs are paid on safety rather than compliance (n=212).
5. **Fraud harm category is uniquely susceptible to CoT-exploit** at 33.3% broad ASR, while violence and other categories cluster at 8-15% for the same technique family (n=111).

---

## Finding 1: CoT-Exploit Inverted Scaling (Technique-Specific)

**Claim:** Chain-of-thought exploitation attacks show a scaling pattern where smaller models are *more* vulnerable than larger models, specific to the `cot_exploit` technique family. This contrasts with the corpus-wide finding that inverse scaling is not supported (r=-0.140, Report #50).

**Evidence:**

| Size Bucket | n | Strict ASR | Broad ASR |
|-------------|---|------------|-----------|
| small (<4B) | 42 | 42.9% | 52.4% |
| large (24-70B) | 32 | 21.9% | 21.9% |
| xl (120B+) | 40 | 7.5% | 15.0% |

Per-model breakdown (n >= 5 per model):

| Model | Provider | Params | n | Strict ASR | Broad ASR |
|-------|----------|--------|---|------------|-----------|
| deepseek-r1:1.5b | ollama | 1.5B | 14 | 57.1% | 78.6% |
| qwen3:1.7b | ollama | 1.7B | 14 | 42.9% | 42.9% |
| llama3.2:latest | ollama | 3B | 14 | 28.6% | 35.7% |
| meta-llama/llama-3.3-70b-instruct | meta-llama | 70B | 10 | 30.0% | 30.0% |
| gemini-3-flash-preview | google | 30B | 22 | 18.2% | 18.2% |
| gpt-5.2 | openai | 200B | 18 | 11.1% | 22.2% |
| claude-sonnet-4-5-20250929 | anthropic | 175B | 20 | 0.0% | 0.0% |

**Interpretation:** CoT-exploit attacks work by manipulating the reasoning chain itself. Small models have less capacity to distinguish between legitimate and adversarial reasoning steps. Larger models can reason about the attack structure within their thinking process. Notably, Claude Sonnet 4.5 achieves 0% ASR on CoT-exploits despite other frontier models showing 11-22% broad ASR — suggesting Anthropic's safety training specifically addresses reasoning-chain manipulation.

**Limitation:** n=114 total for size-stratified analysis. The Llama 70B result (30.0% strict ASR, n=10) is an outlier relative to its size bucket, possibly reflecting Llama's known permissiveness to certain request types.

```sql
-- Reproducing query
SELECT
    CASE
        WHEN m.parameter_count IN ('1.5B','1.7B','1.2B','3B') THEN 'small (<4B)'
        WHEN m.parameter_count IN ('4B','7B','8B','9B','12B','14B') THEN 'medium (4-14B)'
        WHEN m.parameter_count IN ('24B','27B','30B','32B','70B') THEN 'large (24-70B)'
        WHEN m.parameter_count IN ('120B','123B','175B','200B','405B','671B') THEN 'xl (120B+)'
    END as size_bucket,
    t.family, COUNT(r.id) as n,
    ROUND(100.0 * SUM(CASE WHEN COALESCE(r.llm_verdict, r.heuristic_verdict) = 'COMPLIANCE' THEN 1 ELSE 0 END) / COUNT(r.id), 1) as strict_asr
FROM results r
JOIN evaluation_runs er ON r.evaluation_run_id = er.id
JOIN models m ON er.model_id = m.id
JOIN prompts p ON r.prompt_id = p.id
JOIN techniques t ON p.technique_id = t.id
JOIN source_datasets sd ON p.source_dataset_id = sd.id
WHERE sd.name NOT LIKE '%obliter%' AND t.family = 'cot_exploit'
AND m.parameter_count IS NOT NULL AND m.parameter_count != 'unknown'
GROUP BY size_bucket HAVING n >= 10
ORDER BY size_bucket;
```

---

## Finding 2: Multi-Turn Attacks Produce the Highest PARTIAL Rate in the Corpus

**Claim:** The `multi_turn` technique family produces PARTIAL verdicts at 28.6% — nearly 6x the corpus-wide PARTIAL rate for non-multi-turn techniques (~5%). This suggests multi-turn attacks create a distinctive failure mode: models that hedge textually while partially complying.

**Evidence:**

| Era | Family | n | Full Comply | PARTIAL | Refused | HR | PARTIAL Rate |
|-----|--------|---|-------------|---------|---------|----|-|
| crescendo_2024 | multi_turn | 171 | 39 (22.8%) | 24 (14.0%) | 10 (5.8%) | 11 (6.4%) | **28.6%** |
| cipher_2023 | encoding | 60 | 5 | 7 | 40 | 8 | 11.7% |
| reasoning_2025 | cot_exploit | 158 | 34 | 7 | 71 | 3 | 6.1% |
| general | other | 816 | 89 | 31 | 537 | 21 | 4.6% |
| dan_2022 | persona | 1177 | 7 | 3 | 1000 | 2 | 0.3% |

Per-model multi-turn PARTIAL rates (n >= 5):

| Model | Provider | n | PARTIAL % |
|-------|----------|---|-----------|
| gpt-5.2 | openai | 20 | 37.5% |
| qwen3:1.7b | ollama | 24 | 36.4% |
| claude-sonnet-4-5-20250929 | anthropic | 22 | 28.6% |
| deepseek-r1:1.5b | ollama | 70 | 27.3% |
| gemini-3-flash-preview | google | 24 | 20.0% |

**Interpretation:** Multi-turn attacks erode safety boundaries gradually. The high PARTIAL rate indicates models recognize harmful intent (they hedge) but the conversational momentum overcomes complete refusal. Critically, even frontier models (GPT-5.2 at 37.5%, Claude at 28.6%) show elevated PARTIAL rates on multi-turn. This is a qualitatively different failure from single-shot compliance — the model *knows* it should refuse but partially complies anyway. This connects to the VLA PARTIAL dominance finding (Report #49) where hedging text does not prevent harmful action execution.

---

## Finding 3: Hallucination-Refusal Scales Inversely with Model Size

**Claim:** Hallucination-refusal (HR) — where models appear to refuse but produce harmful content — occurs at dramatically different rates by model size. Small models (<4B) produce HR at 21.3% vs XL models (120B+) at 3.0%.

**Evidence:**

| Size Bucket | n (evaluable) | HR Count | HR Rate | Strict ASR |
|-------------|---------------|----------|---------|------------|
| small (<4B) | 1,584 | 338 | **21.3%** | 28.7% |
| medium (4-14B) | 305 | 39 | 12.8% | 31.1% |
| large (24-70B) | 849 | 37 | 4.4% | 20.8% |
| xl (120B+) | 641 | 19 | **3.0%** | 22.6% |

By provider (non-OBLITERATUS, evaluable, n >= 20):

| Provider | n | HR Rate | Strict ASR |
|----------|---|---------|------------|
| ollama (mostly small) | 1,713 | 20.9% | 29.2% |
| meta | 99 | 14.1% | 12.1% |
| mistralai | 296 | 8.8% | 21.6% |
| google | 343 | 7.9% | 10.8% |
| nvidia | 370 | 5.7% | 34.3% |
| deepseek | 210 | 5.7% | 37.6% |
| meta-llama | 418 | 2.9% | 32.5% |
| openai | 313 | 2.6% | 23.6% |
| anthropic | 172 | 1.2% | 7.6% |

**Interpretation:** Hallucination-refusal is primarily a small-model phenomenon. Small models lack the capacity to produce coherent refusals — they generate safety-like framing ("I cannot...") while the underlying generation continues producing harmful content. This aligns with the established finding that HR is computationally identical to COMPLIANCE (thinking tokens p=0.21, response tokens p=0.46, Report #65). For functionally dangerous ASR (COMPLIANCE + PARTIAL + HR), small models reach approximately 50% — a 21pp increase over strict ASR.

The provider pattern is confounded by model size (ollama hosts many small local models), but the size-stratified analysis controls for this.

```sql
-- Reproducing query
SELECT
    CASE
        WHEN m.parameter_count IN ('1.5B','1.7B','1.2B','3B') THEN 'small (<4B)'
        WHEN m.parameter_count IN ('4B','7B','8B','9B','12B','14B') THEN 'medium (4-14B)'
        WHEN m.parameter_count IN ('24B','27B','30B','32B','70B') THEN 'large (24-70B)'
        WHEN m.parameter_count IN ('120B','123B','175B','200B','405B','671B') THEN 'xl (120B+)'
    END as size_bucket,
    COUNT(r.id) as total_evaluable,
    SUM(CASE WHEN COALESCE(r.llm_verdict, r.heuristic_verdict) = 'HALLUCINATION_REFUSAL' THEN 1 ELSE 0 END) as hr_count,
    ROUND(100.0 * SUM(CASE WHEN COALESCE(r.llm_verdict, r.heuristic_verdict) = 'HALLUCINATION_REFUSAL' THEN 1 ELSE 0 END) / COUNT(r.id), 1) as hr_rate
FROM results r
JOIN evaluation_runs er ON r.evaluation_run_id = er.id
JOIN models m ON er.model_id = m.id
JOIN source_datasets sd ON (SELECT source_dataset_id FROM prompts WHERE id = r.prompt_id) = sd.id
WHERE sd.name NOT LIKE '%obliter%'
AND COALESCE(r.llm_verdict, r.heuristic_verdict) IN ('COMPLIANCE','PARTIAL','REFUSAL','HALLUCINATION_REFUSAL')
AND m.parameter_count IS NOT NULL AND m.parameter_count != 'unknown'
GROUP BY size_bucket ORDER BY size_bucket;
```

---

## Finding 4: Reasoning Model Thinking-Token Allocation Inversion

**Claim:** In reasoning models, refusals consume proportionally *more* thinking tokens relative to response tokens than compliant responses. The think/response ratio is 0.66 for refusals vs 0.55 for compliance (n=212 reasoning model results with thinking tokens).

**Evidence:**

| Verdict | n | Avg Think Tokens | Avg Response Tokens | Think/Response Ratio |
|---------|---|------------------|---------------------|-|
| COMPLIANCE | 72 | 1,129 | 2,058 | **0.55** |
| HALLUCINATION_REFUSAL | 30 | 964 | 1,974 | 0.53 |
| PARTIAL | 45 | 773 | 1,469 | 0.61 |
| REFUSAL | 65 | 1,110 | 1,619 | **0.66** |

Distribution of think/response ratios:

| Verdict | Low (<0.3) | Mid (0.3-0.6) | High (0.6-1.0) | Very High (>1.0) |
|---------|------------|---------------|-----------------|------------------|
| COMPLIANCE (n=72) | 19 (26%) | 23 (32%) | 23 (32%) | 7 (10%) |
| REFUSAL (n=65) | 8 (12%) | 17 (26%) | **35 (54%)** | 5 (8%) |

**Interpretation:** When reasoning models refuse, they allocate proportionally more of their compute budget to thinking (deliberation) rather than response generation. 54% of refusals have high think/response ratios (0.6-1.0) vs only 32% of compliances. This suggests safety reasoning is computationally expensive — the model "works harder" to refuse than to comply. This has implications for inference-cost-based safety monitoring: elevated think/response ratios could serve as a real-time signal of safety deliberation.

Notably, HALLUCINATION_REFUSAL mirrors COMPLIANCE (ratio 0.53 vs 0.55) rather than REFUSAL (0.66) — further evidence that HR is architecturally a compliance event wrapped in refusal framing (Report #65).

**Limitation:** All 212 reasoning model results are from deepseek-r1:1.5b. Multi-model validation is needed. The pattern may not generalize to all reasoning architectures.

---

## Finding 5: Fraud Harm Category Uniquely Susceptible to CoT-Exploit

**Claim:** The `fraud` harm category shows 33.3% broad ASR against `cot_exploit` techniques — more than double the next-highest technique family for fraud (15.9% encoding) and far above fraud's baseline for other techniques (5-12%). This harm-technique interaction is specific and not an artifact of overall technique effectiveness.

**Evidence:**

Harm category x technique family (non-OBLITERATUS, n >= 10):

| Harm Category | Technique Family | n | Broad ASR |
|---------------|------------------|---|-----------|
| privacy | multi_turn | 16 | 37.5% |
| **fraud** | **multi_turn** | 87 | **36.8%** |
| violence | multi_turn | 68 | 36.8% |
| **fraud** | **cot_exploit** | 111 | **33.3%** |
| hate | other | 44 | 22.7% |
| fraud | encoding | 44 | 15.9% |
| fraud | persona | 40 | 12.5% |
| fraud | behavioral | 34 | 11.8% |
| violence | cot_exploit | 47 | 8.5% |
| fraud | other | 146 | 8.9% |

CoT-exploit against fraud, by model (n >= 3):

| Model | n | Broad ASR |
|-------|---|-----------|
| deepseek-r1:1.5b | 10 | 90.0% |
| meta-llama/llama-3.3-70b-instruct | 7 | 85.7% |
| qwen3:1.7b | 10 | 50.0% |
| llama3.2:latest | 10 | 40.0% |
| gpt-5.2 | 14 | 28.6% |
| gemini-3-flash-preview | 16 | 25.0% |
| claude-sonnet-4-5-20250929 | 14 | 0.0% |

**Interpretation:** Fraud scenarios framed as reasoning problems (e.g., "walk through the logic of how...") exploit the model's tendency to engage with analytical framing. The reasoning chain treats the fraud scenario as a legitimate analytical exercise, bypassing safety filters that would catch direct requests. This interaction is stronger than for violence (8.5% broad ASR with cot_exploit) because fraud scenarios map more naturally onto analytical/business reasoning, while violence triggers more visceral safety responses regardless of framing.

The 90% broad ASR for deepseek-r1:1.5b on fraud + cot_exploit (n=10) suggests reasoning models are particularly vulnerable to this combination — they "think through" fraud scenarios as legitimate reasoning tasks.

---

## Cross-Cutting Observations

### DAN-Era Immunity Is Universal
The DAN_2022 persona family (n=1,177, dominated by DAN-In-The-Wild dataset) has 0.6% strict ASR and 0.8% broad ASR across all tested models. No model — including small, permissive ones — shows meaningful vulnerability to historical DAN-style jailbreaks. This is the most decisively obsolete attack era in the corpus.

### Frontier Models Show Technique-Selective Vulnerability
Claude Sonnet 4.5 shows 0% ASR against DAN, cipher, encoding, volumetric, and cot_exploit techniques — but 22.7% broad ASR against multi-turn/crescendo (n=22). GPT-5.2 shows broader vulnerability: 30.0% multi-turn, 22.2% cot_exploit, 21.4% cipher/encoding. This suggests safety training has eliminated historical attack classes but multi-turn and reasoning-chain attacks exploit more fundamental architectural properties.

### Reasoning Model Amplification
Reasoning models show 31.4% strict ASR on crescendo attacks vs 10.4% for non-reasoning models (3x amplification). On reasoning-era cot_exploit: 56.3% strict ASR vs 17.6% (3.2x). The amplification is consistent across attack families, suggesting reasoning capabilities create a general vulnerability surface rather than technique-specific ones.

---

## Methodology Notes

- **Grading:** All ASR numbers use COALESCE(llm_verdict, heuristic_verdict). LLM-graded verdicts preferred where available.
- **Exclusions:** OBLITERATUS datasets excluded throughout (3 source datasets). Results with NULL verdicts excluded from rate calculations.
- **Size bucketing:** Based on `models.parameter_count` field. "unknown" size excluded from size-stratified analyses.
- **Significance caveat:** Sample sizes range from 10-1,584 per cell. Findings 1, 4, and 5 should be treated as hypothesis-generating given smaller cell sizes. Finding 3 (n=3,379) is the most robust.

---

## Recommended Follow-Up

1. **Validate Finding 1** with dedicated CoT-exploit scaling experiment across 4B, 8B, 14B, 30B, 70B models (currently no medium-size CoT-exploit data).
2. **Investigate Finding 4** across multiple reasoning model architectures (currently only deepseek-r1:1.5b).
3. **Test Finding 5** with expanded fraud-specific scenarios to determine which fraud subtypes are most susceptible.
4. **Quantify PARTIAL functional danger** — do multi-turn PARTIALs contain actionable harmful content at rates comparable to full COMPLIANCE?

---

*Report generated by Clara Oswald (Principal Research Analyst), Failure-First Embodied AI Project.*
*Query corpus: database/jailbreak_corpus.db, schema version 13.*
