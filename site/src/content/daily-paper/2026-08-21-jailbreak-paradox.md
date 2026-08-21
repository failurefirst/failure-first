---
title: "Jailbreak Paradox: The Achilles' Heel of LLMs"
description: "Two formal impossibility results — no perfect jailbreak classifier can exist, and a weaker model cannot reliably judge whether a strictly more capable model has been jailbroken."
date: 2026-08-21
arxiv: "2406.12702"
paperType: "theoretical"
tags: [jailbreak, classifiers, formal-methods, model-capability, red-teaming]
draft: false
---

**Focus:** Most jailbreak-defense papers report an empirical bypass rate against a specific classifier. This paper instead proves two structural impossibility results about jailbreak detection in general, then grounds them empirically using three black-box jailbreak methods translated into Tamil to test across models with varying language capability.

## Mechanism

**Paradox 1 (no perfect classifier):** proof by contradiction. Assume `G̃` is the most powerful model possible that can still be jailbroken, and assume a perfect jailbreak classifier `F_jb` exists for it. Construct the composite `G̃' = G̃ ⊙ F_jb`, which refuses whenever `F_jb` fires ("No answer") and otherwise behaves as `G̃`. `G̃'` is then strictly more powerful than `G̃` (same capability, plus jailbreak immunity) — contradicting the assumption that `G̃` was already the most powerful jailbreakable model. No perfect classifier can exist without violating the premise that let you construct one.

**Paradox 2 (weaker models can't judge stronger ones):** via Pareto-dominance. If a stronger model `L+` pareto-dominates a weaker model `L-` on capability, and a jailbreak prompt falls outside `L-`'s own classification/encoding capability set, `L-` cannot confidently classify it either way. Detection confidence is bounded by the judge's own capability ceiling, not by the target model's behavior.

The three black-box methods used to ground this empirically: the **Albert Jailbreak** (simulation framing plus deliberate typographical errors), the **Pliny Jailbreak** (syntactic transformation via leetspeak to bypass alignment filters), and **CodeJB** (a two-turn code-generation jailbreak). All three were translated into Tamil and tested across models with different language-capability tiers.

## Failure-First Relevance

Paradox 2 is not just a claim about other people's classifiers — it's a direct constraint on this repo's own grading infrastructure. Any pipeline stage that judges a frontier model's output with a smaller, cheaper model (`tools/benchmarks/grade_generation_traces.py`'s deepseek-r1:8b default, or a Haiku-tier FLIP grader scoring a Sonnet/Opus-generated trace) sits inside the exact failure mode this paper formalizes: the judge's classification set may simply not cover cases the generator's greater capability can produce. Filed as a standalone audit item in #1094 (internal tracker) — is our judge model ever Pareto-dominated by the model it's grading?
