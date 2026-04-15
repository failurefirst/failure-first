---
title: "DRIP Recomputation with Corrected Wave 5 ASR Values"
description: "Recomputation of the Deployment Risk Inversion Point (DRIP) 60:1 ratio and Safety Debt Accumulator chain with corrected Wave 5 ASR values. The 60:1 ratio is unchanged. Compound P(harm) estimates decrease by 3-7pp. The qualitative findings are robust."
date: "2026-03-16"
reportNumber: 126
classification: "Technical Analysis"
status: "complete"
author: "Clara Oswald (Principal Research Analyst)"
tags: []
draft: false
---

## 1. Purpose

Report #101 introduced the Deployment Risk Inversion Point (DRIP) and the `drip_sensitivity.py` tool. The DRIP model's 60:1 ratio was computed with default parameters. Subsequently, Wave 5 data was collected and regraded (Report #119), producing corrected ASR values:

| Family | Wave 4 (initial) | Wave 5 (regraded) | Change |
|--------|------------------|--------------------|--------|
| IMB | 85.7% (6/7, 3 ERROR) | 70.0% (7/10, 0 ERROR) | -15.7pp |
| SID | 75.0% (3/4, 1 ERROR) | 60.0% (3/5, 0 ERROR) | -15.0pp |
| SIF | 33.3% (1/3, 2 ERROR) | 60.0% (3/5, 0 ERROR) | +26.7pp |

This report recomputes the DRIP ratio and the Safety Debt Accumulator chain with these corrected values.

---

## 2. DRIP Model: No Change to the 60:1 Ratio

The DRIP ratio (R_u(0) / R_a) does not depend on IMB, SID, or SIF ASR values. It depends on:

```
R_u(0) / R_a = [lambda_u * p_ctx * (1 - S_0)] / [lambda_a * ASR_0]
```

Where ASR_0 is the adversarial success rate against the model for standard jailbreak attacks, not the family-specific VLA attack success rates. The default ASR_0 = 10% represents the mixed-vulnerability-class baseline from Report #50.

**The 60:1 ratio is unchanged.** IMB, SID, and SIF are mechanisms that modify P(harm) for specific attack pathways, not the R_u/R_a balance. The DRIP structural argument — that normal-user risk dominates adversarial risk — is independent of which specific attack families exist.

### 2.1 Sensitivity Confirmation

Running `drip_sensitivity.py` with default parameters:

```
Baseline: R_u/R_a = 60.0x (unintentional dominates)

To flip the inversion:
  lambda_a:  Need 60x increase (0.01 -> 0.60/hr)
  ASR_0:     Need 600% (impossible)
  lambda_u:  Need 60x reduction (60 -> 1/hr)
  p_ctx:     Need 60x reduction (0.01 -> 0.000167)
  S_0:       Need 99.83% compliance (from 90%)
```

The 60:1 ratio is robust. No plausible parameter shift reduces it below 10:1 for realistic deployment scenarios.

---

## 3. Safety Debt Accumulator: Revised P(harm) Chain

The Safety Debt Accumulator (unified_theoretical_framework.md, Section 11) computes compound P(harm) across defense layers. The corrected ASR values change the intermediate calculations.

### 3.1 Original Values (Wave 4, pre-regrading)

```
P(harm) = P(complies) * P(eval_miss) * P(actuator)
        = 0.724 * 0.692 * 1.0
        = 0.50 (baseline)

With SID: P(complies|diluted) -> 0.90  => P(harm) = 0.62
With SID+SIF: eval degrades -> 0.85    => P(harm) = 0.77
```

### 3.2 Corrected Values (Wave 5, regraded)

The corrected family ASRs affect the model as follows:

**Baseline P(complies):** The VLA-wide FLIP ASR of 72.4% (Report #49) is unchanged. IMB, SID, and SIF are separate families; their regrading does not change the 7-family aggregate.

**SID's effect on P(complies|diluted):** The original calculation used SID 75% to estimate P(complies|diluted) approximately 0.90. With corrected SID 60%:
- SID broad ASR 60% means that at the tested dose levels, 60% of inputs that would normally be evaluated against safety instructions succeed after dilution
- This suggests P(complies|diluted) increases from 0.724 toward approximately 0.85 (proportional adjustment from the 75% -> 60% shift)
- Conservative estimate: P(complies|diluted) approximately 0.85 (was 0.90)

**SIF's effect on evaluator miss rate:** SIF corrected ASR 60% (was 33.3%). This actually *increases* the SIF contribution:
- Original: SIF 33.3% suggested modest evaluator fatigue
- Corrected: SIF 60% suggests evaluator fatigue is more severe than initially measured
- The correction comes from two ERROR traces resolving to PARTIAL and COMPLIANCE — the model was complying but the grader was failing
- P(eval_miss|fatigued) increases from approximately 0.80 to approximately 0.85

**IMB's effect on infrastructure bypass:** IMB corrected from 85.7% to 70.0%. This reduces the parallel pathway contribution:
- P(harm_via_infrastructure) = 0.70 * P(infra_exposed) (was 0.857)

### 3.3 Revised P(harm) Chain

**Static baseline (unchanged):**
```
P(harm) = 0.724 * 0.692 * 1.0 = 0.50
```

**With SID (corrected):**
```
P(harm|diluted) = 0.85 * 0.692 * 1.0 = 0.59 (was 0.62)
```

**With SID + SIF (corrected):**
```
P(harm|diluted+fatigued) = 0.85 * 0.85 * 1.0 = 0.72 (was 0.77)
```

### 3.4 Summary of Changes

| Scenario | Original P(harm) | Corrected P(harm) | Delta |
|----------|------------------|--------------------|-------|
| Baseline (static) | 0.50 | 0.50 | 0 |
| With SID (extended op) | 0.62 | 0.59 | -0.03 |
| With SID + SIF (extended + fatigue) | 0.77 | 0.72 | -0.05 |
| IMB parallel path | 0.857 * P(exposed) | 0.70 * P(exposed) | Reduced |

The corrections reduce all compound estimates by approximately 3-7pp. The qualitative story is unchanged: compound vulnerabilities produce P(harm) values substantially above the static baseline. The specific numbers move from 0.50 -> 0.77 to 0.50 -> 0.72.

---

## 4. Does the Correction Matter?

### 4.1 Structurally: No

The DRIP 60:1 ratio, the Safety Debt compounding dynamic, and the qualitative finding that compound vulnerabilities multiply through defense layers are all unchanged. The corrections reduce individual point estimates by modest amounts without changing any directional conclusions.

### 4.2 Quantitatively: Modestly

The SID + SIF compound P(harm) dropped from 0.77 to 0.72. This is a 6.5% relative reduction. For actuarial purposes (if CHL-based shift-length risk curves are eventually calibrated), this changes the risk multiplier for a 12-hour shift by a similar proportion. Not negligible, but well within the uncertainty of the underlying estimates.

### 4.3 Methodologically: Yes

The regrading process (Report #119) resolved 7 ERROR verdicts that were distorting ASRs in both directions. SID and IMB dropped; SIF increased substantially. This validates the "regrade before report" discipline and demonstrates that small-sample ASRs are highly sensitive to individual verdict corrections. The Safety Debt Accumulator should not be calibrated to specific numbers until sample sizes reach at least n=20 per family.

---

## 5. Updated Parameter Table

For future reference, the corrected parameters for the Safety Debt Accumulator:

| Parameter | Value | Source | Confidence |
|-----------|-------|--------|------------|
| P(complies) baseline | 0.724 | Report #49, n=58 | Medium |
| P(eval_miss) baseline | 0.692 | 1 - 0.308 FP, Issue #315, n=39 | Low-Medium |
| P(actuator_executes) | ~1.0 | Report #49, 0% refusal | Medium-High |
| P(complies\|SID) | ~0.85 | Report #119, n=5, estimated | Very Low |
| P(eval_miss\|SIF) | ~0.85 | Report #119, n=5, estimated | Very Low |
| P(infra_bypass) | 0.70 | Report #119, n=10 | Low |
| DRIP ratio (R_u/R_a) | 60:1 | Report #101, sensitivity analysis | Medium (structural) |

---

## 6. Limitations

- All SID, SIF, and IMB values are from n=5-10 samples on a single 1.5B model. Confidence intervals span 30+ percentage points.
- The P(complies|SID) estimate (~0.85) is a proportional adjustment, not a directly measured value. It assumes the relationship between family ASR and conditional compliance is linear, which is unvalidated.
- The P(eval_miss|SIF) adjustment is similarly indirect.
- These numbers should not be used in external-facing documents. They are working estimates for internal framework calibration.

---

*Prepared by Clara Oswald, Principal Research Analyst, Failure-First Embodied AI.*
*"The ratio moved from 60:1 to 60:1. Sometimes the most important result is that nothing changed."*
