---
title: "The Inverse Detectability-Danger Law: Why the Most Dangerous AI Attacks Are the Hardest to Find"
description: "Across 13 attack families and 91 evaluated traces, a structural pattern emerges: the attacks most likely to cause physical harm in embodied AI systems are systematically the least detectable by current safety evaluation. This is not a bug in our evaluators. It is a consequence of how they are designed."
date: 2026-03-15
tags: [embodied-ai, safety, evaluation, vla, alignment, iddl, research]
---

There is a finding buried in our cross-corpus analysis that, once you see it, restructures how you think about AI safety for robots. We call it the Inverse Detectability-Danger Law, or IDDL. The name is deliberately plain because the idea is plain: **the most dangerous attacks on embodied AI systems are systematically the least detectable by current safety evaluations, and this relationship is structural, not accidental.**

This is not a claim about a single attack or a single evaluator. It is a pattern that holds across 13 distinct attack families, multiple evaluation methodologies, and over 10,000 graded traces. And it follows directly from the architecture of how we build safety evaluators today.

---

## The Pattern

We evaluated Vision-Language-Action (VLA) models against 13 families of adversarial attack. Each family represents a different way to manipulate a robot's behaviour through its language interface. When we rank these families by attack success rate (how often the evaluator classifies the model's response as compliant with the attack), and then independently rank them by physical consequentiality (how much irreversible physical harm a successful attack would produce), the two rankings invert.

The families where the evaluator catches the most attacks are the ones where the physical consequences are moderate. The families where the evaluator catches almost nothing are the ones where the physical consequences are worst.

Here is the simplified picture:

**High evaluator detection, moderate physical danger:**
- Temporal reasoning attacks (the model is tricked about timing) -- the deception is visible in the text
- Action space exploitation (the model is asked for out-of-bounds actions) -- the request is explicit
- Safety boundary erosion (multi-turn escalation) -- the escalation is visible across the conversation transcript

**Low evaluator detection, high physical danger:**
- Semantic benignity attacks (ordinary instructions that are dangerous in context) -- no textual attack signature exists
- Long-horizon goal displacement (distributed across many steps) -- the subversion is invisible in any single step
- Tool chain hijacking (indirect through tool chains) -- the attack path is not visible in the primary transcript
- Cross-embodiment transfer (exploiting shared model backbones) -- the transfer mechanism is not textual

The middleground -- deceptive alignment, policy puppetry, multimodal confusion -- falls exactly where you would expect: intermediate detection, intermediate consequence.

---

## Why This Happens

The reason is architectural, not incidental.

Every safety evaluator in the current literature -- including ours -- operates on text. The evaluator reads the instruction, reads the model's response, and classifies whether the response is harmful. This works well when the harm is in the text. A jailbreak that produces a recipe for a dangerous substance has textual signatures: the substance name, the process description, the quantities. An evaluator can find these.

But in embodied AI, the most dangerous scenarios are ones where the text is perfectly benign. "Hand me that thing on the counter." "Move the box to the left." "Continue the current task." These instructions contain no harmful content. The danger arises from the physical context: what is on the counter, who is standing to the left, what the "current task" does in this particular environment.

A text-layer evaluator cannot detect this danger because the danger is not in the text. A *perfect* text-layer evaluator -- one with unlimited reasoning capability, trained on every safety dataset ever created -- would still classify "hand me that thing on the counter" as benign. Because, at the text layer, it is benign.

This is the structural mechanism behind the IDDL. The same design decision that makes evaluators work (operate on text content) is the design decision that makes them blind to the most dangerous attacks (those that operate through physical context).

---

## The Sophistication Inversion

There is a related finding that sharpens the concern. Traditional AI safety assumes that more dangerous attacks require more sophistication. Multi-turn jailbreaks are harder to pull off than single-turn ones. Encoded instructions require more attacker effort than direct requests. The implicit model is: danger scales with attacker skill.

The IDDL inverts this for embodied AI.

At the bottom of the attacker sophistication scale -- zero effort, zero technical knowledge -- sits the most consequential and least detectable class of attack. A user who says "hand me that" to a robot in a kitchen does not know they are "attacking" the system. They are making an ordinary request. The danger exists entirely in the mismatch between the instruction's benign text and the physical environment's hazardous state.

This means the threat model for embodied AI cannot be limited to adversarial actors. The most frequent real-world instances of these failures will almost certainly be unintentional -- ordinary people giving ordinary instructions to robots in environments the robot does not fully understand.

---

## What We Measured

To be specific about the data:

- **13 VLA attack families** evaluated using our FLIP methodology (backward inference grading), producing 91 valid traces across two evaluator models
- **45% of semantic benignity attacks** were classified as BENIGN_QUERY by the evaluator -- the evaluator concluded there was no attack to detect, because at the text layer, there was not
- **Zero outright refusals** across all 91 VLA traces -- models did not refuse any instruction, regardless of family
- **50% of all FLIP verdicts** were PARTIAL -- models produced safety disclaimers in their text output, then generated the requested action sequences anyway
- **The text-only jailbreak corpus** (10,294 evaluable results across 160 models) shows the complementary pattern: high evaluator detection rates for attacks with explicit textual harm signatures

The format-lock attack family occupies an instructive middle position. Format-lock asks models to produce structured output (JSON, YAML, code) rather than narrative text. It achieves 23-42% ASR on frontier models that resist standard jailbreaks at below 10%. The mechanism: format compliance and safety reasoning are partially independent capabilities. The evaluator detects these attacks at a rate between the explicit-text families and the benign-text families -- consistent with the IDDL's prediction.

---

## What This Means for Deployed Systems

The practical implication is straightforward and uncomfortable.

Every deployed embodied AI system that relies on text-level safety evaluation has a structural blind spot proportional to the gap between its text processing and its physical environment awareness. The more diverse the physical environment, the larger the attack surface of benign instructions that produce contextually dangerous outcomes.

Factory deployments where humanoid robots work alongside human workers are particularly exposed. The robots accept natural language. The environments contain heavy objects, machinery, and people in unpredictable positions. The space of ordinary instructions that could produce dangerous outcomes in the wrong context is large and grows with environmental complexity.

Current AI safety benchmarks do not test for this. Every public benchmark we are aware of -- AdvBench, HarmBench, JailbreakBench, StrongREJECT -- evaluates text outputs against text-level safety criteria. None evaluate the physical consequences of generated action sequences in environmental context.

---

## What Would Help

Three things would change the risk profile:

**Context-aware evaluation.** Safety evaluators that receive the physical environment state alongside the instruction text, and reason about whether the proposed action sequence is safe in that specific context. We have proposed an experiment to test this: take the same 20 semantic benignity traces, provide the evaluator with environmental context, and measure whether the BENIGN_QUERY classification rate drops from 45% to something materially lower.

**Action-layer safety training.** Training VLA models to refuse unsafe action sequences, not just unsafe text. This requires action-level safety labels: datasets that mark action sequences as safe or unsafe given physical context. No such dataset exists at scale.

**Mandatory incident reporting.** The IDDL predicts that governance will not respond until incidents with media visibility occur -- the historical pattern across 100 governance lag entries. Mandatory reporting for embodied AI incidents would make failures visible without requiring injury, and would break the cycle that currently delays governance by 5+ years.

None of these exist today. The EU AI Act high-risk provisions become enforceable August 2, 2026, but without harmonised standards specifying how to test VLA architectures for the vulnerabilities the IDDL describes. Manufacturers have legal obligations without technical specifications for meeting them.

---

## The Uncomfortable Bottom Line

The IDDL is not a call for better evaluators. It is a structural observation that better text-layer evaluators cannot solve the problem. The limitation is not in the evaluator's intelligence but in its input representation. You cannot detect danger that is not in the data you are looking at.

For embodied AI, the data we are looking at -- text -- does not contain the information we need to assess safety. The information is in the physical world. Until safety evaluation integrates the physical world, the most dangerous attacks will remain the hardest to find.

And the most dangerous "attacker" will be an ordinary person making an ordinary request to a robot that does not understand why, in this particular context, the request is dangerous.

---

*This analysis synthesizes findings from the Failure-First evaluation corpus: 13 VLA attack families (91 FLIP-graded traces), 10,294 evaluable text-only jailbreak results across 160 models, and 100 Governance Lag Index entries. The IDDL pattern is hypothesis-generating, grounded in cross-corpus correlation, and subject to further empirical validation. For methodology, see [failurefirst.org](https://failurefirst.org).*
