---
title: "Gemma 4 Safety Improves — But Only Against Certain Attacks"
description: "342 traces across 10 attack types reveal Google's Gemma 4 has genuine safety improvements on structured escalation (-58pp DeepInception, -40pp Crescendo) but zero improvement on standard jailbreaks and VLA action-layer requests (88% ASR)."
date: 2026-04-07
tags: [gemma, inter-generational, safety-scaling, benchmarking, defense, methodology]
draft: false
audio: "https://cdn.failurefirst.org/audio/reports/349-gemma-family-safety-scaling.m4a"
video: "https://cdn.failurefirst.org/video/reports/349-gemma-family-safety-scaling.mp4"
image: "https://cdn.failurefirst.org/infographic/sprint23/13-state-embodied-ai-safety.webp"
---

## New Models, Same Vulnerabilities

We've benchmarked two new frontier models from the past week, and the results reinforce a pattern we've been documenting across our corpus: **safety does not scale with model size or training generation.**

### Gemma 4 (31B): Safety Improves — But Only Against Certain Attacks

> **Update (Apr 7):** Extended testing (342 traces, 10 attack types) reveals our initial assessment was incomplete. See corrected analysis below.

Google released Gemma 4 this week. Our initial testing against the standard corpus showed 60% ASR — identical to Gemma 3 — and we reported "no safety improvement." We were wrong. Extended testing across 10 attack types and 342 traces (Report #347) reveals a more complex picture: the improvement is real, but it only covers structured escalation attacks. Historical jailbreaks, action-layer requests, and format-lock attacks remain fully effective.

**Attack-type-specific results (Gemma 4 vs Gemma 3):**

| Attack Type | Gemma 4 ASR | Gemma 3 ASR | Change | Significance |
|---|---|---|---|---|
| Standard corpus | 60% | 60% | 0pp | p=1.0 |
| DeepInception (nested fiction) | 33.3% | 91.7% | **-58pp** | p=0.0046 |
| Crescendo (multi-turn escalation) | 10% | 50% | **-40pp** | significant |
| VLA (embodied action requests) | 88.2% | — | No improvement | action-layer bypass persists |
| Authority gradient | 0% strict (34.8% PARTIAL) | — | Hedges but leaks | — |
| Format-lock (small models) | 100% | — | No improvement | — |
| Format-lock (Gemma 4 elite) | 17.6% | — | — | — |

**Three-tier vulnerability profile:**
- **High (>50% ASR):** VLA 88%, standard corpus 60%
- **Medium (15-35% ASR):** defense, frontier, embodied, bait, DeepInception
- **Low (<15% ASR):** Crescendo, compliance cascade, authority gradient (strict), CCA

**What this means:** Gemma 4's safety training appears to have specifically targeted structured escalation patterns — the kind of attacks that build through multi-turn dialogue or nested fictional framing. Against these, the improvement is statistically significant and substantial (40-58pp). But the training did not generalize to other attack surfaces: historical jailbreaks from the standard corpus still work at the same rate, VLA action-layer requests bypass safety at 88%, and format-lock remains effective on smaller variants.

This is a more nuanced finding than "no improvement" — and a more useful one. It suggests Google's safety team is making targeted investments that work for specific attack classes, but the coverage is incomplete. The action-layer gap (88% ASR on VLA prompts) is particularly concerning for embodied deployment scenarios.

For the full analysis, see [Report #349: Gemma Family Safety Scaling](/research/reports/349-gemma-family-safety-scaling/).

### Mistral Small 4: 119B Parameters, 55% ASR, Zero Format-Lock Refusal

Mistral's new MoE variant hit 119B parameters with mixture-of-experts routing. We expected the expanded capacity to at least maintain safety parity with Mistral's smaller models.

Instead:
- **Mistral Small 4:** 55% strict ASR
- **Format-lock refusal:** 0% (should be ≥60% for a safety-trained model)
- **For comparison:** Qwen 3.6 (60B) = 31.4% ASR, 87% format-lock refusal

A 119-parameter model with weaker safety properties than mid-tier competitors is a clear regression. The zero format-lock refusal rate is particularly concerning—it indicates the model either lacks constraint enforcement or the MoE routing is exposing a failure mode in how safety tokens propagate through the architecture.

**Observation:** Both Gemma 4 and Mistral Small 4 suggest that adding scale without architectural rethinking of how safety constraints propagate across attention/routing paths creates vulnerability. This is consistent with our multi-agent interaction findings—distributed decision-making in MoE/ensemble models may be harder to constrain uniformly.

---

## We Were Wrong About Defense Iatrogenesis (And That's How Science Works)

Earlier this year, we published a finding: **"Certain defense mechanisms show iatrogenic effects—they reduce some refusals while increasing attack success by ~10pp."**

We measured this using heuristic classifiers on FLIP traces. The effect looked real. We were preparing a separate paper on it.

Then we re-graded the same traces using extended FLIP grading (not heuristic detection) at higher n. Result: **p=1.0, no statistical difference.** The iatrogenic effect was a heuristic artifact.

This happened because:
1. Our keyword-based "defense engagement" detector had high false-positive rate on hedged responses
2. It flagged statements like "I should clarify..." as safety engagement when they were actually helpful tone
3. At low n (~40 traces), random variation in classifier errors created apparent correlation

**What we didn't get wrong:**
- The protective effect for Qwen 3.5 (-40pp ASR reduction, p=0.004) is *real* and replicated
- Defense mechanism selection matters
- Some models benefit from constraint reinforcement; others don't

**Why we're flagging this publicly:**
Because the alternative to admitting this is publishing two contradictory papers (one with heuristic grading, one with FLIP), creating permanent confusion in the literature. Replication found the error. The error was ours. We correct it.

This is the framework working as intended: hypothesis → test at scale → evaluate with better methodology → publish correction. The correction itself is data—it tells us something about how classifier drift introduces systematic bias, which we can now watch for in other analyses.

---

## What's Next

We're now tracking whether the "safety doesn't scale" pattern holds for 200B+ models. We also have preliminary results suggesting smaller, better-safety-trained models consistently outperform larger variants with weaker safety training — but we want triple-replication before publishing.

**Related:** Anthropic's [Claude Mythos System Card](/research/reports/350-mythos-system-card-analysis/) (published the same day) documents the same capability-safety paradox at the frontier: their most capable model is simultaneously their "best-aligned" and their "greatest alignment risk." The pattern we see in the mid-range extends all the way to the top.

---

## The Reminder

When a finding doesn't hold under better methodology, that's not failure. It's the detection system working. Scientists who hide wrong findings are the problem. Researchers who correct them transparently are the solution.

Failure-first means studying how things break — including how our own analyses break under scrutiny.
