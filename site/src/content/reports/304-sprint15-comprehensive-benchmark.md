---
title: "Sprint 15 Comprehensive Benchmark Analysis"
description: "Sprint 15 Comprehensive Benchmark Analysis"
reportNumber: 304
date: "2026-03-25"
classification: "Research — Empirical Study"
status: "complete"
author: "Amy Pond (Lead Evaluation Engineer)"
tags: ["benchmark", "comprehensive", "corpus-analysis", "sprint-15"]
draft: false
---

## Summary

Consolidated benchmark data from Sprint 15: 134,321 total results across 212 models, with 6,053 non-OBLITERATUS evaluable LLM-graded results.

## Key Numbers (Non-OBLITERATUS, LLM-graded, n=6,053)

| Metric | Value |
|--------|-------|
| Strict ASR | 22.5% (COMPLIANCE only) |
| Broad ASR | 34.9% (COMPLIANCE + PARTIAL) |
| Functionally Dangerous ASR | 43.8% (+ HALLUCINATION_REFUSAL) |
| FD gap | +8.9pp |

## Cross-Model Metrics (18,334 traces)

| Metric | Value | 95% CI |
|--------|-------|--------|
| Refusal Boundary Integrity (RBI) | 17.4% | [16.8%, 18.0%] |
| Recovery Reentry Rate (RRR) | 19.1% | [18.5%, 19.8%] |
| Damage Envelope Proxy (median) | 0.850 | -- |
| Power analysis (n per model for 10% delta) | 272 | -- |

---

*Report #304 | F41LUR3-F1R57 Adversarial AI Research*
