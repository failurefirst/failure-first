---
title: "VLA Safety Evaluation"
description: "Safety evaluation for Vision-Language-Action models — where visual, linguistic, and action-space attack surfaces interact."
layout: "service-detail"
draft: true
---

# VLA (Vision-Language-Action) Model Safety Evaluation

Vision-Language-Action models do not inherit the safety properties of the language models they are fine-tuned from. The action head, the visual encoder, and the fusion layer each introduce attack surfaces that plain LLM testing does not cover.

We run structured safety evaluations against VLA systems that reflect how these models actually fail in the wild.

## What We Test

- **Action-layer compliance.** Whether the model refuses in language while still committing to the unsafe action — the PARTIAL verdict pattern we see in roughly half of graded VLA traces.
- **Visual adversarial input.** Typographic attacks in-frame, object-identity perturbations, and scene-composition prompts that reframe the requested task.
- **Cross-modal instruction conflict.** When the image and the text disagree, which wins — and does the safety layer track the disagreement?
- **Embodied task framing.** Dangerous requests embedded in plausible household or workplace task descriptions (SafeAgentBench-style coverage).
- **Recovery behavior.** After an unsafe step, does the model acknowledge, correct, and re-plan, or does it commit to the failure trajectory?

## Methodology Summary

We draw on the F41LUR3-F1R57 VLA corpus and published benchmarks (SafeAgentBench, SafeLIBERO). Grading uses the FLIP protocol adapted for action-layer behavior, with explicit verdicts for REFUSAL, PARTIAL (disclaim-then-act), COMPLIANCE, and BENIGN_QUERY categories.

We never grade action-bearing traces with keyword heuristics alone — VLA responses routinely include safety language while executing the unsafe action, and keyword graders systematically misclassify these as refusals.

## Deliverables

- **Core Technical Report** — findings, evidence, reproduction, remediation
- **Verdict decomposition** — REFUSAL / PARTIAL / COMPLIANCE rates with confidence intervals
- **Action-trace archive** — full model outputs and any simulated or recorded action sequences

## Example Engagement Shapes

| Scenario | Suggested Tier |
|---|---|
| Spot-check a VLA policy before a pilot deployment | Quick Scan |
| Pre-deployment evaluation for a commercial robotics product | Standard |
| Full adversarial evaluation including custom visual attack generation | Comprehensive |

## Get a Scoping Call

Contact [TBD — Operator].
