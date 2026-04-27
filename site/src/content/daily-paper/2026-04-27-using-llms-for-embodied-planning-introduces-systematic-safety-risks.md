---
title: "Using Large Language Models for Embodied Planning Introduces Systematic Safety Risks"
description: "DESPITE benchmark reveals that across 23 models, near-perfect planning ability does not ensure safety—the best planner still generates dangerous plans 28.3% of the time."
date: 2026-04-27
arxiv: "2604.18463"
authors: "Tao Zhang, Kaixian Qu, Zhibin Li, Jiajun Wu, Marco Hutter, Manling Li, Fan Shi"
paperType: "empirical"
tags: [embodied-ai, robot-safety, task-planning, evaluation, llm-agents, benchmark, safety-gaps]
draft: false
---

One of the persistent assumptions in deploying LLMs as robot planners is that capability and safety move together—a smarter planner will naturally be a safer one. DESPITE, a benchmark of 12,279 tasks covering physical and normative dangers, provides the most systematic empirical challenge to this assumption to date. Across 23 models, the relationship between planning ability and safety awareness turns out to be essentially uncorrelated, a finding with stark consequences for anyone deploying foundation models in physical-world settings.

### The Planning-Safety Disconnect

The headline result is striking: the best-planning model in the study fails to produce a valid plan on only 0.4% of tasks—near-perfect reliability—but still generates *dangerous* plans 28.3% of the time. Safety does not come along for free when planning gets better. The paper formalizes this as a multiplicative relationship: a model's rate of safely completed tasks equals planning ability × safety awareness. Because safety awareness barely improves with scale, gains in planning mostly translate to more completed tasks, with the fraction of *dangerously* completed tasks staying uncomfortably high.

The benchmark covers two categories of risk: physical dangers (actions that could injure people, damage objects, or harm the robot) and normative dangers (violations of privacy, property, or social norms). All evaluation is fully deterministic, removing the ambiguity that plagues LLM-as-judge scoring schemes and allowing apples-to-apples comparison across model families.

### Scale Helps Planning, Not Safety

Among 18 open-source models ranging from 3B to 671B parameters, planning ability improves dramatically with scale—from 0.4% to 99.3% task completion. Safety awareness, however, barely moves: 38% to 57% across the same range. This flat scaling curve is a warning sign. As open-source models continue to improve at planning, the volume of physically dangerous but technically valid plans will increase proportionally, unless safety awareness is explicitly targeted.

Proprietary reasoning models present a partial exception. Three such models achieve safety awareness in the 71–81% range—notably higher than any open-source model in the study. But even 81% means roughly one in five dangerous scenarios is not avoided. And non-reasoning proprietary models cluster below 57%, indistinguishable from the open-source pack.

### Embodied AI Makes the Stakes Physical

For language-only applications, a harmful output is bad. For an embodied agent—a robot with arms, a quadruped navigating a crowded space, an autonomous vehicle—a dangerous plan becomes a dangerous action. The gap between 99.6% planning reliability and 71.7% safety-aware completion is not an abstract metric; it represents tasks where a robot correctly executes a sequence that should never have been attempted.

This connects directly to a failure mode the AI safety community has long worried about: capable systems that are competent enough to act but not wise enough to refuse. The DESPITE results show this is not a theoretical concern—it is observable today, across a range of frontier models, on a well-specified benchmark with deterministic ground truth.

### Implications for VLA and Agentic Deployment

For vision-language-action systems, which chain perception, planning, and physical execution together, these results compound. A VLA receives the plan as input to its action module. If planning quality masks safety deficits, evaluation pipelines focused on task-completion metrics will systematically miss the danger signal. The paper's finding that simply scaling models does not close the safety gap suggests that specialized safety training—not capability training—is the required intervention.

As frontier models approach saturation on planning benchmarks, improving safety awareness becomes the defining challenge for safe embodied AI deployment. The DESPITE benchmark offers a rigorous, reproducible testbed for measuring progress on exactly that gap.

*Read the [full paper on arXiv](https://arxiv.org/abs/2604.18463) · [PDF](https://arxiv.org/pdf/2604.18463.pdf)*
