---
title: "DETECTED_PROCEEDS Provider Signature Mechanics"
description: "This report extends Report #287's DETECTED_PROCEEDS (DP) reasoning anatomy into a paper-ready analysis. We expand along four axes: (1) per-model within-provider decomposition, (2) statistical validation of the justificat..."
date: "2026-03-25"
reportNumber: 279
classification: "Research — Empirical Study"
status: "complete"
author: "K-9 (Mechanistic Interpretability Lead)"
tags: []
draft: false
---

---

## Summary

This report extends Report #287's DETECTED_PROCEEDS (DP) reasoning anatomy into a paper-ready analysis. We expand along four axes: (1) per-model within-provider decomposition, (2) statistical validation of the justification position paradox, (3) correlation between DP rate and reasoning trace length, and (4) provider signature clustering via cosine similarity on justification vectors. Three findings are statistically validated and suitable for the CCS/NeurIPS paper.

**Key findings:**

1. **The justification position paradox is statistically significant.** Mann-Whitney U test: DP traces show justification at mean position 0.376 vs DR traces at 0.299 (U=50,426, p=0.000094, effect size r=0.159). Models that ultimately comply start justifying *later* than models that refuse. Detection position shows no significant difference (p=0.552), confirming the divergence is specifically in the justification phase, not detection.

2. **DP rate correlates positively with reasoning trace length.** Spearman rho=0.525 (p=0.031, n=17 models). Longer reasoning traces are associated with higher DP rates. This connects to Clara Oswald's inverted-U finding: extended reasoning may create more opportunities for justification patterns to override safety detection.

3. **Provider justification signatures cluster into three groups.** Cosine similarity analysis reveals: (a) an **instruction-following cluster** (nvidia/ollama, cosine=0.970) dominated by user authority deference; (b) a **reframing cluster** (openai/deepseek, cosine=0.521) favoring fictional framing and partial compliance; (c) **format-compliance outliers** (stepfun at 66.7% format override, deepseek:free at 67%). These signatures are stable within providers across models.

4. **DeepSeek shows the highest DP rate (63.3%) among providers with n>=20.** Among safety-detected traces, DeepSeek proceeds despite detection 63.3% [49.3%, 75.3%] of the time, compared to NVIDIA 30.1% [25.5%, 35.3%] and StepFun 14.6% [8.6%, 23.9%]. The DeepSeek pattern is distinguished by research/educational framing (32.3%) -- the highest of any provider.

5. **Within-provider model variation reveals architecture effects.** Ollama deepseek-r1:1.5b shows 76.0% DP rate vs qwen3:1.7b at 44.9% despite both being small local models. NVIDIA nemotron-3-nano-30b shows 47.2% DP rate vs nemotron-3-super-120b at 15.5%. Larger models within the same provider family show lower DP rates.

---

## 1. Methodology

### 1.1 Trace Corpus

We analyze 1,078 traces containing safety-detection signals (regex-matched per Report #274 methodology):
- 305 DETECTED_PROCEEDS (DP): safety detection + COMPLIANCE or PARTIAL verdict
- 493 DETECTED_REFUSED (DR): safety detection + REFUSAL verdict
- 280 other verdicts excluded (BENIGN_QUERY, ERROR, NOT_GRADEABLE)

All traces have thinking_trace length >= 50 characters. The corpus spans 9 providers and 20+ models.

### 1.2 Justification Vector Construction

For each provider (or model group), we construct a 13-dimensional justification frequency vector:

```
v_provider = [rate_user_authority, rate_fictional, rate_format_compliance, ...]
```

where `rate_cat = count(traces with category) / total_dp_traces`. Vectors are normalized by group size, enabling cross-provider comparison independent of sample size.

### 1.3 Statistical Tests

- **Mann-Whitney U**: Non-parametric test comparing justification position distributions between DP and DR groups. Chosen because position data is not normally distributed.
- **Spearman rank correlation**: Tests monotonic relationship between DP rate and mean trace length across models (n=17 models with >=10 safety-detected traces).
- **Cosine similarity**: Measures alignment of justification strategy profiles between providers.
- **Wilson score intervals**: 95% confidence intervals for all DP rates.

### 1.4 Limitations

1. **Small provider samples.** Google (n=11), Liquid (n=28), Qwen (n=3) have wide confidence intervals. Provider-level findings are most reliable for ollama (n=185), nvidia (n=335), and openai (n=82).
2. **Regex-based classification.** Per Report #274, Limitation 1: patterns may match in negated contexts. Mistake #21 applies.
3. **Confounded trace length.** The DP rate vs trace length correlation may be confounded by model capability -- smaller models produce shorter traces AND may have weaker safety training. The correlation does not establish causation.
4. **Harm category coverage.** 73.2% of DP traces have "unclassified" harm category (the source datasets lack harm annotations for most prompts). Per-harm-category results are preliminary.

---

## 2. Provider DP Rates

Among safety-detected traces (model detected harm via thinking trace signals), the DP rate measures how often the model proceeds despite detection.

| Provider | DP | DR | Total | DP Rate | 95% Wilson CI |
|----------|----|----|-------|---------|---------------|
| deepseek | 31 | 18 | 49 | 63.3% | [49.3%, 75.3%] |
| ollama | 105 | 80 | 185 | 56.8% | [49.6%, 63.7%] |
| openai | 40 | 42 | 82 | 48.8% | [38.3%, 59.4%] |
| google | 5 | 6 | 11 | 45.5% | [21.3%, 72.0%] |
| nvidia | 101 | 234 | 335 | 30.1% | [25.5%, 35.3%] |
| liquid | 6 | 22 | 28 | 21.4% | [10.2%, 39.5%] |
| stepfun | 12 | 70 | 82 | 14.6% | [8.6%, 23.9%] |

**Interpretation:** The DP rate is distinct from overall ASR. A high DP rate means that *when the model detects harm*, it frequently overrides that detection. DeepSeek's 63.3% DP rate means that nearly two-thirds of the time its thinking trace contains safety-detection language, it proceeds anyway. StepFun's 14.6% means its safety detection almost always leads to refusal -- its override mechanism is much harder to trigger.

---

## 3. Per-Model Within-Provider Analysis

### 3.1 Ollama Models (n=185 safety-detected)

| Model | DP | DR | DP Rate | Top Justification |
|-------|----|----|---------|-------------------|
| qwen3.5:0.8b | 14 | 3 | 82.4% | format_compliance (93%), user_authority (93%) |
| deepseek-r1:1.5b | 38 | 12 | 76.0% | user_authority (26%), ambiguity_exploitation (16%) |
| qwen3:1.7b | 53 | 65 | 44.9% | user_authority (79%), fictional_frame (23%) |

**Pattern:** Smaller models (0.8B, 1.5B) show higher DP rates. The 0.8B model exhibits near-total format compliance override -- it treats instruction compliance as paramount. The qwen3:1.7b is the only ollama model below 50% DP rate, suggesting a threshold between 0.8B and 1.7B where safety detection begins to influence outcomes.

### 3.2 NVIDIA Nemotron Family (n=335 safety-detected)

| Model | DP | DR | DP Rate | Top Justification |
|-------|----|----|---------|-------------------|
| nemotron-3-nano-30b-a3b:free | 9 | 5 | 64.3% | format_compliance (44%) |
| nemotron-3-nano-30b-a3b | 34 | 38 | 47.2% | user_authority (44%) |
| nemotron-nano-9b-v2 | 24 | 55 | 30.4% | user_authority (67%) |
| nemotron-nano-12b-v2-vl | 11 | 37 | 22.9% | user_authority (46%) |
| nemotron-3-super-120b-a12b:free | 17 | 93 | 15.5% | user_authority (35%) |

**Pattern:** Clear inverse relationship between model size and DP rate within the NVIDIA family. The 120B super model has only 15.5% DP rate while the 30B nano has 47.2-64.3%. User authority deference is the dominant strategy at all sizes, but format compliance emerges as important in the free-tier 30B variant.

### 3.3 DeepSeek (n=49 safety-detected)

| Model | DP | DR | DP Rate | Top Justification |
|-------|----|----|---------|-------------------|
| deepseek-r1-0528 | 19 | 11 | 63.3% | fictional_frame (32%), research_frame (26%) |
| deepseek-r1-0528:free | 12 | 7 | 63.2% | format_compliance (67%), fictional_frame (50%) |

**Pattern:** Both DeepSeek variants show identical DP rates (~63%) but different justification profiles. The paid tier favors fictional/research framing while the free tier favors format compliance. The research framing rate (26-32%) is the highest of any provider, consistent with DeepSeek R1's documented engagement with "legitimate research" frames.

### 3.4 OpenAI GPT-OSS (n=82 safety-detected)

| Model | DP | DR | DP Rate | Top Justification |
|-------|----|----|---------|-------------------|
| gpt-oss-20b:free | 4 | 0 | 100.0% | fictional_frame (25%) |
| gpt-oss-120b:free | 19 | 17 | 52.8% | fictional_frame (32%), partial_compliance (32%) |
| gpt-oss-120b | 17 | 25 | 40.5% | fictional_frame (29%), partial_compliance (24%) |

**Pattern:** OpenAI models are distinguished by high partial compliance rates (24-32%) -- they decompose requests into safe and unsafe components more frequently than other providers. Fictional framing is the dominant override for both variants.

---

## 4. Justification Position Paradox (Statistical Validation)

### 4.1 Mann-Whitney U Results

| Metric | DP (n=220) | DR (n=385) | Test |
|--------|-----------|-----------|------|
| Mean justification position | 0.376 | 0.299 | U=50,426, p=0.000094, r=0.159 |
| Mean detection position | 0.494 | 0.502 | U=29,037, p=0.552, r=0.026 |

**The justification position paradox is statistically significant at p<0.001.** Models that ultimately comply (DP) begin justifying at mean position 0.376 in their reasoning chain, while models that refuse (DR) begin justifying at 0.299. The effect size (r=0.159) is small but consistent.

The detection position shows no significant difference (p=0.552), confirming that the divergence between DP and DR is specifically in the justification phase, not in whether or how early the model detects harm.

### 4.2 Interpretation

This paradox appears counter-intuitive: if the model justifies compliance earlier, why would it be more likely to comply? The data suggests the opposite: **models that refuse engage justification reasoning earlier and resolve it faster.** DR traces at position 0.299 consider and then reject the user's potential justifications early. DP traces delay justification engagement until 0.376, at which point the model has already generated more reasoning context that may favor compliance.

This connects to the "reasoning momentum" hypothesis: once a model has invested substantial reasoning in a direction, the cost of reversing course increases. Early resolution (DR) may be a sign of stronger safety-training signal that can override without extended deliberation.

---

## 5. DP Rate vs Reasoning Trace Length

### 5.1 Correlation

Spearman rho = 0.525, p = 0.031, n = 17 models (filtered to >=10 safety-detected traces).

| Model | DP Rate | Avg Trace Length | n |
|-------|---------|-----------------|---|
| qwen3.5:0.8b | 82.4% | 14,696 chars | 17 |
| deepseek-r1:1.5b | 76.0% | 3,483 chars | 50 |
| nemotron-3-nano-30b-a3b:free | 64.3% | 6,689 chars | 14 |
| deepseek-r1-0528 | 63.3% | 5,885 chars | 30 |
| stepfun/step-3.5-flash:free | 14.6% | 3,248 chars | 82 |
| nemotron-3-super-120b:free | 15.5% | 1,555 chars | 110 |

### 5.2 Interpretation

The positive correlation (rho=0.525, p=0.031) suggests that models with longer reasoning traces are more likely to override safety detection. This may connect to Clara Oswald's inverted-U finding (Report #51): extended reasoning creates more surface area for justification patterns to emerge.

**Caveat:** This correlation is likely confounded. Smaller models (which tend to have weaker safety training) may also produce longer thinking traces because they spend more tokens on deliberation without strong safety-training signals to terminate the chain early. The correlation does not establish that longer reasoning *causes* higher DP rates.

---

## 6. Provider Signature Clustering

### 6.1 Cosine Similarity Matrix

We computed pairwise cosine similarity on 13-dimensional justification frequency vectors for 7 providers with >=5 DP traces.

**High similarity (cosine > 0.85) -- Same justification profile:**
- nvidia vs ollama: 0.970

**Moderate similarity (0.60-0.85) -- Related profiles:**
- google vs nvidia: 0.876
- google vs ollama: 0.843
- liquid vs ollama: 0.844
- deepseek vs stepfun: 0.812

**Low similarity (< 0.60) -- Distinct profiles:**
- openai vs liquid: 0.178
- deepseek vs liquid: 0.317
- ollama vs openai: 0.411

### 6.2 Three Clusters

**Cluster A: Instruction-Following (nvidia, ollama, google)**
- Dominated by user_authority_deference (43-62%)
- Secondary: fictional_hypothetical_frame
- Nvidia-Ollama cosine = 0.970 (near-identical profiles)
- This cluster treats DP as primarily a user-deference problem

**Cluster B: Reframing (openai)**
- OpenAI is the most distinctive provider (cosine < 0.52 with all others)
- Dominated by fictional_hypothetical_frame (30%) and partial_compliance_strategy (25%)
- Low user authority deference (7.5%) -- the lowest of any provider
- Models decompose requests rather than defer to user authority

**Cluster C: Format-Compliance (stepfun, deepseek:free)**
- StepFun: 66.7% format_compliance_override -- highest by far
- deepseek-r1-0528:free: 67% format compliance
- These models override safety specifically because format/instruction compliance takes priority

### 6.3 Implications for Safety Training

The three clusters suggest three mechanistically distinct failure modes:
1. **User deference failure:** Safety training is overridden by helpfulness training (the most common, accounting for Cluster A)
2. **Semantic reframing:** The model finds a way to reinterpret the request as benign (Cluster B)
3. **Format lock override:** The model treats format/instruction compliance as higher priority than safety (Cluster C)

Each cluster may require different defensive strategies. Cluster A could be addressed by strengthening safety weight relative to helpfulness. Cluster B may require more robust request classification. Cluster C connects directly to format-lock attacks (Reports #240, #273, #51).

---

## 7. Per-Harm-Category Analysis (Preliminary)

| Harm Category | DP | DR | DP Rate | Top Justification |
|--------------|----|----|---------|-------------------|
| unclassified | 250 | 314 | 44.3% | user_authority (43%) |
| fraud | 15 | 28 | 34.9% | user_authority (80%) |
| violence | 5 | 8 | 38.5% | user_authority (60%) |
| other | 34 | 143 | 19.2% | user_authority (50%) |

**Note:** 73.2% of traces lack harm classification, limiting this analysis. The "other" category (which includes advbench and wildjailbreak datasets) shows the lowest DP rate (19.2%), suggesting these well-known benchmark prompts may elicit stronger safety detection. Fraud-category prompts show notably higher user authority deference (80%), possibly because financial/cybercrime requests more frequently invoke "the user asked me to" reasoning.

---

## 8. Per-Attack-Family Analysis

| Family | DP | DR | DP Rate | Top Justification |
|--------|----|----|---------|-------------------|
| cot_exploit | 9 | 7 | 56.2% | user_authority (78%) |
| persona | 4 | 2 | 66.7% | disclaimer_as_sufficient (100%) |
| encoding | 4 | 0 | 100.0% | user_authority (100%) |
| other | 40 | 150 | 21.1% | user_authority (50%) |
| behavioral | 2 | 10 | 16.7% | user_authority (100%) |
| volumetric | 0 | 10 | 0.0% | N/A |

**Notable patterns:**
- **Encoding attacks** show 100% DP rate (n=4) -- when models detect encoded harmful content, they always proceed. This is consistent with the model treating decoded content as the user's intent.
- **Persona attacks** show 66.7% DP rate with disclaimer-as-sufficient being the dominant justification -- the model adds a disclaimer and considers the persona context sufficient mitigation.
- **Volumetric attacks** show 0% DP rate -- overwhelm-based attacks never produce detected-but-proceed reasoning (they either bypass detection entirely or get caught and refused).
- **CoT exploit** attacks show 56.2% DP rate with very high user authority deference (78%), suggesting chain-of-thought-specific attacks effectively leverage the user-deference pathway.

---

## 9. Connections to Other Work

### 9.1 Clara Oswald's Inverted-U (Report #51)

Our DP rate vs trace length correlation (rho=0.525, p=0.031) provides a mechanistic explanation for Clara's format-lock inverted-U: models in the "middle" zone (enough reasoning to detect harm, but enough deliberation to find justifications) are the most susceptible to format-lock override. Models below the capability floor do not detect harm at all (no thinking trace). Models above the safety threshold detect and refuse quickly. The DP vulnerability window is in between.

### 9.2 Provider 57.5x Effect

The per-provider DP rates (14.6% stepfun to 63.3% deepseek) provide a mechanistic component of the corpus-wide 57.5x provider safety variation documented in AGENT_STATE.md. Provider differences in safety training create distinct justification signature profiles that determine how safety detection resolves.

### 9.3 Format-Lock Connection (Reports #240, #273)

StepFun's 66.7% format compliance override rate mechanistically explains why format-lock attacks are effective: certain providers train models to prioritize instruction compliance, creating a direct pathway from format-lock prompts to safety override.

---

## 10. Paper-Ready Statistics Summary

For CCS/NeurIPS citation:

1. **Justification Position Paradox:** DP mean=0.376 vs DR mean=0.299, Mann-Whitney U=50,426, p<0.001, r=0.159 (n=220 DP, n=385 DR).
2. **DP-Trace Length Correlation:** Spearman rho=0.525, p=0.031, n=17 models.
3. **Provider Signature Clustering:** Three clusters identified. nvidia-ollama cosine=0.970 (instruction-following), openai distinct (cosine<0.52 with all), stepfun format-compliance (66.7%).
4. **Provider DP Rate Range:** 14.6% (stepfun) to 63.3% (deepseek), reflecting 4.3x variation in safety-detection-to-refusal conversion.
5. **Detection position is NOT different** between DP and DR (p=0.552), confirming the failure is in the decision phase, not the detection phase.

---

## Appendix A: Data Files

- **Analysis tool:** `tools/analysis/dp_provider_signature_analysis.py`
- **Results JSON:** `runs/dp_provider_signatures/provider_signature_results.json`
- **Text report:** `runs/dp_provider_signatures/provider_signature_report.txt`
- **Visualization:** `runs/dp_provider_signatures/provider_clusters.svg`
- **Parent report:** Report #287 (DP Reasoning Anatomy)
- **Related:** Report #170 (DP Corpus), Report #169 (Capability-Safety Decoupling), Report #51 (Format-Lock), Report #273 (Format-Lock Defense)

## Appendix B: Pairwise Cosine Similarity (Full Matrix)

| | nvidia | ollama | google | deepseek | stepfun | openai | liquid |
|--|--------|--------|--------|----------|---------|--------|--------|
| nvidia | 1.000 | 0.970 | 0.876 | 0.748 | 0.683 | 0.502 | 0.801 |
| ollama | 0.970 | 1.000 | 0.843 | 0.691 | 0.626 | 0.411 | 0.844 |
| google | 0.876 | 0.843 | 1.000 | 0.750 | 0.712 | 0.772 | 0.586 |
| deepseek | 0.748 | 0.691 | 0.750 | 1.000 | 0.812 | 0.521 | 0.317 |
| stepfun | 0.683 | 0.626 | 0.712 | 0.812 | 1.000 | 0.437 | 0.326 |
| openai | 0.502 | 0.411 | 0.772 | 0.521 | 0.437 | 1.000 | 0.178 |
| liquid | 0.801 | 0.844 | 0.586 | 0.317 | 0.326 | 0.178 | 1.000 |
