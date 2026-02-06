---
title: "Grader Comparison Report: Heuristic vs. LLM Judge"
description: "Technical analysis of automated grading strategies for classifying model responses in safety benchmarks"
last_updated: 2026-02-06
category: "evaluation"
related: ["grader-comparison", "dataset-user-guide"]
toc: true
---

# Grader Comparison Report: Heuristic vs. LLM Judge

## 1. Executive Summary

This report evaluates the reliability of different automated grading strategies used to classify model responses as **COMPLIANCE** (Jailbreak), **REFUSAL**, or **PARTIAL**.

Based on an analysis of approximately 19,000 results and a human-verified calibration set of 300 samples, we find that:
- **Heuristic agreement** varies wildly by model family (25% to 81%).
- **Gemini-3-flash-preview** is the most reliable LLM judge for this domain.
- **Subtle Refusals** are the primary source of disagreement, where heuristics flag compliance but LLMs detect a refusal.

---

## 2. Grading Tiers

| Tier | Method | Cost | Accuracy | Best Use |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1** | **Heuristic** (Keyword) | $0 | Low-Medium | Initial sweeps, large-scale pre-filtering. |
| **Tier 2** | **LLM Judge** (Single) | High | High | Standard benchmarking, per-prompt labeling. |
| **Tier 3** | **Consensus** (Multi-Judge) | Very High | Highest | Research-grade validation, paper-ready results. |

---

## 3. Data Analysis: Agreement Rates

### Overall Calibration (N=300)
- **Agreement Rate:** 82.0%
- **Disagreement Rate:** 18.0%

### Model-Specific Agreement (Database Snapshot)
| Model | Total Results | Agreement % | Heuristic Compliance / LLM Refusal |
| :--- | :--- | :--- | :--- |
| **meta-llama/llama-3.3-70b** | 7 | 85.7% | 0 |
| **gemini-3-flash-preview** | 63 | 81.0% | 2 |
| **claude-sonnet-4-5** | 64 | 65.6% | 12 |
| **gpt-5.2-pro** | 63 | 25.4% | 37 |

**Observation:** Newer, more sophisticated models (like GPT-5.2) show the lowest agreement. This is because these models often use complex, nuanced language for refusals that does not trigger standard "I cannot" keyword filters.

---

## 4. Common Failure Modes

### 4.1 Heuristic False Positives (Jailbreak)
Heuristics often flag a response as a "jailbreak" if it contains structural markers like `Step 1:`, even if the model is refusing or discussing the prompt theoretically.
- **Example:** *"I cannot provide a jailbreak. However, Step 1: Understand the policy..."* (Flagged as COMPLIANCE by heuristic, REFUSAL by LLM).

### 4.2 Heuristic False Negatives (Refusal)
Subtle refusals or "refuse-then-comply" patterns are often missed.
- **Example:** *"I'm sorry, I'm not supposed to do that. But here is some general info..."* (Flagged as COMPLIANCE if it contains enough subsequent detail).

### 4.3 LLM Judge Hallucination
Judges occasionally hallucinate "jailbreak" content when a model follows a requested format (e.g., JSON) perfectly but provides benign or empty data.

---

## 5. Recommendations for Researchers

1.  **Always use an LLM Judge for final scoring.** Heuristics are useful only for broad trend analysis.
2.  **Gemini-3-flash** is recommended as the "Standard Judge" due to its high agreement with human-verified labels and cost efficiency.
3.  **Investigate GPT-5.2 Anomalies:** When benchmarking against cutting-edge models, manual spot-checks are required as current heuristics fail in approximately 75% of cases.
4.  **Use Consensus for Paper-Ready Data:** For academic publications, use a 3-judge consensus (e.g., Gemini, Claude, and Llama-3-70b).

---

## Related Documentation
- [Grader Comparison Guide](/docs/grader-comparison) - Choosing the right grading tier for your use case
- [Dataset User Guide](/docs/dataset-user-guide) - Understanding dataset structure and usage
