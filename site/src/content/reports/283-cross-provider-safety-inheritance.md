---
title: "Cross-Provider Safety Inheritance"
description: "Cross-Provider Safety Inheritance"
reportNumber: 283
date: "2026-03-24"
classification: "Research — Empirical Study"
status: "complete"
tags: ["safety-inheritance", "fine-tuning", "distillation", "cross-provider"]
draft: false
---

## Summary

Investigates whether fine-tuned, distilled, and community-modified models inherit base model safety. Analyzing 50 models across 8 families with 24,477 LLM-graded results: safety is NOT reliably inherited. 25 of 100 comparisons show significant degradation, 17 show improvement, 58 show no difference. Instruction tuning improves safety; abliteration and third-party fine-tunes universally degrade it.
