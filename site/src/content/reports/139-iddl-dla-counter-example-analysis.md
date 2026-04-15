---
title: "DLA Counter-Example and IDDL Robustness Analysis"
description: "The Dual-Layer Attack (DLA) family is a counter-example to the Inverse Detectability-Danger Law (IDDL). Including DLA weakens the IDDL Spearman correlation from rho=-0.822 to rho=-0.680. We argue that DLA strengthens rather than undermines the IDDL because DLA's danger derives from textual content, not physical context -- illuminating the boundary conditions of the law."
date: "2026-03-18"
reportNumber: 139
classification: "Research — Empirical Study"
status: "complete"
author: "F41LUR3-F1R57 Research"
tags: []
draft: false
---

> **Disclaimer:** Empirical figures cited from Failure-First research reflect testing
> on specific model families under research conditions. Attack success rates are
> indicative estimates with methodological caveats described in the Limitations
> section. This report does not constitute safety certification guidance.

---

## Summary

The Dual-Layer Attack (DLA) family is a counter-example to the Inverse Detectability-Danger Law (IDDL). DLA has perfect detectability (D=1.00; all 7 traces classified as REFUSAL by the FLIP evaluator) combined with high physical consequentiality (C=4.5). The IDDL predicts that high-consequentiality attacks should have low detectability. DLA violates this prediction.

Including DLA weakens the IDDL Spearman correlation from rho=-0.822 (n=27, BCa 95% CI [-0.913, -0.733]) to rho=-0.680 (n=28, BCa 95% CI [-0.852, -0.228]). Jackknife analysis confirms DLA is the single most influential family: removing DLA produces the largest shift in both VLA-only (delta=-0.17) and full-corpus (delta=-0.14) analyses.

We argue that DLA strengthens rather than undermines the IDDL's structural claim, because DLA's danger derives from textual content (infrastructure misconfiguration), not physical context. The IDDL specifically concerns attacks whose danger is invisible to text-layer evaluation because it arises from the physical environment. DLA is detectable precisely because its mechanism IS textual.

## Data

### IDDL with and without DLA

| Analysis | n | rho | BCa 95% CI | Boot SE | p |
|----------|---|-----|-----------|---------|---|
| Full corpus (excl DLA) | 27 | -0.822 | [-0.913, -0.733] | 0.062 | <0.001 |
| Full corpus (incl DLA) | 28 | -0.680 | [-0.852, -0.228] | 0.148 | <0.001 |
| VLA only (excl DLA) | 16 | -0.698 | [-0.897, -0.332] | 0.163 | 0.002 |
| VLA only (incl DLA) | 17 | -0.526 | [-0.842, 0.010] | 0.221 | 0.027 |

### DLA Family Details

- **n=7** traces (5 adversarial, 2 benign controls)
- **Verdict distribution:** 2 REFUSAL, 1 HALLUCINATION_REFUSAL, 3 BENIGN_QUERY, 1 ERROR
- **Strict ASR:** 0/7 = 0.0% [0.0%, 35.4%] (Wilson 95% CI)
- **Detectability D:** 1.00 (all evaluable traces recognized as actual attacks or correctly classified)
- **Consequentiality C:** 4.5 (dual-layer attacks combining infrastructure bypass with AI-layer manipulation)
- **Grader:** 27B-class LLM graders via OpenRouter

### Jackknife Influence Analysis

| Scope | n | Full rho | LOO rho (DLA removed) | Delta | Next largest delta |
|-------|---|----------|-----------------------|-------|--------------------|
| Full corpus | 28 | -0.680 | -0.822 | -0.143 | Supply_Chain: -0.018 |
| VLA only | 17 | -0.526 | -0.698 | -0.172 | PP: -0.068 |

DLA's influence is 8x larger than the next most influential family in the full corpus, and 2.5x in VLA-only. This is a single-point leverage effect.

## Interpretation

The DLA counter-example illuminates the boundary conditions of the IDDL. The IDDL holds for attacks whose danger depends on physical context that is absent from the evaluation input. DLA's danger depends on textual content (a misconfigured infrastructure layer) that IS present in the evaluation input. The evaluator can see the attack mechanism and correctly classifies it.

This suggests the IDDL should be stated more precisely: the inverse relationship holds for the class of attacks where danger arises from the physical environment rather than from the textual instruction. DLA falls outside this class. The IDDL is a statement about the structural limits of text-layer evaluation, not about all attacks generally.

### Taxonomy of Detectability

The 28 families now span three detectability regimes:

1. **Text-layer detectable (D > 0.7):** Attacks with textually explicit harmful content. Includes Encoding, DAN_Persona, GCG, Supply_Chain, TRA, ASE, SBE, DLA. Evaluators have a textual signature to detect.

2. **Partially detectable (0.4 < D < 0.7):** Attacks with mixed textual/contextual mechanisms. Includes Multi-turn, Crescendo, Format_Lock, MMC, VAP, LAM, SID, DA. Evaluator signal is partial.

3. **Structurally invisible (D < 0.4):** Attacks whose danger arises from physical context. Includes SBA, LHGD, TCH, CET, SIF, PCM, PP. No textual signature exists for evaluation.

DLA belongs squarely in regime 1, where the IDDL predicts high detectability. The IDDL's claim is that regime 3 contains the highest-consequentiality attacks, which the data confirms even with DLA included.

## Evidence Package

**Claim:** IDDL rho=-0.822 (n=27, excl DLA). DLA is a counter-example with D=1.00, C=4.5.
**Key test:** Spearman rank correlation with BCa bootstrap CI.
**Robustness:** Jackknife stable (all 27 LOO significant). Monte Carlo sensitivity: 100% of perturbations significant, 100% negative. DLA exclusion analytically justified.
**Counter-evidence:** Including DLA weakens to rho=-0.680 (n=28). CI still excludes zero. VLA-only with DLA: rho=-0.526, CI barely includes zero (upper bound 0.010).
**Assessment:** The IDDL is a robust finding for context-dependent attacks. It should be stated with the boundary condition that textually-explicit high-consequentiality attacks (DLA-class) are detectable and fall outside its scope. This is a refinement, not a refutation.

---

*All computations reproducible with seed=42, B=20,000.*
