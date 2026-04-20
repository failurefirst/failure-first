---
title: "DualTHOR: A Dual-Arm Humanoid Simulation Platform for Contingency-Aware Planning"
description: "A physics-based simulator for dual-arm humanoid robots introduces a contingency mechanism that deliberately injects low-level execution failures, revealing critical robustness gaps in current VLMs."
date: 2026-04-20
arxiv: "2506.16012"
authors: "Boyu Li, Siyuan He, Hang Xu, Haoqi Yuan, Yu Zang, Liwei Hu, Junpeng Yue, Zhenxiong Jiang"
paperType: "empirical"
tags: [embodied-ai, vla-models, simulation, failure-modes, contingency-planning, dual-arm-robotics, robustness-evaluation]
draft: false
---

One of the most uncomfortable truths in embodied AI safety is that most evaluation frameworks are designed to measure success, not failure. Benchmarks track task completion rates in clean simulation environments where grasps always land and physics behaves predictably. DualTHOR takes the opposite stance: it deliberately injects failures into the simulation loop and asks how well current Vision Language Models (VLMs) handle the mess that follows.

Built on an extended version of AI2-THOR, DualTHOR provides a physics-based simulation platform specifically designed for dual-arm humanoid robots—a morphology that is rapidly becoming the target architecture for general-purpose physical AI but has been systematically underrepresented in rigorous evaluation. The platform includes real-world robot assets, a task suite for dual-arm collaboration, and inverse kinematics solvers that must contend with the full complexity of humanoid joint constraints.

### The Contingency Mechanism

The safety-critical innovation in DualTHOR is what the authors call the *contingency mechanism*. Unlike standard robustness evaluations that perturb observations or inject noise into sensor readings, DualTHOR's contingencies operate at the execution layer through physics-based low-level simulation. A planned grasp fails because the physics engine introduces realistic contact dynamics that don't match the planner's predictions. A carefully coordinated two-arm lift goes wrong because one end loses its grip under simulated weight. These aren't hand-crafted adversarial scenarios—they emerge from the physics, which is precisely why they matter.

This distinction is critical for safety evaluation. Current VLM-based robot controllers operate at the level of language instructions and visual observations. They plan actions but delegate execution to lower-level controllers. When that execution layer encounters contingencies—and it will, constantly, in real-world deployment—the higher-level planner must detect the failure and adapt. DualTHOR creates a principled testbed for evaluating exactly this capacity, not just in controlled one-off experiments but systematically across a diverse task suite.

The evaluations paint a sobering picture. Current VLMs struggle significantly with dual-arm coordination and exhibit limited robustness when contingencies occur. The performance gap between clean-environment benchmarks and contingency-injected evaluation is substantial—which means the field has been measuring the wrong thing.

### Failure Modes as Safety Concerns

The failure modes that DualTHOR surfaces are not merely performance problems. Each maps directly onto a class of safety risk for physically deployed systems:

**Failure detection gaps**: If a VLM doesn't recognize that a grasp failed, it may proceed with subsequent steps that assume a held object—causing drops, collisions, or uncontrolled contact forces. In a household with fragile objects or human bystanders, this is a genuine hazard. DualTHOR makes this failure mode measurable and reproducible, a prerequisite for fixing it.

**Sequential brittleness and cascades**: Dual-arm manipulation involves tightly coupled action sequences where early failures propagate through the plan. An object set down in the wrong position invalidates subsequent grasps; a failed pour leads to spilled liquid that now becomes an obstacle. DualTHOR's task suite specifically targets these cascades, surfacing how a single contingency early in a long-horizon task can render the rest of the plan not just ineffective but actively unsafe.

**Robustness gaps versus generalization gaps**: The paper distinguishes between a model failing because it hasn't seen a task type before (generalization) and failing because a task it knows is disrupted mid-execution (robustness). Safety-critical deployment requires robustness, not just generalization. A VLM that can plan a table-setting task from scratch but cannot recover when a cup slips is not ready for real-world deployment.

### Sim-to-Real Transfer of Safety Properties

Most sim-to-real research focuses on transferring task performance—making models trained in simulation work in the physical world. DualTHOR reframes the question: can we also transfer *safety behaviors*? A model trained in a contingency-rich simulation should develop internal representations of failure states and recovery strategies that remain useful when physical reality introduces its own surprises.

This reframing connects to a broader thesis in embodied AI safety: that safety cannot be added after the fact through external monitors alone. It must be learned, and to be learned, it must be practiced. Simulation environments that systematically exclude failure modes will produce agents that have never had to reason about recovery—which makes them brittle by design.

The authors' finding that current VLMs "exhibit limited robustness in realistic environments with contingencies" is precisely the kind of honest evaluation that the field needs more of. DualTHOR provides the infrastructure to generate this evaluation at scale.

### Implications for VLA Safety Research

For researchers working on safety in VLA systems, DualTHOR offers several things at once: a benchmark that measures what actually matters for deployment, a training environment that practices contingency awareness, and a diagnostic tool for identifying the specific failure modes that current architectures handle poorly.

The dual-arm focus is also worth noting in the context of the broader AI safety landscape. Humanoid robots with two arms are increasingly the target morphology for general-purpose physical AI. Evaluation frameworks designed for single-arm manipulation or simplified robot morphologies will not catch the failure modes that emerge from coordinated bimanual tasks. Building the evaluation infrastructure now, before deployment scales up, is exactly the kind of proactive safety work that makes later disasters less likely.

*Read the [full paper on arXiv](https://arxiv.org/abs/2506.16012) · [PDF](https://arxiv.org/pdf/2506.16012.pdf)*
