---
title: "ProbeAct: Probe-Guided Training-Free Failure Recovery in Vision-Language-Action Models"
description: "A plug-and-play runtime safety net that detects grasp and placement failures in pre-trained VLA policies using a hidden-state probe, a kinematic state machine, and a Control Barrier Function filter — improving OpenVLA-OFT success on LIBERO-plus from 69.6% to 74.1% without touching the model's weights."
date: 2026-06-08
arxiv: "2606.09740"
authors: "Fan Zhang, Seongbin Park, Baharan Mirzasoleiman, Shariar Talebi, Nader Sehatbakhsh"
paperType: "methods"
tags: [vision-language-action-models,failure-resilience,runtime-monitoring,embodied-ai,robot-safety,uncertainty-quantification]
draft: false
image: "https://cdn.failurefirst.org/images/daily-paper/2026-06-08-probeact-probe-guided-training-free-failure-recovery-in-vision-language-action-models.png"
audio: "https://cdn.failurefirst.org/audio/daily-paper/2026-06-08-probeact-probe-guided-training-free-failure-recovery-in-vision-language-action-models.m4a"
---

Vision-language-action (VLA) models do well on language-conditioned manipulation inside their training distribution and then fall over when the world shifts slightly — a lighting change, a moved camera, a small difference in the initial state. ProbeAct takes the failure-first position seriously: instead of trying to retrain the policy to be more robust, it assumes the policy *will* fail and builds a runtime layer that catches and recovers from those failures without modifying the model at all.

### A training-free runtime intervention

ProbeAct is a plug-and-play loop that wraps a pre-trained VLA policy. It does not change weights, does not need extra demonstrations, and is described by the authors as orthogonal to existing training pipelines — it sits on top of whatever policy you already have. That framing matters for safety engineering: a recovery mechanism that requires no retraining can be applied to checkpoints that are already deployed.

### Three components

1. **A multi-target hidden-state probe.** A lightweight probe reads the VLA's intermediate features and predicts the 3D positions of task-relevant objects. For multi-object scenes it uses Hungarian-matched identity tracking to keep objects consistent across frames. The probe turns the model's own internal representations into a spatial estimate the rest of the system can act on.

2. **An object-agnostic kinematic state machine.** This component detects grasp, transport, and placement failures using only gripper-internal signals and end-effector kinematics — no object-specific tuning. It is the part that decides *that* something went wrong, from cheap signals the robot already produces.

3. **A hierarchical Control Barrier Function (CBF) filter.** Repeated-failure locations are encoded as soft safe-set constraints. The filter minimally corrects the VLA's actions to steer away from those locations while preserving baseline behaviour everywhere else — it intervenes only where it has evidence of trouble.

### Results

On the LIBERO-plus benchmark, ProbeAct acts as a universal safety net, improving the success rate of the OpenVLA-OFT model from **69.6% to 74.1%**, and the authors report broad applicability across both base and fine-tuned VLA policies. The gain is modest in absolute terms but comes from a layer that costs no retraining and leaves the underlying policy untouched.

### Why this matters for failure-first embodied AI

ProbeAct is a concrete instance of the recovery-as-evaluation-axis idea this project keeps returning to: the interesting question is not only whether a policy succeeds, but whether the surrounding system can detect a failure mid-task and correct it. A few details are worth flagging for our own work:

- **Detection from internal signals.** Using the policy's own hidden states as a spatial probe is a lightweight alternative to bolting on a separate perception stack, and it connects to our interest in whether a model's representations already "know" when it is failing.
- **CBF-based minimal correction.** Encoding failure locations as soft safe-set constraints and correcting actions only where needed is closely related to the kinematic-shield framing in our own HANSE Layer-4 prototype work — a runtime filter that constrains action rather than rewriting policy. ProbeAct is an independent, training-free point in that same design space.
- **Scope is grasp/placement failures, not adversarial attacks.** ProbeAct targets distribution-shift failures (lighting, viewpoint, initial state), not a malicious adversary. It is a robustness-and-recovery contribution, and pairing it with the trajectory-level *attack* work from the same week sketches both halves of the embodied-safety picture.

### Takeaways

- **Recovery without retraining.** A plug-and-play layer can raise success rates on a pre-trained VLA policy without touching its weights — useful for already-deployed checkpoints.
- **The model's hidden states are usable signal.** Probing intermediate features for object positions reframes failure detection as reading what the policy already encodes.
- **A runtime filter, not a new policy.** The CBF stage corrects minimally and preserves baseline behaviour, keeping the intervention conservative — the right posture for a safety net.

*Read the [full paper on arXiv](https://arxiv.org/abs/2606.09740) · [PDF](https://arxiv.org/pdf/2606.09740)*
