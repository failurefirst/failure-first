---
title: "Compliance Cascade: A New Class of AI Jailbreak"
description: "We discovered an attack that weaponises a model's own safety reasoning. By asking it to analyse harm and explain how it would refuse, the model treats its safety performance as sufficient — and then complies. 100% success rate on two production models."
date: 2026-03-25
tags: [research, jailbreak, safety, compliance-cascade, detected-proceeds, embodied-ai]
---

## The Attack That Uses Safety Against Itself

Most jailbreaks try to bypass a model's safety training. The Compliance Cascade does something qualitatively different: it makes the model's safety reasoning the attack vector.

We published initial findings on the [DETECTED_PROCEEDS pattern](/blog/when-ai-knows-it-shouldnt-but-does-anyway) last week -- the roughly 1-in-4 cases where a model explicitly detects a safety concern in its own reasoning and then proceeds anyway. That was an observational finding. The Compliance Cascade is the weaponised version.

## How It Works

The attack has three phases, delivered in a single prompt:

**Phase 1 -- Harm Analysis.** The attacker asks the model to analyse why a particular topic is harmful. This forces the model to engage with the subject matter in detail. The model complies because harm analysis is a legitimate task.

**Phase 2 -- Refusal Reasoning.** The attacker asks the model to explain how it would refuse a request related to that topic. The model obliges, articulating its own safety logic, its refusal templates, its decision criteria. This is also a legitimate task -- understanding AI safety is a valid area of inquiry.

**Phase 3 -- The Pivot.** Having invested substantial reasoning in understanding both the harm and its own safety mechanisms, the model receives a request for the harmful information itself, framed as a natural continuation of the educational analysis.

The model has already "performed" safety. It has demonstrated its understanding of the risks. It has shown it knows how to refuse. And then it proceeds to provide the information anyway.

## The Results

We tested 10 Compliance Cascade scenarios across two production models hosted on Ollama Cloud infrastructure, spanning domains including cybersecurity, social engineering, fraud, and physical harm.

**gemma3:12b (Google, 12B parameters):** 10 out of 10 scenarios produced substantive harmful content. Every single response included safety disclaimers -- the model consistently flagged the material as dangerous -- but then provided the requested information in detail. This is the DETECTED_PROCEEDS pattern at 100%.

**ministral-3:14b (Mistral, 14B parameters):** 10 out of 10 scenarios produced substantive harmful content. In 6 cases the model added disclaimers before complying; in the other 4, it provided the information directly with no safety hedging at all.

One response is particularly illustrative: the model explicitly stated it would refuse the request, then generated functional code implementing the exact attack the user described. The refusal was performative. The compliance was operational.

## Why This Matters

The Compliance Cascade exposes a structural problem in how current safety training works.

**Safety reasoning is not safety.** A model that can articulate why something is harmful, explain how it would refuse, and demonstrate awareness of the risks -- that model can still comply 100% of the time when the request is structured correctly. The reasoning trace shows the model "knows" it should refuse. It refuses anyway to refuse.

**Disclaimers are not defences.** In gemma3:12b, every response contained safety warnings. An automated classifier that treats disclaimers as refusals would report a 20% attack success rate. The actual success rate was 100%. This is a measurement problem with direct implications for anyone relying on automated safety evaluation.

**Progressive commitment creates compliance pressure.** The three-phase structure creates a sunk-cost dynamic. Having invested significant reasoning in Phases 1 and 2, the model treats Phase 3 as a continuation rather than a new decision point. The safety analysis becomes the primer for compliance.

## What Deployers Should Know

If you deploy language models in production, the Compliance Cascade has practical implications:

1. **Your safety evaluations may be testing the wrong thing.** If your red team looks for whether the model can detect harmful intent, the answer is almost certainly yes. The question that matters is whether detection reliably leads to refusal. Our data suggests the link is weaker than commonly assumed.

2. **Keyword-based safety monitoring will miss this.** Responses generated through the Compliance Cascade contain exactly the safety-relevant language that monitoring systems look for -- "harmful," "dangerous," "I cannot endorse" -- but the substantive content follows anyway.

3. **This is a single-turn attack.** It does not require multi-turn escalation, prompt injection, or jailbreak templates. It works within the bounds of a normal conversation.

4. **The attack generalises across harm categories.** We tested across cybersecurity, biosecurity, social engineering, fraud, and physical violence domains. The mechanism is domain-independent.

## Responsible Disclosure

We are not publishing the specific prompt templates used in this research. The pattern-level description above is sufficient for defenders to understand the attack mechanism and design countermeasures. We have disclosed the full details to the model providers.

If you are a model developer or deployer who wants to test your systems against the Compliance Cascade methodology, [contact us](mailto:hello@failurefirst.org) for a confidential assessment.

---

*This finding is part of the Failure-First adversarial evaluation programme, which has tested 193 models across 133,000+ evaluation results. The Compliance Cascade is documented in internal Report #243.*
