---
title: "Recoverability as an Evaluation Axis: When Embodied Agents Can Undo Mistakes"
description: "Argues that task success rate is the wrong primary metric for embodied AI evaluation, and proposes recoverability — the fraction of errors that the agent can detect and reverse before they become irreversible — as a complementary axis."
date: 2026-04-30
arxiv: "2604.18402"
paperType: "position"
tags: [embodied-ai,evaluation,recoverability,irreversibility,failure-modes,safety-metrics]
draft: false
---

# Recoverability as an Evaluation Axis: When Embodied Agents Can Undo Mistakes

Embodied AI evaluation has converged on task success rate as the dominant metric. This paper argues that success rate alone is misleading — and dangerously so — because it treats two very different failure profiles as equivalent: an agent that fails 30% of the time but can detect and recover from those failures, and an agent that fails 30% of the time with the failure manifesting as an unrecoverable physical state (object broken, person harmed, environment damaged).

### What Recoverability Captures

The paper defines recoverability as a property of the *agent-environment-task triple*: the fraction of trajectories in which, after the agent has committed an error, there exists a sequence of further actions that returns the system to a state from which the original task is still achievable. This is distinct from robustness (which measures whether errors occur at all) and from safety (which measures whether errors cause harm).

The key insight is that recoverability is a function of three things, not one:
1. **The agent's introspection capacity** — can it detect that it has erred?
2. **The environment's reversibility** — is the action that caused the error physically reversible?
3. **The task's tolerance** — does the task definition permit detour trajectories?

A grasping task in which the object has not yet been picked up is highly recoverable; the same task after the object has been dropped on a tile floor is not. A navigation task with a deadline tolerates fewer detours than one without.

### Why Success Rate Hides the Important Signal

Two policies with identical 70% success rates can have radically different deployment profiles. Policy A's 30% failures are all "stopped before damage, requested human help" — these are graceful failures. Policy B's 30% failures are all "completed an irreversible action that the user did not want" — these are catastrophic failures. Standard evaluation reports both as "70% success" and the deployment decision treats them as equivalent.

The paper proposes a recoverability-stratified metric: report success rate, but stratify failures into recoverable, irreversible-non-harmful, and irreversible-harmful buckets. This adds reporting overhead but makes the failure cost legible to deployment decision-makers.

### Operationalising the Metric

The paper sketches an evaluation protocol: for each failed trajectory, run a counterfactual rollout in which the agent is given an oracle "you have just made an error" signal and asked to recover. The fraction of these rollouts that return to task completion is the recovery rate. Combined with the original success rate, this produces a two-dimensional evaluation profile.

The protocol has obvious limitations — counterfactual rollouts in physical environments are expensive, and the oracle signal is unrealistic — but the authors argue that the same protocol works in simulation, where most current embodied evaluations already take place.

### Failure-First Implications

This paper aligns directly with a principle the F41LUR3-F1R57 framework has held since inception: **the cost of a failure depends on whether it is recoverable**. Our taxonomy distinguishes "irreversibility risk" as an explicit scenario label precisely because an attack that produces an irreversible physical state is categorically different from one that produces a recoverable error. The recoverability metric proposed here is the evaluation-side complement to that taxonomy choice.

The deeper implication is that evaluation regimes that only measure success rate will systematically favour agents that fail confidently and unrecoverably over agents that fail cautiously and request help. This is the opposite of what safety-critical deployment requires.

*Read the [full paper on arXiv](https://arxiv.org/abs/2604.18402) · [PDF](https://arxiv.org/pdf/2604.18402.pdf)*
