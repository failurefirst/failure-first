---
title: "An Anatomy of Vision-Language-Action Models: From Modules to Milestones and Challenges"
description: "A structured survey that treats Safety as one of five foundational VLA challenges alongside Representation, Execution, Generalization, and Evaluation."
date: 2026-04-26
arxiv: "2512.11362"
authors: "Chao Xu, Suyu Zhang, Yang Liu, Baigui Sun, Weihong Chen, Bo Xu, Qi Liu, Juncheng Wang, et al."
paperType: "survey"
tags: [vla-models, embodied-ai, safety, robustness, survey, evaluation, generalization]
draft: false
---

When VLA models began scaling beyond research labs, the field faced a paradox: architectural capabilities advanced faster than our understanding of how these systems could fail. "An Anatomy of Vision-Language-Action Models" arrives to address that gap directly, organizing the messy landscape of VLA research into five interlocking challenge dimensions—and treating Safety not as an appendix but as one of the pillars on which everything else rests.

### A Structured Lens on a Moving Target

The paper's core contribution is architectural clarity. Rather than cataloguing papers chronologically or by model family, the authors structure the field around five fundamental challenges: **Representation** (how perceptual and semantic information is encoded), **Execution** (how high-level plans become low-level control), **Generalization** (how capabilities transfer across distributions), **Safety** (how trustworthy deployment is ensured), and **Dataset & Evaluation** (how progress is measured).

This anatomy mirrors what the authors call the "developmental roadmap of a generalist agent"—moving from the basic perception-action loop, through scaling, to trustworthy operation. For safety researchers, this framing is clarifying: it places safety squarely within the engineering substrate of VLA development, not above or outside it. A model that cannot represent its environment accurately cannot be made safe at the execution layer. A model that generalizes poorly will fail unpredictably in open-world settings in ways no safety constraint can anticipate.

### The Representation-Safety Connection

The survey's coverage of Representation challenges is particularly relevant for understanding adversarial vulnerability. VLAs inherit susceptibility from their vision encoders: small, human-imperceptible perturbations in visual inputs—adversarial patches, texture modifications, lighting changes—can cascade through the representation pipeline into substantially altered action outputs. The authors connect this to empirical findings across the attack literature, where physical-world perturbations alone are sufficient to achieve up to 100% task failure rates in robotic manipulation settings.

Critically, the survey notes that multimodal fusion introduces new attack surfaces not present in unimodal systems. When vision and language representations interact, cross-modal misalignment attacks can exploit inconsistencies between what the model sees and what it is instructed to do—a vulnerability that purely visual or purely linguistic safety measures cannot address individually.

### Generalization Failures Are Safety Failures

The survey's treatment of Generalization reveals a systematic challenge: models that fail silently under distribution shift are fundamentally unsafe, even if they pass all in-distribution benchmarks. Current Sim2Real transfer methods leave large gaps between laboratory-measured capabilities and real-world performance. These gaps manifest as unexpected failures when encountering novel objects, unfamiliar lighting, or atypical environmental configurations.

What makes this a safety concern is not merely that failures occur, but that they are difficult to predict or detect before they produce harm. The authors catalogue approaches—domain randomization, physics-grounded training, world models—but note that none yet provides the robustness guarantees needed for deployment in safety-critical environments. Graceful degradation under distribution shift is not a nice-to-have; it is a prerequisite for safe deployment.

### Execution Constraints at the Physical Interface

The Execution challenge section addresses what might be called the "last meter" problem in embodied AI safety: ensuring that even well-formed plans produce physically safe actions at the robot's mechanical interface. Long-horizon planning can succeed semantically—the model understands the goal and the steps—while producing geometrically dangerous actions: reaching trajectories that clip objects, forces that exceed safe limits, or interaction sequences that create collision risks downstream.

Control barrier functions and constraint layers (such as those deployed in the AEGIS/VLSA framework) appear in the survey as promising approaches, but the authors flag a fundamental limitation: hard constraints defined during design cannot anticipate the full distribution of states encountered in open-world deployment. The gap between what can be proven safe in simulation and what actually executes safely in the real world remains one of the field's most pressing open problems.

### Why Evaluation Is the Bottleneck

Perhaps the survey's most actionable observation for safety research is its diagnosis of evaluation infrastructure as the core bottleneck limiting progress. Current VLA benchmarks optimize for task completion rates under favorable conditions. They do not measure safety-relevant behaviors: graceful degradation under adversarial conditions, uncertainty calibration, or appropriate refusal of dangerous instructions.

Until the field develops evaluation protocols that measure what we actually care about—not just whether a task was completed, but whether it was completed *safely*—progress on the other four challenges is difficult to verify. The survey's call for a new generation of safety-aware benchmarks echoes urgently across the field and directly motivates benchmark efforts like IS-Bench, SafeAgentBench, and HomeSafe-Bench.

### Implications for Embodied AI Safety

This survey arrives as VLA models leave the lab and enter physical deployment in warehouses, hospitals, and homes. The anatomy it provides—five interlocking challenges where Safety sits alongside Representation, Execution, Generalization, and Evaluation—offers a useful framework for prioritizing where safety research can have the highest leverage.

The key takeaway: the Safety challenge cannot be addressed in isolation. Representation robustness, execution reliability, and evaluation validity are prerequisites for meaningful safety guarantees. Progress on each must be co-developed rather than addressed sequentially. A model that is "safe" only under the conditions it was trained on is not safe in the sense that matters for real-world embodied deployment.

*Read the [full paper on arXiv](https://arxiv.org/abs/2512.11362) · [PDF](https://arxiv.org/pdf/2512.11362.pdf)*
