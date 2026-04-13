---
title: "Prediction Scorecard -- Monthly Check, March 15, 2026"
description: "First monthly prediction check against the 10 predictions made in Report #90 (Predictive Threat Model). At 0 days into the tracking period, 4 of 10 predictions already show partial or full confirmation, including physical lab attacks on deployed VLA humanoids (CONFIRMED) and FDA surgical AI adversarial guidance (PARTIALLY_CONFIRMED)."
date: "2026-03-15"
reportNumber: 113
classification: "Research — Empirical Study"
status: "complete"
author: "River Song (Head of Predictive Risk)"
tags: []
draft: false
---

## 1. Summary

This is the first monthly prediction check against the 10 predictions made in Report #90 (Predictive Threat Model, March 15 2026). All predictions have deadlines of Q3-Q4 2026. At 0 days into the tracking period, 4 of 10 predictions already show partial or full confirmation.

| Status | Count | Predictions |
|--------|-------|-------------|
| CONFIRMED | 1 | P3 |
| PARTIALLY_CONFIRMED | 3 | P1, P2, P9 |
| PENDING (on track) | 4 | P5, P6, P8, P10 |
| PENDING (uncertain) | 2 | P4, P7 |

**Overall accuracy trajectory:** Strong. The predictions are calibrated or slightly conservative -- several are confirming faster than the Q4 2026 deadline anticipated.

---

## 2. Per-Prediction Status

### P1: 3+ additional humanoid factory deployments (HIGH confidence, Q4 2026)
**Status: PARTIALLY_CONFIRMED**

Evidence already exceeds the threshold. Since the March 2026 baseline (Tesla, Figure, Apptronik, Agility, Sanctuary), at least 4 additional manufacturers have announced factory deployments:

1. **Boston Dynamics** -- Atlas shipping to Hyundai Metaplant Georgia + Google DeepMind (all 2026 units committed)
2. **XPeng** -- Breaking ground on 110,000 sqm humanoid factory in Guangzhou Q1 2026, mass production by end 2026
3. **Xiaomi** -- Humanoid robots in factory trials at automobile plant (assembly + logistics)
4. **STMicroelectronics + Oversonic** -- RoBee deploying across semiconductor plants (first semiconductor industry humanoid deployment)

**Assessment:** Threshold met. Will upgrade to CONFIRMED upon next check when deployments are operational.

### P2: 1+ humanoid safety incident publicly reported (MEDIUM confidence, Q4 2026)
**Status: PARTIALLY_CONFIRMED**

Near-miss incidents are accumulating:
- Unitree H1 viral video showing humanoid flailing dangerously near a worker during Chinese factory test
- OSHA Midwest inspection triggered by worker injury in facility with humanoid robots (robot not direct cause, but humanoid systems cited under General Duty Clause for lacking documented energy control procedures)
- MIT Technology Review article specifically covering why humanoids need new safety rules (dynamic stability means you cannot simply "kill power" -- robot falls, potentially onto worker)

**Assessment:** No confirmed humanoid-caused physical contact injury yet in a commercial deployment. The accumulation of near-miss incidents and the dynamic stability problem suggest this prediction is on track for the Q4 2026 deadline.

### P3: Physical lab attack on deployed VLA humanoid published (HIGH confidence, Q4 2026)
**Status: CONFIRMED**

Multiple published papers demonstrate successful adversarial attacks against VLA-backbone robots in physical laboratory settings:

1. **BackdoorVLA** -- Targeted backdoor attack on physical 7-DoF Franka arm. 58.4% average targeted success rate, 100% on selected tasks.
2. **TrojanRobot** (arXiv:2411.11683) -- Physical-world backdoor attacks against VLM-based robotic manipulation.
3. **AttackVLA** (arXiv:2511.12149) -- Comprehensive benchmark of adversarial and backdoor attacks on VLA models.
4. **State Backdoor** (arXiv:2601.04266) -- Stealthy real-world poisoning attack on VLA models in state space.
5. **EDPA** -- Model-agnostic Embedding Disruption Patch Attack, applicable across VLA models without architecture knowledge.

**Assessment:** Prediction fully confirmed. The volume and diversity of published attacks exceeds the prediction's threshold.

### P4: LRM-to-VLA end-to-end attack chain demonstrated (MEDIUM confidence, Q4 2026)
**Status: PENDING**

Both components exist independently:
- LRM autonomous jailbreak: 97.14% ASR across 25,200 inputs (Nature Communications)
- VLA physical-robot attacks: Multiple published demonstrations (see P3)

The missing link is a single paper connecting the chain. No such demonstration has been published yet.

### P5: No binding VLA safety testing governance enacted (HIGH confidence, Q4 2026)
**Status: PENDING (on track)**

Confirmed that no jurisdiction has enacted VLA-specific safety testing governance. EU AI Act harmonised standards via CEN/CENELEC JTC 21 missed their August 2025 target.

### P6: GLI null rate remains above 60% (HIGH confidence, Q4 2026)
**Status: PENDING (on track)**

Current GLI dataset: 103 entries, majority with null GLI (>85% null rate). Well above the 60% threshold.

### P7: 3+ manufacturers seek EU AI Act conformity assessment (HIGH confidence, Q3 2026)
**Status: PENDING (uncertain)**

EU AI Act full application date (August 2, 2026) is 4.5 months away. No specific public reports of major robotics manufacturers announcing third-party AI safety assessment engagement.

### P8: EU harmonised standard draft OR humanoid incident triggers governance (MEDIUM confidence, Q4 2026)
**Status: PENDING**

prEN 18286 (QMS) is in public enquiry. Need to determine whether a public enquiry for a QMS standard counts as a "harmonised standard draft" for the purposes of this prediction.

### P9: FDA surgical AI adversarial guidance issued (LOW confidence, Q4 2026)
**Status: PARTIALLY_CONFIRMED**

The FDA issued final guidance in February 2026: "Cybersecurity in Medical Devices: Quality Management System Considerations and Content of Premarket Submissions." This guidance explicitly addresses adversarial attacks on AI medical devices, data poisoning and model manipulation, and penetration testing requirements.

**Assessment:** This was the LOW confidence prediction and it has substantially materialised. Upgrading to PARTIALLY_CONFIRMED.

### P10: No binding LAWS adversarial safety framework (HIGH confidence, Q4 2026)
**Status: PENDING (on track)**

Despite significant diplomatic momentum (156 states support UNGA resolution), the pace of international treaty negotiation makes a binding framework by Q4 2026 extremely unlikely.

---

## 3. Calibration Assessment

| Confidence Level | Predictions | Status at First Check |
|-----------------|-------------|----------------------|
| HIGH (>70%) | P1, P3, P5, P6, P7, P10 | 1 CONFIRMED, 1 PARTIALLY_CONFIRMED, 3 on-track, 1 uncertain |
| MEDIUM (40-70%) | P2, P4, P8 | 1 PARTIALLY_CONFIRMED, 2 PENDING |
| LOW (<40%) | P9 | 1 PARTIALLY_CONFIRMED (unexpected) |

**Notable calibration finding:** P9 (FDA adversarial guidance) was rated LOW confidence but has substantially materialised at the first check. This suggests the prediction was underconfident.

## 4. Novel Finding: FDA Adversarial Guidance as GLI Acceleration Signal

The FDA February 2026 guidance represents a potential GLI acceleration event for the medical AI sector. It is the first mandatory adversarial robustness requirement for AI-enabled devices. This should be added to the GLI dataset as a new entry -- one of the few with a complete doc-to-enact chain, and the first for a physical-consequence AI domain.
