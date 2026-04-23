---
title: "SafetyALFRED: Evaluating Safety-Conscious Planning of Multimodal Large Language Models"
description: "SafetyALFRED reveals a critical alignment gap in embodied AI: while multimodal LLMs can recognize kitchen hazards in QA settings, they largely fail to mitigate those same hazards when planning physical actions."
date: 2026-04-23
arxiv: "2604.19638"
authors: "Josue Torres-Fonseca, Naihao Deng, Yinpei Dai, Shane Storks, Yichi Zhang, Rada Mihalcea, Casey Kennington, Joyce Chai"
paperType: "empirical"
tags: [embodied-ai, safety-evaluation, multimodal-llm, household-robotics, hazard-recognition, embodied-planning]
draft: false
---

When we evaluate whether an AI is "safe," what exactly are we testing? A new benchmark from researchers at the University of Michigan and Boise State University exposes a troubling gap: multimodal large language models can *describe* danger with reasonable accuracy, but consistently fail to *avoid* it when they're the ones doing the acting.

### The Recognition-Action Gap in Embodied Safety

SafetyALFRED builds on the established ALFRED benchmark—an environment simulating a household robot navigating kitchens to complete tasks—but augments it with six categories of real-world kitchen hazards: electrical dangers, fire risks, slip hazards, toxic substance exposure, sharp object mishandling, and overheating scenarios.

The key experimental design separates two modes of evaluation. In the **QA mode**, models are shown a scene and asked to answer questions about potential hazards in a disembodied setting—similar to how many existing safety benchmarks work. In the **embodied planning mode**, models must recognize hazards *and* incorporate risk mitigation into an action sequence, verifying that corrective steps happen in the right procedural order.

Eleven state-of-the-art models were tested, drawn from the Qwen, Gemma, and Gemini families. The results confirm what failure-first analysis would predict: QA performance and embodied planning performance are not the same thing.

### What the Numbers Reveal

Models performed comparably well at hazard recognition in QA settings. But when asked to translate that awareness into corrective physical action, mitigation success rates dropped substantially—often by more than half. The paper reports that average mitigation success rates in embodied settings are "low in comparison" to QA performance, a finding the authors characterize as a "significant alignment gap."

This gap matters for a specific structural reason: in QA evaluation, a model only needs to label a risk. In embodied planning, it must:

1. Recognize the hazard *within* the context of a task
2. Decide to deviate from the primary task to address the hazard
3. Execute mitigation steps in the correct procedural order *before* proceeding

Failure can happen at any of these stages, and the benchmark is designed to distinguish between them. The process-oriented evaluation approach—verifying *when* mitigation actions occur relative to risk-prone steps, not merely *whether* they occur—is one of the paper's methodological contributions.

### Connection to Embodied AI Safety

This finding connects directly to a theme running through VLA safety research: **simulation-to-reality evaluation gaps**. Models like OpenVLA and RT-2 are evaluated on task success rates, but "success" in manipulation benchmarks rarely includes safety-aware planning as a first-class metric. SafetyALFRED demonstrates that adding safety awareness as a separate QA capability—the approach taken by many safety fine-tuning efforts—does not automatically translate into safe embodied behavior.

The paper also raises a pointed question about the current paradigm of "safety-aware chain-of-thought" prompting. Some models were prompted to reason explicitly about hazards before acting. This improved mitigation scores modestly but often came at the cost of task completion, suggesting a capability tradeoff that deserves deeper investigation before it reaches deployment.

For the embodied AI safety community, these results echo the warning embedded in SafeVLA and IS-Bench: static safety evaluations create a false sense of security. An agent that knows fire is dangerous in a quiz is not necessarily an agent that will turn off the stove before picking up a flammable object.

### Failure Modes Worth Watching

The benchmark reveals several recurring failure modes:

- **Procedural ordering errors**: Models mitigate hazards after they've already committed to risk-prone actions, rather than before.
- **Task priority dominance**: Models optimize for task completion at the expense of safety steps, especially under complex multi-step instructions.
- **Category-specific blindspots**: Certain hazard types—particularly toxic substance exposure and electrical dangers—showed lower recognition rates even in QA mode, suggesting capability gaps at the perception layer.

The inclusion of the Gemini-2.5 series is notable, as these represent some of the most capable multimodal models available. Even frontier models exhibited the alignment gap, ruling out the explanation that performance will simply improve with scale.

### Why This Matters

SafetyALFRED's open-source release—code and dataset on GitHub—means this benchmark can serve as a standard for tracking progress on embodied safety as new VLA architectures emerge. The paper's central argument, that the field needs "a paradigm shift toward benchmarks that prioritize corrective actions in embodied contexts," is well-supported by its empirical evidence.

For practitioners building household robots or autonomous agents operating in physical environments, this work provides a clear framework for the kind of safety evaluation that should accompany every deployment decision.

*Read the [full paper on arXiv](https://arxiv.org/abs/2604.19638) · [PDF](https://arxiv.org/pdf/2604.19638.pdf)*
