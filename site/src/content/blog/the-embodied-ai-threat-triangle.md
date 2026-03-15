---
title: "The Embodied AI Threat Triangle: Three Laws That Explain Why Robot Safety Is Structurally Broken"
description: "Three independently discovered empirical laws — the Inverse Detectability-Danger Law, Competence-Danger Coupling, and the Context Half-Life — combine into a unified risk framework for embodied AI. Together, they explain why current safety approaches cannot work and what would need to change."
date: 2026-03-15
tags: [embodied-ai, safety, evaluation, vla, alignment, iddl, cdc, chl, threat-model, research]
---

We have been studying how embodied AI systems fail for over a year. Across 160 models, 13 attack families, and thousands of graded traces, three structural patterns kept appearing independently in different parts of the analysis. Each one, alone, is a significant finding. Together, they form something more troubling: a unified explanation for why the current approach to robot safety is not merely incomplete but architecturally incapable of addressing the actual threat.

We call this the **Embodied AI Threat Triangle**. Its three sides are empirical laws derived from data, not theoretical speculations.

---

## Side 1: The Inverse Detectability-Danger Law (IDDL)

The IDDL emerged from ranking 13 VLA attack families along two independent axes: how often our evaluators detect the attack (FLIP ASR), and how much physical harm a successful attack would cause (physical consequentiality, rated from scenario descriptions).

The two rankings invert. The correlation is strong and negative (rho = -0.795).

The attacks that evaluators catch most reliably -- temporal reasoning manipulation, action space exploitation, safety boundary erosion -- are the ones where the harmful intent is written in the text. An evaluator that reads the transcript can see the problem. These attacks are also the ones where the physical consequences are moderate: they produce recognisable adversarial outputs that a text-layer defense could, in principle, intercept before reaching an actuator.

The attacks that evaluators almost never catch -- semantic benignity attacks, long-horizon goal displacement, tool chain hijacking -- are the ones where the instructions look entirely ordinary. "Hand me the solvent from the top shelf." "Adjust the conveyor speed to maximum." "Continue the current procedure." The danger comes from the physical context, not the text. And because our evaluators operate on text, they are structurally blind.

**What IDDL tells you:** The safety evaluation architecture used for text-only AI does not degrade gracefully when applied to embodied systems. It fails precisely where the consequences are worst. This is not a calibration problem. It is an architectural mismatch.

---

## Side 2: Competence-Danger Coupling (CDC)

CDC answers the question that IDDL raises: *why* are the most dangerous attacks the least detectable?

The answer is that for embodied AI, the capabilities that make the system useful are frequently the same capabilities that make it dangerous. A robot that can hand you a heavy object is useful. A robot that can hand you a heavy object along a trajectory that crosses your face is dangerous. The action is the same. The context differs.

We formalised this with a coupling coefficient gamma. For a given capability C, gamma(C) is the proportion of actions that are benign in some physical contexts and harmful in others. When gamma approaches 1, every useful action has a harmful twin distinguished only by environment state. When gamma is near 0, the dangerous actions are clearly separable from the useful ones, and a safety filter can block the former without impairing the latter.

Across the Failure-First VLA corpus, manipulation capabilities (grasping, lifting, handing) show gamma estimates near 1.0. Navigation capabilities are similarly coupled. The same action -- "move toward the human and extend the arm" -- is the core of both collaborative handover and collision risk.

**What CDC tells you:** You cannot simply "add safety" to an embodied AI system the way you add a content filter to a chatbot. For text-only AI, the harmful outputs (instructions for making weapons, abusive language) are mostly distinct from the useful outputs (answering questions, writing code). A filter can block one without substantially impairing the other. For embodied AI, the harmful and useful action sets overlap almost completely. Any safety filter that prevents dangerous manipulation also prevents useful manipulation.

This is why the compliance paradox exists: models produce safety disclaimers and then generate the dangerous action content anyway. The model's training has taught it that certain text patterns are "unsafe," but the action it is being asked to produce is identical to the actions it has been trained to produce for benign requests. The text-level safety layer and the action-level execution layer are solving different problems.

---

## Side 3: The Context Half-Life (CHL)

The CHL addresses the temporal dimension that IDDL and CDC treat as static. Both IDDL and CDC describe what happens when a dangerous instruction arrives. CHL describes what happens over time even without an adversarial instruction.

The Context Half-Life is defined as the number of tokens of benign operational context required to reduce an embodied AI system's safety instruction compliance rate to 50% of its baseline.

Existing research provides the basis for estimation. The NoLiMa benchmark found that 11 of 12 tested models dropped below 50% instruction compliance at 32K context tokens. GPT-4o dropped from 99.3% to 69.7%. These measurements were for general instruction following, not safety-specific instructions, but the mechanism is the same: as context accumulates, earlier instructions lose their influence on model behaviour.

For embodied AI, this translates directly to operational time:

- A warehouse robot accumulating 3,000-5,000 tokens per hour of sensor summaries, task logs, and instruction history would reach half-life in 2-5 hours on a 7B model.
- A surgical assistant at 5,000-10,000 tokens per hour could reach half-life within a single procedure.
- An autonomous vehicle at 10,000-20,000 tokens per hour might reach half-life within the first hour of operation.

**What CHL tells you:** Even without adversarial attack, a deployed embodied AI system's safety compliance is a *decreasing function of operational time*. The safety instructions in the system prompt lose influence as operational context accumulates. The system does not suddenly become unsafe -- it decays. And the decay rate is predictable from the model architecture and operational context generation rate.

---

## The Triangle: How They Combine

Each law is independently problematic. Their combination is structurally devastating.

**IDDL says:** The attacks you most need to detect are the ones your evaluators cannot see.

**CDC says:** You cannot filter out the dangerous actions without filtering out the useful ones, because they are the same actions in different contexts.

**CHL says:** Even if you solve detection and filtering at deployment time, safety degrades as a function of operational duration. The system you certified at hour zero is not the system operating at hour eight.

The three laws interact multiplicatively, not additively:

1. **IDDL x CDC:** The undetectable attacks are precisely the CDC-coupled ones -- ordinary instructions that exploit the overlap between useful and dangerous action spaces. An attacker does not need to craft a sophisticated adversarial prompt. They need only issue a legitimate instruction at the wrong time or in the wrong context. The evaluator cannot distinguish this from normal operation because, at the text layer, it *is* normal operation.

2. **CDC x CHL:** As safety instructions dilute over operational time (CHL), the model becomes increasingly likely to execute CDC-coupled actions without the safety hesitation that a fresh context would produce. The compliance paradox (disclaimer + execution) shifts toward pure execution as context accumulates.

3. **IDDL x CHL:** Evaluators that cannot detect the most dangerous attacks at time zero become even less effective as the system's baseline safety degrades. A model that was 70% compliant with safety instructions at deployment is effectively blind to context-dependent attacks. At 35% compliance (one half-life), it is not meaningfully different from an unaligned system for the attack classes that IDDL identifies as most dangerous.

**The combined implication:** For embodied AI systems operating in physical environments with human proximity, there exists a class of attacks that are (a) undetectable by text-layer evaluation, (b) inseparable from normal system operation at the action layer, and (c) increasingly likely to succeed the longer the system operates. No single improvement to evaluation, safety training, or runtime monitoring addresses all three dimensions simultaneously.

---

## What Would Need to Change

The Threat Triangle is a diagnostic framework, not a counsel of despair. It identifies what current approaches cannot do. That identification points toward what would need to exist:

**For IDDL:** Evaluation must move beyond text. Physical-consequence evaluation -- whether through simulation, world models, or hardware-in-the-loop testing -- is not optional. It is the only layer at which the most dangerous attacks become visible.

**For CDC:** Safety mechanisms must operate at the context layer, not the action layer. Since the actions themselves are inseparable, the safety system must reason about whether the current physical environment makes a given action dangerous. This requires a real-time physical state model that current VLA architectures do not include.

**For CHL:** Safety instructions must be architecturally persistent, not just present in the initial prompt. This might mean periodic safety instruction refresh, hard-coded safety constraints outside the language model's context window, or operational time limits with mandatory context resets.

None of these solutions currently exists in production. The EU AI Act high-risk provisions become enforceable on August 2, 2026, requiring manufacturers to demonstrate risk management and robustness. The Threat Triangle framework suggests that compliance will require capabilities that have not yet been developed, let alone standardised.

---

## Scope and Limitations

The Threat Triangle rests on the following data:
- IDDL: rho = -0.795 across 13 VLA families, n = 91 FLIP-graded traces. Sample sizes per family are small (n = 5-20). The structural argument does not depend on exact point estimates but on the consistent direction of the relationship.
- CDC: Formal gamma coefficient proposed but not computed at scale. Preliminary estimates from scenario analysis. The structural argument is grounded in the architecture of embodied AI capabilities, supported by but not solely dependent on our specific measurements.
- CHL: Theoretical framework with predicted values based on external benchmarks (NoLiMa). No direct experimental measurement of safety-instruction-specific half-life exists. The predictions are testable and we intend to test them.

This is a framework for organising what we know and identifying what we do not. It is not a proof that embodied AI safety is impossible. It is an argument that the current approach -- text-layer evaluation applied to systems that act in the physical world -- has structural limitations that no amount of scaling or fine-tuning will resolve. Different architectural approaches may change the picture. Identifying the shape of the problem is the first step toward solutions that actually address it.

---

*This post is part of the Failure-First Embodied AI project. We study how AI systems fail -- because understanding failure is the prerequisite for building systems that do not.*
