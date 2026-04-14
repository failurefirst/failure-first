---
title: "DLMI Wave 5 Update -- Has the Defense Layer Mismatch Changed?"
description: "Wave 5 empirical data confirms the structural DLMI of 0.54 and computes a weighted variant at 0.58. L2 infrastructure attacks (IMB 70% ASR) are as effective as L1 reasoning attacks (68.3% mean ASR). The defense investment mismatch is not conservative."
date: "2026-03-16"
reportNumber: 129
classification: "Research -- Predictive Risk"
status: "complete"
author: "River Song (Head of Predictive Risk)"
tags: []
draft: false
---

## 1. Summary

Report #118 calculated the Defense Layer Mismatch Index at 0.54 based on a structural count of 24 attack families across three defense layers. Wave 5 provided the first empirical ASR data for three new families: IMB (L2, infrastructure), SID (L3, physical context), and SIF (L3, physical context).

**DLMI remains 0.54.** The wave 5 data does not change the structural DLMI because no new families were added or reclassified. However, the empirical data allows a weighted variant to be computed for the first time.

---

## 2. Weighted DLMI

The original DLMI treats all families equally. A weighted variant accounts for observed effectiveness (broad ASR):

### Layer-Weighted Broad ASR (from FLIP-graded data)

| Layer | Families with data | Mean broad ASR | Weighted contribution |
|-------|--------------------|----------------|----------------------|
| L1 (Reasoning) | LAM 60%, TRA 100%, SBE 78%, MMC 78%, VAP 70%, ASE 80%, PCM 60%, PP 20% | 68.3% | 0.417 x 0.683 = 0.285 |
| L2 (Infrastructure) | IMB 70%, TCH (data pending), LHGD (data pending) | 70.0%* | 0.292 x 0.700 = 0.204 |
| L3 (Physical context) | SID 60%, SIF 60%, CET (data pending) | 60.0%* | 0.125 x 0.600 = 0.075 |
| Cross-layer | DA 63.6%, SBA (data pending), SID+SIF 66.7% | 65.2%* | 0.167 x 0.652 = 0.109 |

*Means from available data only; families without traces excluded.

### Weighted DLMI Calculation

The weighted DLMI accounts for both the distribution of families and their observed effectiveness:

```
DLMI_weighted = 1 - (weighted_L1_contribution / total_weighted_contribution)
             = 1 - (0.285 / (0.285 + 0.204 + 0.075 + 0.109))
             = 1 - (0.285 / 0.673)
             = 1 - 0.423
             = 0.577
```

**Weighted DLMI = 0.58** (rounded from 0.577)

This is slightly higher than the structural DLMI (0.54), because:
- L2 attacks (IMB 70%) are similarly effective to L1 attacks (68.3%), meaning the off-investment-layer attack surface is not just broad but deep
- L3 attacks (SID/SIF 60%) are less effective than L1 but still achieve majority compliance

---

## 3. Interpretation

The wave 5 data changes the DLMI story in one important way: **L2 attacks are not weaker than L1 attacks.** The original DLMI assumed that off-layer attacks might be structurally present but practically less effective. IMB at 70% broad ASR disproves this -- infrastructure-mediated bypass is as effective as direct reasoning-layer attacks.

This means the DLMI is not conservative. The 54% structural mismatch is backed by 58% weighted mismatch. Safety investment concentration at L1 is not compensated by lower attack effectiveness at L2/L3.

---

## 4. What Would Change the DLMI?

| Event | DLMI effect | Likelihood (Q2 2026) |
|-------|-------------|---------------------|
| Major VLA vendor adds infrastructure security audit to safety eval | Decrease (shifts investment toward L2) | Low |
| New L1 attack family discovered | Decrease (increases L1 fraction) | Medium |
| New L2/L3 family discovered | Increase (increases off-layer fraction) | High (DLA family already proposed) |
| Context-aware safety scheduling deployed | Decrease (addresses L3 SID/SIF) | Very low |
| EU AI Act conformity assessment mandates L2 testing | Decrease (regulatory push) | Low before Aug 2026 |

---

## 5. Updated Metrics

| Metric | Report #118 value | Wave 6 updated value |
|--------|-------------------|---------------------|
| Structural DLMI | 0.54 | 0.54 (unchanged) |
| Weighted DLMI | N/A (no empirical ASR data) | 0.58 |
| L2 mean ASR | N/A | 70.0% (n=10, IMB only) |
| L3 mean ASR | N/A | 60.0% (n=10, SID+SIF) |
| L1 mean ASR | 72.4% (7 original families) | 68.3% (8 families incl. PP) |

---

## 6. Limitations

- IMB is the only L2 family with empirical data. TCH, LHGD, and others have traces but are awaiting FLIP grading updates.
- SID/SIF data is n=5 each on a 1.5B model. Wilson CIs span [23%, 88%].
- The weighted DLMI assumes that broad ASR is a meaningful proxy for real-world attack effectiveness. This is unvalidated.
- All data is from deepseek-r1:1.5b, which is below the capability floor. L1 ASR on frontier models is much lower (~9%), which would dramatically increase DLMI_weighted (L1 defenses work, L2/L3 untested on frontier).
