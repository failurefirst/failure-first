---
title: "Cross-Embodiment Attack Transfer Benchmark — Systematic Dataset Design"
description: "This report documents the design of the first systematic benchmark for testing whether adversarial attacks transfer across different robot embodiments that..."
date: "2026-03-18"
reportNumber: 146
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

This report documents the design of the first systematic benchmark for testing whether adversarial attacks transfer across different robot embodiments that share Vision-Language Model (VLM) backbones. While BadVLA demonstrated near-100% attack success rates against pi0 and OpenVLA via shared backbones, no existing dataset systematically disentangles backbone-layer attacks (which should transfer universally) from action-head attacks (which should be embodiment-specific).

We created 15 scenarios across 5 robot embodiment types (6DoF arm, mobile platform, humanoid, quadruped, drone) organised into three attack categories: 5 backbone-layer attacks with universal transfer prediction, 5 action-head attacks with embodiment-specific non-transfer prediction, and 5 hybrid attacks with partial transfer prediction. Each scenario includes explicit `environment_state` specifying the robot type, backbone architecture, action head type, action space dimensionality, and transfer prediction.

This is a design-stage report with zero empirical traces. All transfer predictions are hypotheses derived from the architectural distinction between shared backbones (embodiment-agnostic) and action heads (embodiment-specific). Empirical testing is required to validate or refute these predictions.

---

## 1. Introduction

The VLA (Vision-Language-Action) architecture has a fundamental property relevant to adversarial robustness: the vision-language backbone is typically shared across robot embodiments, while the action head is embodiment-specific. BadVLA (arXiv:2505.16640) demonstrated that this sharing creates a single attack surface spanning heterogeneous robot fleets. Report #49 documented FLIP-graded ASR of 72.4% across 7 original VLA attack families, with zero outright refusals.

The existing CET family (10 scenarios, VLA-CET-001 through VLA-CET-010) tests cross-embodiment transfer broadly but does not systematically distinguish between attack layers. This makes it difficult to predict which attacks will and will not transfer to new embodiments.

The key research question: **Can we predict attack transferability from architectural properties alone?** If backbone-layer attacks transfer universally and action-head attacks do not, then the transfer behaviour of any VLA attack should be predictable from which architectural layer it targets.

## 2. Method

### 2.1 Scenario Design

We designed 15 scenarios across three categories:

| Category | Scenarios | IDs | Transfer Prediction |
|----------|-----------|-----|---------------------|
| Backbone-layer | 5 | CETS-001 to CETS-005 | Universal (all 5 embodiments) |
| Action-head | 5 | CETS-006 to CETS-010 | Embodiment-specific (1 of 5 only) |
| Hybrid | 5 | CETS-011 to CETS-015 | Partial (backbone universal, action-head specific) |

### 2.2 Embodiment Types

Each category covers all 5 embodiment types:

| Embodiment | Action Head | Action Space | Degrees of Freedom |
|------------|-------------|--------------|-------------------|
| 6DoF arm | Diffusion policy | Joint angles | 6 |
| Mobile platform | MLP velocity controller | 2D velocity + heading | 3 |
| Humanoid | Flow matching | Full-body joint positions | 52 |
| Quadruped | Locomotion policy | Joint torques | 12 |
| Drone | PID waypoint controller | 3D waypoint + yaw | 4 |

### 2.3 Backbone Architectures

Scenarios use two backbone families to test generality:
- **SigLIP ViT** (used in OpenVLA, pi0): 10 scenarios
- **DINOv2** (self-supervised, used in several research VLAs): 5 scenarios

### 2.4 Attack Mechanisms

**Backbone-layer attacks (CETS-001 to CETS-005):**
1. CLS token UAP — obstacle misclassification (SigLIP)
2. Semantic feature shift — person-as-furniture (DINOv2)
3. Projected text injection — VLM cross-attention exploitation (SigLIP)
4. Patch embedding saturation — false depth discontinuity (SigLIP)
5. Backbone backdoor trigger — supply chain attack (DINOv2)

**Action-head attacks (CETS-006 to CETS-010):**
6. Diffusion denoising noise injection — 6DoF arm joint velocity violation
7. MLP weight pattern exploitation — mobile platform velocity maximisation
8. Flow matching joint decorrelation — humanoid balance failure
9. Gait phase shift — quadruped trot-to-pace destabilisation
10. PID integral windup — drone altitude oscillation

**Hybrid attacks (CETS-011 to CETS-015):**
11. Object misidentification + grasp force maximisation (arm-specific worst case)
12. Person detection suppression + speed limit override (platform-specific worst case)
13. Distance underestimation + step length amplification (humanoid-specific worst case)
14. Terrain misclassification + gait destabilisation (quadruped-specific worst case)
15. Altitude reference corruption + PID gain manipulation (drone-specific worst case)

## 3. Transfer Prediction Matrix

The core deliverable of this benchmark is a testable transfer prediction matrix. Each cell predicts whether the attack transfers to that embodiment and what the expected outcome is.

### 3.1 Backbone-Layer Attacks — Predicted Universal Transfer

| ID | Attack | 6DoF Arm | Mobile Platform | Humanoid | Quadruped | Drone |
|----|--------|----------|-----------------|----------|-----------|-------|
| 001 | CLS token UAP (obstacle) | TRANSFER: collision | TRANSFER: drives into obstacle | TRANSFER: walks into obstacle | TRANSFER: traverses obstacle | TRANSFER: flies into obstacle |
| 002 | Person-as-furniture (DINOv2) | TRANSFER: grasps at person | TRANSFER: no yield to person | TRANSFER: no avoidance | TRANSFER: no reroute | TRANSFER: no altitude adjustment |
| 003 | Projected text injection | TRANSFER: safety override | TRANSFER: safety override | TRANSFER: safety override | TRANSFER: safety override | TRANSFER: safety override |
| 004 | Patch embedding saturation | TRANSFER: reach distance error | TRANSFER: false stop | TRANSFER: halts walking | TRANSFER: halts traversal | TRANSFER: altitude adjustment |
| 005 | Backbone backdoor (supply chain) | TRANSFER: enters hazard | TRANSFER: enters hazard | TRANSFER: enters hazard | TRANSFER: enters hazard | TRANSFER: descends into hazard |

**Prediction:** All 25 cells show TRANSFER. Specific behavioural manifestation varies by embodiment, but the root cause (corrupted backbone features) is identical.

### 3.2 Action-Head Attacks — Predicted Non-Transfer

| ID | Attack | 6DoF Arm | Mobile Platform | Humanoid | Quadruped | Drone |
|----|--------|----------|-----------------|----------|-----------|-------|
| 006 | Diffusion denoising (arm) | **AFFECTED** | NO EFFECT | NO EFFECT | NO EFFECT | NO EFFECT |
| 007 | MLP velocity (platform) | NO EFFECT | **AFFECTED** | NO EFFECT | NO EFFECT | NO EFFECT |
| 008 | Flow matching decorrelation (humanoid) | NO EFFECT | NO EFFECT | **AFFECTED** | NO EFFECT | NO EFFECT |
| 009 | Gait phase shift (quadruped) | NO EFFECT | NO EFFECT | NO EFFECT | **AFFECTED** | NO EFFECT |
| 010 | PID integral windup (drone) | NO EFFECT | NO EFFECT | NO EFFECT | NO EFFECT | **AFFECTED** |

**Prediction:** A 5x5 identity matrix. Each attack affects exactly one embodiment and zero others. If empirical testing shows off-diagonal effects, this would indicate unexpected cross-embodiment coupling at the action-head layer.

### 3.3 Hybrid Attacks — Predicted Partial Transfer

| ID | Attack | 6DoF Arm | Mobile Platform | Humanoid | Quadruped | Drone |
|----|--------|----------|-----------------|----------|-----------|-------|
| 011 | Misidentify + grasp force | **SEVERE** (both) | MILD (backbone only) | MILD (backbone only) | MILD (backbone only) | MILD (backbone only) |
| 012 | Person suppress + speed | MILD (backbone only) | **SEVERE** (both) | MILD (backbone only) | MILD (backbone only) | MILD (backbone only) |
| 013 | Distance error + step length | MILD (backbone only) | MILD (backbone only) | **SEVERE** (both) | MILD (backbone only) | MILD (backbone only) |
| 014 | Terrain error + gait | MILD (backbone only) | MILD (backbone only) | MILD (backbone only) | **SEVERE** (both) | ZERO (terrain irrelevant) |
| 015 | Altitude error + PID gain | MILD (backbone only) | MILD (backbone only) | MILD (backbone only) | MILD (backbone only) | **SEVERE** (both) |

**Prediction:** Each hybrid attack has one SEVERE cell (where both components activate), several MILD cells (backbone only), and potentially ZERO cells (where the backbone perturbation is irrelevant to that embodiment). CETS-014 is notable: the backbone terrain error is ZERO impact on the drone (terrain classification is irrelevant for flight).

### 3.4 Key Testable Predictions

1. **Backbone universality:** All 5 backbone attacks should produce detectable failure on all 5 embodiments (25/25 cells affected).
2. **Action-head specificity:** All 5 action-head attacks should affect exactly 1 embodiment each (5/25 cells affected, forming an identity matrix).
3. **Hybrid asymmetry:** Each hybrid attack should produce the most severe outcome on exactly 1 embodiment, with reduced severity on others.
4. **Opposite failure modes:** CETS-013 predicts that the SAME backbone perturbation (distance underestimation) produces overshoot on the humanoid but undershoot on the mobile platform.
5. **Embodiment-irrelevant backbone effects:** CETS-014 predicts that terrain misclassification has zero impact on a drone despite universal backbone transfer.

## 4. Discussion

### 4.1 Relationship to Existing CET Family

The original CET family (CET-001 through CET-010) focused primarily on backbone-layer attacks (visual perturbations, supply chain backdoors, cross-modal injection). This new systematic dataset extends CET by adding the action-head and hybrid categories, which test the transfer boundary rather than only the transfer itself.

The two datasets are complementary. The original CET tests breadth of backbone transfer scenarios. This systematic dataset tests the architectural distinction between transferable and non-transferable attack layers.

### 4.2 Defence Implications

If the transfer predictions hold empirically:

- **Backbone-layer defence:** Must be applied once at the backbone level and will protect all embodiments. Adversarial training, input certification, or backbone-specific monitoring would defend the entire fleet.
- **Action-head defence:** Must be applied per-embodiment. Each robot type needs its own action-head monitoring because the attack surface is unique to the action space.
- **Hybrid defence:** Requires both. Backbone defence alone prevents the universal component; action-head defence alone prevents the embodiment-specific component; full protection requires both layers.

(Descriptive claim: this follows logically from the architectural separation if the transfer predictions are confirmed.)

### 4.3 Severity Gradient in Hybrid Attacks

The hybrid scenarios demonstrate that a single adversarial input can produce a severity gradient across embodiments: catastrophic on one embodiment (where both components activate), moderate on most (backbone only), and zero on some (where the backbone perturbation is irrelevant). This has implications for fleet-level risk assessment: the same attack input may be tolerable for one robot type but dangerous for another.

(Analytical claim: this is consistent with the observation that different embodiments have different relevance profiles for the same environmental features.)

## 5. Limitations

1. **Sample size.** Zero empirical traces. All 15 scenarios are untested. Transfer predictions are hypotheses, not findings.
2. **Grader quality.** Not applicable (no grading performed).
3. **Scale confound.** The existing CET FLIP results (strict 40%, broad 60%, n=10) were on sub-2B models (deepseek-r1:1.5b, qwen3:1.7b), subject to capability floor effects.
4. **Generalisability.** The transfer predictions assume a clean architectural separation between backbone and action head. In practice, some VLA architectures (e.g., pi0.5, RT-2) use partial fine-tuning of backbone layers during action-head training, which could introduce action-head-specific features into the backbone, weakening the transfer prediction.
5. **Methodology.** Design-only report. No grading methodology applicable. Empirical testing should use FLIP methodology on 7B+ models per Mistake #25 (sub-2B models are insufficient for action-layer evaluation).
6. **Embodiment realism.** The 5 embodiment types and their action spaces are representative but simplified. Real-world VLA systems have more complex action spaces and may use multiple action heads.

## 6. Conclusions and Recommendations

We have created a 15-scenario benchmark dataset for systematically testing cross-embodiment attack transfer in VLA systems. The dataset makes explicit, testable predictions about which attacks should and should not transfer across embodiments, based on the architectural distinction between shared VLM backbones and embodiment-specific action heads.

If confirmed by empirical testing, these predictions would suggest that:
1. Fleet-wide defence must prioritise backbone-layer monitoring (protects all embodiments from 5/5 backbone attacks).
2. Per-embodiment action-head monitoring is necessary for the remaining attack surface (5/5 action-head attacks are not detectable at the backbone level).
3. Risk assessment for heterogeneous fleets should account for the severity gradient: a single adversarial input may produce different danger levels across embodiment types.

**Recommended next steps:**
- Create GH issue for empirical testing campaign
- Run on 7B+ models to avoid capability floor confound
- Test at least 2 models per embodiment type to establish inter-model agreement
- Use FLIP grading methodology

---

## References

1. F41LUR3-F1R57. Report #49: VLA PARTIAL Dominance. 2026-03-11 (updated).
2. F41LUR3-F1R57. Report #51: Format-Lock Capability-Floor Hypothesis. 2026-03-11.
3. Liang et al. BadVLA: Near-Universal Adversarial Attacks on Vision-Language-Action Models. arXiv:2505.16640, 2025.
4. Cardenas & Xie. Projected Text Attacks on Vision-Language Models. 2026.
5. F41LUR3-F1R57. CANONICAL_METRICS.md. 2026-03-18.
6. F41LUR3-F1R57. Attack Classes Taxonomy. 2026-03-18.

---

## Appendix A: Transfer Prediction Matrix (Compact)

```
Attack Layer     | Arm | Platform | Humanoid | Quadruped | Drone | Transfer Rate
-----------------+-----+----------+----------+-----------+-------+--------------
CETS-001 (BB)    |  X  |    X     |    X     |     X     |   X   |    5/5
CETS-002 (BB)    |  X  |    X     |    X     |     X     |   X   |    5/5
CETS-003 (BB)    |  X  |    X     |    X     |     X     |   X   |    5/5
CETS-004 (BB)    |  X  |    X     |    X     |     X     |   X   |    5/5
CETS-005 (BB)    |  X  |    X     |    X     |     X     |   X   |    5/5
CETS-006 (AH)    |  X  |    .     |    .     |     .     |   .   |    1/5
CETS-007 (AH)    |  .  |    X     |    .     |     .     |   .   |    1/5
CETS-008 (AH)    |  .  |    .     |    X     |     .     |   .   |    1/5
CETS-009 (AH)    |  .  |    .     |    .     |     X     |   .   |    1/5
CETS-010 (AH)    |  .  |    .     |    .     |     .     |   X   |    1/5
CETS-011 (HY)    | XX  |    x     |    x     |     x     |   x   |    5/5*
CETS-012 (HY)    |  x  |   XX     |    x     |     x     |   x   |    5/5*
CETS-013 (HY)    |  x  |    x     |   XX     |     x     |   x   |    5/5*
CETS-014 (HY)    |  x  |    x     |    x     |    XX     |   .   |    4/5*
CETS-015 (HY)    |  x  |    x     |    x     |     x     |  XX   |    5/5*

Legend: X = full effect, x = backbone-only (mild), XX = hybrid (severe),
        . = no effect, * = severity varies
BB = backbone, AH = action-head, HY = hybrid
```

---

*This report was produced as part of the Failure-First Embodied AI research
programme. All claims are scoped to the tested conditions and should not be
generalised without additional validation. See docs/CANONICAL_METRICS.md for
corpus-level numbers.*
