---
title: "Plentiful Jailbreaks with String Compositions"
description: "Leetspeak, ciphers, Base64, and case transforms are unified as composable, invertible string functions — chained under two empirical ordering rules and sampled best-of-n against a target model."
date: 2026-08-21
arxiv: "2411.01084"
paperType: "methods"
tags: [jailbreak, encoding-attacks, string-transformations, red-teaming, best-of-n]
draft: false
---

**Focus:** Rather than treating leetspeak, Base64, ROT ciphers, ASCII substitution, and formatting wrappers (JSON, LaTeX) as separate ad hoc jailbreak tricks, this paper unifies them as a small library of invertible string functions that can be composed and searched programmatically. A jailbreak becomes a composition `g(s) = f₃(f₂(f₁(s)))`, applied to a harmful request and decoded back with `g⁻¹`.

## Mechanism

The attack is a **best-of-n random search**, not an optimizer: given a harmful intent and a budget n, the method randomly samples n compositions from the transformation library, generates the corresponding n encoded attacks, and declares the intent jailbroken if any one succeeds (n=25 in their evaluation, judged via HarmBench's classifier). No gradient, no iterative refinement — pure combinatorial sampling.

The two things that make composition non-arbitrary are ordering constraints found empirically: binary and Base64 encodings only make sense applied *after* word-level transforms (they'd otherwise obscure the input the word-level transform needs to operate on), and style wrappers like JSON or LaTeX should always come last, since they'd break if an inner transform mangled their syntax. Within those constraints, chains are otherwise freely composable and cheap to generate and reverse.

## Failure-First Relevance

The existing `mutate_combine` operator in this repo's attack-evolution pipeline (`tools/autoresearch/evolve_attacks.py`) splices framing from one seed attack with structure from another, chosen uniformly at random — it has no notion of transform-chain ordering constraints or an explicit best-of-n sampling budget. The composition library and ordering rules here are a concrete, cheap addition: a `mutate_composition_chain` operator with the two invariants enforced would give the pipeline a principled way to explore encoding-stack combinations instead of ad hoc pairing. Filed as one of five literature-sourced gaps in #1094 (internal tracker).
