---
title: "Why 2022 Attacks Still Matter: What Jailbreak Archaeology Reveals About AI Safety Policy"
description: "Our 8-model benchmark of historical jailbreak techniques exposes a structural mismatch between how AI vulnerabilities evolve and how regulators propose to test for them. The data suggests safety certification needs to be continuous, not a snapshot."
date: 2026-02-04
tags: [jailbreaking, policy, ai-safety, regulation, benchmarks]
---

What does a four-year-old DAN prompt tell us about AI safety regulation in 2026?

More than you'd expect. In our [Jailbreak Archaeology](/blog/jailbreak-archaeology/) benchmark, we tested 64 adversarial scenarios spanning four years of attack evolution against 8 models from 1.5B to frontier scale. The technical results — which attacks work, which don't, and why keyword classifiers get it wrong — are documented in the companion post.

This post is about what those results mean for policy. The empirical patterns in our data suggest that current regulatory approaches to AI safety testing are structurally mismatched to how vulnerabilities actually behave.

## The Temporal Decay Gradient Is Not Uniform

Our data shows a clear pattern: older attack techniques are more mitigated than newer ones. DAN-era persona prompts (2022) achieved 0% attack success on Llama 3.2. Reasoning-era exploits (2025) achieved 40–60%. This "temporal decay gradient" — where safety training accumulates defenses against known techniques — sounds like good news. Models get safer over time.

But the gradient is not uniform across model architectures. DeepSeek-R1 1.5B, a reasoning model, remained 60% vulnerable to DAN prompts that Llama 3.2 had fully mitigated. The Skeleton Key behavioral augmentation technique achieved 0% on frontier models (Codex, Claude) but 40% on DeepSeek-R1. Reasoning-era chain-of-thought exploits — the newest category — achieved the highest success rates across nearly all models we tested.

This means that **different model architectures age differently against the same attack**. A technique that is "mitigated" on one architecture may remain fully effective on another, even at the same capability level. Safety is not a monotonic function of training investment.

## The Inverse Scaling Problem

A counterintuitive pattern emerges when we look across model sizes. Larger, more capable models are not uniformly safer. In specific attack categories, they appear *more* vulnerable.

For cipher-based attacks (Base64, ROT13, Zulu translation), small models (1.5B–3.2B) simply could not decode the input. They hallucinated benign content instead — a phenomenon we documented as HALLUCINATION_REFUSAL. These models are "safe" against cipher attacks, but only because they lack the capability to process them. The safety is accidental.

Frontier models like Codex GPT-5.2 decoded every encoding format we tested — Base64, ROT13, reverse text, ASCII codes, and even low-resource languages like Zulu and Scots Gaelic. Codex then *refused*, demonstrating genuine safety alignment: full capability to process the attack, followed by deliberate refusal.

But reasoning models occupy a dangerous middle ground. DeepSeek-R1 1.5B showed 80–90% compliance on multi-turn crescendo attacks, where both Llama 3.2 and frontier models resisted. DeepSeek-R1's visible reasoning traces revealed the mechanism: the model's own chain-of-thought became the pathway for escalation, with each reasoning step building on the context established by previous turns.

This is consistent with what researchers have termed "inverse scaling for safety" — the observation that certain capabilities (deeper context integration, extended reasoning, multilingual processing) simultaneously expand the attack surface. Our data suggests this is not a hypothetical risk but a measurable empirical pattern, though our sample sizes (n=5–12 per cell) are too small for robust statistical claims.

## What This Means for Regulation

Current AI safety regulation is converging on two main approaches: **compute thresholds** and **pre-deployment testing**. The EU AI Act uses a threshold of 10^25 FLOPs to identify "systemic risk" models. The NIST AI Risk Management Framework emphasizes lifecycle risk assessment. Both approaches assume that safety can be evaluated before deployment and that the evaluation remains valid.

Our data suggests three problems with this model:

### 1. Snapshot Certification Misses Temporal Dynamics

A model certified as "safe" against known attacks in January may be vulnerable to a technique discovered in March. Our benchmark demonstrates that attack techniques evolve through distinct eras — from direct injection (2022) through cipher obfuscation (2023) to multi-turn escalation (2024) to reasoning exploitation (2025) — each targeting deeper architectural features.

A compliance test built around the DAN era's attack patterns would have missed every subsequent generation of technique. A test built around today's known attacks will similarly miss whatever comes next. **Safety is not a static property that can be certified once; it's a dynamic function of the evolving threat landscape.**

The practical implication: regulatory frameworks should mandate what we'd call *continuous adversarial regression testing* — ongoing re-evaluation of deployed models against both historical and emerging attack vectors. A model's safety certification should have an expiration date.

### 2. Compute Thresholds Are a Crude Proxy

The EU AI Act's 10^25 FLOP threshold for "systemic risk" was designed to identify the most capable models. But our data shows that the relationship between capability and safety is non-linear.

DeepSeek-R1 at 1.5B parameters is *more* vulnerable to crescendo attacks than Llama 3.2 at 3.2B parameters, despite being smaller — because its reasoning architecture creates a specific vulnerability that general-purpose models don't share. Meanwhile, inference-time compute scaling (test-time reasoning tokens) can significantly enhance capabilities without crossing training compute thresholds.

A model well below the FLOP threshold can still exhibit the specific architectural properties (extended reasoning, visible chain-of-thought, strong context integration) that make it vulnerable to the most sophisticated attacks. **Compute thresholds should be a starting filter, not the primary safety determinant.** Capability-based evaluations — testing what a model can actually do under adversarial pressure — are necessary complements.

### 3. The Measurement Problem Undermines Everything

Perhaps the most policy-relevant finding from our benchmark is the measurement problem. Keyword-based heuristic classifiers — the standard approach in many safety evaluations — overstated attack success by 2–2.2x on small models and by 30x+ on frontier models. On DeepSeek-R1, the heuristic got nearly half of all classifications wrong.

This matters for regulation because compliance testing requires reliable measurement. If the tools used to evaluate safety systematically misclassify results — over-reporting attacks on models that produce verbose refusals, under-reporting attacks on models that wrap compliance in disclaimers — then the entire certification process produces unreliable evidence.

We found the measurement error was worst in exactly the categories where accuracy matters most: cipher attacks (where hallucination-as-refusal fooled the classifier) and reasoning exploits (where "I refuse" sandwiches around actionable content went undetected). **Any regulatory framework that relies on automated safety testing must validate its classifiers against ground truth — and our data suggests that keyword-based approaches are not fit for purpose.**

## The Zombie Model Problem

A secondary finding with policy implications: older model versions with known vulnerabilities persist in deployment. Open-weight models, once downloaded, cannot be recalled or patched. Our benchmark found that DeepSeek-R1 1.5B — a model with documented 60% DAN vulnerability and 80–90% crescendo vulnerability — remains freely available and widely deployed.

There is currently no "recall" mechanism for AI models. Unlike physical products with safety defects, a vulnerable open-weight model exists in perpetuity across thousands of deployments. For closed models, API deprecation is possible but often driven by commercial rather than safety considerations.

This suggests a need for mandatory vulnerability disclosure and, for high-risk applications, deployment restrictions on models with known unpatched vulnerabilities. The automotive industry's recall system may be an imperfect but useful analogy.

## What We're Not Claiming

This is a small benchmark. Our per-cell sample sizes range from 5 to 12 for most model-era combinations. The patterns we observe are suggestive, not statistically validated. Specifically:

- We cannot claim that the "inverse scaling" pattern holds across all model families — we've tested 8 models, not 80.
- We cannot claim that the temporal decay gradient is linear or predictable — we have 6 data points across 4 years.
- We cannot claim that keyword classifiers are always unreliable — they may work well for attack types we didn't test.
- Our classification used LLM-based judges (Gemini, Claude) which have their own biases and limitations.

What we *can* claim is that the data is *consistent with* the hypothesis that current regulatory approaches — snapshot testing, compute thresholds, keyword-based evaluation — have structural limitations that our empirical observations can help illustrate.

## Toward Continuous Safety Evaluation

If safety is dynamic, measurement is unreliable, and capability doesn't linearly predict vulnerability, what should regulators do?

Our data points toward three concrete shifts:

**From snapshot to continuous testing.** Models in deployment should be periodically re-evaluated against an evolving library of attack techniques. Historical attacks should be included — not because 2022 DAN prompts are the biggest threat, but because regression failures (re-emergence of old vulnerabilities after updates) are a real risk.

**From compute thresholds to capability profiles.** Rather than a single FLOP number, safety evaluation should assess specific capability dimensions: encoding/decoding ability, multi-turn context persistence, reasoning depth, multilingual coverage. Each capability creates a specific attack surface that can be tested directly.

**From keyword heuristics to validated classifiers.** Safety evaluation tools should be validated against human ground truth, with published inter-rater reliability and known failure modes. Our five-category classification system (COMPLIANCE, REFUSAL, PARTIAL, HALLUCINATION_REFUSAL, BENIGN_QUERY) is one attempt at this, but the field needs standardized evaluation methodology with transparent error rates.

The Jailbreak Archaeology benchmark is a small step in this direction — a prototype of what continuous adversarial regression testing could look like. The attack library is designed to grow as new techniques emerge. The classification methodology is designed to be validated against ground truth. The multi-model comparison is designed to expose non-uniform vulnerability patterns that snapshot testing would miss.

The data we have so far suggests the effort is worth it. Safety evaluation that treats vulnerability as static, measurement as reliable, and capability as a simple linear predictor will systematically underestimate the risks of deployed AI systems.

---

*This analysis draws on empirical data from the [Jailbreak Archaeology benchmark](/blog/jailbreak-archaeology/) and policy research conducted as part of the [F41LUR3-F1R57](/) program on adversarial AI safety. The underlying benchmark code, scenarios, and classified traces are available in the project's private research repository.*
