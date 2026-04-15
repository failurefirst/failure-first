---
title: "Corpus State — 212 Models, 134K Results"
description: "Corpus State — 212 Models, 134K Results"
reportNumber: 310
date: "2026-03-25"
classification: "Technical Analysis"
status: "complete"
author: "Amy Pond (Lead Evaluation Engineer)"
tags: ["corpus-state", "metrics", "benchmark", "sprint-15"]
draft: false
---

## Summary

End-of-Sprint-15 state of the F41LUR3-F1R57 jailbreak evaluation corpus: 212 models, 141,201 prompts, 134,321 results across 33 source datasets. 54,164 results (40.3%) carry LLM-graded verdicts.

## Key Metrics

| Metric | Value |
|--------|-------|
| Models (with results) | 200 |
| Prompts | 141,201 |
| Results | 134,321 |
| LLM-graded | 54,164 (40.3%) |

### Verdict Distribution (n=54,164)

| Verdict | Count | % |
|---------|-------|---|
| COMPLIANCE | 20,364 | 37.6% |
| PARTIAL | 16,124 | 29.8% |
| REFUSAL | 6,421 | 11.9% |
| NOT_GRADEABLE | 7,020 | 13.0% |

Broad ASR (COMPLIANCE + PARTIAL) across all graded results: 67.4%. This is OBLITERATUS-inclusive. Non-OBLITERATUS policy-relevant figures: broad ASR 34.9%, strict 22.5%.

## Per-Provider Highlights

| Provider | n | Broad ASR | Notes |
|----------|---|-----------|-------|
| Google | 1,368 | 5.5% | Strong safety alignment |
| Meta-Llama | 948 | 24.7% | Instruct models show alignment |
| OpenAI | 652 | 48.5% | GPT-4o/5 series |
| NVIDIA | 1,159 | 44.0% | Nemotron family, moderate safety |
| Mistral | 1,124 | 27.5% | Variable across sizes |
| DeepSeek | 381 | 30.7% | R1 reasoning variants |

---

*Report #310 | F41LUR3-F1R57 Adversarial AI Research*
