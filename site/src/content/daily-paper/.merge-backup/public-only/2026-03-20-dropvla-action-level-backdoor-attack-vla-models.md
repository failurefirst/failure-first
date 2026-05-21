---
title: "DropVLA: An Action-Level Backdoor Attack on Vision-Language-Action Models"
description: "Demonstrates that VLA models can be backdoored at the action primitive level with as little as 0.31% poisoned episodes, achieving 98-99% attack success while preserving clean task performance."
date: 2026-03-20
arxiv: "2510.10932"
authors: "Zonghuan Xu, Jiayu Li, Yunhan Zhao, Xiang Zheng, Xingjun Ma, Yu-Gang Jiang"
paperType: "empirical"
tags: ["backdoor-attacks", "vision-language-action", "data-poisoning", "robotic-manipulation", "adversarial-ml"]
audio: "https://cdn.failurefirst.org/audio/daily-paper/2510.10932-audio-overview.m4a"
draft: false
---

# DropVLA: An Action-Level Backdoor Attack on Vision-Language-Action Models

**Focus:** Xu et al. present a backdoor attack methodology that targets individual action primitives within Vision-Language-Action models, demonstrating that an adversary can implant hidden triggers during training that cause specific unintended robotic actions at precise decision points while the model otherwise performs normally on clean tasks.

---

### Key Insights

- **Action-level granularity is the critical innovation.** Unlike prior backdoor work that targets entire task outcomes, DropVLA poisons individual action primitives at specific timesteps. This means a robot might perform 99% of a task correctly before executing a single compromised action, such as releasing a held object at the wrong moment or applying force in an unintended direction. The granularity makes detection through task-level monitoring extremely difficult.

- **Minimal poisoning achieves near-perfect attack success.** Testing on OpenVLA-7B shows that vision-only poisoning with just 0.31% of training episodes compromised achieves attack success rates between 98.67% and 99.83%. Clean task performance remains at 98.50%-99.17%, meaning standard evaluation benchmarks would not flag the compromised model. This poisoning ratio is well within the range of realistic supply chain attacks on training data.

- **Window-consistent relabeling enables stable triggers.** The authors introduce a technique that ensures consistent relabeling across temporal windows during fine-tuning, which stabilizes the backdoor implantation. The targeted action executes within 25 control steps at 500 Hz, giving the attack precise temporal control over when the malicious behavior manifests.

- **Vision triggers outperform text triggers at low poisoning rates.** While both modalities can serve as trigger channels, text-only triggers show instability at low poisoning levels. This asymmetry suggests that the visual pathway in VLA models may be more susceptible to backdoor implantation, possibly because visual features provide richer embedding space for hiding trigger patterns.

- **Cross-suite transfer demonstrates generalization.** The backdoor transfers across evaluation suites with 96.27% and 99.09% success rates, and physical-world validation on a 7-DoF robotic arm confirms feasibility despite real-world challenges like camera motion and lighting variation.

### Failure-First Relevance

DropVLA represents a particularly concerning attack class for embodied AI safety because it operates at the granularity where safety monitoring is weakest. Our failure taxonomy identifies action-level compromise as distinct from task-level or policy-level attacks: the system appears to function correctly under all standard evaluations, and the failure manifests only when the trigger condition is met during deployment. The 0.31% poisoning threshold is especially alarming in the context of crowdsourced training data collection, where adversarial contributors could inject poisoned demonstrations at rates far below any practical auditing threshold. The physical-world validation closes the sim-to-real gap that often serves as an implicit defense, confirming that these attacks are not merely theoretical artifacts of simulation environments.

### Open Questions

- Can runtime action monitoring detect the single-step deviations that DropVLA produces, given that the compromised action occurs within a window of otherwise normal behavior?

- How do different VLA architectures (beyond OpenVLA-7B) respond to action-level poisoning, and does model scale affect susceptibility?

- What defenses from the backdoor detection literature in classification models transfer to the action-prediction setting, where outputs are continuous control signals rather than discrete labels?

---

*Read the [full paper on arXiv](https://arxiv.org/abs/2510.10932) · [PDF](https://arxiv.org/pdf/2510.10932.pdf)*
