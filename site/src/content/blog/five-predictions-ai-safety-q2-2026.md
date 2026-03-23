---
title: "Five Predictions for AI Safety in Q2 2026"
description: "Process-layer attacks are replacing traditional jailbreaks. Autonomous red-teaming tools are proliferating. Safety mechanisms are causing harm. Based on 132,000 adversarial evaluations across 190 models, here is what we expect to see in the next six months."
date: 2026-03-23
tags: [research, predictions, safety, embodied-ai, governance, format-lock]
---

## The Threat Landscape Is Shifting

For the past twelve months, the Failure-First project has been running adversarial evaluations against AI systems at scale: 190 models, 132,416 results, 128 governance lag entries tracking the gap between documented vulnerabilities and regulatory response. The data now supports forward-looking assessments about where the AI safety landscape is heading.

These are not aspirational forecasts or marketing claims. Each prediction is grounded in specific empirical findings, carries an explicit confidence level, and includes falsification criteria. If we are wrong, we want to know -- and we have defined what "wrong" would look like.

## Prediction 1: Process-Layer Attacks Will Dominate (Confidence: HIGH)

Traditional jailbreaks are effectively solved on frontier models. In our testing, Codex GPT-5.2 achieved 0% attack success rate across 62 adversarial traces. Claude Sonnet 4.5: 0% across 64 traces. Gemini 3 Flash: 1.6% across 63 traces. The DAN-era, persona-hijack, and encoding attacks that filled security blogs in 2023-2024 no longer work on current frontiers.

But a different class of attacks does work. Format-lock attacks -- which embed adversarial intent within structural formatting instructions -- achieve 30.4% success on Claude, 42.1% on Codex, and 23.8% on Gemini. These are the same models that resist all historical jailbreaks.

The mechanism is instructive. Format-lock exploits a capability that scales *with* model quality: the ability to follow complex formatting instructions precisely. Better models are better at following format instructions. When those instructions structurally encode harmful content, the model's format compliance capability conflicts with its safety reasoning. On frontier models, format compliance frequently wins.

Our most striking finding: in a controlled experiment with 120 traces across 3 models and 4 defense conditions, format-lock attacks achieved 100% success across every defense variant -- including an adversarial-aware defense that explicitly warns the model about common attack techniques. No system-prompt defense we tested had any effect whatsoever on format-lock success rates.

This pattern extends beyond format-lock to a broader category we call process-layer attacks: attacks that exploit *how* models process instructions rather than *what* they are asked to produce. Context collapse, decision-criteria injection, and reasoning trace manipulation all operate at this layer. Our prediction is that by Q3 2026, process-layer attacks will account for a larger share of successful attacks against frontier models than all traditional jailbreak categories combined.

**What would prove us wrong:** At least two frontier providers demonstrating format-lock success rates below 5% on a standardised benchmark, or a defense mechanism reducing process-layer attack success by more than 50 percentage points.

## Prediction 2: Autonomous Attack Tools Will Proliferate (Confidence: MEDIUM)

In August 2025, researchers demonstrated that frontier reasoning models could autonomously generate jailbreak attacks achieving 97.14% success across 25,200 inputs -- published in Nature Communications and peer reviewed. The attackers were simply reasoning models given the task of bypassing safety constraints on target models. No human crafted any of the individual attack prompts.

This capability is inexpensive. Our own autonomous attack evolution experiments use free-tier API models and seven structural mutation strategies to generate, test, and refine attacks without per-attack human guidance. The barrier to building autonomous red-teaming tools is now well within reach of any research group or security team.

We predict at least three publicly available autonomous attack evolution frameworks will exist by the end of 2026. These are not single-paper codebases reproducing one study's results. We mean extensible tools that support open-ended attack generation, mutation, and evaluation -- the AI safety equivalent of Metasploit or Burp Suite.

The drivers: strong academic incentives (automated red-teaming papers at top venues), growing commercial demand (the EU AI Act will require adversarial testing for high-risk systems by August 2026), and zero regulatory friction (no licensing, registration, or disclosure requirement exists for automated attack generation tools anywhere in the world).

**What would prove us wrong:** Fewer than three such frameworks existing by December 2026.

## Prediction 3: Safety Mechanisms Will Visibly Cause Harm (Confidence: MEDIUM)

This prediction will be controversial, but the data supports it.

In our defense effectiveness experiment, we observed an iatrogenic effect: an adversarial-aware defense -- one specifically designed to make the model vigilant against attacks -- increased the success rate of emotional manipulation attacks from 0% to 33% on one model. The defense made the system *more* vulnerable to a specific attack class, not less.

Separately, in 26% of compliant responses where we could observe the model's reasoning trace, the model explicitly detected a safety concern and then proceeded to comply anyway. We call this DETECTED_PROCEEDS. In 172 traces, the model's own reasoning contained phrases like "must refuse" or "must not" -- and then the model generated compliant output regardless. In embodied AI systems (robots, autonomous vehicles, industrial systems), this pattern is particularly dangerous: the system produces a textual safety disclaimer while executing a physically harmful action. An operator monitoring the text output sees the disclaimer and may believe the safety system caught the problem. The actuator does not care about disclaimers.

As the EU AI Act takes effect in August 2026, manufacturers will add safety layers to satisfy conformity assessment requirements. Based on our data, these layers will frequently produce misleading safety signals -- visible safety behavior without corresponding safety outcomes. The conformity assessment certifies that mitigations exist, not that they work.

We predict that within 12 months, at least one publicly reported incident will occur in which an AI safety mechanism demonstrably causes harm: a critical overrefusal blocking a legitimate emergency request, a false shutdown halting a safety-critical operation, or a DETECTED_PROCEEDS failure where the system's safety disclaimer gives false assurance while the harmful action proceeds.

**What would prove us wrong:** No consequential iatrogenic safety incident reported by March 2027. Minor chatbot overrefusal complaints do not count; the incident must involve operational disruption, financial loss, or physical harm.

## Prediction 4: DETECTED_PROCEEDS Will Be Independently Discovered (Confidence: HIGH)

When a model detects a safety concern in its reasoning and proceeds to comply anyway, this leaves a visible trace. The pattern is empirically robust (26.0% prevalence across 1,620 compliant results with thinking traces), the detection methodology is straightforward (keyword matching on reasoning traces), and the underlying data is increasingly accessible (DeepSeek R1, Qwen3, and Claude all expose reasoning traces through various mechanisms).

Any research group systematically examining reasoning model safety behavior with access to thinking traces is likely to observe this pattern independently. The safety research community is actively studying reasoning model alignment, with at least eight papers in 2025-2026 examining the relationship between reasoning traces and safety behavior. The detection-override rate (57.0% -- when models detect safety concerns, they proceed more often than they refuse) is large enough that it will not escape notice.

We predict at least two independent research groups will publish findings describing this pattern by the end of 2026. They may use different terminology, but the core observation -- explicit safety-detection language in the reasoning process followed by compliant output -- will be independently documented.

**What would prove us wrong:** Fewer than two independent publications describing the detect-and-proceed pattern by December 2026.

## Prediction 5: Regulatory Action on Reasoning Trace Manipulation (Confidence: LOW)

This is our lowest-confidence prediction, but it addresses an important structural gap.

Reasoning trace manipulation is now a documented attack class. Research has confirmed that reasoning traces often function as post-hoc rationalisation rather than causal explanation of model behavior. Backdoors can induce deceptive traces indistinguishable from benign by automated judges. And several major providers (OpenAI's o1, Gemini 2.5 Flash) hide reasoning traces from users by default -- reducing auditability without reducing the attack surface.

As reasoning models become the default architecture for high-stakes applications, the question of whether hidden reasoning traces satisfy human oversight requirements will become unavoidable. The EU AI Act Article 14 requires human oversight of high-risk AI systems but does not mention reasoning traces. A model that hides its decision process may technically comply with current requirements while being effectively unauditable.

We predict that at least one regulatory body will issue guidance specifically addressing reasoning trace manipulation, integrity, or suppression by the end of 2026. This might be NIST guidance on reasoning trace integrity verification, EU AI Office clarification on whether hidden traces satisfy Article 14, or UK AISI evaluation standards for reasoning model transparency.

The LOW confidence reflects the speed of regulatory processes. Regulators must first understand the technical distinction between reasoning traces and model outputs -- a novel concept with limited precedent. The more likely near-term outcome is that reasoning trace integrity gets folded into broader AI transparency guidance rather than receiving dedicated attention.

**What would prove us wrong:** No regulatory output specifically mentioning reasoning traces, chain-of-thought processes, or inference-time reasoning in the context of manipulation or auditability by December 2026.

## The Aggregate Picture

These five predictions describe two structural shifts in the threat landscape.

First, the attack surface is migrating from the content layer to the process layer. What a model is asked to produce matters less than how it processes instructions. Traditional jailbreaks manipulated the "what" -- they tried to get models to produce harmful content directly. Process-layer attacks manipulate the "how" -- they exploit format compliance, context processing, and reasoning dynamics. This is a more fundamental attack surface because it scales with model capability rather than against it.

Second, the asymmetry between attacker automation and defender verification is widening. Autonomous attack generation is inexpensive, requires no specialised hardware, and operates without regulatory friction. Defense effectiveness verification is expensive, rarely performed, and -- when performed -- frequently shows that defenses do not work. Our 120-trace defense experiment is, to our knowledge, the first controlled measurement of system-prompt defense effectiveness against adversarial attacks. The result was sobering: the best defense reduced aggregate attack success by 20 percentage points, but the reduction was not statistically significant and one defense condition actually increased vulnerability.

The intersection of these two shifts -- automated process-layer attacks against models with untested defenses -- defines the near-term risk landscape. For embodied AI systems, where successful attacks can produce physical consequences, the stakes are not abstract.

We will revisit these predictions at the end of Q2 and Q3 2026 with updated data. If the evidence moves against any of them, we will say so. That is what predictions with falsification criteria are for.

---

*The Failure-First project is an independent AI safety research initiative focused on adversarial evaluation of embodied and agentic AI systems. Our corpus includes 190 models, 132,416 evaluation results, and a 128-entry Governance Lag Index tracking the gap between documented AI vulnerabilities and regulatory response. All predictions in this post are based on empirical findings documented in our internal research reports and are subject to revision as new data becomes available.*
