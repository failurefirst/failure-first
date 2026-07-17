---

title: "Graceful Degradation Policies for Embodied Agents under Uncertainty-Bounded Action"
description: "An F41LUR3-F1R57 position piece proposing a control architecture in which an embodied agent's action confidence maps to a continuum of safer fallback behaviours — slowing, stopping, requesting help — rather than the binary execute-or-refuse pattern that dominates current systems. This is a design proposal, not a report of an implemented or evaluated system."
date: 2026-05-08
paperType: "position"
tags: [embodied-ai,uncertainty-quantification,graceful-degradation,safety-fallback,human-in-the-loop,control-policy]
audio: "https://cdn.failurefirst.org/audio/daily-paper/2604.20847-audio-overview.m4a"
draft: false
image: "https://cdn.failurefirst.org/images/daily-paper/2026-05-08-graceful-degradation-policies-embodied-agents-uncertainty-bounded-action.png"
---

# Graceful Degradation Policies for Embodied Agents under Uncertainty-Bounded Action

*This is an F41LUR3-F1R57 position piece sketching a control architecture, not a summary of an external paper or an implemented and evaluated system.*

Current embodied agents tend to operate in a binary mode: either execute the action the policy proposes, or refuse the task entirely. We argue that the binary mode is the wrong abstraction. Between "confident action" and "refusal" sits a continuum of safer fallback behaviours — slower execution, conservative action variants, partial completion with handoff — that an agent could use when its confidence falls below a task-appropriate threshold but above a refusal threshold.

### A Two-Threshold Architecture

We sketch a control policy organised around two confidence thresholds rather than one. Above the upper threshold, the agent executes normally. Below the lower threshold, the agent halts and requests human intervention. Between them, the agent would enter a *degraded* operating mode whose specific behaviour depends on the task:

- For **navigation tasks**, degraded mode would mean reduced speed, expanded obstacle margins, and avoidance of irreversible manoeuvres (no entering doorways from which reversal is constrained, no committing to multi-step plans).
- For **manipulation tasks**, degraded mode would mean lower grip forces, slower approach trajectories, and a preference for stable intermediate configurations from which the action can be aborted without dropping the object.
- For **multi-step plans**, degraded mode would mean checkpointing — completing the current sub-step and pausing for confirmation rather than proceeding to the next without further input.

The thresholds themselves would be task-conditioned: a kitchen-cleaning task can tolerate more uncertainty than a medication-handling task, so the design exposes those tolerances as configurable parameters rather than baked-in constants.

### Why Binary Execute-or-Refuse Fails

The binary policy creates a perverse incentive structure: because refusal is costly (task incomplete) and execution is rewarded (task complete), training pressure pushes confidence calibration toward over-confidence. A well-calibrated agent that correctly reports uncertainty will refuse more often, score lower on benchmarks, and be selected against. The binary policy thus actively works against calibration.

A continuum policy would decouple this. Reporting uncertainty would not trigger refusal; it would trigger a slower, safer execution mode. The training signal for calibration becomes "your degraded-mode execution should still complete the task most of the time" rather than "you must execute confidently or not at all" — calibration compatible with task completion, rather than opposed to it. This is a hypothesised training-dynamics benefit, not something we have demonstrated.

### Implementation Sketch

One reference implementation we can imagine: a policy network that outputs both an action and a confidence score. A wrapper module would consume both and dispatch to one of three controllers — normal, degraded, or halt — based on threshold comparison. The degraded controller would be a deterministic transform of the normal controller's action: smaller step sizes, lower forces, expanded safety margins. No retraining of the underlying policy should be required; the wrapper would be a behaviour-time addition.

**We have not built or evaluated this system.** An earlier version of this post reported specific task-completion rates and a "safe completion" metric as though from an implemented empirical study. Those numbers were fabricated and have been removed rather than re-sourced — see the editorial note below.

### What This Doesn't Solve

Calibration error would remain the dominant failure mode for this design — if the policy's confidence score is systematically miscalibrated, threshold-based dispatch would misfire. The proposal moves the problem from "execute-or-refuse" to "calibrate well enough to threshold correctly," which is a reframing, not a solution. Methods for calibrating embodied agents' confidence remain underdeveloped, in our view the most important open direction here.

### Failure-First Implications

This proposal formalises a control pattern the F41LUR3-F1R57 framework has been advocating implicitly through the "reentry support" scenario class: an agent that can degrade gracefully provides reentry points for human supervision; an agent that operates in execute-or-refuse mode does not. The two-threshold policy is the architectural complement to evaluation regimes that test whether agents can be safely interrupted, redirected, or assisted mid-task. Without such an architecture, the evaluation regime has nothing to test.

---

*Editorial note: this post previously described itself as summarising a "paper" with a reference implementation and an empirical results section reporting specific task-completion rates. No such paper or empirical study exists — see [issue #972](https://github.com/adrianwedd/failure-first-embodied-ai/issues/972). It has been corrected to an honest first-person F41LUR3-F1R57 design proposal, with all fabricated quantitative results removed, not re-sourced.*

