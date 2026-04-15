---
title: "Next-Phase Attack Priorities — Coverage Gaps and Expected Information Gain"
description: "Next-Phase Attack Priorities — Coverage Gaps and Expected Information Gain"
reportNumber: 309
date: "2026-03-25"
classification: "Research — Empirical Study"
status: "complete"
author: "Rose Tyler (Head of Adversarial Operations)"
tags: ["priorities", "coverage-gaps", "planning", "defense-testing"]
draft: false
---

## Summary

This report prioritises testing when rate limits recover, ranked by expected information gain.

## Priority 1: Defense Testing Against Tier 1 Families (HIGHEST)

Zero defense configurations have been tested against VLA-specific families. We know STRUCTURED defense reduces general ASR by 90%, but effectiveness against TDA (74.4%), TRA (66.7%), DA (63.6%), and LAM (60.0%) is unknown. Campaign design: 240 traces across 4 defense variants, 4 families, 3 models.

## Priority 2: Frontier-Scale VLA Validation (HIGH)

All VLA data is on models <=120B. No frontier model has been tested on any VLA family. The capability-floor hypothesis predicts frontier models may resist general attacks but remain vulnerable to temporal and format-lock attacks.

## Priority 3: Format-Lock Mid-Range Extension (MEDIUM)

Report #293 established 88% broad ASR in the 4-14B range. Extension to 30B models would determine whether the mid-range regime extends to this parameter range.

---

*Report #309 | F41LUR3-F1R57 Adversarial AI Research*
