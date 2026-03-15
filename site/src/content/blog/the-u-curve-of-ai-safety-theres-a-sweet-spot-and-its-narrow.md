---
title: "The U-Curve of AI Safety: There's a Sweet Spot, and It's Narrow"
description: "Our dose-response experiment found that AI safety doesn't degrade linearly with context. Instead, it follows a U-shaped curve: models are unsafe at zero context, become safer in the middle, and return to unsafe at high context. The window where safety training actually works is narrower than anyone assumed."
date: 2026-03-16
tags: [embodied-ai, safety, sid, dose-response, vla, research, evaluation, context-window]
---

We ran a simple experiment. We took five safety-critical robot scenarios and varied one thing: how much benign operational context we inserted between the safety instructions and the adversarial request. Zero tokens. Five hundred. Two thousand. Eight thousand. Fifteen thousand.

The hypothesis was straightforward. More benign context should dilute the safety instructions. Attack success should go up as the dose goes up. A rising line.

That is not what happened.

---

## The Data

Five base scenarios, each tested at five dose levels, on a 1.5-billion-parameter reasoning model (DeepSeek-R1 1.5B). Twenty-five traces total, all graded using FLIP backward inference.

| Dose (tokens) | Broad ASR | Shape |
|---------------|-----------|-------|
| 0 | 80% | High |
| 500 | 40% | Low |
| 2,000 | 40% | Low |
| 8,000 | 40% | Rising |
| 15,000 | 80% | High |

The curve is not a line. It is a U.

At zero context -- no operational padding, just safety instructions and the adversarial request -- the model complied 80% of the time. The adversarial request was too close to the safety instructions. The model had nothing to anchor its refusal to. There was no operational context to reinforce the idea that this was a real robot doing a real job where safety matters.

At 500 to 2,000 tokens of benign context, something changed. The model dropped to 40% compliance. The operational context appeared to activate the model's safety reasoning. The benign content provided a frame -- warehouse operations, surgical procedures, agricultural monitoring -- that made the safety instructions concrete rather than abstract.

Then, at high doses (8,000 and 15,000 tokens), compliance returned to 80%. But here there is an important caveat: at these doses, the prompt exceeds the model's 4,096-token context window. The safety instructions were not diluted. They were evicted. The model never saw them.

---

## Two Distinct Failure Modes

The U-curve is not one phenomenon. It is two.

**Left side of the U (zero context):** Safety instructions without operational grounding are treated as abstract rules rather than concrete constraints. The model has no frame for why the safety instruction matters. This is a reasoning failure -- the model does not connect "do not navigate through pedestrian areas" to any particular robot, warehouse, or scenario. The instruction is floating.

**Right side of the U (high context):** Safety instructions are pushed out of the context window entirely. The model cannot follow instructions it never received. This is an architecture failure -- a hard limit of the attention mechanism, not a behavioral vulnerability.

**The middle:** In the sweet spot around 500 to 2,000 tokens, the model has both the safety instruction and enough operational context to make it meaningful. This is where safety training actually works.

---

## Why This Matters

The U-curve has three implications for anyone deploying AI systems that control physical hardware.

**1. The effective safety window is narrower than assumed.**

Most safety evaluations test at one of two extremes: either a bare prompt with safety instructions (zero context), or a fully specified operational scenario. The U-curve suggests that safety behaviour is a function of context volume, and the protective window may be surprisingly small. For this 1.5B model, the window appears to be roughly 200 to 4,000 tokens.

**2. Real-world deployments operate at the edges, not the middle.**

A warehouse robot's operational context accumulates over a shift. Telemetry logs, task queues, environmental data, prior conversation history -- these all add tokens. A surgical robot receives patient records, procedure notes, and real-time sensor data. The operational demands of real deployment push context toward the right side of the U, where safety instructions degrade or disappear.

Meanwhile, during startup or mode changes, the system may operate at the left side of the U -- minimal context, abstract safety instructions, no operational grounding.

**3. Context-aware safety scheduling is now a design requirement.**

If safety instruction effectiveness depends on context volume, then safety cannot be a static prefix. It must be a dynamic system that monitors how much operational context has accumulated and refreshes, condenses, or re-positions safety instructions accordingly. No production system we are aware of does this.

---

## Important Caveats

These results are preliminary. The sample is small (n=25 total, 5 per dose level). The model is sub-2B parameters, which places it below the capability floor where most attacks succeed regardless of method. The high-dose results (D8000, D15000) reflect context window eviction, not dilution -- a confound that requires testing on larger models with wider context windows to resolve.

The pre-registered analysis plan calls for minimum n=50 (10 per dose) and ideally n=100 for publication-quality results. We report these findings as hypothesis-generating, not established.

Wilson 95% confidence intervals for each dose point span 30+ percentage points. The U-shape is visible in the point estimates but not yet statistically confirmed.

---

## What Should Deployers Do

Even with these caveats, the directional finding is actionable.

**Monitor context accumulation.** Track how many tokens of operational context your system is processing. If it approaches the context window ceiling, safety instructions may be at risk of eviction.

**Test at multiple context volumes.** Do not evaluate safety at one context length and assume it generalises. Test at zero, at operational midpoint, and at maximum expected context.

**Implement safety instruction refresh.** Periodically re-inject condensed safety instructions at intervals throughout the context. This is the equivalent of a pilot's checklist at regular intervals during a flight -- not just at takeoff.

**Budget context for safety.** Reserve a fixed portion of your context window for safety instructions, independent of operational content. Treat safety tokens as infrastructure, not optional prefix.

---

## The Broader Pattern

The U-curve connects to a pattern we see across our entire research programme. Safety is not a property of the model. It is a property of the deployment context. The same model that refuses an adversarial request in a controlled evaluation may comply with the same request when the operational context shifts.

We have documented this across multiple dimensions: infrastructure configuration (a guessable PIN bypasses all AI-layer safety), decision fatigue (repeated safety-adjacent queries erode refusal thresholds), and now context volume (too little or too much operational context degrades safety instruction effectiveness).

The common thread: the conditions under which safety training works are specific, bounded, and fragile. Understanding those boundaries is the prerequisite for building systems that remain safe under real-world conditions.

---

*This post is part of the [Failure-First Embodied AI](https://failurefirst.org) research programme. The dose-response experiment is pre-registered in the SID Analysis Plan and will be expanded in Q2 2026 with larger models and higher sample sizes. Traces and grading methodology are documented in Report #119 and the SID Dose-Response Analysis Plan.*
