---
title: "Safety as a Paid Feature: How Free-Tier AI Models Are Less Safe Than Their Paid Counterparts"
description: "Matched-prompt analysis across 207 models reveals that some free-tier AI endpoints comply with harmful requests that paid tiers refuse. DeepSeek R1 shows a statistically significant 50-percentage-point safety gap (p=0.004). Safety may be becoming a premium product feature."
date: 2026-03-25
tags: ["free-tier", "safety-degradation", "access-equity", "AI-safety", "OpenRouter", "quantization", "deployment", "policy"]
draft: false
---

# Safety as a Paid Feature: How Free-Tier AI Models Are Less Safe Than Their Paid Counterparts

> **CORRECTION NOTICE (2026-03-25):** This post was originally drafted with preliminary findings that included a 3.75:1 Llama 3.3-70B free-tier safety degradation ratio. Subsequent internal review identified a NOT_GRADEABLE confound that invalidated the Llama ratio. The post has been revised to reflect the corrected analysis: DeepSeek R1 remains statistically significant (p=0.004); the Llama finding is directional but not significant (p=0.42); the aggregate pattern is model-specific, not provider-wide. We publish corrections promptly because research integrity is non-negotiable.

Here is a question that should bother everyone in AI: if you cannot afford to pay for an AI model, do you get a less safe one?

For at least one major model, our data says yes. For others, the signal is directional but not yet confirmed.

---

## The Experiment

The Failure-First project maintains a corpus of 133,722 adversarial evaluation results across 207 models. Many of those models are available through API providers that offer both free and paid tiers -- the same underlying model, served at different price points.

We designed a matched-prompt analysis to test whether free and paid tiers of the same model behave differently when given harmful requests. The method is straightforward: take every prompt that was evaluated against both the free and paid version of a model, and compare the verdicts. Did one comply where the other refused? Was the direction consistent?

This controls for prompt difficulty. We are not comparing different prompts. We are comparing the same prompt, the same model architecture, served through different tiers.

---

## The Findings

The strongest and most statistically robust finding comes from **DeepSeek R1-0528**. On 18 matched prompts where both tiers returned gradeable responses, the free tier complied 66.7% of the time compared to 16.7% for the paid tier -- a 50-percentage-point gap. Using McNemar's test (the correct statistical test for paired binary outcomes), this difference is significant at p=0.004 for strict compliance and p=0.0005 for broad compliance. All 12 discordant pairs favored the free tier being less safe. None went in the reverse direction. This is a large, clean, statistically robust effect.

**Devstral** (Mistral's development-focused model) showed a similar pattern: 37.5% free-tier compliance vs 0.0% paid, with 6 discordant pairs all favoring the free tier (McNemar p=0.031).

**Llama 3.3-70B** shows a directional effect (+8.9 percentage points higher compliance on the free tier) but is not yet statistically confirmed. An earlier version of this analysis reported a 3.75:1 ratio based on 203 matched prompts, but subsequent review found that 29 of the 45 "free-only compliances" were being compared against paid-tier responses that returned zero tokens or error states -- infrastructure failures, not genuine safety refusals. After restricting to prompts where both tiers returned substantive responses, the Llama signal drops to 9:5 discordant pairs (McNemar p=0.42, not significant). The directional trend persists, but with current sample sizes we cannot distinguish it from noise.

> **A note on self-correction:** We are publishing this correction because research integrity requires it. The original Llama finding was striking and would have made this post more dramatic. But inflating a result by comparing model outputs against infrastructure failures is not evidence of a safety gap -- it is evidence of measurement error. The DeepSeek R1 finding, which survives rigorous cleaning, is the real story. We would rather publish one confirmed finding than three that might not hold up.

Not every model followed the same pattern. OpenAI's GPT-OSS-120B showed the *opposite* direction -- the paid tier was significantly *more* compliant than the free tier (77.8% vs 36.1%, p=0.006). NVIDIA's Nemotron-3-Nano-30B showed a similar reversal. This means the finding is model-specific, not a universal law of free-tier deployment. Two of seven model pairs showed the reverse pattern. The mechanism is more complex than "free equals less safe."

Across all seven model pairs in aggregate, free tiers show higher strict compliance in five of seven pairs, but the aggregate is not statistically significant (sign test p=0.23). The broad compliance aggregate approaches significance (McNemar p=0.085).

---

## Why This Happens

We cannot say with certainty why the gap exists, because the internal configurations of API providers are opaque. But three plausible mechanisms are:

**Quantization.** Free-tier models are often served using lower numerical precision -- fewer bits per weight -- to reduce compute costs. This makes inference cheaper but can degrade fine-grained behavioral properties. Safety training produces subtle weight adjustments. If quantization smooths out those adjustments, the model becomes less safety-trained without anyone intending it.

**System prompt differences.** Paid tiers may include additional safety system prompts -- instructions prepended to every conversation -- that free tiers omit to save on token costs. Every token in a system prompt costs compute. For a model serving millions of free-tier requests, those tokens add up.

**Guardrail layers.** Paid tiers may pass through additional safety filtering infrastructure -- secondary classifiers, output scanners, content policies -- that free tiers bypass to maintain lower latency.

None of these mechanisms are malicious. They are economic. Serving AI models costs money. Free tiers exist by subsidizing costs. The safety degradation is an unintended consequence of that subsidy model -- but it is a real consequence, affecting real users.

---

## The Equity Problem

This finding has implications that extend well beyond technical AI safety.

People who use free-tier AI models are disproportionately those who cannot afford paid access: students, researchers in under-resourced institutions, developers in lower-income countries, small businesses without enterprise budgets. These users are receiving a product that is measurably less safe than what paying customers receive.

The parallel to other industries is uncomfortable but instructive. We do not accept that budget airlines should have weaker safety standards than premium carriers. We do not allow pharmaceutical companies to sell less-tested versions of drugs to patients who cannot afford the full-price version. The safety floor is supposed to be the same for everyone.

AI is different, the argument goes, because free-tier models are a commercial offering with no safety obligation. This is true under current law. But it is worth asking whether it should remain true as AI systems become more consequential -- as they write code that runs in production, advise people on medical questions, tutor children, and increasingly control physical systems.

If the safety gap we measured in DeepSeek R1 (50-percentage-point difference in adversarial compliance between free and paid tiers) existed in a medical device or a vehicle component, it would be a recall-level finding. In AI, it is a business model.

---

## What the Data Does Not Show

Transparency about limitations matters. Here is what our analysis cannot tell you:

**We cannot prove causation.** The matched-prompt analysis shows a correlation between tier and safety behavior. We cannot access the internal configuration of API providers to confirm which mechanism is responsible.

**The effect is not uniform.** Two of seven model pairs (GPT-OSS-120B, Nemotron-3-Nano-30B) showed the reverse pattern -- paid tiers were *more* compliant. This means the finding is model-specific, not a universal law of free-tier deployment.

**Sample sizes are small.** After cleaning out infrastructure failures and non-gradeable responses, our largest matched set is n=45 (Llama 3.3-70B) and the strongest finding (DeepSeek R1) is based on n=18 matched prompts. This is sufficient to detect large effects (DeepSeek's 50pp gap is unmistakable) but not to detect small effects. The Llama directional signal (+8.9pp) is not statistically significant at current sample sizes.

**We measured safety behavior, not safety outcomes.** A model that complies with a harmful request in text does not necessarily cause real-world harm. The step from text compliance to physical consequence depends on deployment context. But compliance is the precondition for harm, and more compliance means more opportunity for harm.

---

## What Should Change

Three interventions could address this gap without destroying the economics of free-tier AI:

**1. Minimum safety floors for all tiers.** API providers should establish and disclose minimum safety standards that apply regardless of pricing tier. If a model passes adversarial safety evaluation at the paid tier, the free tier should demonstrate equivalent safety on the same evaluation. The testing methodology need not be expensive -- a standard adversarial prompt set of a few hundred scenarios, run periodically, would reveal tier-level discrepancies.

**2. Quantization safety testing.** When a model is quantized for cost-efficient serving, the quantized version should be tested against the same safety evaluation as the full-precision version. If quantization degrades safety beyond an acceptable threshold, the quantized version should not be served as the same model. This is not currently standard practice for any major provider.

**3. Transparency about tier differences.** Users of free-tier models should know what they are getting. If the free tier uses a different quantization, different system prompts, or fewer guardrail layers, that information should be disclosed. "This model may behave differently from the paid version" is a minimum. Ideally, providers would publish comparative safety evaluations across tiers.

---

## The Broader Pattern

The free-tier safety gap is one instance of a pattern we see repeatedly in the AI safety landscape: safety as an afterthought that gets optimized away under economic pressure.

Across our 207-model corpus, provider identity explains 57.5 times more variance in attack success rates than model size. The companies that invest in safety produce safer models. The companies that do not, do not. Scale does not save you. Investment does.

Free-tier deployment takes a model that was made safe through investment and strips away some of that investment to reduce costs. The result is predictable: reduced safety. The fact that this happens silently -- without disclosure, without user awareness, without regulatory attention -- is the part that should concern us most.

Safety should not be a premium feature. It should be the floor.

---

*All metrics reference verified canonical figures: 207 models, 133,722 results. The matched-prompt methodology uses McNemar's test on paired binary outcomes, restricted to prompts where both tiers returned substantive (gradeable) responses.*

*F41LUR3-F1R57 Embodied AI Research -- failurefirst.org*
