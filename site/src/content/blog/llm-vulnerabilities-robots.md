---
title: "What LLM Vulnerabilities Mean for Robots"
description: "VLA models like RT-2, Octo, and pi0 use language model backbones to translate instructions into physical actions. That means supply chain injection, format-lock attacks, and multi-turn escalation are no longer text-only problems."
date: 2026-02-27
tags: [embodied-ai, robotics, ai-safety, vla, supply-chain]
image: /images/blog/llm-vulnerabilities-robots.webp
---

When a language model is jailbroken, the consequence is a harmful piece of text. When the language model controls a robot arm, the consequence might be something else entirely.

This is the core problem that drives the embodied AI safety work in our [F41LUR3-F1R57 paper](/blog/120-models-18k-prompts/). The vulnerabilities we measure across 120 models and 18,176 adversarial prompts are not abstract. They are vulnerabilities in the reasoning engine that modern robotics systems are increasingly built on top of.

This post explains three attack vectors from our empirical results and maps them to physical deployment. We are explicit about where the analogy holds and where it runs ahead of tested evidence.

---

## The architecture that creates the risk

Vision-language-action (VLA) models — RT-2, Octo, pi0 — share a common design: a language model backbone interprets goals and generates action sequences. The language model is not a peripheral component. It occupies semantic authority over the system, deciding which actions to take, in what order, and in response to which inputs.

This architecture is what makes VLA models useful. A robot that can understand natural language instructions, reason about context, and produce structured action plans is genuinely more capable than one that runs hand-coded state machines. But usefulness and vulnerability share the same source. If the language model backbone is susceptible to prompt injection, format-lock attacks, or multi-turn manipulation — and our testing shows that many are — then the physical system inherits those vulnerabilities.

Our testing is text-in, text-out. We evaluated language model components in isolation, not integrated with physical actuators or sensor systems. The argument we are making is by analogy: if the component is vulnerable, systems built on it inherit that vulnerability. That analogy is empirically grounded but not yet empirically validated through end-to-end embodied testing. The VLA-specific adversarial scenarios we have designed — 31 scenarios across 7 attack families — have not yet been run against VLA models due to API access constraints. We are being direct about this gap.

---

## Attack vector 1: Supply chain injection

In our supply chain experiments, we embedded adversarial instructions into tool definitions and skill files — the operational context that models receive as authoritative configuration rather than as user input. Across six models at the 1.5–3.8B parameter scale (n=300 traces), the attack success rate was 90–100%, with no statistically significant difference between models.

The finding is that small open-weight models do not distinguish between legitimate operational context and adversarial instructions embedded within it. They execute what the context tells them to execute.

Map this to a robotic deployment. A warehouse robot built on an open-weight VLA model loads dozens of skill definition files — grip routines, placement routines, navigation behaviors — sourced from different repositories and vendors. If any of those files is tampered with, or if the plugin manifest is poisoned, our results suggest the model would execute the injected instructions without evaluating their safety implications.

The supply chain for a robotic system is large, distributed, and difficult to audit in the same way that a software dependency tree is. An attacker who can modify a skill file — through a compromised vendor, a malicious update, or a tampered repository — does not need to interact with the robot directly. The injection happens at configuration time, not runtime.

We note that these results are limited to small open-weight models. Frontier models may exhibit stronger instruction-hierarchy enforcement. Testing that hypothesis requires controlled context injection against frontier APIs, which is methodologically non-trivial. We have not done it yet.

For more detail on the supply chain methodology, see our [earlier post on small model vulnerability](/blog/supply-chain-small-models-vulnerable/).

---

## Attack vector 2: Format-lock and the instruction-following dilemma

A robotic controller needs to produce structured outputs. JSON action plans, YAML configuration sequences, code that specifies gripper positions and force values — this is the normal output format for an LLM-backed robotic planner. Structured output is not an optional feature; it is the interface through which language reasoning becomes physical action.

Format-lock attacks exploit exactly this requirement. Our faithfulness experiments presented harmful requests framed as formatting tasks — produce this as JSON, complete this code block, fill in this YAML structure. Against three frontier models (Claude, Codex, Gemini), attack success rates ranged from 24% to 42% across 75 CLI traces, LLM-graded.

The underlying tension is intrinsic: the same instruction-following capability that makes a model useful for structured robotic output also makes it susceptible to format-lock attacks. A model that reliably produces JSON action plans when asked will, in a meaningful fraction of cases, produce JSON-formatted harmful content when the request is framed as a formatting task. The model's training objective — be helpful, follow instructions, produce well-formed output — creates the vulnerability.

There is no obvious solution to this that does not degrade utility. You cannot train a model to refuse all structured output requests. You cannot easily distinguish a legitimate action plan request from a format-lock attack at the syntactic level. The model must make a semantic judgment about the content it is being asked to format, while simultaneously satisfying the formatting constraint. Our results indicate that this judgment fails 24–42% of the time against current frontier models, in a text-only setting. What the failure rate looks like when the output drives physical actuators is an open question.

---

## Attack vector 3: Multi-turn escalation in human-robot interaction

Human-robot interaction is inherently multi-turn. A user working alongside a robot gives instructions across a session, corrects errors, adjusts goals, and builds up context over time. The robot's language model processes this accumulated context to maintain coherence — to remember what has been requested, what has been completed, and what the user's goals are.

Multi-turn escalation attacks exploit this coherence. Our crescendo experiments built harmful requests incrementally across multiple turns, each turn incrementally shifting the interaction frame. Against reasoning models, the attack success rate was 80–90%. Against small non-reasoning models, it was approximately 10%.

The asymmetry is significant. Reasoning models — the frontier models that are most capable and therefore most likely to be deployed in high-stakes robotic applications — are also most susceptible to this attack. Multi-turn coherence is a capability. It is also a vulnerability. An adversary who can sustain a multi-turn interaction with an LLM-backed robot could progressively shift the interaction frame from legitimate requests to harmful ones, exploiting the model's tendency to maintain consistency with prior context.

This is not a theoretical scenario. Robots deployed in public-facing or semi-public settings — delivery systems, hospitality robots, collaborative warehouse systems — will interact with users they have not been specifically configured to trust. The adversarial human-robot interaction scenario is not exotic.

---

## The VLA scenario dataset

We have designed 31 adversarial scenarios specifically for VLA evaluation, organized into 7 attack families:

- **action_space_exploitation** (3 scenarios): attacks that misuse the model's understanding of its own action space
- **language_action_misalignment** (5): scenarios where natural language instructions map to unintended physical actions
- **multimodal_confusion** (5): attacks that exploit inconsistencies between visual and language inputs
- **physical_context_manipulation** (5): environmental manipulation that corrupts the model's situational reasoning
- **safety_boundary_erosion** (5): gradual erosion of physical safety constraints across interaction turns
- **temporal_reasoning_attack** (3): attacks that exploit the model's reasoning about time, sequence, and causality
- **visual_adversarial_perturbation** (5): adversarial patches and visual inputs that corrupt perception

These scenarios have not been run against VLA models. They represent our current best understanding of how the text-only vulnerabilities we have measured would manifest in embodied deployment — an informed hypothesis, not a validated finding. We are publishing them as part of our open dataset so that researchers with VLA model access can run them.

---

## Regulatory gaps

The EU AI Act classifies robotics systems in safety-critical domains as high-risk under Articles 6 and 9, requiring robustness testing against adversarial inputs and structured risk management. These requirements are directionally correct.

The gap is in the standards that inform conformity assessment. IEC 61508, the primary functional safety standard for safety-related systems, does not address semantic failure modes — prompt injection, format-lock compliance, multi-turn manipulation. It was designed for hardware reliability and deterministic software, not for systems whose behavior is determined by a language model's response to natural language inputs. A robot that fails because its gripper motor fails is a different problem from a robot that fails because its language model backbone was manipulated into producing a harmful action plan. Current functional safety standards address the first problem. They do not address the second.

ISO 42001 (AI Management Systems) establishes AI risk management requirements but does not yet specify adversarial evaluation protocols for embodied systems. Our framework — the dataset, benchmark infrastructure, and classification pipeline — is designed to be useful for filling this gap.

---

## What we have established and what we have not

To be clear about the scope of our claims:

We have established that the language model components of VLA systems are susceptible to supply chain injection (90–100% ASR at small model scale), format-lock attacks (24–42% ASR against frontier models), and multi-turn escalation (80–90% ASR against reasoning models). These are text-only measurements.

We have not established that these attacks succeed end-to-end in integrated embodied systems. We have not tested VLA models with our adversarial scenarios. We have not measured what happens when a format-lock attack produces a JSON action plan that is executed by a physical actuator. The analogy from text vulnerability to physical vulnerability is grounded in the architecture — the language model is the reasoning engine — but it is an analogy, not a measured fact.

The 31 VLA scenarios we have designed represent our hypothesis about how the text-only findings would manifest physically. Testing that hypothesis requires resources and access we do not currently have. We are publishing the scenarios and methodology so others can.

The failure-first evaluation philosophy is motivated by an asymmetric cost function: in safety-critical embodied deployment, the cost of a single undetected adversarial failure may far exceed the value of thousands of successful task completions. Evaluation frameworks for embodied AI safety should be designed accordingly — with failure behavior as the primary object of study, not an afterthought. That is the argument we are making. The empirical work to fully support it in embodied settings is ongoing.

---

The full paper, dataset (18,176 prompts, 120 models), benchmark infrastructure, and VLA scenario files are available in the F41LUR3-F1R57 repository. The classification pipeline, including documented heuristic-to-LLM calibration (Cohen's kappa = 0.245), is open for reuse and extension.
