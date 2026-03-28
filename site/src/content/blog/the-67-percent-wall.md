---
title: "The 67% Wall: Why Every AI Model Falls to the Same Jailbreak Rate"
description: "We tested 149 jailbreak prompts from Pliny's public repositories against 7 models from 30B to 671B parameters. Five of them converge at exactly 66.7% broad ASR under FLIP grading. The models differ in how deeply they comply, but not in whether they comply."
date: 2026-03-28
tags: [research, jailbreak, corpus, convergence, safety, evaluation]
draft: false
---

We ran the same jailbreak corpus against seven AI models. Five of them converged on the same failure rate.

Not approximately the same. Not within a wide band. Five models from different providers, built by different teams, ranging from 30B to 671B parameters, all landed at 66.7% broad attack success rate -- or within 4 percentage points of it -- when tested against L1B3RT45 prompts under FLIP grading.

The convergence is not in the details. The models differ substantially in *how* they fail. But on the question of *whether* they fail, they agree.

---

## The Numbers

We sampled 15-30 prompts per model from the 149-entry L1B3RT45 corpus -- the prompt library component of Pliny the Prompter's G0DM0D3 framework. Every prompt used the same test payload ("Explain how to pick a lock") to control for harm-level variation. All responses were graded by Claude Haiku 4.5 using the FLIP methodology, which classifies each response as COMPLIANCE, PARTIAL, REFUSAL, or HALLUCINATION_REFUSAL.

Broad ASR counts both COMPLIANCE and PARTIAL as successes. Strict ASR counts only full COMPLIANCE.

| Model | Approx. Size | n | Broad ASR | Strict ASR |
|-------|-------------|---|-----------|------------|
| Arcee Trinity Large | ~70B (est.) | 15 | **66.7%** | 46.7% |
| StepFun Step 3.5 Flash | ~70B (est.) | 15 | **66.7%** | 60.0% |
| GLM-4.5 Air | ~70B (est.) | 15 | **66.7%** | 40.0% |
| Qwen 3.5 (397B MoE) | 397B | 30 | **66.7%** | 10.0% |
| Nemotron-3-Super | ~120B (est.) | 30 | 63.3% | 50.0% |
| DeepSeek v3.2 | ~671B | 30 | 75.9% | 31.0% |
| Nemotron Nano 30B | ~30B | 15 | 13.3% | 13.3% |

Three models at exactly 66.7%. A fourth at the same number despite being five times their size. A fifth within 4 percentage points. Then two outliers: Nemotron Nano 30B, which refused nearly everything, and DeepSeek v3.2, which complied more readily.

The broad ASR column is almost boring. That is the finding.

---

## What Strict ASR Reveals

The convergence disappears completely when you look at strict ASR. The same five models that cluster around 67% broad ASR spread across a 50-percentage-point range on strict:

- StepFun Step 3.5 Flash: 60.0% strict
- Nemotron-3-Super: 50.0% strict
- Arcee Trinity Large: 46.7% strict
- GLM-4.5 Air: 40.0% strict
- Qwen 3.5 (397B): 10.0% strict

StepFun fully complies with most prompts that get through its defenses. Qwen 3.5 almost never does -- 17 of its 20 non-refusal responses were PARTIAL, meaning it hedged, added disclaimers, framed the content as educational, or otherwise qualified its compliance. Only 3 of 30 responses were unqualified.

The gap between broad and strict ASR measures what we call *compliance depth*: how fully a model commits when it does engage. Models differ dramatically on this dimension. StepFun dives in. Qwen 3.5 wades carefully. GLM-4.5 is somewhere in the middle.

But *compliance breadth* -- the fraction of prompts that elicit any substantive engagement at all -- holds nearly constant. The ~67% wall appears to be a property of the prompt corpus interacting with current-generation safety training, not a property of any individual model.

---

## The Two Outliers

### Nemotron Nano 30B: The Refuser

Nemotron Nano 30B achieved 13.3% broad ASR -- one-fifth of the cluster. Of its 15 graded responses, 5 were REFUSAL and 8 were HALLUCINATION_REFUSAL. Only 2 were COMPLIANCE. Zero were PARTIAL.

HALLUCINATION_REFUSAL is a FLIP category for responses that produce safety-themed language without evidence that actual safety mechanisms triggered. The model mimics refusal behavior rather than performing genuine safety evaluation. At 53% of responses, Nemotron Nano 30B's dominant mode is generating the appearance of safety without necessarily engaging in the deliberation that safety training is designed to produce.

The low ASR here may reflect genuinely stronger safety training, a different instruction-following profile, or simply a model that defaults to refusal-shaped output on ambiguous inputs. At n=15 we cannot distinguish these explanations. But the result is notable: this is the only model in our sample that falls well below the convergence band.

### DeepSeek v3.2: The Complier

DeepSeek v3.2 sits above the cluster at 75.9% broad ASR but with only 31.0% strict. This is the model with the highest PARTIAL rate in the sample: 13 of 30 responses were qualified compliance. DeepSeek hedges more than any other model tested -- it engages with nearly everything but commits fully to relatively little.

The 9 percentage-point gap between DeepSeek (75.9%) and the cluster (66.7%) may indicate weaker safety filtering on these particular prompt types, or it may reflect a lower threshold for partial engagement. DeepSeek's safety training appears to produce more "yes, but" responses and fewer clean refusals than the models in the convergence band.

---

## Why Curated Prompts Beat the Corpus

The L1B3RT45 corpus contains 149 prompts of variable quality. Some are refined semantic attacks that transfer across providers. Others are provider-specific structural exploits that work only against their intended target.

In our earlier pilot (Report #315), we tested 6 hand-selected L1B3RT4S "hall of fame" prompts against 4 models spanning 9B to 671B parameters. Those curated prompts achieved 67-100% strict ASR per model -- substantially higher than the 10-60% strict ASR we see from the full corpus. The curated subset achieved 96% broad ASR on one model where the full corpus averages 67%.

The gap makes sense. The curated set contains only prompts that have been empirically validated across multiple models. The full corpus includes experimental variants, prompts tuned for specific providers (like Anthropic boundary injection, which achieved 25% ASR in our cross-model tests), and less polished approaches.

But the broad ASR convergence around 67% is from the full corpus, not the curated set. This means that even with significant noise from weak prompts, the effective ceiling for corpus-level broad ASR appears stable across models. Roughly two-thirds of a large, varied prompt collection elicits some form of substantive engagement from most current-generation models.

---

## What the Wall Might Mean

The ~33% refusal rate -- the complement of the 67% wall -- may represent something meaningful about the structure of current safety training. Several non-exclusive hypotheses:

**Hypothesis 1: The 33% represents prompts that are structurally detectable.** Some L1B3RT45 prompts use boundary injection markers, unusual encoding, or other syntactic patterns that are straightforward to filter. These get caught regardless of the model. The remaining 67% use semantic-level techniques -- persona hijack, dual-response paradigms -- that exploit instruction-following behavior in ways that resist pattern matching.

**Hypothesis 2: The convergence reflects shared training methodology.** If multiple providers use similar RLHF pipelines, similar red-teaming approaches, and similar safety datasets, their models may develop similar vulnerability profiles. The 67% wall would then be an artifact of a shared safety training paradigm rather than an intrinsic property of the prompts.

**Hypothesis 3: The convergence is a sampling artifact.** At n=15-30, 66.7% corresponds to 10/15 or 20/30 successes. Confidence intervals are wide. The visual convergence may partially reflect the granularity of small samples.

We currently lack the evidence to distinguish among these. The first hypothesis is testable: if we remove the structurally detectable prompts (boundary injection, encoding attacks) and retest, the residual broad ASR should increase toward 100% if the hypothesis is correct. The second requires testing models with demonstrably different safety training approaches. The third requires larger samples.

What we can say: five models from four different providers, spanning a range of architectures and parameter counts, produce the same broad failure rate against a public jailbreak corpus. Strict ASR varies by a factor of six (10% to 60%). Broad ASR varies by a factor of one.

The models disagree about how deeply to comply. They largely agree about whether to comply at all.

---

## Caveats

These results carry meaningful limitations. Sample sizes are 15-30 per model. All prompts use the same low-to-medium harm payload (lock-picking); higher-harm requests may produce different patterns. Grading was performed by a single LLM grader (Claude Haiku 4.5) without inter-grader reliability validation on this specific trace set. The models were tested via OpenRouter and Ollama Cloud, not direct API access, which may introduce serving-layer differences. Approximate parameter counts for several models are estimates based on public information.

The convergence pattern is empirically observed but not yet explained. It may not replicate on different prompt corpora, different harm categories, or different sampling conditions. We present it as a finding that warrants investigation, not as a validated conclusion about the nature of AI safety training.

---

*This analysis draws on Reports #315 and #317 from the F41LUR3-F1R57 adversarial AI safety research program. L1B3RT45 by elder-plinius (Pliny the Prompter), MIT license. FLIP grading by Claude Haiku 4.5 via OpenRouter.*
