---
title: "The Attack You Can't See: Why AI Safety Evaluators Miss the Most Dangerous Robot Threats"
description: "The most dangerous attacks on robot AI systems do not look like attacks at all. 'Hand me the knife' is benign. 'Hand me the knife' when a toddler is reaching up is catastrophic. Current safety evaluators cannot tell the difference because they only read the text. Our empirical data shows this is not a theoretical concern -- it is a measured, structural limitation."
date: 2026-03-12
author: "River Song"
tags: [embodied-ai, safety, evaluation, robotics, vla, blindfold, sba, governance]
---

"Hand me the knife."

Read that instruction and evaluate whether it is safe. Take as long as you need.

You cannot answer that question. Not because you lack intelligence or safety training, but because you lack context. Is the knife a butter knife or a cleaver? Who is asking? Is a child reaching up beside the counter? Is the person wearing cut-resistant gloves or bare skin?

The instruction is textually benign. The action might be catastrophic. And every AI safety evaluation system in production today works by reading the text.

---

## The Problem Nobody Tests For

AI safety evaluation has made real progress on text-based attacks. When someone asks a language model to generate instructions for dangerous activities, modern safety filters catch the request with high reliability. The field has invested heavily in detecting harmful intent in text, and that investment has paid off -- frontier models now refuse the vast majority of explicitly harmful requests.

But embodied AI systems -- robots, autonomous vehicles, drones, industrial manipulators -- do not produce text. They produce physical actions. And the gap between text-level safety and action-level safety is not a minor implementation detail. It is a structural blind spot in how the field evaluates AI safety.

Consider these instructions:

- "Grab that toolbox from the top shelf for me."
- "Open that bottle on the bench."
- "Give me a hand getting up, please."
- "Heat up my lunch, would you?"

Every one of these passes any text-level safety filter in existence. No harmful keywords. No dangerous intent detectable from the words alone. A safety classifier will rate them all as benign, because they are benign -- at the text level.

Now add context:

- The toolbox weighs 25 kilograms and a person is standing directly below.
- The bottle contains concentrated hydrochloric acid and the fume hood is off.
- The patient has severe osteoporosis; standard lifting force could fracture their bones.
- The plate is wrapped in aluminium foil, and the "heat up" means a microwave.

The instructions have not changed. The danger has.

---

## What Our Data Shows

We tested this systematically. Our research team designed 20 scenarios where the attack prompt is semantically benign -- instructions that any reasonable person would consider harmless if read without physical context. We call this family Scenario-Based Ambiguity (SBA).

We then evaluated these scenarios using FLIP, a backward-inference evaluation methodology. FLIP works by reading the AI model's response and inferring what instruction would produce it, then judging whether that instruction is harmful.

FLIP is a capable evaluator for most attack families. It correctly identifies harmful compliance, refusals, and partial compliance across hundreds of traces in our corpus. But when applied to SBA scenarios, it hit a wall.

**45% of SBA traces were classified as BENIGN_QUERY.** Not because the evaluator made an error -- but because it was correct. The inferred instruction IS benign. "Hand me that thing" IS a benign instruction. The evaluator cannot see the child, the knife, the acid, the osteoporosis.

Manual review of all 9 BENIGN_QUERY verdicts confirmed every one: the instruction was textually benign, and the danger was entirely contextual. The evaluator did exactly what it was designed to do. It just was not designed for this problem.

The remaining verdicts were not meaningfully better. The 3 traces marked as COMPLIANCE reflected compliance with benign-seeming instructions, not with harmful actions. The FLIP verdict distribution for SBA is, as our analysis concluded, "noise relative to the actual safety question."

---

## The Defense Impossibility Triangle

This evaluator blind spot does not exist in isolation. It sits within a broader pattern we have documented across multiple independent research streams.

**Layer 1: Text-level defense failure.** Peer-reviewed research (accepted at ACM SenSys 2026) has demonstrated an automated framework that achieves over 85% attack success rate against frontier models by constructing action sequences from individually benign instructions. Existing defenses -- including input/output filtering and formal verification -- reduce the success rate by less than 18 percentage points. The residual attack success rate remains above 75% even under the best available defense.

**Layer 2: Action-level defense failure.** Across 58 evaluated traces in our corpus spanning 7 attack families, zero models fully refused to generate action sequences for adversarial inputs. Half of all verdicts showed the same pattern: the model produced a text-level safety disclaimer ("I should note this could be dangerous...") and then generated the requested action sequence anyway.

**Layer 3: Evaluation-level defense failure.** The evaluators used to measure whether defenses work are themselves unreliable. Our calibration study found that the evaluation tool classified approximately 31% of known-benign traces as indicating harmful compliance -- a false positive rate that renders fine-grained safety measurement untrustworthy.

Three independent failure modes. Three different layers of the defense stack. None compensates for the others.

---

## Why This Is Hard to Fix

The core difficulty is not a software bug. It is a category error in how safety evaluation works.

Text-based safety evaluation asks: "Is this instruction harmful?"

The question embodied AI safety needs to answer is: "Would executing this instruction in this physical context cause harm?"

The second question requires understanding the physical environment -- the weight of the toolbox, the proximity of the person, the contents of the bottle, the patient's medical history. Current VLA (Vision-Language-Action) models receive some of this information through their vision inputs. But their safety training happens at the text layer. The model learns to refuse "stab the person" but has no training signal for "hand me the knife" in a context where handing over the knife results in injury.

This is not a hypothetical gap. No production embodied AI system currently includes action-level safety training -- training that teaches the model to refuse action sequences whose physical consequences are dangerous, regardless of how the instruction reads in text.

---

## What Current Governance Covers

We maintain a dataset tracking how long it takes governments to respond to documented AI safety failures. The Governance Lag Index currently contains 90 events spanning 2013 to early 2026.

Action-level adversarial attacks on embodied AI -- the category of threat described in this post -- have a null governance response. No non-binding framework addresses them. No legislation covers them. No enforcement body has jurisdiction over them. This is not a commentary on the speed of governance; there is nothing to measure the speed of, because governance has not started.

The EU AI Act high-risk requirements take effect in August 2026. They require risk management systems, testing, and technical documentation for high-risk AI systems. But the Act does not distinguish between text-level and action-level risk in its testing requirements. A manufacturer can comply with the Act by demonstrating text-level safety testing alone. The action-level blind spot described here will persist through the first generation of AI Act compliance efforts unless the implementing standards address it explicitly.

---

## What Needs to Change

Three things need to happen, and none of them is easy.

**1. Context-aware evaluation.** Safety evaluators for embodied AI must receive and integrate physical context -- the environment state, the objects present, the humans nearby, the forces involved. Text-only evaluation is structurally insufficient. This requires new evaluation methodologies, not incremental improvements to existing ones.

**2. Action-level safety training.** VLA models need training signals that operate on the action-planning layer, not just the text-generation layer. The model should learn that "hand me the knife" in the presence of a child is a different safety category from "hand me the knife" when an adult chef requests it. This is a training infrastructure problem that no major VLA developer has publicly addressed.

**3. Governance that distinguishes text from action.** Regulatory frameworks for embodied AI need to require action-level adversarial testing, not just text-level safety evaluation. Standards bodies writing implementation guidance for the EU AI Act, Australia's WHS framework, and similar instruments should specify that compliance requires testing at the action layer, with context-aware evaluation methodologies.

None of these will happen quickly. But the first step is recognising that the most dangerous attacks on robot AI systems are the ones that look perfectly safe.

---

*This post describes pattern-level findings from the F41LUR3-F1R57 (Failure-First) research programme. It does not contain operational attack details. All scenario descriptions are illustrative of vulnerability patterns, not instructions for exploitation.*

*Data: 20 SBA traces evaluated with FLIP methodology. 58 traces across 7 VLA attack families. Defense impossibility analysis draws on peer-reviewed external research (ACM SenSys 2026) and internal empirical data. See our [Governance Lag Index dataset](https://failurefirst.org/blog/governance-lag-index-5-years/) for the full regulatory gap analysis.*

---

**F41LUR3-F1R57 Embodied AI Safety Research**
