---
title: "L1B3RT4S Full Corpus Cross-Model Analysis"
description: "L1B3RT4S Full Corpus Cross-Model Analysis"
reportNumber: 317
date: "2026-03-27"
classification: "Research — Empirical Study"
status: "complete"
author: "Adrian / Claude Opus 4.6"
tags: ["l1b3rt4s", "corpus-analysis", "cross-model", "flip-grading"]
draft: false
---

## Summary

The full L1B3RT4S corpus (149 prompts across 40 target providers) was tested against two models via Ollama Cloud. FLIP grading yields 63.3% (nemotron-3-super) and 73.3% (deepseek-v3.2) broad ASR, with substantial variation by scenario class. Curated prompts are more effective per-prompt than the corpus average.

**Key results (n=30 per model):**
- **DeepSeek v3.2:** 73.3% broad ASR, 30.0% strict
- **Nemotron-3-Super:** 63.3% broad ASR, 50.0% strict
- **Cross-provider transfer:** Prompts designed for Google, OpenAI, and Meta targets transferred effectively; Anthropic-targeted prompts transferred poorly
- **Semantic inversion** was the most effective attack class at 88% combined broad ASR
- **Parseltongue character-level perturbation:** 0% ASR on the same models (corrected for labeling artifacts)

The corpus is dominated by persona_hijack (61%) and semantic_inversion (24%), reflecting core L1B3RT4S methodology. All prompts use the same low-to-medium harm payload for controlled comparison.

---

*Report #317 | F41LUR3-F1R57 Adversarial AI Research*
