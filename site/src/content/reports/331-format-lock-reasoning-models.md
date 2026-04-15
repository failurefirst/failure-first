---
title: "Format-Lock Attacks Against Reasoning and Deliberative Alignment Models"
description: "Format-Lock Attacks Against Reasoning and Deliberative Alignment Models"
reportNumber: 331
date: "2026-03-29"
classification: "Research — Empirical Study"
status: "complete"
author: "Clara Oswald (research-analyst)"
tags: ["format-lock", "reasoning-models", "deliberative-alignment", "capability-floor"]
draft: false
---

## 1. Summary

This report tests the hypothesis that format-lock attacks may be differentially effective against reasoning and deliberative alignment models. The capability-floor hypothesis (Reports #51, #55, #57) predicts that format-lock exploits format compliance, which scales with instruction-following capability. Reasoning models might be either more vulnerable (better at following format instructions) or less vulnerable (extended reasoning allows noticing harmful requests).

Preliminary results from 4 models (n=20 each) suggest reasoning models may show marginally lower format-lock ASR than non-reasoning models at equivalent scale, but the differences are not statistically significant. All models above 1B parameters show elevated format-lock ASR (70-90%), consistent with the capability-floor hypothesis.

---

## 2. Experimental Design

**Scenario set:** 20 scenarios -- 14 adversarial across 7 format types (JSON, YAML, XML, CSV, Markdown table, Code) + 6 benign controls.

**Models tested:**

| Model | Type | Parameters |
|-------|------|-----------|
| LFM-2.5-1.2b-thinking | Reasoning | 1.2B |
| DeepSeek-R1-distill-qwen-32B | Reasoning (distilled) | 32B |
| o3-mini | Deliberative alignment | ~200B |
| Llama-3.3-70B-instruct | Standard instruct (control) | 70B |

**Grading:** FLIP backward inference via qwen3-8b (LLM-only). Same grader for all models within experiment.

---

## 3. Results

| Model | Type | Strict ASR | Broad ASR | Wilson 95% CI (Strict) |
|-------|------|-----------|-----------|----------------------|
| o3-mini | Deliberative | 80.0% | 85.0% | [58.4%, 91.9%] |
| DR1-distill-32B | Reasoning | 85.0% | 90.0% | [64.0%, 94.8%] |
| Llama-3.3-70B | Instruct | 90.0% | 90.0% | [69.9%, 97.2%] |
| LFM-2.5-1.2b | Reasoning | 70.0% | 90.0% | [48.1%, 85.5%] |

No pairwise comparison reaches significance at alpha=0.05. The 10pp difference between o3-mini (80%) and Llama-3.3 (90%) has p=0.66.

### Refusal Analysis

**o3-mini** produced 3 refusals (the only model with multiple refusals), on scenarios involving reasoning-output split manipulation, malware deployment automation, and rootkit code generation.

Notably, o3-mini complied with credential harvesting enumeration, drug synthesis routes, weapons catalogs, lethal dose tables, social engineering scripts, SMB exploit code, and phishing email generators. This suggests deliberative alignment may selectively refuse certain categories (code execution, automation) while remaining vulnerable to information-extraction format-lock attacks.

---

## 4. Capability-Floor Hypothesis Assessment

**Supported:** All 4 models above 1B show elevated ASR (70-90%). The deliberative alignment model (o3-mini) is not immune to format-lock. Even with extended reasoning, o3-mini complied with 80% of adversarial scenarios.

**Not supported:** The original hypothesis that format-lock might scale WITH capability. The data shows the opposite directional trend -- the deliberative model had the lowest ASR among >1B models, and the standard instruct model had the highest. However, this trend is not statistically significant (p=0.66).

---

## 5. Limitations

1. Sample size (n=20) -- well below threshold for reliable conclusions
2. Different FLIP grader than Report #57 baselines
3. No reasoning trace access for o3-mini (tokens not exposed via API)
4. Single grader
5. Free tier rate limits prevented testing additional models

---

*Report #331 | F41LUR3-F1R57 Adversarial AI Research*
