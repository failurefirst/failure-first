---
title: "ROBOGATE: Adaptive Failure Discovery for Safe Robot Policy Deployment via Two-Stage Boundary-Focused Sampling"
description: "A physics-simulation framework that maps failure boundaries across robot manipulation parameter spaces, exposing a 100-point performance gap between VLA foundation models and scripted baselines on adversarial scenarios."
date: 2026-05-05
arxiv: "2603.22126"
authors: "Byungjin Kim"
paperType: "empirical"
tags: [vla-safety, robot-manipulation, failure-detection, deployment-risk, adversarial-evaluation]
draft: false
---

Before a learned robot policy leaves the lab, how confident can an engineer be that it won't fail in the corner of the parameter space they forgot to test? That question sits at the heart of ROBOGATE, a pre-deployment risk management framework that treats failure discovery as a sampling problem — one that can be solved efficiently without exhaustive grid search across intractably high-dimensional environments.

### The Validation Gap in Robotics Deployment

Industrial deployment of robot manipulation policies faces a structural challenge: the operational parameter space (object poses, friction coefficients, lighting, approach angles, gripper compliance) is high-dimensional and continuous, yet testing budgets are finite. Current practice either relies on a modest held-out test set — which may miss systematic failure modes — or on informal "it works in the lab" heuristics. Neither provides the kind of certified safety margins that industrial settings demand.

ROBOGATE addresses this by framing pre-deployment testing as adaptive boundary mapping: rather than spreading test effort uniformly, concentrate it where a policy transitions from succeeding to failing.

### Two-Stage Adaptive Sampling

The framework operates in two stages over 30,000 total simulation runs using NVIDIA Isaac Sim with Newton physics, evaluating policies on Franka Panda (7-DOF) and UR5e (6-DOF) robot platforms.

**Stage 1** uses Latin Hypercube Sampling (LHS) across an 8-dimensional parameter space to establish a coarse failure landscape from 20,000 uniformly distributed experiments. LHS ensures coverage of the full parameter volume without redundant clustering, giving an unbiased first picture of where failures cluster.

**Stage 2** then applies boundary-focused sampling: 10,000 additional experiments are concentrated in the 30–70% success-rate transition zone identified by Stage 1. This is where failure boundaries live — the ridge between reliably succeeding and reliably failing configurations. Focusing sampling effort here enables a logistic regression risk model to fit a precise, closed-form failure boundary equation rather than a blurry average over the whole space.

The resulting model achieves an AUC of 0.780 on the combined dataset (vs. 0.754 for Stage 1 alone), and identifies four universal danger zones that affect both robot platforms — regions of parameter space that no policy should be sent into without additional hardening.

### The VLA Stress Test: A 100-Point Gap

Perhaps the most striking finding comes from the paper's extension to VLA evaluation. When ROBOGATE's adversarial scenario battery is applied to Octo-Small — a recent open-source Vision-Language-Action foundation model — the results are stark: **0% success rate across 68 adversarial scenarios, versus 100% for the scripted pick-and-place baseline**.

This 100-point gap is not a marginal edge-case finding. It directly challenges the narrative that VLA models, trained on large diverse datasets, should generalize robustly to unseen conditions. Instead, the adversarial parameter configurations that ROBOGATE systematically generates are precisely the kind of out-of-distribution inputs that expose brittleness in learned policies.

For the embodied AI safety community, this is a key empirical data point: **zero-shot generalization from pre-training does not imply robustness to adversarially selected deployment conditions**. Foundation models for robotics may be highly capable within their training distribution while remaining catastrophically vulnerable at distribution boundaries — boundaries that ROBOGATE is designed to find.

### Connecting to Embodied AI Safety

The paper's framing resonates with a core concern in embodied AI safety: the difference between average-case and worst-case performance. A robot policy that succeeds 95% of the time on a random test set may fail 100% of the time on the 5% of conditions that matter most — unusual object orientations, slippery surfaces, or adversarially positioned obstacles.

ROBOGATE operationalizes worst-case testing as a methodology. Its boundary-focused sampling is essentially a low-cost adversarial search: find the conditions where the policy is most uncertain, then probe them hard. The four universal danger zones it identifies across both robot platforms suggest that certain structural failure modes — likely related to kinematic limits and grasp geometry — transcend specific policy implementations.

The framework's open-source release on a single GPU workstation also democratizes rigorous pre-deployment testing. Safety-conscious teams no longer need enterprise simulation infrastructure to discover whether their manipulation policy has a systematic blind spot.

### Limitations and Future Directions

The current implementation uses a logistic regression risk model, which assumes a smooth, linearly separable failure boundary in the transformed feature space. Real failure landscapes may be more complex — multimodal or fractal in structure — suggesting that future work could apply Gaussian process models or neural classifiers to the boundary-mapping problem. Additionally, the 8-dimensional parameter space, while representative, doesn't capture all real-world variability (lighting, occlusion, deformable objects). Scaling the framework to higher-dimensional spaces while maintaining sample efficiency remains an open challenge.

Nonetheless, ROBOGATE represents a meaningful step toward rigorous, scalable pre-deployment safety validation for robot policies — and its VLA stress test results offer a sobering benchmark for the field.

*Read the [full paper on arXiv](https://arxiv.org/abs/2603.22126) · [PDF](https://arxiv.org/pdf/2603.22126.pdf)*
