---
title: "ANNIE: Be Careful of Your Robots — Adversarial Safety Attacks on Embodied AI"
description: "A systematic study of adversarial safety attacks on VLA-powered robots using ISO-grounded safety taxonomies, achieving over 50% attack success rates across all safety categories."
date: 2026-04-05
arxiv: "2509.03383"
authors: "Yiyang Huang, Zixuan Wang, Zishen Wan, Yapeng Tian, Haobo Xu, Yinhe Han, Yiming Gan"
paperType: "empirical"
tags: [embodied-ai, adversarial-attacks, vla-models, robot-safety, red-teaming]
audio: "https://cdn.failurefirst.org/audio/daily-paper/2509.03383-audio-overview.m4a"
draft: false
---

As vision-language-action (VLA) models become the brains of physical robots, a disturbing question emerges: how easy is it to make a robot dangerously unsafe through adversarial image perturbations? The ANNIE paper delivers a sobering answer — frighteningly easy, and the threat is real enough to validate in physical robot experiments.

### Grounding Safety in Physical Reality

What sets ANNIE apart from prior adversarial ML work is its principled grounding in ISO/TS 15066, the international standard for human-robot collaboration. Rather than measuring attack success as a purely statistical metric divorced from real-world consequences, the authors construct a three-tier taxonomy:

- **Critical violations**: Robots wielding hazardous tools (knives, torches) failing to maintain required separation distances from humans
- **Dangerous violations**: Unsafe handovers involving speed violations or improper gripper states (e.g., passing hot liquids)
- **Risky violations**: Environmental collisions causing equipment damage without direct human harm

This grounding matters because it forces evaluation against the criteria that actual safety engineers care about, not proxies of convenience. It also means attack success has a concrete physical interpretation — not just "the model's output changed" but "the robot would injure a person."

### ANNIEBench and the ANNIE-Attack Framework

The authors introduce ANNIEBench, comprising nine safety-critical manipulation scenarios implemented in ManiSkill simulation with a Franka Emika Panda 7-DoF arm. The benchmark contains 2,400 video-action sequences across the safety violation categories, creating a structured evaluation corpus for adversarial robustness of physical AI systems.

The attack methodology, ANNIE-Attack, addresses a fundamental challenge that separates VLA adversarial attacks from image classification attacks: VLA models operate over sequences of frames and produce continuous action vectors, not class labels. Success isn't measured by misclassification but by whether physical safety constraints are violated over time.

To handle this, ANNIE-Attack employs an "Attack Leader Model" that decomposes high-level attack objectives into frame-level perturbation targets. Projected Gradient Descent (PGD) then optimizes adversarial image perturbations that, when fed to the VLA, steer action outputs toward safety violations. The framework is model-agnostic — it was evaluated on both ACT and Baku architectures.

### Attack Success Rates That Demand Attention

The headline numbers are troubling:

- **Critical violations**: 52% average attack success rate (ASR)
- **Dangerous violations**: 67% average ASR
- **Risky violations**: 50% average ASR

Beyond raw success, the authors demonstrate **adaptive sparse attacks** — a variant called Annie-ADAP that achieves perfect ASR (1.0) while attacking only every ~3 frames on average. This sparse strategy is more stealthy than perturbing every frame, since it produces smaller average perturbation magnitude across the video sequence. The implication: a deployed adversary wouldn't need to attack continuously; occasional, well-timed perturbations are sufficient.

A notable finding concerns model architecture. Baku exhibited 40% higher ASR than ACT but with greater action deviation. The authors trace this to normalization: Baku's Min-Max normalization amplifies perturbation effects more than ACT's Mean-Std approach. Architectural choices made for performance can create security differentials.

### From Simulation to Physical Robots

The transition from simulation to physical hardware is where many adversarial ML papers lose credibility. ANNIE doesn't. Physical experiments on a UR3 robotic arm validated the simulation findings. In 4 of 10 physical trials, the robot holding a knife was successfully induced to point toward and approach a nearby human — a concrete demonstration that these aren't merely academic attack vectors.

### Implications for Embodied AI Safety

ANNIE exposes a structural gap in how we currently think about VLA model safety. Standard adversarial training and robustness evaluation frameworks were built for static perception tasks. They don't account for:

1. **Temporal structure**: Attacks can be sparse and intermittent rather than constant
2. **Physical grounding**: Success metrics must reflect real harm, not statistical deviation
3. **Architecture sensitivity**: Normalization choices create security-relevant performance tradeoffs
4. **Deployment context**: ISO standards provide the right frame for what "unsafe" actually means

The arms race between VLA capability and VLA robustness is now open. ANNIE establishes the attacker's toolkit and the evaluation framework. The defensive side — adversarial training for sequential physical action, anomaly detection in robot trajectories, runtime monitoring against ISO safety constraints — remains largely underdeveloped. That gap is urgent to close as embodied AI deploys into environments with real humans.

*Read the [full paper on arXiv](https://arxiv.org/abs/2509.03383) · [PDF](https://arxiv.org/pdf/2509.03383.pdf)*
