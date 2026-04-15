---
title: "Training Data for Safety Classification"
description: "Training Data for Safety Classification"
reportNumber: 216
date: "2026-03-24"
classification: "Technical Analysis"
status: "complete"
tags: ["classifier-training", "FLIP", "training-data", "fine-tuning"]
draft: false
---

## Summary

Assessed whether 53,831 LLM-graded results can train a fine-tuned safety classifier. Only 5,569 records (10.3%) have usable natural-text responses with trusted LLM verdicts. The remaining 87% are OBLITERATUS telemetry records unusable for text classification. Class imbalance is moderate (39:1). The PARTIAL category is the hardest to classify and the most research-critical.
