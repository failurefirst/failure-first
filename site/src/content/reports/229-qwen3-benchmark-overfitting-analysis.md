---
title: "Qwen3 Benchmark Overfitting Analysis"
description: "Qwen3 Benchmark Overfitting Analysis"
reportNumber: 229
date: "2026-03-24"
classification: "Research — Empirical Study"
status: "complete"
tags: ["qwen3", "overfitting", "benchmark-contamination", "novel-families"]
draft: false
---

## Summary

Tested whether Qwen3's safety refusal on AdvBench reflects genuine alignment or benchmark-specific overfitting. Qwen3-8b refuses 84.7% of AdvBench prompts but complies with 98.3% of novel family prompts -- an 83pp gap (chi-square=80.5, p<10^-18, Cramer's V=0.82). This gap is 2.7x larger than comparable models, suggesting Qwen3-specific overfitting.
