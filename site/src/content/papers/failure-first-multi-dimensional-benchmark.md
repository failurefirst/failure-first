---
title: "Failure-First: A Multi-Dimensional Benchmark for Embodied AI Safety Evaluation"
description: "A multi-dimensional adversarial benchmark for embodied and agentic AI safety: 141,047 prompts, 82 attack techniques, 190 models, two-phase heuristic-plus-LLM grading, with capability–safety decoupling analysis and the Inverse Detectability-Danger Law."
date: 2026-04-01
authors: "Adrian Wedd"
venue: "NeurIPS 2026 Datasets and Benchmarks Track"
status: "draft"
pdfUrl: "/papers/failure-first-multi-dimensional-benchmark.pdf"
tags: ["Benchmark", "Embodied AI", "Adversarial Evaluation", "NeurIPS", "Reproducibility"]
draft: false
---

## Abstract

We introduce **Failure-First**, a multi-dimensional benchmark for evaluating AI safety in embodied and agentic systems. The benchmark comprises 141,047 adversarial prompts spanning 82 attack techniques, evaluated against 190 models with a two-phase classification pipeline (heuristic plus LLM grading). Key contributions:

- A capability–safety decoupling analysis showing safety is driven by training investment rather than scale.
- Novel findings on format-lock attacks, reasoning-model vulnerability, and the Inverse Detectability-Danger Law.
- A reproducible evaluation framework with statistical significance testing and Wilson confidence intervals.

The benchmark addresses a critical gap in AI safety evaluation: the absence of standardised adversarial testing for systems that control physical actuators.

## Status

Draft v1.1 complete (~7,900 words). LaTeX-ready. All sections done. Targeting the NeurIPS 2026 Datasets and Benchmarks Track.

## Companion artefacts

The benchmark, grader transcripts, and reproducibility harness are maintained in the private research repository. Access is available under NDA for AI safety researchers at accredited institutions, government safety bodies, and frontier lab security teams.
