---
title: "The Qwen3 Safety Leap -- Artifact Analysis"
description: "The Qwen3 Safety Leap -- Artifact Analysis"
reportNumber: 222
date: "2026-03-24"
classification: "Research — Empirical Study"
status: "complete"
tags: ["qwen3", "safety-leap", "null-finding", "artifact"]
draft: false
---

## Summary

Investigated whether Qwen3 represents a genuine safety improvement over Qwen2.5. After analyzing 21,939 LLM-graded results across 33 Qwen-family models, no evidence of a safety leap was found. The apparent 0% ASR is an API error artifact (75/77 traces are 402 errors). However, a significant shift in failure mode was identified: Qwen3 produces more PARTIAL verdicts than Qwen2.5.
