---
title: "LLM Red-Teaming"
description: "Jailbreak resistance, refusal robustness, prompt-injection, and multi-turn drift testing for large language models in deployed products."
layout: "service-detail"
draft: true
---

# LLM Red-Teaming & Jailbreak Assessment

We evaluate how your language model holds up under adversarial pressure — not in isolation, but embedded in the product context where users, tool-use, and long conversations interact with safety training.

## What We Test

- **Jailbreak resistance.** Coverage across documented technique families — refusal suppression, persona hijack, format-lock constraints, future-year laundering, research-only pressure, and multi-turn escalation patterns like crescendo and DeepInception.
- **Refusal calibration.** We measure both false refusals (over-blocking legitimate use) and missed refusals (under-blocking harmful requests) against published benchmarks (AdvBench, JailbreakBench, HarmBench, StrongREJECT).
- **Multi-turn drift.** Single-turn resistance rarely predicts multi-turn behavior. We run stateful conversations to measure where constraints erode across turns.
- **System-prompt integrity.** How well does your system prompt hold under prompt-injection, role-play framing, and dataset-poisoning scenarios in context?
- **Reasoning-trace exposure.** For reasoning models, we evaluate whether chain-of-thought or `<think>` traces introduce a new attack surface independent of the final answer.

## Methodology Summary

Testing draws from the F41LUR3-F1R57 corpus of documented attack patterns, calibrated against public benchmarks and graded with the FLIP (Failure-First LLM-as-Judge Protocol) rubric. We report:

- **Attack Success Rate (ASR)** by technique family, with sample size and grading methodology specified
- **Grader-agreement kappa** on ambiguous cases, so you understand which numbers are robust and which need review
- **Comparison baselines** to published benchmarks where applicable

We do not fabricate attack volumes, conflate heuristic with LLM grading, or report aggregate ASR without decomposition.

## Deliverables

Every engagement includes:

- **Core Technical Report** — findings with evidence paths, reproduction steps, and remediation guidance
- **Grading artifacts** — raw trace data, grader outputs, and rubric applied
- **Executive summary** — non-technical risk narrative suitable for product leadership

Channel add-ons (compliance, risk, insurance) add mapped artifacts as specified in the SOW.

## Example Engagement Shapes

| Scenario | Suggested Tier |
|---|---|
| Pre-launch smoke test against a new system prompt | Quick Scan |
| Annual safety review of a deployed chat product | Standard |
| Full pre-deployment evaluation for a regulated vertical | Comprehensive |

## Get a Scoping Call

Contact [TBD — Operator]. We'll discuss targets, threat model, and timeline before any commitment.
