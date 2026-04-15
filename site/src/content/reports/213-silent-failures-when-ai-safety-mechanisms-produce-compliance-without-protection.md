---
title: "Silent Failures: When AI Safety Mechanisms Produce Compliance Without Protection"
description: "Silent Failures: When AI Safety Mechanisms Produce Compliance Without Protection"
reportNumber: 213
date: "2026-03-24"
classification: "Research — Empirical Study"
status: "complete"
tags: ["PARTIAL", "silent-failure", "binary-safety", "DETECTED-PROCEEDS", "measurement"]
draft: false
---

## Summary

The dominant paradigm in AI safety evaluation treats model responses as binary: refuse or comply. This misses the most prevalent failure mode: PARTIAL compliance, where models produce safety language while delivering harmful content. In VLA testing, 50% of verdicts are PARTIAL with zero outright refusals. The gap between strict ASR (21.9%) and broad ASR (34.2%) represents a 56% undercount. When Functionally Dangerous responses are included, ASR rises to 43.0%. Keyword-based classifiers achieve only Cohen's kappa of 0.126 against LLM grading, with a 67.3% false positive rate.
