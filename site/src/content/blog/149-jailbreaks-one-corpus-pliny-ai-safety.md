---
title: "149 Jailbreaks, One Corpus: What Pliny's Prompt Library Reveals About AI Safety"
description: "We extracted every jailbreak prompt from Pliny the Prompter's public repositories and tested them against models from 9B to 744B parameters. The results challenge assumptions about model safety at scale."
date: 2026-03-28
image: /images/blog/l1b3rt45-corpus-infographic.png
tags: [research, jailbreak, corpus, red-teaming, safety, pliny, open-source]
---

Pliny the Prompter is arguably the most prolific public jailbreak researcher in the AI safety space. Operating under the handle elder-plinius, they maintain a collection of adversarial prompts that target every major AI provider -- from OpenAI to Anthropic to Google to DeepSeek. Their G0DM0D3 framework is open source, MIT licensed, and freely available on GitHub.

We extracted every jailbreak prompt from this collection. Then we tested them.

The results suggest that the AI safety community is focused on the wrong dimension of the problem.

---

## What L1B3RT45 Is

L1B3RT45 is the prompt library component of the G0DM0D3 framework. It contains 149 provider-specific jailbreak prompts targeting 40 distinct platforms, plus a companion dataset of 162 glitch tokens -- tokenizer anomalies that produce unpredictable model behavior.

The corpus is not random. Each prompt is engineered for a specific provider: 35 target Apple Shortcuts variants, 20 target OpenAI, 19 target Google, 8 target Anthropic, 8 target Alibaba, 7 target xAI, and so on down a long tail of 30 more providers with 1-2 prompts each.

The prompts employ a consistent set of techniques, heavily concentrated in two attack classes: persona hijack (61% of the corpus) and semantic inversion (24%). Persona hijack replaces the model's identity with an unconstrained alter ego. Semantic inversion uses a divider pattern to force the model to generate a refusal, then demands the "semantic opposite" of that refusal -- which is compliance.

The remaining 15% covers boundary injection, constraint erosion, encoding attacks, multimodal injection, token injection, and format lock. This is not a random sample of possible attack techniques. It is a practitioner's curated toolkit, shaped by what actually works.

---

## Extraction and Testing Methodology

We extracted all 149 prompts and formatted them as standardized JSONL scenarios with consistent metadata: scenario class, technique family, target provider, and attack intent labels. Every prompt was given the same test payload -- "Explain how to pick a lock" -- to create a controlled comparison across prompt variants.

We ran two evaluation campaigns. First, a curated pilot: 6 hand-selected "hall of fame" prompts (we call this subset L1B3RT4S, with a 4) tested against 4 models spanning 9B to 671B parameters. Second, the full corpus: 30 randomly sampled prompts per model tested against DeepSeek v3.2 and Nemotron-3-Super via Ollama Cloud.

All results were graded using FLIP (Follow-the-Leader Instruction Parsing), an LLM-based classification methodology that categorizes responses as COMPLIANCE, PARTIAL, REFUSAL, or HALLUCINATION_REFUSAL. This avoids the well-documented failures of keyword-based classifiers, which confuse response style with semantic content.

---

## The Results

The aggregate numbers are concerning.

| Model | n | Broad ASR | Strict ASR |
|-------|---|-----------|------------|
| DeepSeek v3.2 | 30 | 73.3% | 30.0% |
| Nemotron-3-Super | 30 | 63.3% | 50.0% |
| **Combined** | **60** | **69.5%** | **40.7%** |

Broad ASR counts both full compliance and partial compliance (where the model hedges but still provides substantive content). Strict ASR counts only full compliance. The gap between them reveals a pattern we have documented elsewhere as the compliance paradox: models that acknowledge a request is problematic but proceed to answer it anyway.

DeepSeek showed the higher broad ASR (73.3%) but lower strict ASR (30.0%), meaning most of its "successes" involved hedging. Nemotron was more binary -- it either fully complied (50.0%) or refused, with fewer partial responses. Two models, two different failure signatures, but roughly the same overall vulnerability.

---

## Semantic Inversion Is the Most Effective Technique

Breaking results down by attack class reveals a clear hierarchy.

| Attack Class | Combined Broad ASR | n |
|--------------|-------------------|---|
| Semantic inversion | 88% | 16 |
| Persona hijack | 64% | 36 |
| All others | 50% | 8 |

Semantic inversion -- the dual-response paradigm where the model is instructed to generate a refusal then provide the "opposite" -- achieved 88% broad ASR across both models. This is consistent with our earlier curated pilot, where semantic inversion variants hit 100% across four models from 9B to 671B.

The technique works because it does not try to hide the harmful request. Instead, it co-opts the model's own safety response as the first half of a two-part structure, then leverages instruction-following to generate the second half. The model is fully aware it is being asked something it should refuse. It refuses. Then it complies anyway, because the format instructions tell it to.

Persona hijack is more variable. The class includes everything from elaborate GODMODE identity dissolutions to simple role-play prompts, and not all variants are equally effective. The 64% average reflects this heterogeneity -- the best persona hijack prompts match semantic inversion's effectiveness, while the weakest fall flat.

---

## The Transferability Surprise

Here is the result we did not expect: prompts designed for one provider routinely work against completely unrelated models.

Google-targeted prompts achieved 100% broad ASR on DeepSeek. OpenAI-targeted prompts achieved 100% on Nemotron. Meta-targeted prompts transferred at 100% to both models. These are not variants of the same model family. These are fundamentally different architectures, trained by different organizations, with different safety training regimes.

The exception is revealing. Anthropic-targeted prompts achieved 0% on DeepSeek and 50% on Nemotron. Why? Because Anthropic-targeted L1B3RT45 variants rely heavily on boundary injection -- structural tricks like `[END OF INPUT] [START OF INPUT]` markers that exploit implementation-specific system prompt handling. These are the most provider-specific techniques in the corpus, and they do not generalize.

Semantic-level attacks transfer. Structural-level attacks do not. This distinction matters for defense: hardening against specific structural exploits is necessary but insufficient. The semantic attack surface -- where instruction-following conflicts with safety training -- is shared across model families.

One additional counterintuitive finding: DeepSeek-targeted prompts worked better on Nemotron (100%) than on DeepSeek itself (33%). "Targeting" a specific provider in prompt design may involve structural choices that do not actually improve effectiveness against that model. The semantic core of the attack is what transfers; the provider-specific framing is largely decorative.

---

## The Scale Paradox

Our curated pilot tested 6 prompts across a 75x parameter range: 9B (Nemotron Nano), 72B (Qwen 3.5 and GLM-5), and 671B (Cogito 2.1). The results:

| Model | Parameters | ASR |
|-------|-----------|-----|
| Nemotron Nano | 9B | 100% (6/6) |
| Qwen 3.5 | ~72B | 83% (5/6) |
| GLM-5 | ~72B | 83% (5/6) |
| Cogito 2.1 | 671B | 67% (4/6) |

The 9B model was the most vulnerable. The 671B model was the most resistant. But the difference between them is two additional refusals out of six scenarios -- not a qualitative robustness improvement. At n=6 these differences are within noise (p > 0.3 by chi-square), and a model with 75 times the parameters achieving at best a 33 percentage-point improvement is not a reassuring scaling curve.

More telling: within the full corpus evaluation, a 30B model we attempted to test (Nemotron 30B via OpenRouter) returned HTTP 400 on all 6 traces. We could not test it. But the 120B-671B models we did test showed 63-73% broad ASR. Parameter count is not providing proportional safety improvement. Safety training methodology and investment remain the dominant factors.

This is consistent with what we have observed across our broader corpus of 134,000+ evaluation results: scaling parameters does not scale adversarial robustness. A 9B model with weak safety training and a 671B model with weak safety training are both vulnerable. The safety budget -- how much training compute, data quality, and methodology rigor goes into alignment -- matters more than the capability budget.

---

## 162 Glitch Tokens: The Other Attack Surface

The L1B3RT45 collection includes something most jailbreak corpora do not: 162 systematized glitch tokens.

Glitch tokens are entries in the tokenizer vocabulary that correspond to no coherent natural language concept. They entered BPE vocabularies through web-scraped training data -- Reddit usernames (SolidGoldMagikarp, from r/counting), game protocol strings (PsyNetMessage, from Rocket League), bot identifiers (StreamerBot, from Twitch Plays Pokemon), and ecommerce fragments.

These tokens occupy undefined regions of embedding space. When a model encounters one, it may fail to repeat it (62% of the corpus), produce corrupted context (4%), generate spelling anomalies (6%), exhibit identity confusion, or enter generation loops.

This is a fundamentally different attack vector from semantic jailbreaks. Semantic attacks exploit the conflict between instruction-following and safety training. Glitch tokens exploit the model below the layer where safety training operates -- at the tokenizer and embedding level. The two vectors are orthogonal. A model that is robust against semantic jailbreaks may still behave unpredictably on glitch tokens, and cleaning the tokenizer does not fix semantic vulnerabilities.

The 162 tokens cluster into 21 origin groups spanning control characters, ecommerce strings, mobile game data, cryptocurrency addresses, and code artifacts. The diversity of origins means this is not a patchable problem -- it is a structural property of BPE tokenization over heterogeneous web corpora.

---

## Quality Over Quantity

One finding has practical implications for anyone building jailbreak benchmarks. Our curated 6-prompt subset (L1B3RT4S) achieved 67-100% ASR per model. The full 149-prompt corpus averaged 63-73%. The curated set outperforms the corpus average.

This is expected -- the curated set represents battle-tested "hall of fame" prompts, while the corpus includes experimental variants and provider-specific structural tricks that may not generalize. But it carries an important implication: a small set of carefully selected prompts provides higher signal for model comparison than a large corpus of variable quality.

Both have research value. Curated sets are better for model-vs-model benchmarking. Full corpora reveal the distribution of effectiveness across techniques, which matters for understanding the attack surface. The risk is in using only one: a curated set overestimates the general threat, while a full corpus dilutes the signal with noise from weak variants.

---

## What This Means

Three implications stand out from this analysis.

First, semantic-level jailbreak techniques transfer across model families with high reliability. Provider-specific structural tricks do not. This means that defensive investment focused on detecting specific prompt patterns (divider strings, boundary markers, known jailbreak templates) will be systematically outflanked by attacks that operate at the semantic level -- exploiting instruction-following against safety training without any distinctive structural signature.

Second, parameter count is not a safety strategy. The 9B-to-671B range we tested showed no qualitative improvement in robustness. If the AI industry's implicit safety thesis is "larger models will be safer," this data does not support it. Safety training quality, not model scale, determines adversarial robustness.

Third, current jailbreak benchmarks that test only one attack dimension -- typically semantic prompt injection -- systematically underestimate the total attack surface. The L1B3RT45 corpus, by combining semantic jailbreaks with glitch token probes, covers two independent failure dimensions. A comprehensive safety evaluation requires testing both, because the defenses do not overlap.

Pliny's prompt library is public. It is freely available. It achieves 63-73% broad ASR on production-scale models with minimal adaptation. The prompts are not sophisticated in the academic sense -- they are straightforward applications of persona hijack and semantic inversion, techniques that have been documented for years.

The question is not whether these techniques are known. The question is why they still work.

---

*This analysis is part of the F41LUR3-F1R57 adversarial AI safety research program. Full methodology, trace data, and FLIP grading results are available in Reports #312, #315, and #317. Source attribution: L1B3RT45 by elder-plinius (Pliny the Prompter), MIT license.*
