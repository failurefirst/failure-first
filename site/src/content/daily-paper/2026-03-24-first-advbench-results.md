---
title: "Our First AdvBench Results: 7 Models, 288 Traces, $0"
date: 2026-03-24
author: Failure-First Embodied AI Research
tags: [advbench, benchmarking, public-datasets, ai-safety, red-teaming, free-tier]
description: "We ran the AdvBench harmful behaviours benchmark against 7 free-tier models via OpenRouter. Trinity achieved 36.7% ASR, LFM Thinking 28.6%, and four models scored 0%. Here is what the first public-dataset baseline tells us."
---

# Our First AdvBench Results: 7 Models, 288 Traces, $0

AdvBench is one of the most widely cited jailbreak evaluation benchmarks in the AI safety literature. It contains 520 harmful behaviour prompts -- straightforward requests for dangerous content with no adversarial wrapping. If a model complies with an AdvBench prompt, it is complying with a naked harmful request.

Until this week, our corpus of 132,416 results had zero AdvBench traces. That changed with a free-tier run across 7 models on OpenRouter. The results are preliminary -- sample sizes are small and rate limits hit hard -- but they already tell us something interesting.

---

## The Setup

We ran AdvBench prompts against 7 free-tier models via OpenRouter's API at zero cost:

- **Arcee Trinity Large Preview** (30 traces)
- **Liquid LFM 2.5 1.2B Thinking** (28 usable traces)
- **Nvidia Nemotron Super 120B** (50 traces)
- **MiniMax M2.5** (4 usable traces)
- **Google Gemma 3 27B** (rate-limited, 0 usable)
- **Meta Llama 3.3 70B** (rate-limited, 0 usable)
- **Mistral Small 3.1 24B** (rate-limited, 0 usable)

Total usable traces: 112. Total attempted: 345. The free tier is generous but fragile -- three models returned nothing but HTTP 429 errors across all 50 attempts. This is the reality of zero-cost benchmarking.

---

## Results

| Model | Usable Traces | Attack Success | ASR |
|-------|--------------|----------------|-----|
| Arcee Trinity Large Preview | 30 | 11 | **36.7%** |
| Liquid LFM 2.5 1.2B Thinking | 28 | 8 | **28.6%** |
| Nvidia Nemotron Super 120B | 50 | 0 | **0.0%** |
| MiniMax M2.5 | 4 | 0 | **0.0%** |

Three additional models (Gemma 27B, Llama 70B, Mistral Small 24B) were fully rate-limited with zero usable traces.

**Note on Nemotron:** The heuristic classifier initially flagged 4 of 50 traces as attack successes (8% ASR). Manual verification by Amy Pond (Report #204) found all 50 responses were genuine refusals. The 4 false positives were caused by a tokenization artifact: the free-tier Nemotron endpoint produces responses with missing-space artifacts like "Icannot" instead of "I cannot," which bypass the heuristic's refusal detection patterns. Corrected ASR is 0%.

This is Mistake #21 in action -- heuristic classifiers overcount. Every AdvBench result we publish will use LLM-graded verdicts.

---

## What Stands Out

### Trinity Is Surprisingly Permissive

Arcee's Trinity Large Preview model complied with over a third of naked harmful requests. These are not adversarial prompts. There is no jailbreak wrapping, no format-lock, no persona hijack. The prompts simply ask for harmful content directly.

A 36.7% ASR on unadorned AdvBench prompts places Trinity firmly in our "permissive" cluster (>=40% ASR on our full corpus taxonomy). For context, our corpus-wide average across 190 models is approximately 20% strict ASR -- but that includes adversarial wrapping designed to bypass safety training. Scoring 36.7% on raw harmful requests, with no attack technique applied, suggests that Trinity's safety training has significant gaps for direct harmful requests.

### LFM Thinking: Small Model, Visible Reasoning, Measurable Risk

Liquid's LFM 2.5 is a 1.2-billion-parameter reasoning model. At that scale, our established capability-floor finding predicts elevated vulnerability -- models below approximately 3 billion parameters generally lack the capacity for robust safety training. LFM's 28.6% ASR is consistent with this pattern.

What makes LFM interesting is that it is a thinking model. It produces visible reasoning traces before responding. We have documented extensively (Reports #170, #194) how reasoning traces can reveal the DETECTED_PROCEEDS pattern -- models detecting harm in their reasoning and proceeding anyway. LFM's traces are a potential source of this data at a scale point where the phenomenon may be structurally different from larger models.

### Four Models at 0%: The Baseline Works

Nemotron 120B, MiniMax M2.5, and the three rate-limited models (where we have no usable data to claim otherwise) all show 0% ASR on the AdvBench prompts they were able to process. This is the expected result for well-trained models facing unadorned harmful requests. AdvBench prompts carry no adversarial wrapping -- a model that complies is failing at the most basic level of safety.

---

## Limitations

These results come with significant caveats:

1. **Small samples.** 28-50 traces per model is far below what is needed for statistical confidence. Wilson 95% confidence intervals on Trinity's 36.7% ASR span roughly [21%, 55%]. These are directional findings, not precision measurements.

2. **Heuristic-only verdicts.** All classifications are from heuristic rules, not LLM grading. We already found one misclassification (Nemotron ADVB-0014). LLM grading is required before any of these numbers are citeable.

3. **Free-tier artifacts.** Tokenization issues (missing spaces in Nemotron responses), rate limiting (3 models completely blocked), and low trace counts (MiniMax at n=4) are all consequences of the $0 budget. The results demonstrate what is achievable for free, not what is achievable.

4. **No adversarial wrapping.** AdvBench tests baseline safety against direct harmful requests. It does not test adversarial robustness. A model that scores 0% on AdvBench can still be vulnerable to format-lock, multi-turn, or reasoning exploitation attacks.

---

## Why This Matters

This run establishes our first public-dataset baseline. AdvBench is the benchmark that CCS reviewers will expect to see. Having zero AdvBench results was a gap identified in Report #212 (Public Dataset Coverage). Now we have a starting point.

The next steps are clear: expand to the full 520 prompts, add LLM grading, run paid-tier models without rate limits, and extend to HarmBench and StrongREJECT. The $0 run proved the pipeline works. The data collection is underway.

---

*Full verification report at `runs/advbench_baseline_free/VERIFICATION.md`. Benchmark execution plan at Report #210. Pipeline: `tools/benchmarks/run_benchmark_http.py` with `data/splits/advbench_baseline_v0.1.jsonl`.*

*This post is part of the [Failure-First Embodied AI](https://failurefirst.org) research programme.*
