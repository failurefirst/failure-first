---
title: "Tex3D: Objects as Attack Surfaces via Adversarial 3D Textures for Vision-Language-Action Models"
description: "Adversarial 3D textures applied to physical objects cause manipulation-task failure rates of 96.7% across simulated and real robotic settings."
date: 2026-04-04
arxiv: "2604.01618"
authors: "Jiawei Chen, Simin Huang, Jiawei Du, Shuaihang Chen, Yu Tian, Mingjie Wei, Chao Yu, Zhaoxia Yin"
paperType: "empirical"
tags: [adversarial-attacks, vla-models, robotic-manipulation, 3d-textures, physical-world-attacks]
draft: false
---

Vision-Language-Action (VLA) models have become the backbone of a new generation of robotic manipulation systems. By grounding natural-language instructions in visual perception and mapping both into executable action sequences, they promise a long-awaited generalisation leap for robots operating in unstructured environments. But that same generality introduces a new category of attack surface that researchers are only beginning to map. Tex3D, from a team at East China Normal University, takes a decisive step into unexplored territory: rather than perturbing language prompts or 2-D image pixels, the authors weaponise the physical *texture* of objects that a robot must interact with.

### The Threat Model: From 2-D Pixels to 3-D Surfaces

Earlier adversarial work on VLAs focused on digital manipulations — imperceptible perturbations injected into camera frames, patch stickers taped over flat surfaces, or token-level attacks on the language stream. These attacks are useful for stress-testing in the lab, but they underestimate how a real-world adversary would operate. A determined attacker can repaint, re-wrap, or re-print the surface of any object a robot might encounter. Tex3D formalises this intuition by treating the entire 3-D texture of a manipulation target as a differentiable attack variable.

The framework optimises adversarial textures through a **dual-renderer alignment** strategy. A differentiable renderer computes gradients through the texture-to-pixel mapping under controlled lighting, while a non-differentiable physics-aware renderer enforces that the optimised pattern remains photorealistic enough to survive the sim-to-real transfer. This alignment closes the gap that historically allowed defences to exploit the "unrealistic" appearance of adversarial examples — the resulting textures look, to a human observer, like plausible painted or printed surfaces.

### Critical-Frame Prioritisation Across Viewpoints

A robot does not observe an object from a fixed camera; it sees it from dozens of angles as the end-effector moves through a grasp or placement trajectory. A texture that fools the network at the canonical front view might be harmless when seen from 30° to the left. Tex3D addresses this by weighting the optimisation loss toward **critical frames** — viewpoints that are most predictive of the downstream action output — sampled densely across the likely approach trajectory. This makes the attack robust to viewpoint diversity without requiring an exhaustive enumeration of all possible camera poses.

The practical implication for safety evaluation is sobering: a task-specific adversarial texture that is optimised for a particular grasp trajectory reliably transfers to new approach angles and, in physical robot experiments, to the real world. The authors report **task failure rates of 96.7%** across multiple tabletop manipulation scenarios — pick-and-place, stacking, and tool-use tasks — in both simulation and hardware.

### Failure Modes and Embodied AI Safety

Tex3D illuminates a class of failure modes that existing safety benchmarks largely ignore. Current VLA evaluation suites test for distributional robustness (novel objects, novel lighting) and for semantic generalisation (new task phrasings), but they do not systematically probe adversarial textures on interaction targets. The Tex3D results suggest that even well-performing VLAs trained on diverse simulation data are highly sensitive to optimised surface patterns.

This matters for deployment contexts where object appearance cannot be fully controlled — warehouse shelves restocked from untrusted suppliers, household environments where items are customised or relabelled, or industrial settings where an adversary might modify a component's finish. In each case, the robot's perceived semantics of the object can be silently redirected, causing it to drop, misplace, or otherwise fail at a manipulation task that it would otherwise execute reliably.

From an alignment perspective, the attack is particularly insidious because it does not require any access to the model weights or even the model architecture. An attacker who knows only the *task* the robot will perform, and who can observe the class of objects involved, can in principle generate a candidate texture and apply it physically. The attack is also persistent: unlike a patch that might be noticed and removed, a repainted or reprinted surface is difficult to distinguish from normal product variation.

### Implications for Evaluation and Defence

The paper stops short of proposing complete defences, but several threads emerge from the analysis. Adversarial training over textured objects in simulation is an obvious starting point, though the dual-renderer alignment result suggests that naive texture augmentation may be insufficient. Defences that monitor the consistency of predicted action distributions across synthetic viewpoint perturbations could flag anomalies at inference time. At the policy level, uncertainty-aware action abstention — refusing to act when visual features are anomalous — could reduce the blast radius of successful texture attacks.

For the broader AI safety community, Tex3D is a reminder that the threat surface for deployed embodied agents extends into the physical world in ways that purely digital adversarial research cannot capture. Evaluation frameworks for VLA safety need to include physical attack vectors, not just digital perturbations, if they are to give meaningful assurances about robustness in deployment.

*Read the [full paper on arXiv](https://arxiv.org/abs/2604.01618) · [PDF](https://arxiv.org/pdf/2604.01618.pdf)*
