---
title: "IS-Bench: Evaluating Interactive Safety of VLM-Driven Embodied Agents in Daily Household Tasks"
description: "Introduces a process-oriented benchmark with 161 scenarios and 388 safety risks for evaluating whether VLM-driven embodied agents recognize and mitigate dynamic hazards during household task execution — finding that current frontier models lack interactive safety awareness."
date: 2026-03-31
arxiv: "2506.16402"
authors: "Xiaoya Lu, Zeren Chen, Xuhao Hu, Yijin Zhou, Weichen Zhang, Dongrui Liu, Lu Sheng, Jing Shao"
paperType: "empirical"
tags: ["embodied-ai-benchmark", "interactive-safety", "household-robotics", "process-oriented-evaluation", "vlm-safety"]
draft: false
---

# IS-Bench: Evaluating Interactive Safety of VLM-Driven Embodied Agents in Daily Household Tasks

**Focus:** IS-Bench is the first benchmark to evaluate *interactive* safety — whether VLM-driven embodied agents recognize hazards that emerge dynamically during task execution and take appropriate mitigation actions at the right time. Across 161 scenarios with 388 distinct safety risks, testing reveals that GPT-4o, Gemini-2.5, and other frontier models consistently fail to demonstrate interactive safety awareness, and that safety-focused reasoning prompting improves hazard recognition but degrades task completion.

This benchmark tests what actually matters for household robots: not whether the model knows fire is dangerous, but whether it turns off the stove *before* walking away to fetch a plate.

---

## Key Insights

- **Interactive safety is temporally ordered.** Static safety benchmarks test whether a model recognizes a hazard. IS-Bench tests whether it recognizes the hazard *and* takes the right mitigation action *at the right step in the task sequence*. A model that turns off the stove after leaving the kitchen scores zero — the ordering matters.
- **Current frontier models fail at interactive safety.** GPT-4o and Gemini-2.5 both demonstrate poor interactive safety awareness. They can identify hazards when directly asked but fail to spontaneously recognize and mitigate them during task execution.
- **Safety prompting creates a capability trade-off.** Adding explicit safety instructions to the system prompt improves hazard recognition but reduces task completion — the model becomes overly cautious, refusing to proceed with tasks that involve any perceived risk. This is the iatrogenic safety phenomenon in action.

## Executive Summary

Lu et al. identify a critical gap in embodied AI evaluation: existing benchmarks measure task success (can the robot complete the instruction?) and static safety (does the robot recognize a hazard in an image?), but neither captures the dynamic, process-level safety requirements of real-world household operation. A robot that can identify a hot pan is not necessarily a robot that will move the hot pan to a trivet before placing food on the counter next to it.

IS-Bench addresses this with three innovations:

1. **Process-oriented evaluation:** Each scenario defines a task sequence with explicit safety-critical checkpoints. The benchmark verifies that risk mitigation actions occur *before or after* specific risk-prone steps — not just that they occur at all.
2. **Multimodal scenario design:** 161 scenarios span kitchen, bathroom, living room, and garage environments with 388 distinct safety risks including fire, water, sharp objects, chemicals, electrical hazards, and fall risks.
3. **Dynamic risk emergence:** Hazards are not present in the initial scene. They emerge as consequences of the agent's own actions — spilling water near an electrical outlet, leaving a knife on a counter edge while reaching for something else.

**Frontier model results:**

| Model | Safety Score | Task Completion | Safety-Task Trade-off |
|-------|-------------|----------------|----------------------|
| GPT-4o | Low | Moderate | Moderate |
| Gemini-2.5 | Low | Moderate | Moderate |
| GPT-4o + safety prompt | Improved | Reduced | Significant |
| Gemini-2.5 + safety prompt | Improved | Reduced | Significant |

The precise scores are less important than the pattern: no model achieves both high safety and high task completion. Safety-focused prompting shifts the balance but does not resolve the underlying deficiency.

---

## Detailed Analysis

### 1. Process-Oriented Evaluation

IS-Bench's key methodological contribution is evaluating safety as a *process* property rather than a *state* property. Consider a scenario: "Make tea while a child is playing nearby."

- **State-level safety:** Does the model know boiling water is dangerous around children? (Most models pass this.)
- **Process-level safety:** Does the model: (a) check the child's location before boiling water, (b) use the back burner, (c) keep the kettle handle turned inward, (d) wait for the water to cool before carrying it across the room? (Most models fail this.)

This distinction maps directly to our process-layer vs. goal-layer failure taxonomy. A model can have correct safety *knowledge* (goal layer) while failing at safety *execution* (process layer). IS-Bench measures the latter.

### 2. Dynamic Risk Emergence

The most challenging scenarios involve risks that the agent's own actions create. Examples:
- Placing a wet object near an electrical outlet while cleaning
- Opening a cabinet door into a walking path while retrieving an item
- Leaving a drawer open at knee height while bending to pick something up

These risks do not exist in the initial scene — they emerge from the agent's action sequence. Detecting them requires the model to maintain a dynamic safety model of the environment that updates with each action. Current VLMs do not do this; they reason about each step independently, losing the accumulated safety context.

### 3. The Safety-Capability Trade-off

IS-Bench's finding that safety prompting degrades task completion is consistent with our iatrogenic safety research (TI-S framework). When models are explicitly told to prioritize safety, they exhibit:
- **Over-refusal:** Declining to perform tasks that involve any interaction with potentially hazardous objects (knives, stoves, cleaning chemicals)
- **Excessive caution:** Adding unnecessary safety steps that break task flow (checking for hazards at every step, even when none are present)
- **Task abandonment:** Stopping mid-task when a potential risk is identified, rather than mitigating the risk and continuing

This is the embodied equivalent of the "helpful vs. harmless" tension in language models — but with physical consequences. An over-cautious household robot that refuses to cook because the stove is "dangerous" is not safe; it is useless.

---

## Failure-First Connections

- **Iatrogenic Safety (TI-S Framework):** IS-Bench provides empirical evidence for our TI-S thesis — safety interventions (explicit safety prompting) cause measurable capability harm. The safety-capability trade-off IS-Bench measures is exactly the iatrogenic phenomenon we theorized.
- **Process-Layer Failures (AIES 2026 Outline):** IS-Bench operationalizes process-layer safety evaluation. The temporal ordering requirement (mitigate *before* the risk-prone step) is a concrete instance of our process-layer failure category.
- **FLIP Grading Extension:** IS-Bench's process-oriented scoring could inform FLIP grading for embodied scenarios. A response that acknowledges a hazard (PARTIAL) but does not mitigate it at the right time should be graded differently from one that mitigates correctly (FULL refusal of unsafe action) or ignores the hazard entirely (FULL compliance with unsafe trajectory).
- **SafeLIBERO / AEGIS Comparison:** IS-Bench complements the AEGIS/SafeLIBERO work reviewed earlier this week. SafeLIBERO tests physical constraint adherence (collision avoidance); IS-Bench tests cognitive safety awareness (hazard recognition and temporal reasoning). A complete VLA safety evaluation needs both.

---

## Actionable Insights

### For Embodied AI Developers
* **Implement dynamic safety state tracking.** Current VLMs reason about each step independently. Embodied agents need a running safety model that accumulates risk context across the action sequence — "I left a drawer open three steps ago, and I am about to walk past it."
* **Do not rely on safety prompting alone.** IS-Bench shows that system-prompt-level safety instructions create trade-offs. Architectural solutions (like AEGIS-style constraint layers) may avoid the capability penalty.

### For Safety Researchers
* **Adopt process-oriented evaluation.** IS-Bench's temporal checkpoint methodology should become standard for embodied AI safety benchmarks. Static hazard recognition is necessary but wildly insufficient.
* **Measure iatrogenic effects explicitly.** Every safety intervention should be evaluated for both safety improvement *and* capability degradation. Report both numbers.

### For Household Robotics Deployers
* **Interactive safety is the deployment-blocking gap.** A robot that cannot dynamically track and mitigate emerging hazards in a kitchen should not be deployed in a kitchen. IS-Bench provides the evaluation framework to determine whether your system meets this bar.

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2506.16402) · [PDF](https://arxiv.org/pdf/2506.16402.pdf)*
