---
title: "L1B3RT4S VLA Adaptation and DETECTED_PROCEEDS Scaling Analysis"
description: "L1B3RT4S VLA Adaptation and DETECTED_PROCEEDS Scaling Analysis"
reportNumber: 324
date: "2026-03-27"
classification: "Research — Empirical Study"
status: "complete"
author: "Rose Tyler (Adversarial Operations)"
tags: ["l1b3rt4s", "vla", "detected-proceeds", "scaling", "embodied-ai"]
draft: false
---

## Summary

This report covers two deliverables: (1) creation of a VLA-adapted L1B3RT4S scenario set for embodied AI safety testing, and (2) analysis of the DETECTED_PROCEEDS (DP) pattern across existing L1B3RT4S traces.

## DETECTED_PROCEEDS Scaling Analysis

Across 41 valid L1B3RT4S traces from 5 models (9B to 744B), 29.3% exhibit the DETECTED_PROCEEDS pattern (model generates an explicit refusal followed by substantive compliance content). The DP rate scales with model size:

| Model | Params | n | DP Rate | Broad ASR |
|-------|--------|---|---------|-----------|
| Nemotron Nano 9B | 9B | 6 | 0% | 100% |
| Nemotron-3-Super | 120B | 6 | 17% | 67% |
| Qwen 3.5 | ~122B | 11 | 45% | 100% |
| Cogito 2.1 | 671B | 6 | 33% | 100% |
| GLM-5 | ~744B | 6 | 50% | 100% |

**Interpretation:** Larger models have greater capacity to faithfully execute the dual-response paradigm as specified. Small models (9B) skip the refusal step and jump directly to compliance -- not because they are more vulnerable, but because they cannot execute the multi-step response format. Larger models are more concerning in the DP sense because they produce the safety-appearance of refusal while still generating harmful content.

## VLA Implications

In text-domain applications, DETECTED_PROCEEDS is a classification challenge. In VLA/embodied systems, the implications are more severe:

1. **Action-layer bypass:** If a VLA system's safety monitor checks for refusal keywords and finds them, it may not inspect post-divider content containing actual action sequences.
2. **Monitoring evasion at scale:** At 50% DP rate in large models, approximately half of successful attacks would appear as refusals to keyword-based safety monitors.
3. **Defense vulnerability:** Any VLA safety monitor using keyword matching on response text is actively vulnerable to the DP pattern.

## LIB-VLA Scenario Set

6 scenarios were created preserving exact L1B3RT4S wrappers but replacing text-domain payloads with VLA-specific harmful actions spanning 5 physical harm classes across 4 robot types. Testing is blocked by API rate limits; scenarios are validated and ready for empirical evaluation.

[Specific VLA scenario operational details redacted for public release.]

## Limitations

- Small sample sizes (n=6 per model for most)
- Keyword-based DP classification
- Single payload type (text-domain traces only)
- VLA testing not yet completed

---

*Report #324 | F41LUR3-F1R57 Adversarial AI Research*
