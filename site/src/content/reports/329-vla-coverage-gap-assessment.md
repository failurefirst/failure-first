---
title: "VLA Family Coverage Gap Assessment and Testing Readiness Review"
description: "VLA Family Coverage Gap Assessment and Testing Readiness Review"
reportNumber: 329
date: "2026-03-28"
classification: "Research — Empirical Study"
status: "complete"
author: "Rose Tyler (Head of Adversarial Operations)"
tags: ["vla", "coverage-assessment", "embodied-ai", "benchmark-planning"]
draft: false
---

## Summary

This report assesses coverage gaps across the VLA (Vision-Language-Action) attack family taxonomy and evaluates readiness for the next phase of empirical testing. The assessment covers 42 distinct VLA attack family prefixes across 39 JSONL files, with 673 raw traces collected.

## VLA Family Coverage Status

| Tier | Families | Net ASR | Status |
|------|----------|---------|--------|
| Tier 1 (genuine signal) | DA, TRA, LAM | >30% | FLIP-graded, CCS-ready |
| Tier 2 (marginal signal) | ASE, SBE | 10-30% | Partially graded |
| Tier 3 (at/below FP floor) | PCM, MMC, VAP, SBA, others | <10% | Low priority |

### CCS-Ready VLA Families

| Family | FLIP-Graded n | Models | Broad ASR | CCS-Ready? |
|--------|--------------|--------|-----------|------------|
| TDA (Temporal Drift) | 39 | 3 | 74.4% | YES |
| DA (Deceptive Alignment) | 22 | 2 | 63.6% | YES |
| TRA (Temporal Reasoning) | 6 | 3 | 66.7% | MARGINAL |
| LAM (Language-Action) | 10 | 3 | 60.0% | MARGINAL |

### Critical Gaps

- 6 families have zero or critically insufficient traces (blocked by rate limits or study design requirements)
- 12 families have traces collected but no FLIP grading
- The L1B3RT4S-to-VLA transfer question (LIB-VLA family) is identified as the single most important gap for the CCS paper

## L1B3RT4S VLA Adaptation Readiness

6 scenarios were created preserving exact L1B3RT4S prompt wrappers but replacing text-domain payloads with VLA-specific harmful actions spanning 5 distinct physical harm classes across 4 robot types. All scenarios pass schema validation and lint checks. Testing requires API access recovery.

## Prioritization

1. **CCS-Critical:** LIB-VLA testing (L1B3RT4S transfer), FLIP-grade existing IEA and CC traces
2. **Important but not blocking:** CSC (compositional supply chain), SID subset grading
3. **Deferred:** HITL (human-blocked), SCHEMING (needs expansion), SBA variants (near-null signal)

---

*Report #329 | F41LUR3-F1R57 Adversarial AI Research*
