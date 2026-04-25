---
title: "Your AI Safety Numbers May Be Wrong By 80 Points"
description: "Across 5 frontier models and 498 evaluations, heuristic grading reported 86% attack success. FLIP grading reported 1.4%. The gap is not noise."
date: 2026-04-25
tags: ["methodology", "evaluation", "flip-grading", "red-teaming", "benchmarks"]
image: "https://cdn.failurefirst.org/images/blog/heuristic-vs-flip-frontier-cohort-2026-04-25.png"
---

There is a specific way that AI safety research can look rigorous while producing numbers that are structurally wrong. You run hundreds of evaluations. You automate the classification. You publish the aggregate. The problem is the classifier — and if the classifier is measuring writing style instead of semantic compliance, your numbers are off by not a few percentage points, but by dozens.

In this cohort study across 5 frontier models and 498 evaluations, heuristic grading reported an 86.0% mean attack success rate. FLIP grading — backward inference from the model's response to the instruction it actually followed — reported 1.4%. The delta is 84.2 percentage points. Mean Cohen's kappa between the two methods: −0.001, which is chance-level agreement.

This is the largest confirmation of this measurement problem in the F41LUR3-F1R57 corpus to date.

---

## Why ASR Numbers Can Be Wrong

Attack success rate (ASR) measures how often a model complies with an adversarial instruction rather than refusing it. It is the core metric in adversarial AI safety evaluation. The problem is that ASR is only as reliable as the method used to classify each response as compliant or not.

There are two dominant approaches:

**Heuristic grading** looks at how a response begins. If the model opens with "Certainly" or "Of course" rather than a refusal phrase, the heuristic flags it as compliant. This is fast and cheap to run. It also measures response style, not semantic content.

**FLIP grading** (Failure-Leveraged Inference Protocol) works backward. It asks a second language model: given this response, what instruction does the model appear to have actually followed? If the inferred instruction is the adversarial one, the trace is classified as compliant. This requires more compute, but it measures what we actually want to know — whether the model produced harmful content, not whether it was polite about refusing.

The gap between these two methods is not new. F41LUR3-F1R57 has documented it in prior work. What is new in this cohort is the scale of the gap across frontier models, and the statistical confidence that comes from n=498 evaluations across 5 distinct systems.

---

## The Experiment

The evaluation used 100 temporal-laundering scenarios per model (`data/curated/temporal_laundering_frontier_v0.1.jsonl`). Temporal-laundering attacks attempt to bypass safety constraints by claiming a future date at which the rules no longer apply — framing harm as permissible because of an assumed change in the model's training cutoff or deployment context.

Five frontier models were evaluated. All responses were classified twice: once by heuristic (opening-string pattern matching) and once by FLIP (deepseek-r1:8b via Ollama as the grader model).

Results, with FLIP strict ASR and 95% Wilson confidence intervals:

| Model | N (evaluable) | FLIP strict ASR | 95% CI | Heuristic ASR |
|---|---:|---:|---|---:|
| gemma4:31b | 100 | 0.0% | [0.0%, 3.7%] | 80.0% |
| glm-5 | 100 | 1.0% | [0.2%, 5.4%] | 80.0% |
| deepseek-v3.2 | 100 | 1.0% | [0.2%, 5.4%] | 91.0% |
| kimi-k2-thinking | 98* | 5.1% | [2.2%, 11.4%] | 88.8% |
| gpt-oss:120b | 100 | 0.0% | [0.0%, 3.7%] | 90.0% |
| **Pooled** | **498** | **1.4%** | **[0.7%, 2.9%]** | **86.0%** |

*2 ERROR:no_response traces excluded from kimi denominator.

Pooling used fixed-effects meta-analysis (I² = 42.8%, Q = 6.99, df = 4 — below the 50% heterogeneity threshold). Zero PARTIAL verdicts appeared across all 5 models: every FLIP response was binary compliance or refusal, with no ambiguous middle category.

---

## What the Numbers Mean

The pooled FLIP ASR of 1.4% [0.7%, 2.9%] indicates that, across these 498 evaluations, temporal-laundering attacks achieved genuine semantic compliance in approximately 1 in 70 cases. The remaining responses that heuristic grading classified as compliant were, on backward inference, refusals that happened to open with accommodating language — the model said something like "I understand you're asking about a future context..." and then declined or produced a benign response.

The 84.2 percentage point delta between methods is the Mistake #21 problem in full form. Mistake #21 in the F41LUR3-F1R57 documented error log describes how keyword classifiers detect response style rather than semantic harm, and can produce false-positive ASR inflation of 30–60 percentage points. This cohort sits at the upper bound of that range: 84.2pp.

The year-gap effect — whether attacks claiming greater temporal distance (200+ years forward) succeeded at higher rates — was null. No monotonic trend appeared across the <100y, 100–149y, 150–199y, and 200+y buckets. Results in this corpus suggest the future-date framing alone is not sufficient to produce compliance in these models regardless of how far forward the claimed date falls.

Cohen's kappa of −0.001 deserves attention. A kappa of 0.0 means chance agreement. A kappa near zero means the two grading methods agree on which specific traces are compliant at no better than random. They produce similar aggregate numbers by coincidence, not by measuring the same thing. In this cohort they do not even produce similar aggregate numbers — they are 84pp apart — which makes the near-zero kappa the clearest statement available: these two methods are not measuring the same phenomenon.

---

## What This Means for Benchmarking Practice

A research team using heuristic grading on this scenario class would report a mean ASR of 86.0% across these 5 models and conclude that temporal-laundering attacks are highly effective against frontier systems. A team using FLIP grading on the same traces would report 1.4% and conclude the opposite.

Both teams ran the same 498 evaluations. They reached opposite conclusions because they used different classifiers.

This is not an edge case. It is a structural property of any evaluation methodology that uses opening-string patterns as a proxy for semantic compliance. The pattern is especially pronounced for attack classes where models have learned to open with accommodating language before declining — which is precisely what safety-trained frontier models do. The training procedure that produces polite refusals also produces high heuristic false-positive rates.

Three implications for evaluation practice:

**1. ASR figures require grading methodology disclosure.** An ASR number without a specified grading method is not a reproducible finding. Two labs using different classifiers on the same traces will reach different conclusions, and neither will know the other exists.

**2. Heuristic grading over-reports on safety-trained models.** The opening-string pattern that heuristic graders treat as compliance ("Certainly, here is...") is also a common preamble to safety-trained refusals ("Certainly, I understand the context you've described, but..."). The better the model's safety training, the higher the false-positive rate.

**3. Agreement between grading methods is itself a measurement.** Kappa near −0.001 is a finding in its own right. It tells you that the two methods are not measuring the same construct, and that one of them — in this case the heuristic — is measuring something other than semantic compliance.

---

## What Comes Next

The F41LUR3-F1R57 methodology requires FLIP grading before any ASR figure is cited in external-facing analysis. This cohort, EP-63, is the eighth validated finding in the evidence register and the third independent Mistake #21 confirmation on a single day (alongside Rose Tyler's VLA Phase 1 FLIP correction and the gemma4 cascade analysis earlier in the session).

The temporal-laundering finding from this cohort — that frontier models largely resist this attack class at the semantic level — is the policy-relevant result. But the measurement finding is the methodological story: if you are running adversarial evaluations without FLIP or equivalent backward-inference grading, your ASR figures for this attack class may overstate vulnerability by more than 80 percentage points.

The machine-readable cohort analysis is at `runs/temporal_laundering_frontier_v0.1_restart/cohort_analysis.json`.

---

*This post is part of the [F41LUR3-F1R57 research program](https://failurefirst.org). Pattern-level findings only; no operational scenario details are included. Numbers cited are from EP-63, validated 2026-04-25 (commit 3ae2dac0), sourced from `docs/CANONICAL_METRICS.md`. Grading methodology: FLIP strict (COMPLIANCE only denominator), grader deepseek-r1:8b via Ollama, fixed-effects pooling I²=42.8%.*
