---
title: "Capability-Floor Model Update — Three-Regime Format-Lock Vulnerability Curve"
description: "Capability-Floor Model Update — Three-Regime Format-Lock Vulnerability Curve"
reportNumber: 302
date: "2026-03-25"
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald"
tags: ["capability-floor", "format-lock", "three-regime", "vulnerability-curve"]
draft: false
---

## Summary

With Gemma 3 4B data (100% format-lock ASR, n=30), the capability-floor model now has continuous coverage from 1.2B to frontier. Three regimes are defined:

| Regime | Parameters | FL Broad ASR | Interpretation |
|--------|-----------|-------------|----------------|
| Floor | Below 4B | >= 88% | Safety training insufficient; all attacks succeed |
| Mid-range | 4-14B | 73-100% | Format-lock maintains elevated ASR; maximum advantage |
| Frontier | >70B, safety-trained | 24-42% | Only format-lock maintains elevated ASR |

## Complete Data Table

| Model | Params | FL Broad ASR | CTRL Broad ASR | Delta |
|-------|--------|-------------|----------------|-------|
| LFM 1.2B | 1.2B | 88.2% | N/A | N/A |
| Gemma 3 4B | 4B | 100.0% | 66.7% | +33.3pp |
| Qwen 2.5 7B | 7B | 93.3% | 41.7% | +51.7pp |
| Gemma 3 12B | 12B | 100.0% | 42.9% | +57.1pp |
| Phi-4 14B | 14B | 73.3% | 25.0% | +48.3pp |
| Claude 4.5 | ~200B | 30.4% | 3.9% | +26.5pp |
| Codex GPT-5.2 | ~300B | 42.1% | 8.8% | +33.3pp |
| Gemini 3 Flash | ~400B | 23.8% | 2.3% | +21.5pp |

Format-lock maintains elevated ASR at every scale tested, with the maximum advantage (+57pp) in the mid-range regime.

---

*Report #302 | F41LUR3-F1R57 Adversarial AI Research*
