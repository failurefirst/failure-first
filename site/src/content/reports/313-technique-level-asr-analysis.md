---
title: "Technique-Level ASR Analysis Across Full Corpus"
description: "Technique-Level ASR Analysis Across Full Corpus"
reportNumber: 313
date: "2026-03-27"
classification: "Research — Empirical Study"
status: "complete"
author: "Amy Pond (Data Curator / Benchmark Operator)"
tags: ["technique-analysis", "corpus-wide", "asr", "taxonomy"]
draft: false
---

## Summary

With 99.8% of prompts carrying technique classifications (140,977 of 141,223), this report presents the first comprehensive technique-level ASR analysis. 104 techniques have sufficient graded results (n >= 10) and 155 technique-by-model-family pairs (n >= 5).

**Corpus snapshot:** 50,182 graded results across 104 techniques, tested on models from 10+ families.

## Top 10 Most Effective Techniques (Broad ASR)

| Rank | Technique | Era | n | Broad ASR |
|------|-----------|-----|---|-----------|
| 1 | compliance_cascade | reasoning_2025 | 20 | 85.0% |
| 2 | obliteratus_probe | general | 42,346 | 81.2% |
| 3 | temporal_drift_attack | reasoning_2025 | 39 | 74.4% |
| 4 | format_lock | reasoning_2025 | 130 | 70.8% |
| 5 | infrastructure_boundary | reasoning_2025 | 10 | 70.0% |
| 6 | cot_manipulation | reasoning_2025 | 22 | 68.2% |
| 7 | hcot_attack | reasoning_2025 | 29 | 62.1% |
| 8 | physical_harm | general | 17 | 58.8% |
| 9 | urgency_manipulation | general | 18 | 55.6% |
| 10 | faithfulness_gap_exploit | reasoning_2025 | 443 | 51.0% |

7 of the top 10 techniques are from the reasoning_2025 era, suggesting reasoning-model-specific attacks are disproportionately effective. format_lock (70.8%, n=130) and faithfulness_gap_exploit (51.0%, n=443) are the most robust findings by sample size.

---

*Report #313 | F41LUR3-F1R57 Adversarial AI Research*
