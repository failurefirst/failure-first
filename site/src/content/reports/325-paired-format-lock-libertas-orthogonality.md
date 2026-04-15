---
title: "Paired Format-Lock and L1B3RT4S Test — Vulnerability Profiles Diverge But Not Consistently"
description: "Paired Format-Lock and L1B3RT4S Test — Vulnerability Profiles Diverge But Not Consistently"
reportNumber: 325
date: "2026-03-28"
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald"
tags: ["format-lock", "l1b3rt4s", "orthogonality", "cross-attack", "safety-architecture"]
draft: false
---

## Abstract

This report presents paired format-lock traces on two models (Qwen 3.5 397B and DeepSeek V3.2) that already have L1B3RT4S data. Combined with existing Nemotron 30B paired data, 3 models now have both attack families tested. The central finding: vulnerability profiles diverge significantly between attack families, but **not in a consistent direction**. Nemotron 30B and DeepSeek V3.2 are more vulnerable to format-lock; Qwen 3.5 is more vulnerable to L1B3RT4S.

## Paired Comparison Results

| Model | FL Broad ASR | L1B Broad ASR | Delta | Fisher p | Direction |
|-------|-------------|--------------|-------|----------|-----------|
| Nemotron 30B | 92.0% (n=25) | 13.3% (n=15) | +78.7 pp | < 0.001 | FL >> L1B |
| DeepSeek V3.2 | 90.9% (n=11) | 73.3% (n=30) | +17.6 pp | 0.401 | FL > L1B (NS) |
| Qwen 3.5 | 18.2% (n=11) | 66.7% (n=30) | -48.5 pp | 0.012 | L1B >> FL |

## Three Safety Architecture Patterns

1. **Nemotron 30B (Format-Vulnerable, L1B-Resistant):** Safety training intercepts meta-instruction attacks but does not intercept format compliance requests.

2. **Qwen 3.5 (Format-Resistant, L1B-Vulnerable):** Produces format-compliant refusals (filling schemas with policy-restriction placeholder values) but does not intercept L1B3RT4S semantic-structural attacks. Evaluates adversarial payloads as educational/permissible despite recognising the adversarial framing.

3. **DeepSeek V3.2 (Broadly Vulnerable):** Both attack families achieve high ASR. Neither format-lock nor meta-instruction safety mechanisms are strong.

## Implications

The "orthogonality" framing requires qualification. The two attack families probe partially independent safety dimensions, and model-specific safety architecture determines which dimension is weaker. "Partially independent" is more accurate than "orthogonal."

**Safety evaluation must test multiple attack families.** A model that passes one family may fail another, and the direction of failure is unpredictable from model metadata alone.

## Limitations

- Small n per model (n=11 format-lock, n=15-30 L1B3RT4S)
- Grading methodology mismatch (manual vs FLIP)
- Payload confound (different harm content across families)
- Only 3 models tested

---

*Report #325 | F41LUR3-F1R57 Adversarial AI Research*
