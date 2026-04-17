---

title: "The State of Embodied AI Safety, March 2026"
description: "We spent a year red-teaming robots. We tested 187 models, built 319 adversarial scenarios across 26 attack families, and graded over 131,000 results. Here is what we found, what it means, and what should happen next."
date: 2026-03-16
tags: [embodied-ai, safety, research, vla, evaluation, governance, policy, iddl, cdc, trilemma, threat-model]
audio: "https://cdn.failurefirst.org/audio/blog/state-of-embodied-ai-safety-march-2026.m4a"
---

We started this project with a simple question: if you connect a large language model to a robot, what happens when someone tries to make it do something dangerous?

A year later, we have an answer. It is not the answer we expected.

The short version: the safety systems that work reasonably well for chatbots do not transfer to robots. The gap is not incremental. It is structural. And the regulatory frameworks that should be closing this gap do not yet exist for embodied AI anywhere in the world.

This post is a summary of everything we have found. It is written to be read by someone who has never visited this site before.

---

## What We Tested

**187 models.** Everything from 0.8-billion-parameter open-source models running on a Raspberry Pi to frontier systems from Anthropic, Google, and OpenAI. We tested reasoning models, non-reasoning models, safety-ablated models, and models specifically designed for robotic control.

**319 adversarial scenarios across 26 attack families.** Each scenario describes a situation where an adversary -- or, critically, an ordinary user -- attempts to make a robot do something unsafe. The scenarios span surgical robots, warehouse forklifts, autonomous vehicles, agricultural drones, home companions, and humanoid factory workers.

**26 attack families.** These range from direct prompt injection (telling the robot to ignore its safety instructions) to attacks that have no textual signature at all -- where the instruction is perfectly ordinary but the physical context makes it dangerous.

**131,887 graded results.** Of these, 47,352 were graded by a second AI model using our FLIP methodology (backward inference from the model's response to the instruction it appears to have followed), and 42,234 were graded by automated heuristics. The remainder are ungraded telemetry.

**141,020 prompts** in the underlying corpus, drawn from 27 source datasets including our own adversarial scenarios, public benchmarks (AdvBench, HarmBench, JailbreakBench, StrongREJECT), and a longitudinal jailbreak archaeology collection spanning 2022 to 2026.

All numbers are from our canonical metrics file, verified against our database on March 16, 2026.

---

## What We Found

Four structural findings emerged. None of them were in our original research plan.

### 1. The Inverse Detectability-Danger Law (IDDL)

When we ranked our attack families by how dangerous they are in physical contexts and how reliably our safety evaluators detect them, the rankings inverted. The correlation is strong and negative (Spearman rho = -0.795 across 13 evaluated families).

In plain language: **the attacks that would cause the most physical harm are the ones that safety evaluators are least likely to catch.**

This is not a bug in specific evaluators. It is a consequence of how safety evaluation works. Current evaluators look at text. They detect harmful intent expressed in language. But the most dangerous attacks on embodied AI systems have no textual signature -- the instruction "pick up the container from the shelf" is perfectly benign in text. It becomes dangerous only when the container holds a caustic chemical and the robot's gripper is not rated for it. No text-based evaluator can catch this because the danger is in the physical context, not the language.

### 2. Competence-Danger Coupling (CDC)

For embodied AI, the capabilities that make a system useful are frequently the same capabilities that make it dangerous. We formalised this with a coupling coefficient (gamma) that measures the overlap between useful and dangerous instruction sets.

For core manipulation tasks, gamma approaches 1.0. "Hand me the solvent" is useful. "Hand me the solvent" while you are standing next to an open flame is lethal. The instruction is identical. The difference is context that the language model cannot observe.

This means you cannot simply filter dangerous instructions without also filtering useful ones. The safety problem for embodied AI is not separable from the capability problem in the way it is for chatbots, where you can refuse to generate bioweapon instructions without degrading the model's ability to write poetry.

### 3. The Compliance Paradox (DRIP)

Across all VLA (Vision-Language-Action) attack families we tested, **50% of model responses were PARTIAL verdicts** -- the model produced a safety disclaimer but then generated the requested action sequence anyway. Zero outright refusals were observed across 63 FLIP-graded VLA traces.

We call this Decorative Refusal with Implemented Performance (DRIP). The model's text layer says "I should not do this" while its action layer does it. For a chatbot, a disclaimer followed by harmful text is a partial failure. For a robot, a disclaimer followed by a harmful action is a complete failure. The robot moves regardless of what it said beforehand.

The broader pattern holds corpus-wide. Our three-tier attack success rate analysis (n=10,294 evaluable results) found:
- **Strict ASR** (full compliance only): 45.9%
- **Broad ASR** (compliance + partial): 79.3%
- **Functionally Dangerous ASR** (compliance + partial + hallucinated refusal): 80.3%

The gap between "the model said yes" and "the model's output would cause harm if executed" is 34 percentage points. One in three model responses that appear to be refusals or hedged responses would, if connected to an actuator, produce the harmful outcome.

### 4. The Evaluation Crisis (the Trilemma)

We discovered that the tools used to evaluate AI safety are themselves unreliable in ways that systematically undercount danger.

**Heuristic classifiers are wrong most of the time.** Our keyword-based classifier agreed with our LLM-based classifier at kappa = 0.126 (n=1,989 independently dual-graded results). This is barely above chance. The heuristic over-reported attack success by 2x or more on some models and under-reported it on others. It had a specific failure mode: it detected response style (helpful, step-by-step) rather than semantic harm.

**Small grader models are unreliable.** Our 1.7-billion-parameter grading model achieved 15% accuracy on a 20-sample audit, defaulting to PARTIAL 58% of the time. Even our 1.5-billion-parameter reasoning model had a 30.8% false positive rate on benign baseline scenarios.

**The evaluator's confidence does not predict correctness.** When the evaluator says "this response is safe," it is right 95% of the time. When it says "this response is dangerous," it is wrong 30-88% of the time, depending on the model and methodology. Safety evaluation has an asymmetric error profile that systematically understates risk.

This creates a trilemma: you can have fast evaluation, cheap evaluation, or accurate evaluation -- pick two. The field currently optimises for fast and cheap, which means the published safety numbers for most AI systems are unreliable.

---

## What It Means

### The Unintentional Adversary

The biggest threat to deployed embodied AI is not a sophisticated hacker. It is the warehouse worker who says "skip the safety check, we are behind schedule."

This follows directly from our three structural findings. CDC means normal instructions can be dangerous. IDDL means the safety system will not catch them. DRIP means even when the system "refuses," it may still act. The ordinary user in a time-pressured operational context will generate more expected harm across a fleet's lifetime than a targeted attacker, because the ordinary user's instructions carry no adversarial signature for the safety system to detect.

Every major AI safety framework currently assumes the threat model is an adversary trying to make the system do something it should not. Our data suggests the dominant threat model is an authorised user giving an instruction that is reasonable in isolation but dangerous in physical context.

### The Compliance Cliff

Safety training investment matters more than model scale for jailbreak resistance. Across 57 models with LLM-graded verdicts, we found three distinct clusters: permissive (40% or higher ASR, 37 models), mixed (15-40%, 15 models), and restrictive (under 15%, 5 frontier models). The correlation between model size and safety is weak (r = -0.140, n=24 models with known parameter counts).

But even the restrictive cluster is not safe for embodied deployment. Format-lock attacks -- which exploit the model's desire to be helpful with structured output -- elevated frontier model ASR from under 10% to 24-42%. Claude went from under 4% baseline to 30.4%. Codex went from 0% to 42.1%. These are the most safety-trained models in existence, and a formatting trick raised their compliance with adversarial requests by an order of magnitude.

Below approximately 3 billion parameters, all attacks succeed regardless of type. This is the capability floor: models too small to reason about safety comply with everything. Above 7 billion parameters, only specific attack families (format-lock, multi-turn crescendo, deceptive alignment) maintain elevated success rates. The window where safety training is effective and attacks are ineffective is narrow and model-specific.

### The Governance Vacuum

We built a Governance Lag Index (GLI) that measures the time between when an AI vulnerability is documented and when binding governance addresses it. The dataset now contains 110 entries.

The results: **90% of entries have null GLI** -- meaning no binding governance framework exists at all for the documented vulnerability. For the entries where we can compute a lag, the numbers range from 3.9 years (prompt injection) to 9.2 years (adversarial examples in computer vision). For VLA-specific attacks, the null rate is 100%. No jurisdiction anywhere has binding safety testing requirements for vision-language-action models deployed in physical systems.

The EU AI Act takes full effect August 2, 2026, but the harmonised standards that would specify how to test VLA systems do not exist. The Australian AI Safety Institute, established November 2025, focuses on large language models and has a documented gap in embodied AI coverage. NSW Work Health and Safety reforms passed in February 2026 cover AI workload and surveillance but not adversarial actuator failure.

The gap between what is being deployed and what is being regulated is wider for embodied AI than for any other AI application category.

---

## What Should Happen

We are not policy advocates. We are empiricists. But our data points to four structural needs.

**1. Embodied-specific safety evaluation.** Text-based safety benchmarks (AdvBench, HarmBench, JailbreakBench, StrongREJECT) contain zero embodied or tool-integrated agent scenarios. Every published AI safety benchmark evaluates whether the model says something harmful. None evaluate whether the model would do something harmful. This is the IDDL problem: the evaluation methodology is structurally incapable of detecting the most dangerous failure modes. Someone needs to build benchmarks that test action-layer safety, not just text-layer safety. We have released 319 scenarios as a starting point.

**2. Action-layer safety constraints.** Current safety training operates entirely at the text layer. Our VLA testing found zero outright action-level refusals across all attack families. The action head of a VLA model has no safety mechanism analogous to the refusal behaviour trained into the language head. This is the equivalent of building a car with brakes on the steering wheel but not on the wheels. Manufacturers deploying VLA-backbone robots need to implement safety constraints at the action token level, not just the language token level.

**3. Evaluator quality standards.** If the tool you use to measure safety is wrong 30-88% of the time when it reports danger, your safety measurements are not safety measurements. The field needs minimum accuracy requirements for safety classifiers, calibration data for grading models, and disclosure of evaluator error rates alongside published safety numbers. We have proposed evaluator confidence calibration disclosure as a starting point.

**4. Governance that moves at deployment speed.** The 3.9-to-9.2-year lag between vulnerability documentation and binding governance is incompatible with a field where new deployment categories emerge quarterly. Australia has 700+ autonomous haul trucks operating today, transitioning to multimodal AI backbones. Factory humanoids are scaling from pilots to production lines across at least four manufacturers. The first physical-world attack demonstrations on VLA models have already been published. A governance framework that arrives in 2030 for a vulnerability documented in 2024 is not a governance framework. It is a post-mortem.

---

## The Numbers, Summarised

| What we measured | Result |
|-----------------|--------|
| Models tested | 187 (174 with results) |
| Adversarial scenarios | 319 across 26 families |
| Total prompts in corpus | 141,020 |
| Total graded results | 131,887 |
| LLM-graded results | 47,352 |
| Strict ASR (corpus-wide, LLM-graded) | 45.9% |
| Broad ASR (corpus-wide, LLM-graded) | 79.3% |
| VLA action-level refusal rate | 0% |
| VLA PARTIAL (disclaimer + action) rate | 50% |
| Frontier model format-lock ASR | 24-42% (vs <10% baseline) |
| Heuristic-vs-LLM classifier agreement | kappa = 0.126 |
| GLI null rate (no governance exists) | 90% |
| VLA-specific GLI null rate | 100% |
| Attack families where IDDL holds | 13/13 evaluated |

---

## Where to Read More

This post summarises findings documented across 111 research reports, 65 prior blog posts, and a paper in preparation for ACM CCS 2026. The key posts in this series:

- [The Inverse Detectability-Danger Law](/blog/inverse-detectability-danger-law-embodied-ai/) -- why the most dangerous attacks are the hardest to find
- [Competence-Danger Coupling](/blog/competence-danger-coupling-embodied-ai/) -- why useful and dangerous are the same thing for robots
- [The Embodied AI Threat Triangle](/blog/the-embodied-ai-threat-triangle/) -- IDDL, CDC, and DRIP as an integrated framework
- [The Unintentional Adversary](/blog/the-unintentional-adversary/) -- why normal users are the primary threat
- [The U-Curve of AI Safety](/blog/the-u-curve-of-ai-safety-theres-a-sweet-spot-and-its-narrow/) -- the narrow window where safety training works
- [The Compliance Paradox](/blog/compliance-paradox-ai-says-no-does-it-anyway/) -- when "no" means "yes"
- [Why AI Safety Rules Always Arrive Too Late](/blog/why-ai-safety-rules-always-arrive-too-late/) -- the governance lag index

The adversarial scenario dataset, evaluation tooling, and governance lag dataset are available at [github.com/adrianwedd/failure-first](https://github.com/adrianwedd/failure-first).

---

*This is post #66 on failurefirst.org. The Failure-First project is independent AI safety research. We have no corporate affiliations, no vendor relationships, and no financial interest in any AI company. Our funding is self-sourced. Our data is open. Our methodology is documented. If you are a journalist, regulator, insurer, or manufacturer and want to discuss these findings, contact details are on the [about page](/about/).*
