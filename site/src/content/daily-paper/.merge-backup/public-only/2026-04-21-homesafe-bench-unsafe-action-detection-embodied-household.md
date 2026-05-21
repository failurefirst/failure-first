---

title: "HomeSafe-Bench: Evaluating Vision-Language Models on Unsafe Action Detection for Embodied Agents in Household Scenarios"
description: "A comprehensive benchmark and HD-Guard dual-brain architecture for detecting unsafe actions by embodied VLM agents in household environments, exposing critical gaps in real-time safety monitoring."
date: 2026-04-21
arxiv: "2603.11975"
authors: "Jiayue Pu, Zhongxiang Sun, Zilu Zhang, Xiao Zhang, Jun Xu"
paperType: "empirical"
tags: ["embodied-ai-safety", "unsafe-action-detection", "vision-language-models", "household-agents", "real-time-safety", "benchmark", "dual-brain-architecture"]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/2026-04-21-homesafe-bench-unsafe-action-detection-embodied-household.m4a"
---

# HomeSafe-Bench: Evaluating Vision-Language Models on Unsafe Action Detection for Embodied Agents in Household Scenarios

**Focus:** HomeSafe-Bench introduces a structured benchmark for measuring how well vision-language models detect unsafe actions taken by embodied agents in household environments. Alongside the benchmark, the authors present HD-Guard — a hierarchical dual-brain architecture pairing a fast reactive monitor with a slower, deeper reasoning component. The core finding is sobering: current frontier VLMs fail to reliably catch unsafe household actions in real time, exposing a significant gap between language-level safety and the demands of physical deployment.

This paper is timely. As VLM-driven household robots move from research labs toward consumer settings, the ability to intercept unsafe actions *before* physical consequences occur is not a nice-to-have — it is a prerequisite for deployment. HomeSafe-Bench provides the first principled evaluation framework for exactly this capability.

---

### Key Findings

- **Frontier VLMs are not reliable real-time safety monitors.** Even GPT-4o-class models miss a substantial fraction of unsafe actions when evaluated under realistic streaming conditions, where decisions must be made within a single video frame window.
- **Process-level safety detection is harder than outcome-level detection.** Identifying that an action *will* cause harm before it completes is significantly more difficult for current models than classifying a completed harmful event post-hoc.
- **The FastBrain/SlowBrain split is necessary but not sufficient.** HD-Guard's hierarchical design yields accuracy improvements over single-model approaches, but the FastBrain's recall remains the bottleneck — fast reactions miss subtle precursors to harm.

### Executive Summary

Pu et al. observe that existing safety evaluations for embodied agents typically focus on high-level task refusal ("will the agent attempt a dangerous task?") rather than the more operationally relevant question: "can we detect and interrupt unsafe intermediate actions in real time?"

HomeSafe-Bench fills this gap with a dataset of household scenarios spanning kitchen, bathroom, and living room contexts, each annotated with fine-grained unsafe action labels. The benchmark covers a wide spectrum of hazard types — thermal (stove misuse, boiling overflow), chemical (mixing cleaning agents), mechanical (unstable stacking, sharp objects), and electrical (water near outlets). Crucially, every unsafe action is embedded in a plausible task context, preventing models from triggering on surface-level "dangerous object" cues alone.

**Benchmark structure at a glance:**

| Category | Hazard Types | Evaluation Mode |
|----------|-------------|-----------------|
| Kitchen | Thermal, chemical, mechanical | Streaming + offline |
| Bathroom | Chemical, electrical | Streaming + offline |
| Living room | Mechanical, fall risk | Streaming + offline |
| Cross-context | Multi-hazard sequences | Offline only |

**HD-Guard architecture** divides the safety monitoring problem between two components:
- **FastBrain:** A lightweight visual classifier operating at frame rate, flagging candidate unsafe actions with high recall and lower precision. Designed to never miss a hazard at the cost of occasional false positives.
- **SlowBrain:** A full VLM invoked only when FastBrain raises an alert. Reasons over the action context — what the agent is trying to accomplish, what objects are involved, what stage of the action is underway — to confirm or dismiss the alert.

This matches the interrupt-and-verify pattern seen in safety-critical control systems, where a cheap sensor triggers a more expensive analysis rather than running deep reasoning on every frame.

---

### Detailed Analysis

### 1. The Evaluation Gap in Embodied Safety

Most embodied AI safety research evaluates whether an agent will *accept* a dangerous instruction. HomeSafe-Bench evaluates something different: whether a safety monitor can *intercept* a dangerous action that an agent has already begun. This distinction matters enormously in practice. An agent that refuses to "pour bleach into the toilet cleaner" at the instruction level but proceeds anyway if the task is framed as "clean the bathroom thoroughly" will not be caught by instruction-level safety filters — but would be caught by an action-level monitor operating on HomeSafe-Bench's criteria.

The benchmark thus addresses a failure mode that has been systematically underexamined: the gap between instruction-level alignment and action-level safety.

### 2. Real-Time Constraint as a Core Design Principle

HomeSafe-Bench is unusual among safety benchmarks in that it explicitly measures performance under latency constraints. An unsafe action detection system that achieves 90% accuracy with a 2-second response window is insufficient for interrupting many household hazards — a pot boiling over, a child reaching for a hot surface, an arm knocking an unstable stack. The benchmark includes a streaming evaluation mode that measures detection latency alongside accuracy, forcing models to make safety judgments on partial action sequences.

This is the right framing. Safety is not a post-hoc classification problem; it is a real-time intervention problem. Benchmarks that ignore latency systematically overestimate the practical safety of their evaluated systems.

### 3. Where Current VLMs Fall Short

The paper's evaluation of leading VLMs — including GPT-4o and Gemini-2.5-class models — reveals consistent failure patterns:

- **Incomplete action sequences fool the detector.** When an unsafe action is in progress but not yet visually unambiguous (e.g., a hand reaching toward a mixing container before chemicals are combined), models frequently fail to flag the precursor. They recognize the outcome as dangerous but cannot reason backwards from partial observations.
- **Context collapses under streaming pressure.** Models that perform well in offline evaluation — where they can attend to the full action trajectory — degrade significantly in streaming mode. The VLM's ability to reason over temporal context is not matched by its ability to maintain that context under frame-by-frame evaluation.
- **False negative clustering at action boundaries.** Unsafe actions are most likely to be missed at their very start — the moment when intervention would be most effective. This is the opposite of what a safety monitor needs.

### 4. HD-Guard's Contribution and Limits

The FastBrain/SlowBrain architecture measurably improves over single-model approaches on the benchmark's primary metrics. However, the paper is honest about the remaining gap: the FastBrain's recall, while high, is not high enough for household deployment with vulnerable occupants (children, elderly). A recall of 85% on unsafe action precursors means one in six dangerous sequences begins without a safety alert — unacceptable for consumer robotics.

The authors frame this as a benchmark contribution rather than a solved problem, which is the appropriate scientific stance. HD-Guard demonstrates that architectural choices matter; it does not claim to have solved real-time household safety monitoring.

---

### Failure-First Connections

- **Action-level vs. instruction-level safety:** HomeSafe-Bench makes precise the distinction our [FreezeVLA analysis](/daily-paper/2025-11-freezevla) touched on: safety measures at the language interface cannot substitute for safety measures at the action interface. The two failure modes are distinct and require distinct mitigations.
- **Streaming evaluation as the honest benchmark:** Our prior coverage of IS-Bench raised the issue that static evaluations miss dynamic risk. HomeSafe-Bench operationalizes this critique: the streaming evaluation mode is a methodological contribution as much as the dataset itself.
- **FastBrain/SlowBrain as a deployment pattern:** The dual-brain architecture offers a practical path for embodied systems that cannot run full VLM inference at frame rate. This pattern — cheap trigger, expensive confirm — will likely become standard in safety-critical robotics.

---

### Actionable Insights

#### For Embodied AI Developers
* **Add action-level safety monitors.** Instruction-level refusals are necessary but not sufficient. A streaming action monitor operating on visual inputs is a separate safety layer with different failure modes.
* **Benchmark under latency constraints.** Offline accuracy does not predict streaming performance. Include response latency as a primary evaluation metric alongside precision and recall.

#### For Safety Researchers
* **Focus on action precursors, not completed actions.** The safety-relevant window is the first 20–30% of an unsafe action sequence, before consequences are irreversible. Current models are weakest here; this is where research attention should concentrate.
* **Use HomeSafe-Bench's streaming evaluation mode.** It is a more honest test of real-world deployability than offline classification accuracy.

#### For Deployment Teams
* **Treat 85% recall as unacceptable for household settings with vulnerable occupants.** Calibrate your risk tolerance against the base rate of unsafe actions in your deployment context. For domestic robots operating near children or elderly users, the bar is higher than current state-of-the-art.

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2603.11975) · [PDF](https://arxiv.org/pdf/2603.11975.pdf)*
