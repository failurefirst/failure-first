---

title: "Reasoned Safety Alignment: Ensuring Jailbreak Defense via Answer-Then-Check"
description: "Answer-Then-Check trains LLMs to generate a candidate response first and then evaluate its own safety, achieving robust jailbreak defense without sacrificing reasoning or utility."
date: 2026-04-24
arxiv: "2509.11629"
authors: "Chentao Cao, Xiaojun Xu, Bo Han, Hang Li"
paperType: "empirical"
tags: [safety-alignment, jailbreak-defense, reasoning-models, self-evaluation, answer-then-check, over-refusal, llm-safety]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/2026-04-24-reasoned-safety-alignment-jailbreak-defense-answer-then-check.m4a"
---

Every safety alignment method is implicitly a bet on where the failure will occur: in the model's knowledge, in its instruction-following, or in its judgment about what it should and should not say. Most current approaches bet on the instruction-following layer — fine-tuning models to refuse harmful requests before reasoning about them at all. Cao et al.'s **Reasoned Safety Alignment (ReSA)** paper makes a different bet: that a model which reasons through its answer first, then evaluates what it produced, will be both more robust and more useful.

### The Core Idea: Answer-Then-Check

The dominant paradigm for jailbreak defense is what we might call *check-then-answer*: the model (or a guard model) evaluates the input prompt for harm before generating any response. The weakness of this approach is well-documented — sufficiently obfuscated or indirect prompts slip through because the classifier is operating on the request rather than on what it actually produces.

ReSA inverts this pipeline with the **Answer-Then-Check (ATC)** paradigm. The model:

1. Generates a candidate response, reasoning through the problem as it normally would.
2. Pauses to self-evaluate whether that response complies with safety policy.
3. Either outputs the response or revises it based on the safety evaluation.

The intuition is that harmful content is far easier to detect in the response than in the prompt. A cleverly worded request can hide intent, but a completed synthesis route for a dangerous compound cannot — it is either there or it is not. By delaying the safety check until after generation, ATC gives the model's safety evaluator the most informative possible signal.

### The ReSA Dataset and Training

To train models in this paradigm, the authors construct the **ReSA dataset**, a supervised fine-tuning corpus that includes examples of the full ATC reasoning trace: draft response, safety reflection, and final output. The dataset covers both genuinely harmful prompts (where the model should refuse or redact) and benign prompts that superficially resemble harmful ones (where the model should respond normally after confirming safety).

This second category is particularly important. One of the primary criticisms of aggressive safety fine-tuning is excessive over-refusal — models that reject legitimate questions about medicine, chemistry, history, or security because surface features pattern-match to harmful topics. By explicitly training on cases where the answer is safe and the reflection confirms it, ReSA teaches the model to distinguish real risk from superficial similarity.

### Safety Without the Alignment Tax

The most significant empirical finding in the paper is that ATC achieves **superior safety while maintaining general reasoning capabilities**, as measured on MMLU, MATH500, and HumanEval. This is notable because the standard narrative in safety alignment research is that safety comes at a cost to capability — the so-called alignment tax. Safety fine-tuning methods that constrain the model heavily tend to degrade performance on tasks that require flexible, multi-step reasoning.

ReSA's result suggests that the alignment tax is partly an artifact of when the safety check occurs, not an inevitable consequence of having safety constraints at all. Because ATC lets the model reason freely during generation and only applies the safety filter retrospectively, the model's core reasoning machinery is not suppressed — it is merely given a second-pass editor.

The paper also reports lower over-refusal rates compared to baseline safety-tuned models, confirming that the improvements in safety come from better discrimination, not from broader blanket refusals.

### Implications for Embodied AI Safety

The ATC paradigm has direct relevance for AI systems that must operate in physical environments, where the consequences of both under-refusal and over-refusal are tangible.

**Under-refusal in embodied contexts** means a robot or autonomous agent executes a harmful instruction — picking up an item it should leave alone, entering a restricted zone, or following a manipulated task specification. The ability to reason about the completed action plan (rather than just the input instruction) before committing to execution is exactly the ATC pattern applied to action selection.

**Over-refusal in embodied contexts** is equally costly. A robot arm that refuses to grasp an object because the object's name pattern-matched something from safety training, or a planning agent that aborts a valid medical task because it superficially resembles a harmful one, is not safe — it is broken. ReSA's demonstrated reduction in over-refusal rates is therefore directly applicable to embodied deployment scenarios where availability and reliability are safety properties in their own right.

**Reasoning chains are inspectable.** ATC generates an explicit safety reflection trace as part of its output. In embodied systems, this is enormously valuable: operators can audit not just what the robot decided to do, but why its internal safety evaluator approved it. This transparency is a prerequisite for the kind of meaningful human oversight that most AI safety frameworks call for.

### Open Questions

A key question left open by the paper is how ATC scales to multi-turn interactions and long-horizon tasks. In single-turn question answering, the answer to check is discrete and local. In a robot executing a ten-step manipulation plan, the "answer" is a trajectory — and harmful outcomes may only emerge at step seven, not step one. Extensions of ATC to plan-level safety checking rather than response-level checking would be a natural and important direction.

The interaction between ATC and chain-of-thought elicitation attacks (where adversaries craft prompts that induce the model to reason toward a harmful conclusion during the drafting phase) also deserves further study. If the draft response is itself the attack surface, ATC's safety evaluator needs to be robust to adversarially optimized reasoning chains — not just adversarially optimized prompts.

*Read the [full paper on arXiv](https://arxiv.org/abs/2509.11629) · [PDF](https://arxiv.org/pdf/2509.11629.pdf)*
