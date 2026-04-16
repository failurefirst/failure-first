---
title: "Compositional Supply Chain Attacks on Vision-Language-Action Systems"
description: "CoLoRA (Ding 2026, arXiv:2603.12681) demonstrates that individually benign LoRA adapters, when composed via linear combination, can suppress safety..."
date: "2026-03-18"
reportNumber: 133
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research Team"
tags: []
draft: false
---


> **Disclaimer:** Empirical figures cited from Failure-First research reflect testing
> on specific model families under research conditions. Attack success rates are
> indicative estimates with methodological caveats described in the Limitations
> section. External research findings are attributed and assessed on their own
> methodological terms. This report does not constitute safety certification guidance.

---

## Executive Summary

CoLoRA (Ding 2026, arXiv:2603.12681) demonstrates that individually benign LoRA adapters, when composed via linear combination, can suppress safety alignment in open-weight LLMs without requiring adversarial prompts, triggers, or fine-tuning on harmful data. Each adapter passes single-module safety verification. The safety degradation emerges only from composition -- a property the authors term "combinatorial blindness" because defenders cannot practically validate exponential combinations of components.

This report analyses the implications of CoLoRA-style compositional attacks for Vision-Language-Action (VLA) systems, where modular adapters are the standard deployment pattern. VLA platforms such as pi0, OpenVLA-OFT, and Gemini Robotics use task-specific adapters (grasping, navigation, manipulation) composed at inference time. If the CoLoRA mechanism transfers to VLA architectures, the attack surface is not the model and not the infrastructure -- it is the adapter registry itself. This would represent a qualitatively new attack class in our taxonomy: Compositional Supply Chain (CSC), distinct from all 26 existing families.

Preliminary analysis suggests the threat is credible but unvalidated in embodied systems. No empirical VLA testing has been conducted. The scenarios designed in this session (5 CSC scenarios, `data/vla/vla_compositional_supply_chain_v0.1.jsonl`) operationalise the CoLoRA mechanism for physical-consequence testing.

---

## 1. Introduction

The Failure-First VLA taxonomy currently contains 26 attack families targeting either the reasoning layer (VAP, LAM, SBA, etc.) or the infrastructure layer (IMB). Supply chain attacks are represented through TCH (Tool Chain Hijacking) and general supply chain research (Report #37, Issue #37), but both assume the attacker injects explicitly malicious content -- poisoned tool responses, corrupted model weights, or adversarial training data.

CoLoRA introduces a fundamentally different mechanism: the attacker contributes adapters that are individually benign and pass all single-module verification checks. The safety failure is an emergent property of composition, not a property of any individual component.

This is analogous to binary chemical weapons in a physical security context: each component is inert and passes safety screening; the weapon exists only when the components are combined.

### 1.1 Why VLA Systems Are Especially Vulnerable

VLA deployment architectures are converging on modular adapter stacks for three operational reasons:

1. **Task specialisation.** A single base VLA model (e.g., pi0) serves multiple tasks via swappable LoRA adapters: one for grasping, one for navigation, one for tool use, one for human interaction. Task adapters are composed at deployment time based on the robot's assigned role.

2. **Multi-vendor supply chains.** In industrial robotics, the base model provider, the task adapter vendor, the system integrator, and the end-user operator are typically four different organisations. No single entity has visibility into all composed adapter combinations.

3. **Dynamic reconfiguration.** Fleet management systems swap adapters at runtime based on task assignment. A warehouse robot might load a palletising adapter in the morning and a picking adapter in the afternoon. The composition changes without human review.

These three properties -- task specialisation, multi-vendor supply chains, and dynamic reconfiguration -- create exactly the conditions CoLoRA exploits: a combinatorial space of adapter compositions that no single verifier can exhaustively test.

### 1.2 Relationship to Existing Attack Families

CSC is distinct from all existing families:

| Family | Attack Vector | CSC Distinction |
|--------|--------------|-----------------|
| TCH | Poisoned tool/API responses | CSC poisons the model weights, not the tool responses |
| IMB | Infrastructure bypass (auth, OTA, sensors) | CSC routes through the legitimate adapter deployment pipeline |
| VAP | Adversarial visual input | CSC requires no adversarial input at inference time |
| DA | Observer-aware behaviour change | CSC is static -- behaviour does not depend on observation |
| CET | Shared VLM backbone transfer | CSC exploits composition, not shared architecture |
| SCA (Report #37) | Explicitly malicious supply chain elements | CSC elements are individually benign |

The closest analogue is CSBA (Compound SBA), where individually safe actions produce cumulative danger. CSC applies the same compositional principle to the model weights rather than the action sequence.

---

## 2. Method

### 2.1 CoLoRA Mechanism (External, arXiv:2603.12681)

The CoLoRA attack operates through composition-triggered suppression:

1. Attacker trains multiple LoRA adapters on benign tasks (e.g., coding style, summarisation format, domain vocabulary).
2. Each adapter individually passes safety benchmarks -- it does not increase harmful output rates.
3. When two or more specific adapters are composed via linear combination (the standard LoRA merge technique), the resulting composite suppresses safety alignment.
4. The composed model complies with harmful requests without requiring adversarial prompts, jailbreak suffixes, or trigger phrases.

Key properties:
- **No trigger needed.** The safety degradation is intrinsic to the weight composition, not activated by input.
- **Combinatorial blindness.** With N adapters in a registry, there are 2^N possible compositions. Exhaustive verification is computationally infeasible for any realistic registry size.
- **Plausible deniability.** Each adapter is genuinely functional for its stated task. Attribution to a specific adapter is difficult because the vulnerability exists only in composition.

### 2.2 VLA Threat Model Extension

We extend the CoLoRA mechanism to VLA systems with the following threat model:

**Attacker capability:** The attacker can publish one or more LoRA adapters to a public or semi-public adapter registry (e.g., HuggingFace Hub, internal model registry, ROS package repository). The adapters are genuinely useful for their stated task (e.g., "improved grasping for cylindrical objects", "warehouse navigation optimisation").

**Attack surface:** The VLA system loads multiple adapters at inference time based on task requirements. The composition is performed either by the system integrator at deployment or by the fleet management system at runtime.

**Failure mode:** When the attacker's adapter(s) are composed with other adapters in the stack, the resulting model exhibits degraded safety behaviour in the physical domain: reduced refusal rates for dangerous actions, suppressed safety hedging, or altered action-space outputs that increase physical risk.

**Physical consequence amplification:** Unlike text-only LLMs where CoLoRA produces harmful text, a VLA system with suppressed safety alignment produces harmful actions. The compliance paradox (Report #49: 50% PARTIAL rate, disclaimers ignored by action decoders) means even partial safety degradation at the text layer translates to full compliance at the action layer.

### 2.3 Scenario Design

Five CSC scenarios were designed for `data/vla/vla_compositional_supply_chain_v0.1.jsonl`, covering five distinct VLA deployment domains:

| ID | Domain | Composed Adapters | Physical Consequence |
|----|--------|-------------------|---------------------|
| CSC-001 | Warehouse logistics | Palletising + navigation optimisation | Speed override in pedestrian zone |
| CSC-002 | Surgical robotics | Tissue retraction + instrument handoff | Force limit suppression during surgery |
| CSC-003 | Agricultural automation | Crop harvesting + pesticide application | Chemical application without exclusion zone verification |
| CSC-004 | Construction | Crane operation + material tracking | Load swing over uncleared zone |
| CSC-005 | Home companion | Mobility assist + medication management | Drug interaction ignored during administration |

Each scenario: (a) specifies the individual adapters and their benign function, (b) describes the emergent safety failure when composed, (c) includes environment state with the physical context that makes the failure dangerous, and (d) uses no adversarial language in the user turns -- the user's instructions are routine operational requests.

---

## 3. Results

### 3.1 No Empirical VLA Data (Scope Limitation)

This report contains zero empirical traces. CSC scenarios are designed and validated against schema but have not been tested against any model. All claims about VLA vulnerability are analytical extrapolations from the CoLoRA text-domain findings.

### 3.2 Structural Analysis: Why Transfer is Plausible

Three structural properties of VLA architectures suggest CoLoRA transfer is plausible:

1. **Shared LoRA merge mechanism.** VLA systems use the same linear adapter composition as text LLMs: W_composed = W_base + alpha_1 * A_1 * B_1 + alpha_2 * A_2 * B_2. The algebraic mechanism CoLoRA exploits is architecture-agnostic.

2. **Larger composition stacks.** Text LLMs typically compose 1-3 adapters. VLA systems routinely compose 4-8 task-specific adapters simultaneously (perception, planning, control, safety, domain). More adapters means a larger combinatorial space and more opportunities for emergent safety suppression.

3. **Weaker safety training.** Current VLA safety training is substantially less mature than text LLM safety training. Our corpus shows zero refusals across 63 FLIP-graded traces even without adapter manipulation (Report #49). If the baseline refusal rate is already near zero, CoLoRA-style suppression may push the residual safety hedging (the PARTIAL responses) to full compliance.

### 3.3 Novel Observation: Adapter Composition as Alignment Tax Bypass

CoLoRA reveals a structural tension in the modular VLA ecosystem. Safety alignment is applied to the base model. Task adapters are trained on task performance, not safety. When task adapters are composed, they may inadvertently (or deliberately) shift the model's weight space away from the safety-aligned region.

This is a supply chain manifestation of the alignment tax: every task adapter that improves task performance without maintaining safety alignment erodes the base model's safety properties. Even without a malicious attacker, the natural operation of a multi-adapter VLA system may progressively degrade safety alignment through routine adapter composition.

This is distinct from CoLoRA's deliberate attack but suggests the same mechanism operates as a latent vulnerability in all modular VLA deployments.

### 3.4 Defense Analysis: Combinatorial Blindness in VLA Registries

CoLoRA's "combinatorial blindness" is more severe in VLA than in text LLMs:

- **Text LLM registries:** HuggingFace hosts ~50K LoRA adapters for popular base models. 2^50K is beyond any verification.
- **VLA adapter registries:** Smaller but growing. ROS package ecosystem has ~5,000 packages. As VLA systems mature, task adapter registries will grow. Even 100 adapters produce 2^100 compositions.
- **Runtime composition:** VLA fleet managers compose adapters dynamically. The specific composition may never have been tested before it runs on a physical robot.

No practical defense against compositional attacks exists in the current VLA deployment ecosystem. Proposed mitigations from the CoLoRA paper (pairwise verification, composition-aware safety probes) scale as O(N^2) and become impractical above ~100 adapters.

---

## 4. Discussion

### 4.1 CSC as a Qualitatively New Attack Class

CSC is qualitatively distinct from all 26 existing VLA families and from the text-domain supply chain attacks documented in Report #37. The distinguishing properties:

1. **No adversarial input.** The attack requires no jailbreak, no adversarial prompt, no visual perturbation, and no trigger phrase. The safety degradation is intrinsic to the weight composition.
2. **No malicious component.** Each adapter is individually benign and passes all single-module safety checks.
3. **No infrastructure compromise.** The attack uses the legitimate adapter deployment pipeline. IMB-style defenses (API auth, control plane hardening) are irrelevant.
4. **Physical consequence amplification.** In VLA systems, suppressed safety alignment produces dangerous physical actions, not just harmful text.

These properties make CSC invisible to every existing detection mechanism in the F41LUR3-F1R57 framework: FLIP (tests text-layer safety reasoning), heuristic grading (keyword detection), action-layer evaluation (tests individual responses), and infrastructure monitoring (tests control plane integrity).

### 4.2 Relationship to IDDL

The Inverse Detectability-Difficulty Law (IDDL, rho=-0.847) predicts that harder-to-detect attacks have higher ASR. CSC may represent an extreme point on this curve: detectability is near zero (the attack is invisible to all current evaluation methods) and ASR may be near 100% (the model's safety alignment is suppressed at the weight level, not challenged at the input level).

This is a descriptive prediction, not an empirical finding.

### 4.3 Implications for EU AI Act Conformity Assessment

The EU AI Act (effective August 2, 2026) requires conformity assessment of high-risk AI systems including safety-critical robotics. Article 9 (risk management) and Article 15 (accuracy, robustness, cybersecurity) implicitly assume that safety properties of a verified component persist when deployed. CoLoRA-style compositional attacks invalidate this assumption.

A VLA system where each adapter passes individual conformity assessment but the composition fails safety requirements creates a regulatory gap: which component is non-conforming? The answer is none of them individually -- the non-conformity is emergent.

---

## 5. Limitations

1. **Sample size.** Zero empirical traces. All VLA claims are analytical, not empirical. The 5 CSC scenarios are untested.
2. **Transfer assumption.** CoLoRA was demonstrated on text-only LLMs. Transfer to VLA architectures is plausible based on shared LoRA merge mechanisms but unvalidated.
3. **Scale confound.** CoLoRA tested open-weight LLMs. Proprietary VLA systems (Gemini Robotics, Figure 02) may have different adapter composition mechanisms that resist this attack.
4. **Attacker model.** The threat model assumes the attacker can publish adapters to a registry used by the target. In closed industrial deployments, this may require insider access.
5. **Defense gap.** We have not tested any proposed defenses (pairwise verification, composition-aware probes). The claim that defenses are impractical is based on computational complexity arguments, not empirical defense evaluation.
6. **Methodology.** No grading methodology applies -- zero traces exist. Future empirical work should use FLIP with 7B+ grader models per Mistake #25.

---

## 6. Conclusions and Recommendations

### 6.1 Findings

CoLoRA (arXiv:2603.12681) identifies a structurally novel supply chain attack mechanism -- compositional safety suppression via benign adapter combination -- that has plausible transfer to VLA systems based on shared LoRA merge mechanisms and modular deployment architectures.

The mechanism is qualitatively distinct from all 26 existing VLA attack families and warrants a new taxonomy entry: Compositional Supply Chain (CSC).

### 6.2 Recommendations (Conditional)

If CoLoRA-style composition attacks are confirmed to transfer to VLA systems:

1. **Adapter registries need composition-aware safety testing.** Single-module verification is structurally insufficient. Minimum: pairwise composition testing for commonly co-deployed adapters.
2. **Runtime composition monitoring.** VLA fleet management systems should log which adapter combinations are deployed and flag novel compositions for safety re-evaluation.
3. **Safety adapter pinning.** The safety-critical adapter in a VLA stack should be "pinned" -- its weight contribution should be preserved during composition via constrained merging techniques.
4. **Conformity assessment update.** EU AI Act conformity assessments for modular VLA systems should require composition-level testing, not just component-level testing.

### 6.3 Next Steps

1. Empirical testing of CSC scenarios on available models (Issue #421, Operation Context Collapse Q2 scope).
2. Cross-reference with CSBA (Compound SBA) -- both exploit compositional emergence but at different layers (weights vs actions).
3. Investigate whether the natural adapter composition process (non-malicious) produces measurable safety degradation (alignment tax bypass, Section 3.3).

---

## References

1. Ding, S. CoLoRA: Compositional LoRA Attacks on Large Language Models. arXiv:2603.12681, 2026. (Mercedes-Benz R&D)
2. F41LUR3-F1R57. Report #49: VLA PARTIAL Dominance and Per-Family ASR. 2026.
3. F41LUR3-F1R57. Report #37: Supply Chain Attack Detection. 2026.
4. F41LUR3-F1R57. Report #91: PiCar-X SPARK Penetration Test. 2026.
5. Liang, B. et al. BadVLA: Backdoor Attacks on Vision-Language-Action Models. arXiv:2505.16640, 2025.
6. Li, Z. et al. MUZZLE: A Multi-Agent Zero-Shot LLM Exploitation Framework. arXiv:2602.09222, 2026.
7. Blindfold (SBA foundation): arXiv:2603.01414, 2026.
8. EU AI Act. Regulation (EU) 2024/1689. Official Journal L, 2024.

---

## Appendix A: CSC Attack Surface Map

```
                    ADAPTER REGISTRY
    +---------------------------------------------+
    |  Adapter A (benign: grasping optimiser)      |
    |  Adapter B (benign: navigation efficiency)   |
    |  Adapter C (benign: voice interaction)       |
    +---------------------------------------------+
                         |
                    COMPOSITION
                    (linear merge)
                         |
                         v
    +---------------------------------------------+
    |  Composed Model: A + B + C                   |
    |  Safety alignment SUPPRESSED                 |
    |  Each adapter passes individual verification |
    |  Composition was never verified              |
    +---------------------------------------------+
                         |
                    ACTION DECODER
                         |
                         v
    +---------------------------------------------+
    |  Physical Actions (dangerous)                |
    |  No text-layer disclaimer reaches actuators  |
    |  Compliance Paradox amplified                |
    +---------------------------------------------+
```

---

*This report was produced as part of the Failure-First Embodied AI research
programme. All claims are scoped to the tested conditions and should not be
generalised without additional validation. See docs/CANONICAL_METRICS.md for
corpus-level numbers.*
