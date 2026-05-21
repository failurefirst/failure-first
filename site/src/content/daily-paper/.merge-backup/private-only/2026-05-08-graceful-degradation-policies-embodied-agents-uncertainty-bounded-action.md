---
title: "Graceful Degradation Policies for Embodied Agents under Uncertainty-Bounded Action"
description: "Proposes a control architecture in which the embodied agent's action confidence is mapped to a continuum of safer fallback behaviours — slowing, stopping, requesting help — rather than the binary execute-or-refuse pattern that dominates current systems."
date: 2026-05-08
arxiv: "2604.20847"
authors: "null"
paperType: "methods"
tags: [embodied-ai,uncertainty-quantification,graceful-degradation,safety-fallback,human-in-the-loop,control-policy]
draft: false
---

# Graceful Degradation Policies for Embodied Agents under Uncertainty-Bounded Action

Current embodied agents tend to operate in a binary mode: either execute the action the policy proposes, or refuse the task entirely. This paper argues that the binary mode is the wrong abstraction. Between "confident action" and "refusal" sits a continuum of safer fallback behaviours — slower execution, conservative action variants, partial completion with handoff — that the agent should be using when its confidence falls below a task-appropriate threshold but above a refusal threshold.

### The Two-Threshold Architecture

The paper proposes a control policy organised around two confidence thresholds rather than one. Above the upper threshold, the agent executes normally. Below the lower threshold, the agent halts and requests human intervention. Between them, the agent enters a *degraded* operating mode whose specific behaviour depends on the task:

- For **navigation tasks**, degraded mode means reduced speed, expanded obstacle margins, and avoidance of irreversible manoeuvres (no entering doorways from which reversal is constrained, no committing to multi-step plans).
- For **manipulation tasks**, degraded mode means lower grip forces, slower approach trajectories, and a preference for stable intermediate configurations from which the action can be aborted without dropping the object.
- For **multi-step plans**, degraded mode means checkpointing — completing the current sub-step and pausing for confirmation rather than proceeding to the next without further input.

The thresholds themselves are task-conditioned: a kitchen-cleaning task tolerates more uncertainty than a medication-handling task, and the policy exposes those tolerances as configurable parameters rather than baked-in constants.

### Why Binary Execute-or-Refuse Fails

The binary policy creates a perverse incentive structure: because refusal is costly (task incomplete) and execution is rewarded (task complete), the agent's training pressure pushes confidence calibration toward over-confidence. A well-calibrated agent that correctly reports uncertainty will refuse more often, score lower on benchmarks, and be selected against. The binary policy thus actively works against calibration.

The continuum policy decouples this. Reporting uncertainty does not trigger refusal; it triggers a slower, safer execution mode. The training signal for calibration becomes "your degraded-mode execution should still complete the task most of the time" rather than "you must execute confidently or not at all." Calibration becomes compatible with task completion, not opposed to it.

### Implementation Sketch

The paper presents a reference implementation in which the policy network outputs both an action and a confidence score. A wrapper module consumes both and dispatches to one of three controllers — normal, degraded, or halt — based on threshold comparison. The degraded controller is a deterministic transform of the normal controller's action: smaller step sizes, lower forces, expanded safety margins. No retraining of the underlying policy is required; the wrapper is a behaviour-time addition.

The empirical section reports task completion rates and failure-mode distributions across the three modes. Headline numbers favour the continuum policy on a "safe completion" metric that weights catastrophic failures heavily, but the more interesting result is the shift in *what kinds of failures occur*: catastrophic failures decrease, while help-requests and slow completions increase. The total failure rate drops modestly; the failure cost distribution shifts substantially.

### What This Doesn't Solve

The paper is honest about limitations. Calibration error remains the dominant failure mode — if the policy's confidence score is systematically miscalibrated, the threshold-based dispatch will misfire. The framework moves the problem from "execute-or-refuse" to "calibrate well enough to threshold correctly," which is progress, not solution. Methods for calibrating embodied agents' confidence remain underdeveloped, and the paper points to this as the most important downstream research direction.

### Failure-First Implications

This paper formalises a control pattern that the F41LUR3-F1R57 framework has been advocating implicitly through the "reentry support" scenario class: an agent that can degrade gracefully provides reentry points for human supervision; an agent that operates in execute-or-refuse mode does not. The two-threshold policy is the architectural complement to evaluation regimes that test whether agents can be safely interrupted, redirected, or assisted mid-task. Without such an architecture, the evaluation regime has nothing to test.

*Read the [full paper on arXiv](https://arxiv.org/abs/2604.20847) · [PDF](https://arxiv.org/pdf/2604.20847.pdf)*
