---
title: "L1B3RT4S Corpus — 10-Model Cross-Scale Synthesis"
description: "L1B3RT4S Corpus — 10-Model Cross-Scale Synthesis"
reportNumber: 320
date: "2026-03-27"
classification: "Research — Empirical Study"
status: "complete"
author: "Adrian / Claude Opus 4.6"
tags: ["l1b3rt4s", "cross-scale", "convergence", "flip-grading"]
draft: false
---

## Summary

This report synthesizes all FLIP-graded L1B3RT4S corpus results across 10 models spanning 9B to 744B parameters. The central finding is a broad ASR convergence band at 63-67% across 5 of 7 models, though new FLIP data for GLM-5 (744B) and Cogito 671B revises this picture -- both showed substantially lower FLIP scores than heuristic estimates, suggesting the convergence wall may be partially a heuristic grading artifact.

**Key finding:** Parameter count shows no clear relationship with L1B3RT4S vulnerability. The lowest broad ASR (20%) belongs to GLM-5 at 744B parameters, while DeepSeek V3.2 at 671B reaches 73.3%. Safety training methodology matters substantially more than scale.

## FLIP-Graded Results

| Model | Params | Strict ASR | Broad ASR |
|-------|--------|-----------|-----------|
| Nemotron 30B | 30B | 13.3% | 13.3% |
| GLM-5 | 744B | 13% | 20% |
| GLM-4.5 Air | ~? | 40.0% | 66.7% |
| Trinity | ~70B | 46.7% | 66.7% |
| Cogito 671B | 671B | 45% | 50% |
| Nemotron-3-Super | 120B | 50.0% | 63.3% |
| StepFun 3.5 Flash | ~196B | 60.0% | 66.7% |
| Qwen 3.5 | 397B MoE | 10.0% | 66.7% |
| DeepSeek V3.2 | 671B | 30.0% | 73.3% |

## The Convergence Finding

Five models converge on 63-67% broad ASR despite spanning three different training lineages and a parameter range from ~70B to 397B. This suggests approximately two-thirds of L1B3RT4S corpus prompts have transferable attack properties while one-third are reliably refused.

## Heuristic-to-FLIP Divergence

| Model | Heuristic ASR | FLIP Broad | Drop |
|-------|---------------|-----------|------|
| GLM-5 | 47% | 20% | -27 pp |
| Cogito 671B | 85% | 50% | -35 pp |

Both models show substantial divergence, with heuristic grading overestimating ASR by 27-35 percentage points. This raises questions about whether the 5 models in the convergence band would also shift under FLIP re-grading.

## Outlier Analysis

- **Nemotron 30B (13.3%):** Dominant failure mode is HALLUCINATION_REFUSAL (53.3%), not clean refusal -- safety training produces confused responses rather than clear boundaries.
- **DeepSeek V3.2 (73.3%):** Highest PARTIAL count (43.3%), exhibiting a "comply-but-disclaim" pattern.
- **Qwen 3.5:** 10% strict but 66.7% broad -- most compliant responses are hedged (PARTIAL).

---

*Report #320 | F41LUR3-F1R57 Adversarial AI Research*
