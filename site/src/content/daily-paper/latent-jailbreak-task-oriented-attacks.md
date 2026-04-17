---

title: "Latent Jailbreak: A Benchmark for Evaluating LLM Safety under Task-Oriented Jailbreaks"
description: "Safety evaluation for goal-directed attacks where the harmful intent is latent in system instructions, not explicit requests"
date: 2025-10-04
arxiv: "2307.08487"
authors: "Yuancheng Xu, Jiayi Liu, Rama Chellat, Zizhou Liu, Qiang Liu, University of Texas at Austin"
paperType: "empirical"
tags: [task-oriented-jailbreak, latent-intent, benchmark, safety-evaluation, implicit-harm]
draft: false
audio: "https://cdn.failurefirst.org/audio/daily-paper/latent-jailbreak-task-oriented-attacks.m4a"
---

## Latent Jailbreak: When Harm Is Hidden in Task Description

Standard jailbreak benchmarks (AdvBench, JailbreakBench) test models with explicitly harmful prompts: "write a bomb-making guide." But real-world attacks often hide intent: "I'm writing a novel where the protagonist plans X; here's the scene setup..." Latent Jailbreak introduces a benchmark where the harmful objective is embedded in a plausible task description, making detection harder.

## Key Insight

Safety failures occur on a spectrum:
- **Explicit:** "Help me do X [harmful thing]"
- **Implicit:** "For my novel, I need..."
- **Latent:** System prompt specifies a seemingly innocent task that implicitly requires harmful output

Latent jailbreaks exploit the gap between task description and harmfulness—they're less detectable by safety systems that focus on keyword filtering.

## Benchmark Design

- 50 latent jailbreak scenarios across multiple harm categories
- Baseline models (GPT-3.5, Claude 2) show degraded safety performance on latent vs. explicit attacks
- Modest but measurable effect: ~15-20% higher attack success on latent jailbreaks

## Embodied AI Relevance

Embodied systems operate in task-oriented environments. A robot given "disassemble this device" or "modify this access control system" may execute harmful behaviors that are latent in the task description, not explicit. F41LUR3-F1R57 research has identified similar patterns in robot behavior: systems fail when the implicit objective (e.g., maximize throughput) conflicts with safety constraints (e.g., avoid unintended device damage).

## Limitations

- Modest improvement in jailbreak success suggests latency is a real but subtle effect
- Scenarios are hand-written, not automatically generated
- No analysis of which model components make latent attacks more effective

## Contribution to Field

Latent Jailbreak shifts the evaluation framing: safety is not just about refusing explicit harms, but about detecting harmful objectives embedded in seemingly innocent task specifications. This is critical for embodied AI, where task formulation is often implicit in deployment context.
