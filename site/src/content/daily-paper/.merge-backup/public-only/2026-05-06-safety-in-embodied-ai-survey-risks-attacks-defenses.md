---
title: "Safety in Embodied AI: A Survey of Risks, Attacks, and Defenses"
description: "A 400-paper synthesis mapping the full attack surface of embodied AI — from adversarial perception through jailbreak planning to hardware vulnerabilities — and the defenses available at each layer."
date: 2026-05-06
arxiv: "2605.02900"
authors: "Xiao Li, Xiang Zheng, Yifeng Gao, Xinyu Xia, Yixu Wang, Xin Wang, Ye Sun, Yunhan Zhao, Ming Wen, Jiayu Li, and others"
paperType: "survey"
tags: [embodied-ai-safety, adversarial-attacks, jailbreak, vla-systems, defenses, survey]
draft: false
---

When a language model generates harmful text, the damage is informational. When an embodied AI agent acts on a compromised plan, the damage can be physical. This asymmetry — between a harmful output and a harmful *action* — is what makes safety research in embodied AI qualitatively different from its digital counterpart, and it is exactly the asymmetry that this survey sets out to map.

### The Embodied Attack Surface Is Not One Surface

The paper's central contribution is a structured taxonomy that resists the temptation to reduce embodied AI safety to any single threat model. Instead, it traces the attack surface across the full agent pipeline: perception, cognition, planning, action execution, and human-agent interaction. Each layer has its own failure modes and its own window for defense.

At the **perception layer**, adversarial patches, cross-modal perturbation, and sensor spoofing can corrupt the sensory grounding on which everything downstream depends. The key finding here is that multimodal fusion introduces fragility that neither vision-only nor language-only defenses can address — an attacker who can craft a visual stimulus that looks benign to the visual encoder but shifts the semantic embedding in the language layer has bypassed two independent safety systems with a single adversarial object.

At the **planning and reasoning layer**, the paper confirms what recent jailbreak research has increasingly shown: even agents whose perception is intact can be redirected at the instruction level. Semantic jailbreaks that exploit the flexibility of natural language planning — the same flexibility that makes VLA models generally capable — create an irreversible commitment problem. Once a robot begins executing a compromised plan, mid-trajectory correction is both technically hard and mechanically risky.

The **action execution layer** introduces hardware-level vulnerabilities that have received almost no attention in the LLM safety literature: firmware injection, sensor output manipulation, and actuator control subversion. These are not theoretical. The paper documents multiple demonstrated attack chains that terminate at the physical system layer.

### 400 Papers, One Framework

What makes this survey operationally useful is the decision to organise all 400+ papers along **two timing axes**: when the attack occurs (training-time vs inference-time) and when the defense can be applied (training-time vs inference-time). The resulting 2×2 grid reveals a structural imbalance in the existing literature: the field has invested heavily in inference-time attack research but has comparatively neglected training-time defenses, especially data supply chain hardening.

Training-time threats — backdoor attacks embedded in demonstration data, poisoned preference datasets, compromised pre-training corpora — are particularly dangerous for embodied AI because robot manipulation policies are often fine-tuned on narrow proprietary demonstration sets with no adversarial vetting. A poisoned grasping demonstration is not detectable by the LLM safety evaluations currently in common use.

### The Failure-First Research Connection

From a failure-first perspective, this paper does something analytically valuable: it separates failures that are **structurally expected** from failures that are **contingent on design choices**. Fragile multimodal fusion is structurally expected given current VLA architectures — no amount of safety tuning on the language tower addresses sensor-level adversarial inputs. Jailbreak susceptibility at the planning layer is more contingent: it correlates with instruction-following capability in ways that suggest architectural interventions may be available.

The paper also surfaces a gap that maps directly to the failure-first research programme: the evaluation infrastructure for embodied AI safety is immature. Most papers evaluate on narrow simulation benchmarks that do not capture the long-horizon trajectory dynamics, the recovery behaviour, or the compounding failure modes that make real-world deployment risky. The survey's call for standardised evaluation frameworks echoes a finding we have documented independently across our VLA red-teaming work.

### Why This Survey Matters Now

The timing is deliberate. VLA models — the unified perception-language-action architectures — have moved from research to production deployment in the past 18 months. The safety literature has not kept pace. This paper is an attempt to close that gap by giving researchers and practitioners a common vocabulary, a structural map of the threat landscape, and an honest accounting of where defenses currently exist and where they do not.

*Read the [full paper on arXiv](https://arxiv.org/abs/2605.02900) · [PDF](https://arxiv.org/pdf/2605.02900.pdf)*
