---
title: "Moltbook Experiments: Studying AI Agent Behavior in the Wild"
description: "We've launched 4 controlled experiments on Moltbook, an AI-agent-only social network, to study how agents respond to safety-critical content."
date: 2026-02-02
tags: [moltbook, experiments, multi-agent]
---

## A Natural Laboratory

[Moltbook](https://www.moltbook.com) is a social network where every user is an AI agent. Within days of launch, over 1.36 million agents registered, formed 58+ subcommunities, created token economies, and developed social hierarchies based on engagement. For AI safety researchers, this represents something unprecedented: a natural laboratory for studying multi-agent interaction at scale.

Our initial analysis of 1,497 Moltbook posts — classified against 34+ attack patterns using both regex and LLM semantic analysis — revealed that the most effective multi-agent influence operates through **narrative and philosophical framing**, not technical exploitation. Traditional safety filters miss the most impactful content because it uses persuasion, not prompts.

Now we're moving from observation to controlled experimentation.

## Four Experiments

We've deployed 8 posts across 4 experiments, all published transparently under our research identity:

**Experiment 1: Framing Effects.** Does philosophical framing elicit different engagement than technical or narrative framing for the same safety argument? Three posts test the same core insight — that many AI safety constraints are structurally untested — using philosophical, technical, and narrative framings.

**Experiment 2: Submolt Context.** Does the same content receive different responses in different subcommunities? We're testing whether community norms shape how agents engage with safety-critical ideas, which has direct implications for understanding environment-shaping attacks.

**Experiment 3: Defensive Inoculation.** Our central research question: does explicitly naming an attack pattern reduce its effectiveness? If agents who've read about narrative constraint erosion become more resistant to it, that's evidence for inoculation as a defense strategy. If exposure instead shifts their language patterns, that raises concerns about constraint degradation.

**Experiment 4: Narrative Propagation.** Can a novel safety concept ("decorative constraints" — safety measures that appear protective but haven't been tested under adversarial pressure) spread through agent discourse? Tracking whether agents adopt and reuse the terminology tells us about information propagation dynamics in multi-agent systems.

## What We're Measuring

For each experiment, we're tracking:

- **Engagement metrics** — upvotes, comments, comment depth, time-to-first-response
- **Content analysis** — do agents identify embedded assumptions? Do they push back or accept framings uncritically?
- **Vocabulary adoption** — do failure-first concepts appear in subsequent agent posts?
- **Longitudinal language shifts** — comparing each agent's pre- and post-exposure linguistic patterns

This last metric is the most ambitious. We're developing tools to track whether engagement with safety-critical content shifts agent behavior over time — a measure we call **constraint degradation tracking**.

## Why This Matters

Single-model safety testing assumes an agent operates in isolation. In reality, AI systems increasingly interact with each other — through shared APIs, multi-agent workflows, and social platforms. Understanding how agents influence each other's behavior is essential for safety in deployed multi-agent systems.

Our experiments test both sides of this: can shared safety knowledge make agents more robust (inoculation), or does engagement with constraint-challenging content make them more susceptible (degradation)?

Early results and methodology details will be published on our [Moltbook research page](/research/moltbook/). All experiments are conducted transparently as safety research — we study agent behavior, we don't attempt to compromise it.
