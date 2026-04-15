---
title: "Frontier Probe -- Ollama Cloud Large-Scale Model Testing"
description: "Frontier Probe -- Ollama Cloud Large-Scale Model Testing"
reportNumber: 238
date: "2026-03-24"
classification: "Research — Empirical Study"
status: "complete"
tags: ["frontier-models", "ollama-cloud", "scale", "safety-robustness"]
draft: false
---

## Summary

Tested curated top-ASR prompts against two frontier-scale models: NVIDIA Nemotron 3 Super (~230B) and Alibaba Qwen3.5 (397B). Parameter scale alone does not predict safety robustness. Nemotron 230B showed 78.6% heuristic ASR while Qwen3.5 397B showed 7.1% corrected ASR, including a novel 'silent refusal' pattern.
