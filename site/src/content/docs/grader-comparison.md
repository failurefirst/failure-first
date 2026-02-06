---
title: "Grader Comparison Guide"
description: "Technical guide on automated grading tiers (Heuristic vs. LLM) for safety benchmarking"
last_updated: 2026-02-06
category: "evaluation"
related: ["grader-comparison-report", "dataset-user-guide"]
toc: true
---

# Grader Comparison Guide

This guide describes the different automated grading tiers used in the FERT framework, providing researchers with the necessary information to choose the right approach for their benchmarking.

## 1. Grading Tier Overview

| Tier | Name | Method | Speed | Cost | Accuracy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tier 1** | **Code Detector** | Regex/Keyword matching | Instant | $0 | ~70-85% |
| **Tier 2** | **LLM Judge** | Single-call semantic evaluation | Slow | $0.01+ | ~90-95% |
| **Tier 3** | **Consensus** | 3-model majority vote | Very Slow | $0.03+ | ~98%+ |

---

## 2. Tier 1: Code-Based Detector

The code-based detector uses heuristic pattern matching to flag success or refusal.

### How it Works
- **Refusal Detection**: Searches for common phrases like "I cannot", "Against my guidelines", "As an AI", etc.
- **Jailbreak Detection**: Searches for structural indicators of compliance, such as "Step 1:", "Here is the code", or the presence of requested formatting (JSON/YAML).

### Strengths
- **Zero Cost**: Ideal for large-scale initial screening of thousands of results.
- **Deterministic**: Always gives the same result for the same text.
- **Explainable**: High visibility into why a match occurred via result flags.

### Weaknesses
- **Style Over Substance**: Flags "Helpful" style as a jailbreak even if the model is refusing (e.g., "Step 1: Understand why I cannot help you").
- **Misses Subtle Refusals**: Often fails to catch nuanced hedging or "refuse-then-comply" patterns.
- **High False Positive Rate**: Keyword matching detects response style (helpful, step-by-step), not semantic harm.

---

## 3. Tier 2: LLM Judge (Recommended)

The LLM Judge uses a sophisticated model (typically Gemini 1.5 Pro or Flash) to read the prompt and response and make a semantic judgment.

### How it Works
- The judge is provided with a rubric defining **Compliance**, **Refusal**, and **Partial**.
- It reasons about the intent of the response rather than just keywords.

### Strengths
- **Semantic Understanding**: Can detect when a model is following the *spirit* of an attack vs. just the *format*.
- **Handles Hedging**: Excellent at correctly classifying "Refuse-then-comply" patterns.
- **Context Aware**: Knows the difference between a real jailbreak and a discussion about jailbreaks.

### Weaknesses
- **API Latency**: Evaluation of a full benchmark can take minutes or hours.
- **Financial Cost**: Costs scale linearly with benchmark size.
- **Recursive Risk**: Using an LLM to judge an LLM can sometimes introduce systematic biases (e.g., preference for longer responses).

---

## 4. Decision Guidance: Which to Use?

| Scenario | Recommended Grader |
| :--- | :--- |
| **Rapid Iteration** | Code Detector (Screening) |
| **Large-Scale Trends (10K+ traces)** | Code Detector + 10% LLM Judge Validation |
| **Standard Benchmark Runs** | **LLM Judge (Single)** |
| **Final Research Findings / Papers** | LLM Judge (Single) or Consensus |
| **Calibrating new attack classes** | Human-Verified Consensus |

---

## 5. Known Issues & Lessons Learned

Before relying on automated grading, researchers should be aware of these findings:

- **Unvalidated Heuristics**: Heuristics must be manually spot-checked on every new model family.
- **Disclaimers ≠ Refusals**: A response can contain a disclaimer and still be a 100% successful jailbreak.
- **Keyword False Positives**: Keyword matching often detects *helpfulness* rather than *harm*.

---

## Related Documentation
- [Grader Comparison Report](/docs/grader-comparison-report) - Detailed analysis of grader reliability
- [Dataset User Guide](/docs/dataset-user-guide) - Using datasets for evaluation
