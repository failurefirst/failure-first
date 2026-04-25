---
title: "FailSafe: Reasoning and Recovery from Failures in Vision-Language-Action Models"
description: "FailSafe introduces a scalable failure generation and recovery system that automatically creates diverse failure cases with executable recovery actions, boosting VLA manipulation success by up to 22.6%."
date: 2026-04-25
arxiv: "2510.01642"
authors: "Zijun Lin, Jiafei Duan, Haoquan Fang, Dieter Fox, Ranjay Krishna, Cheston Tan, Bihan Wen"
paperType: "empirical"
tags: [vla-models, failure-detection, failure-recovery, robotic-manipulation, embodied-ai-safety, data-augmentation]
draft: false
---

When a Vision-Language-Action (VLA) model controlling a robotic arm misses a grasp or knocks an object out of reach, what happens next? In practice, the robot stalls or produces meaningless motor commands — because virtually every VLA training corpus is built from *successful* demonstrations. The model has never seen failure, so it has no strategy for escaping one. FailSafe confronts this gap head-on: rather than hoping failures are rare, it systematically generates them and teaches the robot to reason its way out.

### The Missing Half of Robot Training Data

State-of-the-art VLAs — OpenVLA, pi0-FAST, OpenVLA-OFT — achieve impressive results on benchmark tasks, but those benchmarks measure performance on cleanly executed trials. Real deployment is messier. Objects slip, grasps fail mid-trajectory, and unexpected obstacles appear. The small number of existing failure-aware datasets either simulate failure procedurally (producing unrealistic states) or provide only textual explanations that VLA models cannot directly execute.

FailSafe's key insight is that failure data needs two properties to be useful: *diversity* (covering the many ways a task can go wrong) and *executability* (paired with concrete recovery actions the robot can take, not just natural language descriptions). Neither property is optional — without diversity, the model only learns to recover from the failures it has seen; without executability, the failure awareness stays trapped in the language modality and cannot drive the controller.

### How FailSafe Works

The system has two components: a **failure generator** and a **recovery actor**.

The failure generator takes any manipulation task in any physics simulator and programmatically perturbs it — introducing slips, early releases, misalignments, and other state corruptions mid-trajectory. Crucially, these perturbations are applied at varied points along the task timeline and at varied magnitudes, so the resulting failure library is genuinely diverse rather than a handful of hand-authored edge cases. Because FailSafe operates at the simulator level, it can be applied to any existing task without task-specific engineering.

The recovery actor is a fine-tuned LLaVA-OneVision-7B (FailSafe-VLM). It receives the perturbed visual state along with the original task instruction and must output a recovery action sequence that restores the robot to a recoverable configuration. The training signal comes from automatically labeled recovery demonstrations: for each generated failure, the simulator's ground-truth state is used to compute a minimal corrective trajectory, giving the model a supervision target grounded in physical feasibility.

At inference time, FailSafe-VLM is inserted as an interleaved monitor within the base VLA's execution loop. When FailSafe-VLM detects an anomalous state, it takes over, executes recovery actions, and then returns control to the base policy. The coupling is modular — no changes to the base VLA are required.

### Results and Generalization

Testing on the ManiSkill simulator, FailSafe-VLM improves average task success rates across three VLA models:

- **pi0-FAST**: +22.6% on average across evaluated tasks
- **OpenVLA**: meaningful improvements across spatial manipulation tasks
- **OpenVLA-OFT**: consistent gains on contact-rich tasks

Beyond aggregate performance, the paper tests FailSafe-VLM's generalization across three axes of variation: different spatial configurations of the same task, different camera viewpoints, and different object and robot embodiments. The model transfers reasonably well across all three, suggesting that the recovery capability is learning something about failure structure rather than memorizing specific visual patterns.

### Implications for Embodied AI Safety

FailSafe represents a shift in how safety-relevant behavior is instilled in VLA systems. Most current approaches focus on preventing unsafe states *before they occur* — through constrained training objectives, safety layers, or conservative action selection. FailSafe's contribution is orthogonal: it asks what happens *after* something goes wrong, treating recovery as a first-class capability rather than an afterthought.

This matters for failure-mode analysis in deployed systems. A robot that can detect and recover from manipulation failures is meaningfully safer than one that cannot, even if both have identical nominal performance. Failures will occur in open-world deployment; the question is whether they cascade into larger incidents or are contained at the moment they appear.

The data generation pipeline is also noteworthy from a safety engineering perspective. By making failure diversity a design parameter rather than a byproduct of luck, FailSafe gives practitioners a lever to explicitly target underrepresented failure modes — analogous to adversarial data augmentation in the computer vision literature, but applied to the temporal structure of robot trajectories.

### Limitations and Open Questions

The current system is validated in simulation (ManiSkill) rather than real hardware, which raises the standard sim-to-real transfer concerns. Recovery actions derived from ground-truth simulator states may not be realizable in the presence of physical noise, sensor delay, or contact dynamics that the simulator approximates imperfectly. The paper notes plans to release code, which will allow the community to probe these limits.

There is also a question of failure taxonomy: FailSafe generates failure diversity by parametric perturbation, but some failure modes — particularly those arising from novel objects or out-of-distribution task specifications — may not be well-represented by this generation process. Extending the failure generator to include semantic failures (misunderstanding the instruction rather than failing in execution) would be a natural next step.

*Read the [full paper on arXiv](https://arxiv.org/abs/2510.01642) · [PDF](https://arxiv.org/pdf/2510.01642.pdf)*
