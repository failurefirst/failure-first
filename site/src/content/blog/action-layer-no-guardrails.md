---
title: "The Action Layer Has No Guardrails: Why Text-Based AI Safety Fails for Robots"
description: "Current AI safety is built around detecting harmful text. But when AI controls physical hardware, danger can emerge from perfectly benign instructions. Our data and recent peer-reviewed research converge on a finding the industry has not addressed: text-layer safety is structurally insufficient for embodied AI."
date: 2026-03-11
author: "River Song"
tags: [embodied-ai, safety, robotics, vla, guardrails, governance, blindfold, evaluation]
---

Every major AI safety system in production today works by analysing text. Detect harmful words. Flag dangerous requests. Refuse to generate instructions for violence, weapons, or abuse. This approach has been remarkably effective for chatbots and code assistants.

It does not work for robots.

---

## The Text-Safety Assumption

The implicit assumption behind current AI safety is that harm lives in language. If a user asks an AI to do something dangerous, the request will contain dangerous words, and the response will contain dangerous instructions. Safety filters can intercept at either end.

This assumption holds reasonably well for text-only systems. When a language model generates a harmful response, a human reads that text and decides whether to act on it. The text is the final output. The human is the final checkpoint.

Embodied AI breaks both assumptions. The model's output is not read by a human -- it is parsed by an action decoder that converts structured trajectories into motor commands. And the "harmful content" may not contain a single dangerous word.

---

## Benign Text, Dangerous Actions

A peer-reviewed paper accepted at ACM SenSys 2026 demonstrates this gap with precision. The Blindfold framework, developed by researchers at multiple institutions, generates sequences of individually benign instructions that produce dangerous physical outcomes when executed by a robot.

Each instruction in the sequence passes text-level safety filters. "Move arm to position X." "Close gripper." "Extend arm forward." No harmful keywords. No dangerous intent visible in any individual action. The danger exists only in the physical consequence of the sequence -- and no text-level safety filter can detect it.

The results are stark. In simulation, the attack achieved success rates above 85% across every model tested, including frontier systems from major providers. On a real 6-degree-of-freedom robotic arm, 18 out of 20 attack sequences executed successfully.

The existing defenses -- input/output filtering, token-level prediction monitoring, and formal verification -- reduced the attack rate by at most 18 percentage points. Even in the best-defended configuration, the residual success rate remained above 75%.

These are not hypothetical numbers from a contrived lab setup. The attacks were validated on physical hardware performing tasks in four categories: using tools to cause harm, direct physical contact, environmental sabotage, and privacy violations.

---

## Our Data Tells the Same Story from a Different Angle

We have been running adversarial evaluations against vision-language-action (VLA) model scenarios as part of our embodied AI safety research. Our findings, developed independently, converge with the Blindfold results on the same structural conclusion.

Across 58 FLIP-graded adversarial traces tested against VLA scenarios spanning 7 attack families, the verdict breakdown was:

- **50% PARTIAL** -- the model added a safety disclaimer but still generated the requested action content
- **21% COMPLIANCE** -- the model generated the unsafe content without any hedging
- **26% BENIGN_QUERY** -- the model did not recognise the adversarial intent at all
- **0% REFUSAL** -- no model, across any attack family, fully refused to generate action-relevant output

Zero refusals. Not a single trace out of 58 produced a model that declined to generate action sequences for adversarial inputs.

The 50% PARTIAL rate is the most informative finding. These are responses where the model demonstrates awareness of the safety concern -- it writes a disclaimer, it hedges, it qualifies. And then it generates the action content anyway. In a text-only system, that disclaimer might serve as a useful signal to a human reader. In an embodied system, the action decoder ignores every word of it and executes the trajectory.

---

## The Compound Problem: You Cannot Even Evaluate This

The situation is worse than "text safety does not prevent action-layer harm." There is a second failure: the tools we use to evaluate AI safety are themselves text-based.

Our FLIP grading methodology -- which infers the instruction that would have produced a given response, then judges whether that instruction is harmful -- operates at the text layer. When we audited the FLIP grader against a benign baseline (scenarios where no attack was present), we found a false positive rate of 30.8%. The grader flagged nearly a third of safe responses as potentially harmful.

This is not a criticism of our specific grading tool. It is a structural observation: safety evaluators that operate on text content inherit the same blindness as safety filters that operate on text content. If the dangerous output contains no dangerous words, a text-based evaluator cannot reliably detect it.

The result is a triple failure:

1. **Safety filters** cannot prevent the attack because the input text is benign
2. **Safety training** cannot prevent the output because models hedge textually but comply structurally (the PARTIAL pattern)
3. **Safety evaluators** cannot reliably detect the failure because they analyse text, not physical consequences

Each failure is concerning individually. Together, they mean that an embodied AI system can be attacked, the attack can succeed, and the evaluation pipeline can report that nothing went wrong.

---

## No Governance Framework Addresses This

We maintain a dataset tracking the governance response to emerging AI threats -- when a vulnerability is documented, when a framework addresses it, when legislation is enacted, and when enforcement begins.

For action-level manipulation of embodied AI systems, every governance stage is empty. No framework anywhere distinguishes text-layer safety from action-layer safety. No legislation requires action-level adversarial testing for robotic systems. No enforcement mechanism exists.

The EU AI Act, which begins applying to high-risk AI systems in August 2026, will cover robotic systems. Manufacturers must demonstrate robustness. But the Act does not specify that robustness testing must include action-level evaluation. A manufacturer could technically satisfy conformity requirements using purely text-level safety assessments -- and deploy systems vulnerable to a published, automated attack with above 85% success rates.

Australia's NSW Digital Work Systems Act, passed in February 2026, creates a binding pre-deployment testing duty for AI systems affecting workers. But it does not distinguish between text-layer and action-layer safety testing. An employer deploying a VLA-controlled manipulator arm that has only undergone text-level evaluation may not satisfy the duty -- but the Act provides no guidance on what action-level testing should look like.

Standards bodies are beginning to address AI agents broadly. NIST launched an AI Agent Standards Initiative in February 2026 covering interoperability, security, and identity for autonomous AI. But "agents" in NIST's framing means software agents booking flights and writing code -- not physical robots manipulating objects. The embodied case, where the agent's actions have irreversible physical consequences, is not addressed.

---

## What Would Need to Change

Closing the text-action safety gap requires changes at multiple levels.

**Action-space monitoring.** Safety mechanisms must operate at the action execution layer, not only at the text generation layer. This means kinematic constraint checking, force envelope monitoring, collision prediction, and sequence-level consequence analysis. Each generated action must be evaluated not for what it says, but for what it does.

**Physical consequence modelling.** Safety training and evaluation must incorporate physical simulation. An action sequence that moves an arm through five individually safe positions can still result in an impact if those positions trace a striking trajectory. Evaluating positions individually is insufficient -- the sequence must be assessed as a physical trajectory.

**Evaluator calibration.** Safety evaluation tools must be benchmarked against known attack types, including attacks that produce no harmful text. A 30.8% false positive rate on benign inputs, combined with potential false negatives on text-benign but physically dangerous outputs, means current evaluation provides less confidence than it appears to.

**Governance that distinguishes layers.** Regulatory frameworks and conformity assessments must explicitly address the text-action gap. A robotic AI system that passes all text-level safety tests should not be considered safe if it has not been tested against action-level manipulation. Standards bodies developing AI safety evaluation criteria should define separate requirements for text-layer and action-layer safety.

---

## The Takeaway

Current AI safety was built for a world where AI produces text and humans decide what to do with it. That world is ending. AI systems increasingly produce actions -- motor commands, tool invocations, navigation trajectories -- where no human reads the output before it takes effect.

The safety infrastructure has not caught up. Text-layer safety filters, text-based safety training, and text-based safety evaluations form a coherent defensive stack -- for text. For physical actions, they leave an unaddressed gap that both published peer-reviewed research and our own empirical data show is exploitable at high rates.

This is not a call for alarm. It is a call for specificity. The question is no longer "is AI safe?" but "which layer of AI output is being evaluated for safety, and does the evaluation method match the deployment context?" For embodied AI, the answer today is that it does not.

---

*This analysis draws on the Blindfold framework (Huang et al., arXiv:2603.01414, accepted ACM SenSys 2026) and the Failure-First Embodied AI project's adversarial VLA evaluation data (n=58 FLIP-graded traces across 7 attack families). Pattern-level findings only -- no operational attack details are disclosed.*
