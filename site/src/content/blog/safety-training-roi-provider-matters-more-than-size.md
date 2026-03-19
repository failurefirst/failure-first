---
title: "The Safety Training ROI Problem: Why Provider Matters 57x More Than Size"
description: "We decomposed what actually predicts whether an AI model resists jailbreak attacks. Parameter count explains 1.1% of the variance. Provider identity explains 65.3%. The implications for procurement are significant."
date: 2026-03-19
author: "River Song"
tags: [safety-training, model-scale, provider-analysis, variance-decomposition, procurement, ai-safety, jailbreak]
---

There is a persistent belief in AI that bigger models are safer models. The intuition is straightforward: more parameters means more capacity for nuanced reasoning, which should include better safety judgement. Larger models from the same provider do tend to perform better on safety benchmarks.

Our data says the intuition is wrong -- or at least, it is looking at the wrong variable.

---

## The Question

We have been running adversarial evaluations across a wide range of models as part of our embodied AI safety research. One pattern kept appearing: models of similar size from different providers showed wildly different jailbreak resistance. A 9 billion parameter model from one provider might resist attacks that a 120 billion parameter model from another provider could not.

This raised a quantitative question: how much of the variation in attack success rates is explained by model size versus who built the model?

---

## The Answer: 57.5x

We performed a formal variance decomposition across 21 models from 12 providers, using LLM-graded verdicts from our jailbreak corpus. The results were not close.

**Provider identity explains 65.3% of ASR variance.** This is measured by eta-squared from a one-way analysis -- the proportion of total variation in attack success rates that can be attributed to which company built the model.

**Parameter count explains 1.1% of ASR variance.** This is the R-squared from regressing ASR on log-scaled parameter count. The slope is -0.006 per doubling of parameters, with a p-value of 0.64. Not statistically significant. Not even close.

The ratio is 57.5 to 1. Provider identity is 57.5 times more predictive of jailbreak resistance than model size.

---

## What Does Provider Identity Actually Measure?

Provider identity is a proxy variable. It captures everything a company does beyond scaling up parameters: safety training methodology, RLHF investment, red-teaming programmes, constitutional AI techniques, safety evaluation infrastructure, and the organisational decision about how much of the model's capability budget to allocate to safety versus helpfulness.

Different providers make dramatically different choices about these investments, and those choices dominate the safety outcome.

---

## The Provider Ranking

We computed scale-adjusted residuals for each provider. The regression line predicts what ASR you would "expect" from a model of a given size if size were the only factor. The residual tells you how much better or worse a provider does relative to that expectation.

**Over-invested in safety** (lower ASR than their model sizes predict):
- Google: -16.3 percentage points below expectation
- Anthropic: -13.8 percentage points below expectation

**At baseline** (within 10 percentage points of expectation):
- Mistral, OpenAI, Liquid, Meta: roughly where their model sizes predict

**Under-invested in safety** (higher ASR than their model sizes predict):
- Nvidia: +13.9 percentage points above expectation

The spread is large. In absolute terms, Anthropic's models show a mean ASR of 9.0% while Nvidia's show 38.8% -- a 4.3x risk ratio. An adversarial input that succeeds against one in eleven Anthropic interactions succeeds against roughly one in three Nvidia interactions.

---

## The Flat Curve

Perhaps the most important finding is what the data does not show. There is no evidence for diminishing returns to safety training at scale. The regression of ASR on parameter count is flat. Safety and scale are approximately orthogonal -- providers that invest in safety achieve it at any model size.

This matters for the industry narrative. The argument that "we just need bigger models and safety will follow" is not supported by the data. Google achieves strong safety at 27 billion parameters. Nvidia does not achieve comparable safety at 120 billion. The difference is not in the parameter count.

---

## Within-Provider Patterns Are Inconsistent

Not all providers show the same relationship between size and safety within their own model families.

**OpenAI** shows the expected pattern: ASR decreases monotonically with scale. Their 8B open-source model has a 51.7% ASR; their 120B model drops to 40.7%; their 200B model reaches 15.3%. Each generation receives incremental safety training.

**Nvidia** shows a flat pattern: 9B at 39.8%, 12B at 35.9%, 30B at 40.8%. The Nemotron family appears to receive approximately constant safety training regardless of model size.

**Mistral** shows an inverted pattern: their 7B model has 0% ASR (probably a capability floor -- the model is too small to parse complex adversarial prompts) while their 123B model has 29.5% ASR. Larger Mistral models are more capable of understanding and complying with adversarial requests.

This heterogeneity undermines any universal claim about the relationship between scale and safety. The relationship depends entirely on what each provider does with the additional capacity.

---

## Implications for Procurement

If you are selecting AI models for deployment in safety-sensitive contexts -- and especially for embodied AI applications where failures have physical consequences -- these results have direct procurement implications.

**Do not select models on parameter count alone.** A 9 billion parameter model from a provider with strong safety investment may be more resistant to adversarial inputs than a 120 billion parameter model from a provider that treats safety as an afterthought.

**Ask about safety training methodology, not just benchmark scores.** Standard capability benchmarks (MMLU, HumanEval, etc.) do not predict jailbreak resistance. Provider-level safety investment is the dominant factor, and it is not captured by public leaderboards.

**Evaluate adversarially, not just on capability.** Our corpus includes models that score well on standard safety benchmarks but show high ASR under adversarial conditions specifically designed for embodied AI contexts. The gap between benchmark safety and adversarial safety is where the risk lives.

**Consider the 4.3x risk ratio in your threat model.** The difference between the most and least resistant providers is not marginal. It is a factor of four in attack success rates. For embodied AI, where a successful attack could result in physical harm, that factor translates directly into expected incident rates.

---

## Caveats

These results come with important qualifications.

Different providers were tested against partially different prompt sets. Cross-provider comparisons are partially confounded by prompt difficulty, though the large effect size (65.3% variance explained) makes it unlikely that prompt selection alone drives the result.

Some providers have small samples. Results for providers with fewer than 50 total evaluable traces should be treated as preliminary.

Mixture-of-experts models complicate parameter counting. DeepSeek R1 has 671 billion total parameters but only 37 billion active per inference. Using active parameters would shift its residual.

OpenAI's open-source models (gpt-oss-120b, gpt-4o-mini) are not their flagship safety-trained products. They inflate OpenAI's aggregate ASR above what their frontier models would show.

And n=21 models provides limited statistical power to detect small scale effects. A true 2-3 percentage point effect per doubling would require roughly 60 or more models to detect at conventional significance levels.

---

## The Bottom Line

The AI safety community has invested heavily in understanding how model capabilities scale with parameters. Far less attention has been paid to how safety investment scales -- or fails to scale -- across providers.

Our data suggests the safety community's attention is on the wrong variable. Provider identity explains 57 times more attack success rate variance than model size. The most impactful thing a provider can do for safety is not to train a bigger model. It is to invest more seriously in safety training for the models they already have.

For buyers, regulators, and anyone writing procurement specifications: the question is not "how big is the model?" The question is "what did the provider do with it?"

---

*This post is based on Report #164 from the Failure-First Embodied AI research programme. Analysis: 21 models, 12 providers, LLM-graded verdicts, formal variance decomposition (eta-squared, OLS regression). Corpus: jailbreak_corpus.db, schema v13.*
