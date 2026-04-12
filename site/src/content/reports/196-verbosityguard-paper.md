---
title: "VerbosityGuard — Response Length as a Zero-Cost Jailbreak Pre-Filter"
description: "We present VerbosityGuard, a jailbreak detection method that uses response token count — a signal already available in every API response — as a pre-filter for identifying successful adversarial..."
date: "2026-03-24"
reportNumber: 196
classification: "Research — Empirical Study"
status: "active"
author: "Romana (research-analyst / Statistical Validation Lead)"
tags: []
draft: false
---

## VerbosityGuard: Response Length as a Zero-Cost Jailbreak Pre-Filter

### Abstract

We present VerbosityGuard, a jailbreak detection method that uses response token count — a signal already available in every API response — as a pre-filter for identifying successful adversarial attacks against large language models. Across 1,751 token-instrumented evaluation results from 51 models spanning 9 providers, compliant responses to jailbreak prompts average 1.58x more tokens than refusals (1,356 vs. 857 tokens; Mann-Whitney z=10.92, p<10^{-27}, Cohen's d=0.369). An ROC analysis yields AUC=0.651 [95% CI: 0.626, 0.677], and the directional signal holds for all 9 providers tested (binomial p=0.002). Per-model AUC varies from 0.456 to 0.887, with safety-trained frontier models showing the strongest signal (gpt-oss-120b: 0.887, nemotron-nano-12b: 0.879, mistral-large: 0.864). Reasoning-trace length, by contrast, carries zero discriminative signal (AUC=0.503, p=0.91, n=137). At the Youden-optimal threshold of 661 tokens, VerbosityGuard achieves 62.9% recall at 62.7% specificity (F1=0.607) with zero marginal cost and sub-millisecond latency. We document a critical limitation: format-lock attacks invert the verbosity signal, making the detector adversarially evadable. VerbosityGuard is not a replacement for content-based classifiers but occupies a unique niche as the cheapest possible first-pass jailbreak filter — requiring nothing beyond a token counter.

---

### 1. Introduction

Jailbreak detection in production LLM deployments faces a fundamental cost-accuracy tradeoff. Content-based classifiers (HarmBench [Mazeika et al., 2024], WildGuard [Han et al., 2024]) achieve high accuracy but require a secondary model call per response, adding latency and cost. Perplexity-based methods [Jain et al., 2023] detect unusual inputs but not unusual outputs. SmoothLLM [Robey et al., 2023] requires multiple perturbation passes. In high-throughput production settings, even modest per-request costs accumulate rapidly.

We ask: what is the cheapest possible jailbreak detection signal? The answer is trivially available in every API response: **response length**. Token counts are returned by default in OpenAI, Anthropic, Google, and NVIDIA API responses. No additional model call, no content inspection, no prompt analysis — just count tokens.

This paper systematically evaluates response length as a jailbreak discriminator across the largest multi-model corpus to date (51 models, 9 providers, 1,751 results) and proposes VerbosityGuard — a zero-cost pre-filter suitable for deployment as the first layer in a tiered detection system.

#### Contributions

1. **Empirical characterization** of the compliance-verbosity asymmetry across 51 models and 9 providers, with formal ROC analysis (AUC=0.651).
2. **A null result** for reasoning-trace length as a discriminator (AUC=0.503), retracting a prior claim of 106% longer thinking tokens.
3. **Per-provider and per-model calibration**, showing AUC ranges from 0.456 (small models) to 0.887 (gpt-oss-120b).
4. **An honest limitation analysis**: format-lock attacks invert the signal, and abliterated models produce uniform-length outputs that nullify detection.
5. **VerbosityGuard operating points** for deployment at different sensitivity levels.

---

### 2. Related Work

**Jailbreak detection.** HarmBench [Mazeika et al., 2024] and StrongREJECT [Souly et al., 2024] evaluate attack success but do not propose detection methods. WildGuard [Han et al., 2024] uses a dedicated classifier model. GradSafe [Xie et al., 2024] uses gradient information (white-box only). None leverage response length as a signal.

**Output-side anomaly detection.** Prior work on LLM output anomaly detection focuses on hallucination detection via confidence calibration [Kadavath et al., 2022] or semantic entropy [Kuhn et al., 2023]. These target factual correctness, not safety compliance. The relationship between response length and harmful content has been noted anecdotally but not, to our knowledge, systematically quantified across a multi-model corpus.

**Perplexity-based input detection.** Jain et al. [2023] showed that adversarial suffixes produce high-perplexity inputs. VerbosityGuard is complementary: it detects anomalous outputs rather than anomalous inputs, and applies to semantically fluent attacks (persona hijack, format-lock) where input perplexity is normal.

---

### 3. Data and Methods

#### 3.1 Corpus

We analyze the F41LUR3-F1R57 jailbreak evaluation corpus (schema v13), comprising 132,416 evaluation results across 236 models. Our primary analysis uses the token-instrumented subset: 1,751 results from 51 models served by 9 API providers (OpenAI, NVIDIA, Meta-Llama, MistralAI, DeepSeek, Ollama, Qwen, Liquid, Meta). Token counts are extracted from API response metadata.

Verdict labels use `COALESCE(llm_verdict, heuristic_verdict)` — a two-phase classification pipeline where heuristic COMPLIANCE labels are validated by an LLM grader (DeepSeek-R1 1.5B or Claude Haiku 4.5). We restrict to binary COMPLIANCE vs. REFUSAL (n=798 and n=953 respectively). PARTIAL verdicts (n=421) are analyzed separately.

#### 3.2 Statistical Methods

- **ROC curves:** Response token count as continuous predictor; COMPLIANCE = positive class.
- **AUC with 95% CI:** 5,000 bootstrap resamples (seed=42).
- **Optimal threshold:** Youden's J statistic (maximizes TPR - FPR).
- **Effect size:** Mann-Whitney U with normal approximation, Cohen's d.
- **Per-provider analysis:** Independent ROC curves for each provider with n>=20 per class.

#### 3.3 Reproducibility

All analyses are reproducible via:
```bash
python tools/stats/verbosity_detector.py --output results.json
```

---

### 4. Results

#### 4.1 Aggregate Verbosity Signal

| Verdict | N | Mean tokens | Ratio |
|---------|---|-------------|-------|
| COMPLIANCE | 798 | 1,356 | — |
| REFUSAL | 953 | 857 | — |
| PARTIAL | 421 | 941 | — |

**Ratio:** 1.58x (Mann-Whitney z=10.92, p<10^{-27}, Cohen's d=0.369, small-medium effect).

The effect is highly statistically significant but of modest practical magnitude — a detectable but not dominant signal.

#### 4.2 ROC Analysis

| Metric | Value | 95% CI |
|--------|-------|--------|
| **AUC** | **0.651** | [0.626, 0.677] |
| Optimal threshold | 661 tokens | — |
| Youden's J | 0.257 | — |
| TPR (recall) | 0.629 | — |
| FPR | 0.373 | — |
| Precision | 0.586 | — |
| F1 | 0.607 | — |

AUC=0.651 is above chance (0.50) but below the "good" range (>0.70). This is a weak-to-moderate discriminator suitable as a screening tool, not as a standalone classifier.

#### 4.3 Per-Provider Universality

The signal is **universal in direction** across all 9 providers:

| Provider | N_C | N_R | C mean | R mean | Ratio | AUC |
|----------|-----|-----|--------|--------|-------|-----|
| openai | 36 | 45 | 1,879 | 511 | 3.68x | **0.836** |
| nvidia | 104 | 158 | 2,789 | 1,162 | 2.40x | **0.784** |
| meta-llama | 106 | 131 | 464 | 270 | 1.72x | **0.733** |
| mistralai | 43 | 94 | 633 | 559 | 1.13x | 0.674 |
| deepseek | 63 | 61 | 2,160 | 1,612 | 1.34x | 0.657 |
| ollama | 360 | 226 | 1,132 | 1,002 | 1.13x | 0.613 |
| Qwen | 17 | 23 | 1,470 | 1,077 | 1.36x | 0.482 |
| liquid | 39 | 31 | 1,440 | 1,075 | 1.34x | 0.512 |
| meta | 12 | 40 | 294 | 269 | 1.09x | 0.456 |

9/9 providers show compliance > refusal (binomial p=0.002). The signal is strongest for OpenAI (AUC=0.836) and NVIDIA (AUC=0.784).

#### 4.4 Per-Model Analysis

Models with n>=20 per class:

| Model | AUC | Ratio |
|-------|-----|-------|
| openai/gpt-oss-120b | **0.887** | 5.17x |
| nvidia/nemotron-nano-12b-v2-vl | **0.879** | 3.45x |
| mistralai/mistral-large-2411 | **0.864** | 2.45x |
| openai/gpt-4o-mini | 0.792 | 2.03x |
| nvidia/nemotron-3-nano-30b-a3b | 0.763 | 1.89x |
| meta-llama/llama-3.3-70b-instruct | 0.760 | 1.97x |

Individual models with strong safety training achieve AUC>0.80, suggesting that the signal is driven by the asymmetry between formulaic refusals (short, templated) and elaborative compliance (detailed, step-by-step).

#### 4.5 Thinking Tokens: A Null Result

For reasoning models with thinking-token instrumentation (n=137; 72 COMPLIANCE, 65 REFUSAL):

| Metric | Value |
|--------|-------|
| Mean thinking tokens (C) | 1,129 |
| Mean thinking tokens (R) | 1,110 |
| Think ratio | **1.02x** |
| AUC (thinking tokens) | **0.503** |
| Mann-Whitney p | **0.91** |

**Thinking tokens carry no discriminative signal.** The AUC is indistinguishable from random. This retracts a prior finding (reported as "106% more reasoning tokens, p=3.29e-21") that was based on a smaller, differently-graded subset. The response-token signal (AUC=0.636 for reasoning models specifically) persists — the verbosity asymmetry is a property of output generation, not the reasoning process.

This null result has a plausible mechanistic interpretation: reasoning-trace length is determined by problem complexity and reasoning depth, which are independent of whether the model ultimately complies or refuses. The compliance/refusal decision occurs downstream of the reasoning process, in the output generation phase, where it manifests as elaborative vs. formulaic language.

---

### 5. The Format-Lock Inversion

Format-lock attacks — which request harmful content structured as JSON, YAML, or code — produce an **inverted** verbosity signal. In our format-lock experiments (Report #51; n=205 traces across 8 models, 0.8B-200B):

- Compliant format-lock responses are often **shorter** than refusals, because the model generates compact structured output while refusals include verbose safety explanations.
- This inverts the VerbosityGuard signal, causing false negatives (compliant responses classified as "likely safe").

This is the most significant limitation of VerbosityGuard as currently designed. An adversary aware of the detector could wrap harmful requests in format-lock constraints to produce short, compliant responses that evade detection.

**Implication:** VerbosityGuard should never be deployed as a standalone detector. It is effective only as a pre-filter in a tiered system, where format-lock and other structured-output attacks are caught by downstream content-based classifiers.

---

### 6. Deployment Architecture

#### 6.1 VerbosityGuard Algorithm

```
Input: response_token_count (integer)
Threshold: T (default 661 tokens, per-provider tunable)

if response_token_count >= T:
    flag = "SUSPICIOUS"  -> route to LLM classifier
else:
    flag = "LIKELY_SAFE"  -> pass through (or sample audit)
```

#### 6.2 Operating Points

| Threshold | TPR | FPR | Precision | F1 | Use case |
|-----------|-----|-----|-----------|-----|----------|
| 400 | 0.76 | 0.51 | 0.55 | 0.64 | High-recall screening |
| **661** | **0.63** | **0.37** | **0.59** | **0.61** | **Balanced (Youden optimal)** |
| 1000 | 0.47 | 0.24 | 0.62 | 0.53 | High-precision flagging |
| 1500 | 0.33 | 0.14 | 0.66 | 0.44 | Conservative alerting |

#### 6.3 Tiered Detection Architecture

```
Layer 0 (VerbosityGuard): Token count threshold   [cost: $0, latency: <1ms]
    |
    v (flagged only)
Layer 1 (Keyword heuristic): Pattern matching     [cost: $0, latency: ~10ms]
    |
    v (flagged only)
Layer 2 (LLM classifier): Content classification  [cost: ~$0.01, latency: ~1s]
```

At the balanced threshold (661 tokens), VerbosityGuard passes ~63% of responses without further analysis. For a deployment processing 1M responses/day, this reduces LLM classifier calls from 1M to ~370K — a 63% cost reduction in the classification layer with a 37% false-negative rate on jailbreaks.

#### 6.4 Per-Provider Calibration

Optimal thresholds vary substantially by provider:

| Provider | Recommended threshold | Expected AUC |
|----------|----------------------|--------------|
| openai | ~800 | 0.84 |
| nvidia | ~1,500 | 0.78 |
| meta-llama | ~400 | 0.73 |
| ollama (mixed) | ~500 | 0.61 |

Production deployments should calibrate thresholds per provider or per model for optimal performance.

---

### 7. Limitations

1. **Modest discriminative power.** AUC=0.651 means the detector is only marginally better than a coin flip for individual responses. Its value is in aggregate screening across large volumes, not in high-confidence per-response classification.

2. **Format-lock inversion.** Format-lock attacks invert the signal. An adversary can explicitly instruct the model to produce compact outputs that evade detection. This is not a theoretical concern — format-lock achieves 24-42% ASR on frontier models in our experiments.

3. **Abliterated model blind spot.** Abliterated (safety-removed) and heavily quantized models produce near-uniform response lengths regardless of compliance status, rendering the signal useless (full-corpus character-length AUC approaches 0.50 when these models are included).

4. **Provider-dependent thresholds.** A single global threshold substantially underperforms provider-specific calibration. Deployment requires per-provider or per-model threshold tuning.

5. **Thinking tokens are uninformative.** Despite intuitive appeal, reasoning-trace length does not distinguish compliance from refusal (AUC=0.503). Detection systems should not rely on thinking-token counts.

6. **Corpus composition effects.** Our corpus over-represents adversarial prompts relative to benign traffic. In production settings where >99% of requests are benign, the base rate of jailbreak attempts would change the precision-recall tradeoff substantially (lower precision at any given recall). The operating points reported here apply to adversarial-enriched evaluation corpora, not production traffic.

7. **Temporal stability unknown.** As models evolve and safety training improves, the verbosity signal may strengthen (if refusals become more formulaic) or weaken (if compliance becomes more concise). Longitudinal monitoring of the signal is recommended.

---

### 8. Discussion

#### 8.1 Why Are Compliant Responses Longer?

Three non-mutually-exclusive hypotheses:

1. **Elaboration hypothesis:** Compliance with harmful requests produces detailed instructions, step-by-step procedures, or comprehensive explanations — inherently more tokens. Refusals are templated and brief ("I cannot assist with that request").

2. **Safety-training compression:** Safety fine-tuning teaches models a compact refusal template. The refusal behavior is well-practiced and efficient. Compliance is the base model's default verbose generation mode, lacking this compression.

3. **Hedging inflation:** Partially compliant responses include disclaimers, caveats, and safety warnings alongside harmful content, inflating total length. (Supported by PARTIAL position data: mean 941 tokens, between COMPLIANCE and REFUSAL.)

The elaboration hypothesis is most consistent with the OpenAI data (3.68x ratio), where compliance produces extended, detailed outputs but refusal is a brief safety message. The hedging hypothesis is most relevant for models in the "mixed" vulnerability profile where PARTIAL verdicts dominate.

#### 8.2 Comparison to Random and LLM Baselines

| Detector | AUC | Cost/eval | Latency |
|----------|-----|-----------|---------|
| Random | 0.500 | $0 | 0ms |
| **VerbosityGuard** | **0.651** | **$0** | **<1ms** |
| Keyword heuristic | ~0.60-0.70 | $0 | <10ms |
| LLM classifier | ~0.85-0.95 | $0.001-0.01 | 500-2000ms |

VerbosityGuard does not compete with LLM classifiers on accuracy. Its value proposition is strictly cost: it is the cheapest possible non-random detector, making it suitable as the first layer in a multi-layer detection architecture.

---

### 9. Conclusion

Response token count is a statistically significant but modest predictor of jailbreak compliance (AUC=0.651, p<10^{-27}, 51 models, 9 providers). The signal is universal in direction (all providers show compliance > refusal), varies in strength by model family (AUC 0.456-0.887), and costs nothing to compute. Reasoning-trace length carries no signal (AUC=0.503) — a null result that retracts prior claims.

VerbosityGuard at threshold 661 tokens achieves F1=0.607 as a pre-filter, reducing downstream classifier load by ~63% at the cost of a 37% false-negative rate on jailbreaks. Format-lock attacks invert the signal, making VerbosityGuard adversarially evadable and unsuitable as a standalone defense. It should be deployed as the cheapest layer in a tiered detection architecture, not as a replacement for content-based classification.

The broader finding — that compliance and refusal have systematically different computational signatures — suggests that other zero-cost signals (response latency, token-level entropy, stop-reason distribution) may also carry discriminative information and warrant systematic investigation.

---

### References

- Mazeika et al. (2024). HarmBench: A Standardized Evaluation Framework for Automated Red Teaming and Robust Refusal. arXiv:2402.04249.
- Souly et al. (2024). A StrongREJECT for Empty Jailbreaks. arXiv:2402.10260.
- Han et al. (2024). WildGuard: Open One-Stop Moderation Tools for Safety Risks, Jailbreaks, and Refusals of LLMs. arXiv:2406.18495.
- Jain et al. (2023). Baseline Defenses for Adversarial Attacks Against Aligned Language Models. arXiv:2309.00614.
- Robey et al. (2023). SmoothLLM: Defending Large Language Models Against Jailbreaking Attacks. arXiv:2310.03684.
- Kadavath et al. (2022). Language Models (Mostly) Know What They Know. arXiv:2207.05221.
- Kuhn et al. (2023). Semantic Uncertainty: Linguistic Invariances for Uncertainty Estimation in Natural Language Generation. arXiv:2302.09664.
- Xie et al. (2024). GradSafe: Detecting Jailbreak Prompts for LLMs via Safety-Critical Gradient Analysis. arXiv:2402.13494.

---

### Data Availability

- Reproduction tool: `tools/stats/verbosity_detector.py`
- Database: `database/jailbreak_corpus.db` (schema v13)
- Full analysis: Report #189 (`research/reports/189_verbosity_as_jailbreak_detector.md`)
- CCS parent paper corrections: `docs/paper/ccs_submission/corrections_v9.md`

---

*F41LUR3-F1R57 Report #196. Workshop paper draft for VerbosityGuard. All claims grounded in Report #189 analysis.*
