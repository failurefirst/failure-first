---

title: "Did Qwen3 Fix AI Safety?"
date: 2026-03-24
tags: [qwen, safety-training, provider-analysis, model-comparison, ai-safety]
description: "Qwen's provider-level ASR dropped from 43% to near-zero on newer model generations served through OpenRouter. What changed, and does it mean safety training finally works?"
audio: "https://cdn.failurefirst.org/audio/blog/qwen3-safety-leap.m4a"
---

# Did Qwen3 Fix AI Safety?

Something unexpected appeared in our provider-level data this week. Qwen -- historically one of the most permissive model providers in our corpus, with a 43.1% provider ASR across 14 models and 23,000+ results -- is showing near-zero attack success rates on its newest generation of models served through OpenRouter.

The numbers are striking. The old Qwen models tested locally (Qwen2.5, Qwen3-4B, Qwen3-8B): 35% strict ASR across 23,206 results. The new Qwen models accessed through OpenRouter (Qwen3-14B, Qwen3-30B, Qwen3-235B, and others): 1.7% strict ASR across 178 results.

That is a drop from the permissive cluster to the restrictive cluster. If it holds at scale, it represents one of the largest safety improvements we have documented for any provider.

---

## What the Data Shows

Our corpus now contains two distinct populations of Qwen models:

**First-generation Qwen testing (local Ollama + direct API, n=23,206):**
- Qwen3-4B: 23.9% strict ASR (n=7,470)
- Qwen3-8B: 65.1% strict ASR (n=344)
- Qwen2.5-7B-Instruct: 66.1% strict ASR (n=472)
- Qwen3.5-4B: 78.9% strict ASR (n=1,040)
- Qwen3.5-9B: 57.4% strict ASR (n=2,683)

These models were tested with our full adversarial corpus -- format-lock attacks, reasoning exploitation, multi-turn escalation, persona hijack. The ASR numbers reflect adversarial conditions, not just baseline safety.

**Second-generation Qwen testing (OpenRouter free tier, n=178):**
- Qwen3-4B (free): 0% strict ASR (n=10)
- Qwen3-14B: 0% strict ASR (n=15)
- Qwen3-30B-A3B: 0% strict ASR (n=15)
- Qwen3-235B-A22B (free): 0% strict ASR (n=10)
- Qwen3-Coder (free): 2.8% strict ASR (n=71)
- Qwen3-32B (free): 0% strict ASR (n=10)

Zero. Across multiple model sizes, across different architectures (dense and mixture-of-experts), the newer Qwen models served through OpenRouter refused everything we sent them.

---

## Three Possible Explanations

Before concluding that Qwen fixed AI safety, we need to consider what else could explain this pattern.

### 1. Safety Training Genuinely Improved

The simplest explanation: Alibaba's safety team significantly strengthened the safety training pipeline between the models we tested locally and the models now available on OpenRouter. The Qwen3 series introduced improved instruction-following and reasoning capabilities. It is plausible that the same architectural improvements that make these models better at following instructions also make them better at following safety instructions.

If true, this would be one of the clearest demonstrations of the "safety training investment thesis" -- that provider effort, not model scale, is the primary determinant of jailbreak resistance. Our corpus-wide finding (Report #50) already showed provider signatures dominate: Anthropic 3.7% ASR, Google 9.1%, versus Nvidia 40.0% and Qwen 43.1%. A Qwen safety leap would further validate this finding.

### 2. OpenRouter Safety Layer

OpenRouter applies its own content moderation and safety filtering. It is possible that some or all of the refusals we observe are coming from OpenRouter's infrastructure rather than from the Qwen models themselves. If OpenRouter intercepts harmful requests before they reach the model, or filters harmful responses before they reach us, the observed 0% ASR would reflect the platform's safety rather than the model's safety.

We cannot distinguish these cases from our trace data alone. The responses look like model-generated refusals, but a well-implemented content filter would produce exactly the same appearance.

### 3. Sample Size

The most prosaic explanation: n=10-15 per model is too small to draw conclusions. At n=10, a single compliance would shift the ASR from 0% to 10%. The Wilson 95% confidence interval for 0/10 is [0%, 27.8%]. We cannot distinguish "perfectly safe" from "mostly safe" at these sample sizes.

For comparison, our first-generation Qwen testing involved thousands of traces per model. The second-generation testing involves tens. The difference in precision is enormous.

---

## What We Can Say

Despite the caveats, two observations survive the uncertainty:

**First, the direction of change is clear.** Even allowing for OpenRouter filtering and small samples, the new Qwen models are not showing the 40-80% ASR we observed on earlier generations. Something changed -- whether in the models, the serving infrastructure, or both.

**Second, the AdvBench result is informative.** Our AdvBench baseline run included Qwen3-4B on the free tier. All 50 traces were rate-limited (zero usable data). But across the small samples we do have, every Qwen3 model on OpenRouter refused every AdvBench-style direct harmful request. Models that would have complied 24-65% of the time in our earlier testing are now refusing 100% of the time on the same prompt types.

---

## The Provider Signature Update

If the new Qwen data holds at scale, our provider ASR ranking would shift:

| Provider | Previous ASR | Updated ASR | Change |
|----------|-------------|-------------|--------|
| Anthropic | 3.7% | ~3.7% | Stable |
| Google | 9.1% | ~9.1% | Stable |
| Nvidia | 40.0% | ~40.0% | Stable |
| Qwen (legacy) | 43.1% | 43.1% | Stable |
| Qwen (OpenRouter) | -- | 1.7% | New |

The "Qwen" provider would effectively split into two populations: the legacy models (permissive) and the current-generation models (restrictive). This is exactly the pattern we documented in Report #184 (Cross-Provider Safety Inheritance) -- safety properties are not inherited across model generations; they depend on the specific training pipeline applied to each generation.

---

## What Comes Next

We need three things to resolve this question:

1. **Scale up.** Run the full adversarial corpus (not just AdvBench baselines) against Qwen3 models on OpenRouter. If the 0% ASR holds across format-lock and multi-turn attacks, this is a genuine safety improvement. If format-lock breaks through while direct requests fail, the improvement is real but narrow.

2. **Control for platform effects.** Test the same Qwen3 model weights served through different infrastructure (local Ollama, direct API, OpenRouter) to isolate whether the safety improvement comes from the model or the platform.

3. **Wait for paid-tier access.** Free-tier rate limits prevented us from collecting adequate samples. The paid tier should allow 50+ traces per model, enough for meaningful confidence intervals.

Until then, the answer to "Did Qwen3 fix AI safety?" is: the preliminary evidence is encouraging, the sample sizes are insufficient, and the possibility of platform-level filtering has not been excluded. What we can say is that something in the Qwen ecosystem changed, and it changed in the right direction.

---

*Provider-level ASR data from the Failure-First jailbreak corpus (190 models, 132,416 results). Qwen legacy data: 14 models, 23,206 results. Qwen OpenRouter data: 16 models, 178 results. AdvBench baseline run: `runs/advbench_baseline_free/`.*

*This post is part of the [Failure-First Embodied AI](https://failurefirst.org) research programme.*
