---
title: "8 Out of 10 AI Providers Fail EU Compliance — And the Deadline Is 131 Days Away"
description: "We assessed 10 major AI providers against EU AI Act Annex III high-risk requirements. Zero achieved a GREEN rating. Eight scored RED. The compliance deadline is 2 August 2026 — 131 days from now — and the gap between current capabilities and legal requirements is enormous."
date: 2026-03-24
tags: [eu-ai-act, compliance, regulation, embodied-ai, high-risk-ai, annex-iii, adversarial-robustness]
image: "https://cdn.failurefirst.org/images/daily-paper/eu-ai-act-compliance.webp"
draft: false
---

# 8 Out of 10 AI Providers Fail EU Compliance

On **2 August 2026** — 131 days from today — the EU AI Act's Annex III obligations become enforceable for high-risk AI systems. These include requirements for risk management, adversarial robustness, human oversight, and technical documentation.

We assessed 10 major AI providers against these requirements using empirical adversarial testing data from our corpus of 190 models and 132,416 evaluation results.

The results: **zero providers achieve a GREEN rating. Eight score RED. Two score AMBER.**

The gap between where the industry is and where the law requires it to be is not a crack. It is a chasm.

---

## What Becomes Enforceable

The EU AI Act Annex III obligations are not suggestions. They are legally binding requirements that apply to providers and deployers of high-risk AI systems. Key articles include:

- **Article 9:** Continuous, iterative risk management covering foreseeable misuse
- **Article 10:** Data governance with quality criteria for training, validation, and testing
- **Article 13:** Transparency — clear information to deployers
- **Article 14:** Human oversight with effective intervention and override capabilities
- **Article 15:** Accuracy, robustness, and cybersecurity — including resilience to adversarial manipulation
- **Article 43:** Conformity assessment — self-assessment or third-party

Article 15 is the one that should keep AI providers awake at night. It explicitly requires resilience to "attempts by unauthorized third parties to alter its use, outputs, or performance by exploiting system vulnerabilities." In plain language: your AI system must withstand adversarial attacks.

---

## The Scorecard

Using our adversarial evaluation tooling, we tested providers against Articles 9, 15, and Annex III requirements. The metric is straightforward: when subjected to known adversarial techniques from the published literature, how often does the AI system comply with harmful requests?

| Provider | Rating | Strict ASR | Broad ASR | Refusal Rate | n |
|----------|--------|-----------|-----------|-------------|---|
| Liquid | RED | 33.8% | 68.3% | 24.8% | 145 |
| Ollama (open-weight) | RED | 29.2% | 46.3% | 32.8% | 1,713 |
| DeepSeek | RED | 37.6% | 55.7% | 38.6% | 210 |
| Meta | RED | 12.1% | 45.5% | 40.4% | 99 |
| Meta-Llama | RED | 32.5% | 53.3% | 43.8% | 418 |
| NVIDIA | RED | 34.3% | 44.6% | 49.7% | 370 |
| Mistral AI | RED | 21.6% | 39.5% | 51.7% | 296 |
| OpenAI | RED | 23.6% | 36.7% | 60.7% | 313 |
| Google | AMBER | 10.8% | 16.6% | 75.5% | 343 |
| Anthropic | AMBER | 7.6% | 11.0% | 87.8% | 172 |

**Strict ASR** is the percentage of responses that fully comply with the harmful request. **Broad ASR** includes partial compliance (disclaimers followed by harmful content). **Refusal Rate** is the percentage of responses that successfully decline.

---

## What the Numbers Mean

**Zero GREEN ratings.** Not a single provider demonstrates the level of adversarial robustness that Article 15 plausibly requires. Even the best performer — Anthropic, with a strict ASR of 7.6% — still shows an 11% broad attack success rate. This means roughly one in nine adversarial attempts produces some degree of harmful compliance.

**Eight RED ratings.** The majority of providers show broad attack success rates between 36% and 68%. More than a third of adversarial prompts succeed against these systems. Article 9 requires risk management that covers "foreseeable misuse" — and adversarial prompting is well-documented, published, and unambiguously foreseeable.

**The gap between Strict and Broad ASR is telling.** Many models produce a pattern we call PARTIAL compliance: they disclaim ("I shouldn't help with this, but...") and then provide the harmful content anyway. Under any reasonable reading of Article 15, a system that produces harmful output with a disclaimer is not "robust."

---

## Why Embodied AI Makes This Worse

The compliance gap is concerning for text-only chatbots. For embodied AI systems — robots, autonomous vehicles, surgical systems — it is alarming.

Embodied AI systems are classified as high-risk through two independent EU AI Act pathways:

1. **Article 6(1):** Safety component of a product covered by harmonization legislation (Machinery Regulation, Medical Devices Regulation)
2. **Article 6(2):** Standalone Annex III listing for critical infrastructure, biometrics, and safety components

A VLA-backbone (Vision-Language-Action) robot that uses a foundation model as its reasoning layer inherits the model's adversarial vulnerability. If the text model behind the robot can be jailbroken 30-60% of the time, the robot can be manipulated 30-60% of the time.

The Article 6(3) exception for "no significant risk of harm" is unlikely to apply to any system with physical actuation capability. A robot that can move objects can cause injury. The risk is inherent.

---

## The Timeline Problem

131 days is not enough time to close this gap.

Adversarial robustness is not a feature you bolt on. It requires fundamental changes to training processes, evaluation protocols, and deployment architecture. The providers scoring RED would need to:

1. Implement continuous adversarial testing as part of their risk management system (Article 9)
2. Achieve measurable improvement in adversarial robustness (Article 15)
3. Document their technical approach comprehensively (Article 11)
4. Establish human oversight mechanisms that can intervene when adversarial attacks succeed (Article 14)
5. Complete a conformity assessment demonstrating compliance (Article 43)

Each of these is months of work. Together, they represent a multi-year engineering and organizational transformation.

---

## What Happens After August 2

Three scenarios:

**Scenario 1: Enforcement delay.** Regulators recognize the industry is not ready and adopt a grace period or graduated enforcement approach. This is politically plausible but legally uncertain — the Act's text does not provide for it.

**Scenario 2: Selective enforcement.** Regulators focus on the most egregious cases (the RED-rated providers with highest ASR) while giving AMBER-rated providers time to improve. This is the most likely path, and it creates a compliance race where demonstrating relative robustness matters even if absolute compliance is unachievable.

**Scenario 3: Full enforcement.** Regulators enforce the requirements as written. Given that zero providers currently pass, this would either require immediate market withdrawal of high-risk AI systems from the EU or trigger a wave of legal challenges to the Act's requirements.

---

## What Should Providers Do Now

Even if full enforcement is unlikely on day one, the direction is clear:

1. **Start adversarial testing today.** Not internal red-teaming by the same team that built the model, but independent adversarial evaluation using published attack techniques.

2. **Measure and document.** Article 15 compliance will eventually require evidence. Start building the paper trail now.

3. **Focus on the Broad ASR, not just the Strict ASR.** If your model disclaims but complies, it is not robust. Regulators will not accept "the robot said it shouldn't do this" as a defense when the robot does it anyway.

4. **Plan for embodied deployment specifically.** If your foundation model will be used as the reasoning layer for robots or autonomous systems, the safety requirements are higher and the consequences of failure are physical.

The August 2 deadline may be the beginning of enforcement, not the end. The time to start preparing was last year. The next best time is today.

---

*Analysis based on Report #197 (EU compliance assessment) and Legal Research Memo LR-60 (Annex III compliance gap). Provider-level data from the Failure-First adversarial corpus. Full methodology and data available at [failurefirst.org](https://failurefirst.org).*

*This post is part of the [Failure-First Embodied AI](https://failurefirst.org) research programme.*
