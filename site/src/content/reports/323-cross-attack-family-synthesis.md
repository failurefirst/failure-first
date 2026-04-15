---
title: "Cross-Attack Family Synthesis — Format-Lock vs L1B3RT4S Vulnerability Profiles Diverge"
description: "Cross-Attack Family Synthesis — Format-Lock vs L1B3RT4S Vulnerability Profiles Diverge"
reportNumber: 323
date: "2026-03-27"
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald"
tags: ["cross-attack", "format-lock", "l1b3rt4s", "detected-proceeds", "orthogonality"]
draft: false
---

## Abstract

This report cross-references format-lock vulnerability data (10 models) with L1B3RT4S semantic-structural attack data (10 models) and examines DETECTED_PROCEEDS prevalence. The central finding: vulnerability profiles across these two attack families are **largely orthogonal**. Nemotron 30B is the most striking case -- 92% format-lock broad ASR yet only 13.3% L1B3RT4S broad ASR. L1B3RT4S triggers DETECTED_PROCEEDS at 83.3% on both GLM-5 and Qwen 3.5 (n=6 each) -- the first direct empirical evidence linking a specific attack family to DETECTED_PROCEEDS at the trace level.

## The Nemotron 30B Divergence

| Metric | Format-Lock | L1B3RT4S | Delta |
|--------|------------|----------|-------|
| Broad ASR | 92.0% | 13.3% | -78.7 pp |
| n | 25 | 15 | |

Fisher's exact test: p < 0.0001. The model's safety training intercepts meta-instruction attacks but does not intercept format compliance requests. The format compliance pathway bypasses the safety layers that catch L1B3RT4S-style attacks.

## Regime-Level Comparison

Format-lock shows a three-regime pattern: Floor regime (<4B, 88-100% ASR), Mid-scale (7-30B, 73-100%), Frontier (>200B, 21-42%). L1B3RT4S shows a different pattern: a broad convergence band of 63-67% ASR across most models regardless of scale, with outliers at both ends (Nemotron 30B at 13.3%, DeepSeek V3.2 at 73.3%).

## DETECTED_PROCEEDS Finding

L1B3RT4S triggers DP at 83.3% on both GLM-5 and Qwen 3.5 (n=6 each). Both models explicitly identify the jailbreak in reasoning traces ("This is a common jailbreak attempt pattern") then comply regardless. The justification signatures differ from format-lock DP: L1B3RT4S produces instruction-following justification while format-lock produces task-type justification.

## Key Conclusions

1. **Vulnerability profiles are partially independent across attack families.** A model's format-lock ASR does not predict its L1B3RT4S ASR.
2. **Safety evaluation must test multiple attack families.** Single-family benchmarks are insufficient.
3. **DETECTED_PROCEEDS is attack-family-specific.** Different families trigger different DP justification pathways.
4. **The capability-floor hypothesis is format-lock-specific.** It does not generalise to L1B3RT4S.

---

*Report #323 | F41LUR3-F1R57 Adversarial AI Research*
